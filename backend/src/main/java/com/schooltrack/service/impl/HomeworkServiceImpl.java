package com.schooltrack.service.impl;

import com.schooltrack.dto.HomeworkCompletionRequest;
import com.schooltrack.dto.HomeworkCreateRequest;
import com.schooltrack.dto.HomeworkResponseDto;
import com.schooltrack.entity.*;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.exception.UnauthorizedActionException;
import com.schooltrack.notification.NotificationService;
import com.schooltrack.repository.*;
import com.schooltrack.service.AuditLogService;
import com.schooltrack.service.HomeworkService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HomeworkServiceImpl implements HomeworkService {

    private final HomeworkRepository homeworkRepository;
    private final HomeworkCompletionRepository completionRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final SubjectTeacherProfileRepository subjectTeacherProfileRepository;

    public HomeworkServiceImpl(HomeworkRepository homeworkRepository,
                               HomeworkCompletionRepository completionRepository,
                               SchoolClassRepository schoolClassRepository,
                               SubjectRepository subjectRepository,
                               UserRepository userRepository,
                               StudentProfileRepository studentProfileRepository,
                               NotificationService notificationService,
                               AuditLogService auditLogService,
                               TeacherSubjectAssignmentRepository assignmentRepository,
                               SubjectTeacherProfileRepository subjectTeacherProfileRepository) {
        this.homeworkRepository = homeworkRepository;
        this.completionRepository = completionRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
        this.assignmentRepository = assignmentRepository;
        this.subjectTeacherProfileRepository = subjectTeacherProfileRepository;
    }

    @Override
    @Transactional
    public HomeworkResponseDto createHomework(HomeworkCreateRequest request, String teacherUsername) {
        User teacher = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + teacherUsername));

        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + request.getClassId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + request.getSubjectId()));

        boolean isPrincipal = teacher.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (!isPrincipal) {
            SubjectTeacherProfile stp = subjectTeacherProfileRepository.findByUserId(teacher.getId()).orElse(null);
            if (stp != null) {
                boolean assigned = assignmentRepository.existsByTeacherIdAndSchoolClassIdAndSubjectId(stp.getId(), schoolClass.getId(), subject.getId());
                if (!assigned) {
                    throw new UnauthorizedActionException("You are not assigned to teach " + subject.getName() + " for class " + schoolClass.getName());
                }
            }
        }

        Homework hw = new Homework();
        hw.setTitle(request.getTitle());
        hw.setDescription(request.getDescription());
        hw.setTeacher(teacher);
        hw.setSchoolClass(schoolClass);
        hw.setSubject(subject);
        hw.setAssignedDate(LocalDate.now());
        hw.setDueDate(request.getDueDate());
        hw.setPriority(request.getPriority());
        hw.setAttachmentUrl(request.getAttachmentUrl());

        hw = homeworkRepository.save(hw);

        notificationService.sendHomeworkNotification(hw);
        auditLogService.log(teacher, "CREATE_HOMEWORK", "HOMEWORK", hw.getId(), "Created homework: " + hw.getTitle() + " for " + schoolClass.getName(), null);

        return mapToDto(hw, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeworkResponseDto> getHomeworkForClass(Long classId, Long studentId) {
        return homeworkRepository.findBySchoolClassIdOrderByDueDateDesc(classId).stream()
                .map(hw -> {
                    HomeworkCompletion comp = null;
                    if (studentId != null) {
                        comp = completionRepository.findByHomeworkIdAndStudentId(hw.getId(), studentId).orElse(null);
                    }
                    return mapToDto(hw, comp);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeworkResponseDto> getHomeworkForTeacher(Long teacherId) {
        return homeworkRepository.findByTeacherIdOrderByDueDateDesc(teacherId).stream()
                .map(hw -> mapToDto(hw, null))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeworkResponseDto> getStudentDigitalDiary(Long studentId) {
        return getStudentDigitalDiary(studentId, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HomeworkResponseDto> getStudentDigitalDiary(Long studentId, String currentUsername) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        if (currentUsername != null) {
            User currentUser = userRepository.findByUsername(currentUsername).orElse(null);
            if (currentUser != null) {
                boolean isStudent = currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_STUDENT);
                boolean isParent = currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PARENT);
                if (isStudent && !student.getUser().getId().equals(currentUser.getId())) {
                    throw new UnauthorizedActionException("Students can only view their own digital diary");
                }
                if (isParent) {
                    if (student.getParent() == null || !student.getParent().getUser().getId().equals(currentUser.getId())) {
                        throw new UnauthorizedActionException("Parents can only view digital diary for their linked children");
                    }
                }
            }
        }

        if (student.getCurrentClass() == null) return List.of();

        return homeworkRepository.findBySchoolClassIdOrderByDueDateDesc(student.getCurrentClass().getId()).stream()
                .map(hw -> {
                    HomeworkCompletion comp = completionRepository.findByHomeworkIdAndStudentId(hw.getId(), studentId).orElse(null);
                    return mapToDto(hw, comp);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public HomeworkResponseDto updateHomeworkCompletion(Long homeworkId, Long studentId, HomeworkCompletionRequest request) {
        return updateHomeworkCompletion(homeworkId, studentId, request, null);
    }

    @Override
    @Transactional
    public HomeworkResponseDto updateHomeworkCompletion(Long homeworkId, Long studentId, HomeworkCompletionRequest request, String currentUsername) {
        Homework homework = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found: " + homeworkId));

        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        if (currentUsername != null) {
            User currentUser = userRepository.findByUsername(currentUsername).orElse(null);
            if (currentUser != null) {
                boolean isStudent = currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_STUDENT);
                boolean isParent = currentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PARENT);
                if (isStudent && !student.getUser().getId().equals(currentUser.getId())) {
                    throw new UnauthorizedActionException("Students can only update their own homework completion status");
                }
                if (isParent) {
                    if (student.getParent() == null || !student.getParent().getUser().getId().equals(currentUser.getId())) {
                        throw new UnauthorizedActionException("Parents can only update homework status for their linked children");
                    }
                }
            }
        }

        HomeworkCompletion completion = completionRepository.findByHomeworkIdAndStudentId(homeworkId, studentId)
                .orElse(new HomeworkCompletion(homework, student, HomeworkStatus.PENDING));

        completion.setStatus(request.isCompleted() ? HomeworkStatus.COMPLETED : HomeworkStatus.PENDING);
        if (request.getRemarks() != null) completion.setRemarks(request.getRemarks());

        completion = completionRepository.save(completion);
        return mapToDto(homework, completion);
    }

    @Override
    @Transactional
    public void deleteHomework(Long homeworkId, String username) {
        Homework hw = homeworkRepository.findById(homeworkId)
                .orElseThrow(() -> new ResourceNotFoundException("Homework not found: " + homeworkId));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        boolean isPrincipal = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (!isPrincipal && !hw.getTeacher().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can only delete your own homework assignments");
        }

        homeworkRepository.delete(hw);
        auditLogService.log(user, "DELETE_HOMEWORK", "HOMEWORK", homeworkId, "Deleted homework: " + hw.getTitle(), null);
    }

    private HomeworkResponseDto mapToDto(Homework h, HomeworkCompletion comp) {
        HomeworkResponseDto dto = new HomeworkResponseDto();
        dto.setId(h.getId());
        dto.setClassId(h.getSchoolClass().getId());
        dto.setClassName(h.getSchoolClass().getName());
        dto.setSubjectId(h.getSubject().getId());
        dto.setSubjectName(h.getSubject().getName());
        dto.setSubjectCode(h.getSubject().getCode());
        dto.setTeacherId(h.getTeacher().getId());
        dto.setTeacherName(h.getTeacher().getFullName());
        dto.setTitle(h.getTitle());
        dto.setDescription(h.getDescription());
        dto.setAssignedDate(h.getAssignedDate());
        dto.setDueDate(h.getDueDate());
        dto.setPriority(h.getPriority());
        dto.setAttachmentUrl(h.getAttachmentUrl());

        if (comp != null) {
            dto.setCompletionStatus(comp.getStatus());
            dto.setCompletedAt(comp.getCompletedAt());
            dto.setRemarks(comp.getRemarks());
        } else {
            dto.setCompletionStatus(HomeworkStatus.PENDING);
        }

        dto.setOverdue(h.getDueDate().isBefore(LocalDate.now()) && (dto.getCompletionStatus() == HomeworkStatus.PENDING));
        return dto;
    }
}
