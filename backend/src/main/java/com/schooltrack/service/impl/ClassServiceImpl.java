package com.schooltrack.service.impl;

import com.schooltrack.dto.ClassCreateRequest;
import com.schooltrack.dto.ClassDetailDto;
import com.schooltrack.dto.SubjectDetailDto;
import com.schooltrack.entity.*;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.repository.*;
import com.schooltrack.service.AuditLogService;
import com.schooltrack.service.ClassService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassServiceImpl implements ClassService {

    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final ClassTeacherProfileRepository classTeacherProfileRepository;
    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final AcademicYearRepository academicYearRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public ClassServiceImpl(SchoolClassRepository schoolClassRepository,
                            SubjectRepository subjectRepository,
                            StudentProfileRepository studentProfileRepository,
                            TeacherSubjectAssignmentRepository assignmentRepository,
                            ClassTeacherProfileRepository classTeacherProfileRepository,
                            CoordinatorProfileRepository coordinatorProfileRepository,
                            AcademicYearRepository academicYearRepository,
                            UserRepository userRepository,
                            AuditLogService auditLogService) {
        this.schoolClassRepository = schoolClassRepository;
        this.subjectRepository = subjectRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.assignmentRepository = assignmentRepository;
        this.classTeacherProfileRepository = classTeacherProfileRepository;
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.academicYearRepository = academicYearRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDetailDto> getAllClasses() {
        return schoolClassRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDetailDto getClassById(Long id) {
        SchoolClass sc = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + id));
        return mapToDto(sc);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDetailDto> getClassesByCoordinatorId(Long coordinatorId) {
        return schoolClassRepository.findByCoordinatorId(coordinatorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDetailDto getClassByClassTeacherId(Long classTeacherId) {
        SchoolClass sc = schoolClassRepository.findByClassTeacherId(classTeacherId)
                .orElseThrow(() -> new ResourceNotFoundException("No class assigned to Class Teacher: " + classTeacherId));
        return mapToDto(sc);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassDetailDto> getClassesBySubjectTeacherId(Long teacherId) {
        return assignmentRepository.findByTeacherId(teacherId).stream()
                .map(a -> mapToDto(a.getSchoolClass()))
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDetailDto> getAllSubjects() {
        return subjectRepository.findAll().stream().map(s -> {
            SubjectDetailDto dto = new SubjectDetailDto();
            dto.setId(s.getId());
            dto.setName(s.getName());
            dto.setCode(s.getCode());
            dto.setDescription(s.getDescription());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectDetailDto> getSubjectsByClassId(Long classId) {
        return assignmentRepository.findBySchoolClassId(classId).stream().map(a -> {
            SubjectDetailDto dto = new SubjectDetailDto();
            dto.setId(a.getSubject().getId());
            dto.setName(a.getSubject().getName());
            dto.setCode(a.getSubject().getCode());
            dto.setDescription(a.getSubject().getDescription());
            dto.setAssignedTeacherId(a.getTeacher().getId());
            dto.setAssignedTeacherName(a.getTeacher().getUser().getFullName());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClassDetailDto createClass(ClassCreateRequest request, String principalUsername) {
        User principal = userRepository.findByIdentifier(principalUsername)
                .or(() -> userRepository.findByUsername(principalUsername))
                .orElse(null);

        String grade = request.getGrade().trim();
        String section = request.getSection().trim().toUpperCase();
        String name = request.getName() != null && !request.getName().isBlank()
                ? request.getName().trim()
                : "Grade " + grade + "-" + section;

        AcademicYear ay = request.getAcademicYearId() != null
                ? academicYearRepository.findById(request.getAcademicYearId()).orElse(null)
                : academicYearRepository.findByActiveTrue().orElse(null);

        boolean exists = (ay != null)
                ? schoolClassRepository.existsByGradeAndSectionAndAcademicYearId(grade, section, ay.getId())
                : schoolClassRepository.existsByGradeAndSection(grade, section);
        if (exists) {
            throw new BadRequestException("Class with Grade " + grade + " and Section " + section + " already exists.");
        }

        ClassTeacherProfile classTeacher = null;
        if (request.getClassTeacherId() != null && request.getClassTeacherId() > 0) {
            classTeacher = classTeacherProfileRepository.findById(request.getClassTeacherId())
                    .orElseThrow(() -> new ResourceNotFoundException("Class Teacher not found: " + request.getClassTeacherId()));
        }

        CoordinatorProfile coordinator = null;
        if (request.getCoordinatorId() != null && request.getCoordinatorId() > 0) {
            coordinator = coordinatorProfileRepository.findById(request.getCoordinatorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Coordinator not found: " + request.getCoordinatorId()));
        }

        SchoolClass sc = new SchoolClass(grade, section, name, classTeacher, coordinator, ay);
        sc = schoolClassRepository.save(sc);

        if (auditLogService != null && principal != null) {
            auditLogService.log(principal, "CREATE_CLASS", "CLASS", sc.getId(), "Created Class: " + sc.getName(), null);
        }

        return mapToDto(sc);
    }

    @Override
    @Transactional
    public ClassDetailDto updateClass(Long id, ClassCreateRequest request, String principalUsername) {
        User principal = userRepository.findByIdentifier(principalUsername)
                .or(() -> userRepository.findByUsername(principalUsername))
                .orElse(null);

        SchoolClass sc = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + id));

        if (request.getGrade() != null && !request.getGrade().isBlank()) {
            sc.setGrade(request.getGrade().trim());
        }
        if (request.getSection() != null && !request.getSection().isBlank()) {
            sc.setSection(request.getSection().trim().toUpperCase());
        }
        if (request.getName() != null && !request.getName().isBlank()) {
            sc.setName(request.getName().trim());
        } else {
            sc.setName("Grade " + sc.getGrade() + "-" + sc.getSection());
        }

        if (request.getClassTeacherId() != null) {
            if (request.getClassTeacherId() == 0) {
                sc.setClassTeacher(null);
            } else {
                ClassTeacherProfile ct = classTeacherProfileRepository.findById(request.getClassTeacherId())
                        .orElseThrow(() -> new ResourceNotFoundException("Class Teacher not found: " + request.getClassTeacherId()));
                sc.setClassTeacher(ct);
            }
        }

        if (request.getCoordinatorId() != null) {
            if (request.getCoordinatorId() == 0) {
                sc.setCoordinator(null);
            } else {
                CoordinatorProfile cp = coordinatorProfileRepository.findById(request.getCoordinatorId())
                        .orElseThrow(() -> new ResourceNotFoundException("Coordinator not found: " + request.getCoordinatorId()));
                sc.setCoordinator(cp);
            }
        }

        if (request.getAcademicYearId() != null) {
            AcademicYear ay = academicYearRepository.findById(request.getAcademicYearId()).orElse(null);
            sc.setAcademicYear(ay);
        }

        sc = schoolClassRepository.save(sc);

        if (auditLogService != null && principal != null) {
            auditLogService.log(principal, "UPDATE_CLASS", "CLASS", sc.getId(), "Updated Class: " + sc.getName(), null);
        }

        return mapToDto(sc);
    }

    @Override
    @Transactional
    public void deleteClass(Long id, String principalUsername) {
        User principal = userRepository.findByIdentifier(principalUsername)
                .or(() -> userRepository.findByUsername(principalUsername))
                .orElse(null);

        SchoolClass sc = schoolClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + id));

        long studentsInClass = studentProfileRepository.findByCurrentClassId(id).size();
        if (studentsInClass > 0) {
            throw new BadRequestException("Cannot delete class with " + studentsInClass + " enrolled students. Reassign or remove students first.");
        }

        schoolClassRepository.delete(sc);

        if (auditLogService != null && principal != null) {
            auditLogService.log(principal, "DELETE_CLASS", "CLASS", id, "Deleted Class: " + sc.getName(), null);
        }
    }

    @Override
    @Transactional
    public SubjectDetailDto createSubject(SubjectDetailDto request, String principalUsername) {
        User principal = userRepository.findByIdentifier(principalUsername)
                .or(() -> userRepository.findByUsername(principalUsername))
                .orElse(null);

        if (request.getName() == null || request.getName().isBlank()) {
            throw new BadRequestException("Subject name is required");
        }
        if (request.getCode() == null || request.getCode().isBlank()) {
            throw new BadRequestException("Subject code is required");
        }

        if (subjectRepository.existsByCode(request.getCode().trim().toUpperCase())) {
            throw new BadRequestException("Subject with code " + request.getCode() + " already exists");
        }

        Subject subject = new Subject(request.getName().trim(), request.getCode().trim().toUpperCase(), request.getDescription());
        subject = subjectRepository.save(subject);

        if (auditLogService != null && principal != null) {
            auditLogService.log(principal, "CREATE_SUBJECT", "SUBJECT", subject.getId(), "Created Subject: " + subject.getName(), null);
        }

        SubjectDetailDto dto = new SubjectDetailDto();
        dto.setId(subject.getId());
        dto.setName(subject.getName());
        dto.setCode(subject.getCode());
        dto.setDescription(subject.getDescription());
        return dto;
    }

    private ClassDetailDto mapToDto(SchoolClass sc) {
        ClassDetailDto dto = new ClassDetailDto();
        dto.setId(sc.getId());
        dto.setGrade(sc.getGrade());
        dto.setSection(sc.getSection());
        dto.setName(sc.getName());
        if (sc.getClassTeacher() != null) {
            dto.setClassTeacherId(sc.getClassTeacher().getId());
            dto.setClassTeacherName(sc.getClassTeacher().getUser().getFullName());
            dto.setClassTeacherEmail(sc.getClassTeacher().getUser().getEmail());
        }
        if (sc.getCoordinator() != null) {
            dto.setCoordinatorId(sc.getCoordinator().getId());
            dto.setCoordinatorName(sc.getCoordinator().getUser().getFullName());
        }
        dto.setStudentCount(studentProfileRepository.findByCurrentClassId(sc.getId()).size());
        dto.setSubjects(getSubjectsByClassId(sc.getId()));
        return dto;
    }
}
