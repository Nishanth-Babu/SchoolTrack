package com.schooltrack.service.impl;

import com.schooltrack.dto.TeacherDetailDto;
import com.schooltrack.entity.*;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.repository.*;
import com.schooltrack.service.TeacherService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final ClassTeacherProfileRepository classTeacherProfileRepository;
    private final SubjectTeacherProfileRepository subjectTeacherProfileRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherServiceImpl(CoordinatorProfileRepository coordinatorProfileRepository,
                              ClassTeacherProfileRepository classTeacherProfileRepository,
                              SubjectTeacherProfileRepository subjectTeacherProfileRepository,
                              TeacherSubjectAssignmentRepository assignmentRepository,
                              UserRepository userRepository,
                              RoleRepository roleRepository,
                              SchoolClassRepository schoolClassRepository,
                              SubjectRepository subjectRepository,
                              PasswordEncoder passwordEncoder) {
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.classTeacherProfileRepository = classTeacherProfileRepository;
        this.subjectTeacherProfileRepository = subjectTeacherProfileRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.subjectRepository = subjectRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDetailDto> getAllTeachers() {
        List<TeacherDetailDto> list = new ArrayList<>();
        list.addAll(getCoordinators());
        list.addAll(getClassTeachers());
        list.addAll(getSubjectTeachers());
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDetailDto> getCoordinators() {
        return coordinatorProfileRepository.findAll().stream().map(c -> {
            TeacherDetailDto dto = new TeacherDetailDto();
            dto.setId(c.getId());
            dto.setUserId(c.getUser().getId());
            dto.setFullName(c.getUser().getFullName());
            dto.setEmail(c.getUser().getEmail());
            dto.setPhone(c.getUser().getPhone());
            dto.setEmployeeId(c.getEmployeeId());
            dto.setRole("COORDINATOR");
            dto.setDepartment(c.getDepartment());
            dto.setSpecialization(c.getAssignedWing());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDetailDto> getClassTeachers() {
        return classTeacherProfileRepository.findAll().stream().map(ct -> {
            TeacherDetailDto dto = new TeacherDetailDto();
            dto.setId(ct.getId());
            dto.setUserId(ct.getUser().getId());
            dto.setFullName(ct.getUser().getFullName());
            dto.setEmail(ct.getUser().getEmail());
            dto.setPhone(ct.getUser().getPhone());
            dto.setEmployeeId(ct.getEmployeeId());
            dto.setRole("CLASS_TEACHER");
            dto.setQualification(ct.getQualification());
            schoolClassRepository.findByClassTeacherId(ct.getId()).ifPresent(sc -> dto.setAssignedClass(sc.getName()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherDetailDto> getSubjectTeachers() {
        return subjectTeacherProfileRepository.findAll().stream().map(st -> {
            TeacherDetailDto dto = new TeacherDetailDto();
            dto.setId(st.getId());
            dto.setUserId(st.getUser().getId());
            dto.setFullName(st.getUser().getFullName());
            dto.setEmail(st.getUser().getEmail());
            dto.setPhone(st.getUser().getPhone());
            dto.setEmployeeId(st.getEmployeeId());
            dto.setRole("SUBJECT_TEACHER");
            dto.setSpecialization(st.getSpecialization());

            List<String> assignments = assignmentRepository.findByTeacherId(st.getId()).stream()
                    .map(a -> a.getSubject().getName() + " (" + a.getSchoolClass().getName() + ")")
                    .collect(Collectors.toList());
            dto.setAssignedSubjects(assignments);
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherDetailDto getTeacherById(Long id) {
        var optST = subjectTeacherProfileRepository.findById(id);
        if (optST.isPresent()) {
            SubjectTeacherProfile st = optST.get();
            TeacherDetailDto dto = new TeacherDetailDto();
            dto.setId(st.getId());
            dto.setUserId(st.getUser().getId());
            dto.setFullName(st.getUser().getFullName());
            dto.setEmail(st.getUser().getEmail());
            dto.setPhone(st.getUser().getPhone());
            dto.setEmployeeId(st.getEmployeeId());
            dto.setRole("SUBJECT_TEACHER");
            dto.setSpecialization(st.getSpecialization());
            return dto;
        }
        var optCT = classTeacherProfileRepository.findById(id);
        if (optCT.isPresent()) {
            ClassTeacherProfile ct = optCT.get();
            TeacherDetailDto dto = new TeacherDetailDto();
            dto.setId(ct.getId());
            dto.setUserId(ct.getUser().getId());
            dto.setFullName(ct.getUser().getFullName());
            dto.setEmail(ct.getUser().getEmail());
            dto.setPhone(ct.getUser().getPhone());
            dto.setEmployeeId(ct.getEmployeeId());
            dto.setRole("CLASS_TEACHER");
            dto.setQualification(ct.getQualification());
            return dto;
        }
        throw new ResourceNotFoundException("Teacher profile not found: " + id);
    }

    @Override
    @Transactional
    public void assignSubjectTeacherToClass(Long teacherId, Long classId, Long subjectId) {
        SubjectTeacherProfile teacher = subjectTeacherProfileRepository.findById(teacherId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject teacher not found: " + teacherId));
        SchoolClass schoolClass = schoolClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + classId));
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + subjectId));

        if (!assignmentRepository.existsByTeacherIdAndSchoolClassIdAndSubjectId(teacherId, classId, subjectId)) {
            TeacherSubjectAssignment assignment = new TeacherSubjectAssignment(teacher, schoolClass, subject, schoolClass.getAcademicYear());
            assignmentRepository.save(assignment);
        }
    }
}
