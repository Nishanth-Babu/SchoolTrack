package com.schooltrack.service.impl;

import com.schooltrack.dto.*;
import com.schooltrack.entity.*;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.repository.*;
import com.schooltrack.service.AdminAccountService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminAccountServiceImpl implements AdminAccountService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CoordinatorProfileRepository coordinatorRepository;
    private final ClassTeacherProfileRepository classTeacherRepository;
    private final SubjectTeacherProfileRepository subjectTeacherRepository;
    private final StudentProfileRepository studentRepository;
    private final ParentProfileRepository parentRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAccountServiceImpl(UserRepository userRepository,
                                   RoleRepository roleRepository,
                                   CoordinatorProfileRepository coordinatorRepository,
                                   ClassTeacherProfileRepository classTeacherRepository,
                                   SubjectTeacherProfileRepository subjectTeacherRepository,
                                   StudentProfileRepository studentRepository,
                                   ParentProfileRepository parentRepository,
                                   SchoolClassRepository schoolClassRepository,
                                   SubjectRepository subjectRepository,
                                   TeacherSubjectAssignmentRepository assignmentRepository,
                                   AcademicYearRepository academicYearRepository,
                                   AuditLogRepository auditLogRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.coordinatorRepository = coordinatorRepository;
        this.classTeacherRepository = classTeacherRepository;
        this.subjectTeacherRepository = subjectTeacherRepository;
        this.studentRepository = studentRepository;
        this.parentRepository = parentRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.subjectRepository = subjectRepository;
        this.assignmentRepository = assignmentRepository;
        this.academicYearRepository = academicYearRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDto createAccount(AccountCreateRequest req, String adminUsername) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseGet(() -> userRepository.findByIdentifier(adminUsername).orElse(null));

        String email = req.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("An account with email " + email + " already exists");
        }

        String roleStr = req.getRole().toUpperCase().replace("ROLE_", "");
        RoleName roleName;
        try {
            roleName = RoleName.valueOf("ROLE_" + roleStr);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role specified: " + req.getRole());
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        String usernameBase = req.getFirstName().toLowerCase() + "." + req.getLastName().toLowerCase();
        String username = generateUniqueUsername(usernameBase);

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(req.getFirstName().trim());
        user.setLastName(req.getLastName().trim());
        user.setPhone(req.getPhone());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setStatus(AccountStatus.ACTIVE);
        user.setActive(true);
        user.setRoles(Set.of(role));

        if (roleName == RoleName.ROLE_STUDENT) {
            if (req.getRollNumber() == null || req.getRollNumber().isBlank()) {
                throw new BadRequestException("Roll number is required for student accounts");
            }
            if (userRepository.existsByRollNumber(req.getRollNumber().trim())) {
                throw new BadRequestException("A student with roll number " + req.getRollNumber() + " already exists");
            }
            user.setRollNumber(req.getRollNumber().trim());
        } else if (roleName != RoleName.ROLE_PARENT) {
            if (req.getTeacherId() != null && !req.getTeacherId().isBlank()) {
                if (userRepository.existsByTeacherId(req.getTeacherId().trim())) {
                    throw new BadRequestException("Teacher ID " + req.getTeacherId() + " is already assigned");
                }
                user.setTeacherId(req.getTeacherId().trim());
            }
        }

        user = userRepository.save(user);

        // Profile specific setup
        switch (roleName) {
            case ROLE_COORDINATOR -> {
                String empId = req.getTeacherId() != null && !req.getTeacherId().isBlank()
                        ? req.getTeacherId().trim()
                        : "EMP-CRD-" + user.getId();
                user.setTeacherId(empId);
                coordinatorRepository.save(new CoordinatorProfile(
                        user, empId,
                        req.getSpecialisation() != null ? req.getSpecialisation() : "Academics",
                        req.getWing() != null ? req.getWing() : "Senior Secondary Wing"
                ));
            }
            case ROLE_CLASS_TEACHER -> {
                String empId = req.getTeacherId() != null && !req.getTeacherId().isBlank()
                        ? req.getTeacherId().trim()
                        : "EMP-CT-" + user.getId();
                user.setTeacherId(empId);
                ClassTeacherProfile ctp = classTeacherRepository.save(new ClassTeacherProfile(
                        user, empId,
                        req.getQualifications() != null ? req.getQualifications() : "B.Ed, Master Degree"
                ));
                if (req.getClassId() != null) {
                    SchoolClass sc = schoolClassRepository.findById(req.getClassId()).orElse(null);
                    if (sc != null) {
                        sc.setClassTeacher(ctp);
                        schoolClassRepository.save(sc);
                    }
                }
            }
            case ROLE_SUBJECT_TEACHER -> {
                String empId = req.getTeacherId() != null && !req.getTeacherId().isBlank()
                        ? req.getTeacherId().trim()
                        : "EMP-ST-" + user.getId();
                user.setTeacherId(empId);
                SubjectTeacherProfile stp = subjectTeacherRepository.save(new SubjectTeacherProfile(
                        user, empId,
                        req.getSpecialisation() != null ? req.getSpecialisation() : "General Studies"
                ));
                if (req.getClassId() != null && req.getSubjectId() != null) {
                    SchoolClass sc = schoolClassRepository.findById(req.getClassId()).orElse(null);
                    Subject sub = subjectRepository.findById(req.getSubjectId()).orElse(null);
                    AcademicYear ay = academicYearRepository.findByActiveTrue().orElse(null);
                    if (sc != null && sub != null) {
                        assignmentRepository.save(new TeacherSubjectAssignment(stp, sc, sub, ay));
                    }
                }
            }
            case ROLE_STUDENT -> {
                SchoolClass sc = req.getClassId() != null ? schoolClassRepository.findById(req.getClassId()).orElse(null) : null;
                ParentProfile parentProfile = null;
                if (req.getParentPhone() != null && !req.getParentPhone().isBlank()) {
                    Optional<User> pUser = userRepository.findByPhone(req.getParentPhone().trim());
                    if (pUser.isPresent()) {
                        parentProfile = parentRepository.findByUserId(pUser.get().getId()).orElse(null);
                    }
                }
                String admNo = req.getAdmissionNumber() != null ? req.getAdmissionNumber() : "ST-" + LocalDate.now().getYear() + "-" + req.getRollNumber();
                studentRepository.save(new StudentProfile(
                        user, admNo, req.getRollNumber(), sc,
                        LocalDate.now().minusYears(15), "Not Specified", "O+", "City", parentProfile
                ));
            }
            case ROLE_PARENT -> {
                ParentProfile pp = parentRepository.save(new ParentProfile(
                        user,
                        req.getQualifications() != null ? req.getQualifications() : "Professional",
                        req.getPhone(),
                        req.getRelationshipType() != null ? req.getRelationshipType() : "PARENT"
                ));
                if (req.getStudentRollNumberToLink() != null && !req.getStudentRollNumberToLink().isBlank()) {
                    Optional<User> sUser = userRepository.findByRollNumber(req.getStudentRollNumberToLink().trim());
                    if (sUser.isPresent()) {
                        studentRepository.findByUserId(sUser.get().getId()).ifPresent(sp -> {
                            sp.setParent(pp);
                            studentRepository.save(sp);
                        });
                    }
                }
            }
            default -> {}
        }

        user = userRepository.save(user);

        // Audit Log
        auditLogRepository.save(new AuditLog(
                admin, "CREATE_ACCOUNT", "USER", user.getId(),
                "Created account " + user.getUsername() + " with role " + roleName + " by administrator " + adminUsername,
                "127.0.0.1"
        ));

        return mapToDto(user);
    }

    @Override
    @Transactional
    public UserDto updateAccountStatus(Long userId, String statusStr, String adminUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        AccountStatus newStatus;
        try {
            newStatus = AccountStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid account status: " + statusStr);
        }

        user.setStatus(newStatus);
        user.setActive(newStatus == AccountStatus.ACTIVE);
        user = userRepository.save(user);

        User admin = userRepository.findByUsername(adminUsername)
                .orElseGet(() -> userRepository.findByIdentifier(adminUsername).orElse(null));

        auditLogRepository.save(new AuditLog(
                admin, "UPDATE_ACCOUNT_STATUS", "USER", user.getId(),
                "Account status for " + user.getUsername() + " changed to " + newStatus + " by " + adminUsername,
                "127.0.0.1"
        ));

        return mapToDto(user);
    }

    @Override
    @Transactional
    public void resetPassword(Long userId, String newPassword, String adminUsername) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (newPassword == null || newPassword.length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        User admin = userRepository.findByUsername(adminUsername)
                .orElseGet(() -> userRepository.findByIdentifier(adminUsername).orElse(null));

        auditLogRepository.save(new AuditLog(
                admin, "RESET_PASSWORD", "USER", user.getId(),
                "Administrative password reset performed for " + user.getUsername() + " by " + adminUsername,
                "127.0.0.1"
        ));
    }

    @Override
    @Transactional
    public void linkStudentParent(Long studentId, Long parentId, String adminUsername) {
        StudentProfile student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        ParentProfile parent = parentRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found with id: " + parentId));

        student.setParent(parent);
        studentRepository.save(student);

        User admin = userRepository.findByUsername(adminUsername)
                .orElseGet(() -> userRepository.findByIdentifier(adminUsername).orElse(null));

        auditLogRepository.save(new AuditLog(
                admin, "LINK_STUDENT_PARENT", "STUDENT", student.getId(),
                "Linked student " + student.getUser().getFullName() + " to parent " + parent.getUser().getFullName(),
                "127.0.0.1"
        ));
    }

    @Override
    @Transactional
    public void assignSubjectTeacher(Long teacherProfileId, Long classId, Long subjectId, String adminUsername) {
        SubjectTeacherProfile teacher = subjectTeacherRepository.findById(teacherProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject teacher not found with id: " + teacherProfileId));
        SchoolClass schoolClass = schoolClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + subjectId));
        AcademicYear ay = academicYearRepository.findByActiveTrue().orElse(null);

        assignmentRepository.save(new TeacherSubjectAssignment(teacher, schoolClass, subject, ay));

        User admin = userRepository.findByUsername(adminUsername)
                .orElseGet(() -> userRepository.findByIdentifier(adminUsername).orElse(null));

        auditLogRepository.save(new AuditLog(
                admin, "ASSIGN_SUBJECT_TEACHER", "ASSIGNMENT", teacher.getId(),
                "Assigned teacher " + teacher.getUser().getFullName() + " to " + schoolClass.getName() + " for " + subject.getName(),
                "127.0.0.1"
        ));
    }

    @Override
    @Transactional
    public void assignClassTeacher(Long classId, Long teacherProfileId, String adminUsername) {
        SchoolClass schoolClass = schoolClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with id: " + classId));
        ClassTeacherProfile teacher = classTeacherRepository.findById(teacherProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Class teacher not found with id: " + teacherProfileId));

        schoolClass.setClassTeacher(teacher);
        schoolClassRepository.save(schoolClass);

        User admin = userRepository.findByUsername(adminUsername)
                .orElseGet(() -> userRepository.findByIdentifier(adminUsername).orElse(null));

        auditLogRepository.save(new AuditLog(
                admin, "ASSIGN_CLASS_TEACHER", "CLASS", schoolClass.getId(),
                "Assigned class teacher " + teacher.getUser().getFullName() + " to " + schoolClass.getName(),
                "127.0.0.1"
        ));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getAccountsByRole(String roleStr) {
        RoleName roleName = RoleName.valueOf("ROLE_" + roleStr.toUpperCase().replace("ROLE_", ""));
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName() == roleName))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setTeacherId(user.getTeacherId());
        dto.setRollNumber(user.getRollNumber());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhone(user.getPhone());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setStatus(user.getStatus() != null ? user.getStatus().name() : "ACTIVE");
        dto.setActive(user.isActive());
        dto.setRoles(user.getRoles().stream().map(r -> r.getName().name().replace("ROLE_", "")).collect(Collectors.toList()));
        return dto;
    }

    private String generateUniqueUsername(String base) {
        String clean = base.toLowerCase().replaceAll("[^a-z0-9]", "");
        String username = clean;
        int counter = 1;
        while (userRepository.existsByUsername(username)) {
            username = clean + counter;
            counter++;
        }
        return username;
    }
}
