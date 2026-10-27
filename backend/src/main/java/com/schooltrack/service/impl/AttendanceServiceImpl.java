package com.schooltrack.service.impl;

import com.schooltrack.dto.*;
import com.schooltrack.entity.*;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.exception.UnauthorizedActionException;
import com.schooltrack.notification.NotificationService;
import com.schooltrack.repository.*;
import com.schooltrack.service.AttendanceService;
import com.schooltrack.service.AuditLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final SubjectTeacherProfileRepository subjectTeacherProfileRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;
    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final ClassTeacherProfileRepository classTeacherProfileRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository,
                                 StudentProfileRepository studentProfileRepository,
                                 SchoolClassRepository schoolClassRepository,
                                 SubjectRepository subjectRepository,
                                 UserRepository userRepository,
                                 SubjectTeacherProfileRepository subjectTeacherProfileRepository,
                                 TeacherSubjectAssignmentRepository assignmentRepository,
                                 LeaveRequestRepository leaveRequestRepository,
                                 NotificationService notificationService,
                                 AuditLogService auditLogService,
                                 CoordinatorProfileRepository coordinatorProfileRepository,
                                 ClassTeacherProfileRepository classTeacherProfileRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.subjectTeacherProfileRepository = subjectTeacherProfileRepository;
        this.assignmentRepository = assignmentRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.classTeacherProfileRepository = classTeacherProfileRepository;
    }

    @Override
    @Transactional
    public List<AttendanceResponseDto> markBulkAttendance(BulkAttendanceRequest request, String currentUsername) {
        User teacherUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUsername));

        SchoolClass schoolClass = schoolClassRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + request.getClassId()));

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + request.getSubjectId()));

        // Attendance marking is strictly restricted to SUBJECT_TEACHER assigned to this class and subject
        boolean isSubjectTeacher = teacherUser.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.ROLE_SUBJECT_TEACHER);

        if (!isSubjectTeacher) {
            throw new UnauthorizedActionException("Only assigned Subject Teachers can mark attendance.");
        }

        SubjectTeacherProfile stProfile = subjectTeacherProfileRepository.findByUserId(teacherUser.getId())
                .orElseThrow(() -> new UnauthorizedActionException("Subject teacher profile not found for user: " + currentUsername));

        boolean assigned = assignmentRepository.existsByTeacherIdAndSchoolClassIdAndSubjectId(
                stProfile.getId(), schoolClass.getId(), subject.getId()
        );
        if (!assigned) {
            throw new UnauthorizedActionException("You are not assigned to teach " + subject.getName() + " in " + schoolClass.getName());
        }

        List<AttendanceResponseDto> results = new ArrayList<>();

        for (AttendanceMarkItemDto item : request.getRecords()) {
            StudentProfile student = studentProfileRepository.findById(item.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + item.getStudentId()));

            // Verify student belongs to the requested class
            if (student.getCurrentClass() == null || !student.getCurrentClass().getId().equals(schoolClass.getId())) {
                throw new BadRequestException("Student " + student.getUser().getFullName() + " does not belong to class " + schoolClass.getName());
            }

            // Strictly validate attendance status (Only PRESENT, ABSENT, ON_DUTY)
            if (item.getStatus() == null || (item.getStatus() != AttendanceStatus.PRESENT && item.getStatus() != AttendanceStatus.ABSENT && item.getStatus() != AttendanceStatus.ON_DUTY)) {
                throw new BadRequestException("Invalid attendance status. Only PRESENT, ABSENT, and ON_DUTY are permitted.");
            }

            // Find existing or create new (controlled update to prevent duplicates)
            Attendance attendance = attendanceRepository.findByStudentIdAndSubjectIdAndDateAndPeriod(
                    student.getId(), subject.getId(), request.getDate(), request.getPeriod()
            ).orElse(new Attendance());

            attendance.setStudent(student);
            attendance.setSchoolClass(schoolClass);
            attendance.setSubject(subject);
            attendance.setTeacher(teacherUser);
            attendance.setDate(request.getDate());
            attendance.setPeriod(request.getPeriod());
            attendance.setStatus(item.getStatus());
            attendance.setRemarks(item.getRemarks());

            attendance = attendanceRepository.save(attendance);

            // If marked ABSENT -> check prior approved leave and dispatch absence alert to parents
            Optional<LeaveRequest> approvedLeaveOpt = leaveRequestRepository.findApprovedLeaveForStudentAndDate(student.getId(), request.getDate());
            if (item.getStatus() == AttendanceStatus.ABSENT) {
                boolean hasLeave = approvedLeaveOpt.isPresent();
                String leaveReason = hasLeave ? approvedLeaveOpt.get().getLeaveType().getName() + " (" + approvedLeaveOpt.get().getReason() + ")" : null;
                notificationService.sendAbsenceAlert(student, request.getDate(), hasLeave, leaveReason);
            }

            results.add(mapToDto(attendance, approvedLeaveOpt));
        }

        auditLogService.log(
                teacherUser,
                "MARK_ATTENDANCE",
                "ATTENDANCE",
                schoolClass.getId(),
                String.format("Marked attendance for %s, Subject: %s, Date: %s, Period: %d, Count: %d",
                        schoolClass.getName(), subject.getName(), request.getDate(), request.getPeriod(), request.getRecords().size()),
                null
        );

        return results;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDto> getAttendanceByClassAndDate(Long classId, LocalDate date, String currentUsername) {
        validateClassAccess(currentUsername, classId);
        return attendanceRepository.findBySchoolClassIdAndDate(classId, date).stream()
                .map(this::mapToDtoWithLeaveCheck)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDto> getAttendanceByClassAndSubjectAndDateAndPeriod(Long classId, Long subjectId, LocalDate date, Integer period, String currentUsername) {
        validateClassAccess(currentUsername, classId);
        return attendanceRepository.findBySchoolClassIdAndSubjectIdAndDateAndPeriod(classId, subjectId, date, period).stream()
                .map(this::mapToDtoWithLeaveCheck)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentAttendanceStatsDto getStudentAttendanceStats(Long studentId, String currentUsername) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        validateStudentAccess(currentUsername, student);

        List<Attendance> allRecords = attendanceRepository.findByStudentId(studentId);

        long presentCount = allRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long absentCount = allRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
        long onDutyCount = allRecords.stream().filter(a -> a.getStatus() == AttendanceStatus.ON_DUTY).count();
        long totalSessions = allRecords.size();

        // Effective Present = PRESENT + ON_DUTY
        long effectivePresent = presentCount + onDutyCount;
        double percentage = totalSessions > 0 ? ((double) effectivePresent / totalSessions) * 100.0 : 100.0;

        List<AttendanceResponseDto> recentAbsences = allRecords.stream()
                .filter(a -> a.getStatus() == AttendanceStatus.ABSENT)
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .limit(10)
                .map(this::mapToDtoWithLeaveCheck)
                .collect(Collectors.toList());

        List<AttendanceResponseDto> mappedRecords = allRecords.stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .map(this::mapToDtoWithLeaveCheck)
                .collect(Collectors.toList());

        StudentAttendanceStatsDto dto = new StudentAttendanceStatsDto();
        dto.setStudentId(student.getId());
        dto.setStudentName(student.getUser().getFullName());
        dto.setAdmissionNumber(student.getAdmissionNumber());
        dto.setRollNumber(student.getRollNumber());
        dto.setClassName(student.getCurrentClass() != null ? student.getCurrentClass().getName() : "");
        dto.setTotalSessions(totalSessions);
        dto.setPresentCount(presentCount);
        dto.setAbsentCount(absentCount);
        dto.setOnDutyCount(onDutyCount);
        dto.setEffectivePresent(effectivePresent);
        dto.setAttendancePercentage(Math.round(percentage * 10.0) / 10.0);
        dto.setRecentAbsences(recentAbsences);
        dto.setRecords(mappedRecords);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDto> getStudentAbsenceHistory(Long studentId, String currentUsername) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        validateStudentAccess(currentUsername, student);

        return attendanceRepository.findByStudentIdAndStatus(studentId, AttendanceStatus.ABSENT).stream()
                .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
                .map(this::mapToDtoWithLeaveCheck)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ClassAttendanceSummaryDto getClassAttendanceSummary(Long classId, LocalDate date, String currentUsername) {
        validateClassAccess(currentUsername, classId);

        SchoolClass sc = schoolClassRepository.findById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + classId));

        List<Attendance> records = attendanceRepository.findBySchoolClassIdAndDate(classId, date);
        long totalStudents = studentProfileRepository.findByCurrentClassId(classId).size();

        long presentCount = records.stream().filter(a -> a.getStatus() == AttendanceStatus.PRESENT).count();
        long absentCount = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ABSENT).count();
        long onDutyCount = records.stream().filter(a -> a.getStatus() == AttendanceStatus.ON_DUTY).count();

        long effectivePresent = presentCount + onDutyCount;
        long totalCount = presentCount + absentCount + onDutyCount;
        double percentage = totalCount > 0 ? ((double) effectivePresent / totalCount) * 100.0 : 0.0;

        ClassAttendanceSummaryDto dto = new ClassAttendanceSummaryDto();
        dto.setDate(date);
        dto.setClassId(classId);
        dto.setClassName(sc.getName());
        dto.setTotalStudents(totalStudents);
        dto.setPresentCount(presentCount);
        dto.setAbsentCount(absentCount);
        dto.setOnDutyCount(onDutyCount);
        dto.setEffectivePresent(effectivePresent);
        dto.setAttendancePercentage(Math.round(percentage * 10.0) / 10.0);
        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceResponseDto> getSchoolWideAttendance(LocalDate date, String currentUsername) {
        validateSchoolWideAccess(currentUsername);
        return attendanceRepository.findByDate(date).stream()
                .map(this::mapToDtoWithLeaveCheck)
                .collect(Collectors.toList());
    }

    private void validateSchoolWideAccess(String username) {
        if (username == null) return;
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return;
        boolean isPrincipal = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (!isPrincipal) {
            throw new UnauthorizedActionException("Only Principal is authorized to view school-wide attendance records.");
        }
    }

    private void validateClassAccess(String username, Long classId) {
        if (username == null) return;
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return;

        boolean isPrincipal = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (isPrincipal) return;

        SchoolClass sc = schoolClassRepository.findById(classId).orElse(null);
        if (sc == null) return;

        boolean isCoord = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_COORDINATOR);
        if (isCoord) {
            boolean isAssigned = (sc.getCoordinator() != null && sc.getCoordinator().getUser().getId().equals(user.getId()));
            if (!isAssigned) {
                CoordinatorProfile cp = coordinatorProfileRepository.findByUser(user)
                        .or(() -> coordinatorProfileRepository.findByUserId(user.getId())).orElse(null);
                if (cp != null && cp.getAssignedWing() != null && sc.getName() != null &&
                        sc.getName().toLowerCase().contains(cp.getAssignedWing().trim().toLowerCase())) {
                    isAssigned = true;
                }
            }
            if (!isAssigned) {
                throw new UnauthorizedActionException("Unauthorized: Coordinator is not assigned to this class.");
            }
            return;
        }

        boolean isCT = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_CLASS_TEACHER);
        if (isCT) {
            if (sc.getClassTeacher() == null || !sc.getClassTeacher().getUser().getId().equals(user.getId())) {
                throw new UnauthorizedActionException("Unauthorized: You are not the Class Teacher for this class.");
            }
            return;
        }

        boolean isST = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_SUBJECT_TEACHER);
        if (isST) {
            SubjectTeacherProfile stp = subjectTeacherProfileRepository.findByUserId(user.getId()).orElse(null);
            if (stp != null) {
                boolean teachesInClass = assignmentRepository.findBySchoolClassId(classId).stream()
                        .anyMatch(a -> a.getTeacher().getId().equals(stp.getId()));
                if (teachesInClass) return;
            }
            throw new UnauthorizedActionException("Unauthorized: You are not assigned to teach in this class.");
        }

        throw new UnauthorizedActionException("Unauthorized access to class attendance.");
    }

    private void validateStudentAccess(String username, StudentProfile student) {
        if (username == null) return;
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return;

        boolean isPrincipal = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (isPrincipal) return;

        boolean isStudent = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_STUDENT);
        if (isStudent) {
            if (!student.getUser().getId().equals(user.getId())) {
                throw new UnauthorizedActionException("Unauthorized: You can only view your own attendance records.");
            }
            return;
        }

        boolean isParent = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PARENT);
        if (isParent) {
            if (student.getParent() == null || student.getParent().getUser() == null || !student.getParent().getUser().getId().equals(user.getId())) {
                throw new UnauthorizedActionException("Unauthorized: You can only view your linked child's attendance.");
            }
            return;
        }

        if (student.getCurrentClass() != null) {
            validateClassAccess(username, student.getCurrentClass().getId());
            return;
        }

        throw new UnauthorizedActionException("Unauthorized access to student attendance.");
    }

    private AttendanceResponseDto mapToDtoWithLeaveCheck(Attendance a) {
        Optional<LeaveRequest> approvedLeave = leaveRequestRepository.findApprovedLeaveForStudentAndDate(a.getStudent().getId(), a.getDate());
        return mapToDto(a, approvedLeave);
    }

    private AttendanceResponseDto mapToDto(Attendance a, Optional<LeaveRequest> approvedLeaveOpt) {
        AttendanceResponseDto dto = new AttendanceResponseDto();
        dto.setId(a.getId());
        dto.setStudentId(a.getStudent().getId());
        dto.setStudentName(a.getStudent().getUser().getFullName());
        dto.setAdmissionNumber(a.getStudent().getAdmissionNumber());
        dto.setRollNumber(a.getStudent().getRollNumber());
        dto.setClassId(a.getSchoolClass().getId());
        dto.setClassName(a.getSchoolClass().getName());
        dto.setSubjectId(a.getSubject().getId());
        dto.setSubjectName(a.getSubject().getName());
        dto.setDate(a.getDate());
        dto.setPeriod(a.getPeriod());
        dto.setStatus(a.getStatus());
        dto.setRemarks(a.getRemarks());

        if (a.getStatus() == AttendanceStatus.ABSENT) {
            if (approvedLeaveOpt.isPresent()) {
                LeaveRequest leave = approvedLeaveOpt.get();
                dto.setPriorLeaveInfo("Approved " + leave.getLeaveType().getName() + " (" + leave.getReason() + ")");
            } else {
                dto.setPriorLeaveInfo("No Prior Leave");
            }
        } else if (a.getStatus() == AttendanceStatus.ON_DUTY) {
            dto.setPriorLeaveInfo("OD — Counted as Present");
        } else {
            dto.setPriorLeaveInfo("Normal Attendance");
        }

        return dto;
    }
}
