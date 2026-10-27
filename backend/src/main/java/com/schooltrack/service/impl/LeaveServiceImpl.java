package com.schooltrack.service.impl;

import com.schooltrack.dto.LeaveApplyRequest;
import com.schooltrack.dto.LeaveResponseDto;
import com.schooltrack.dto.LeaveTimelineItemDto;
import com.schooltrack.dto.LeaveVerificationRequest;
import com.schooltrack.entity.*;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.exception.UnauthorizedActionException;
import com.schooltrack.ivr.IvrService;
import com.schooltrack.notification.NotificationService;
import com.schooltrack.repository.*;
import com.schooltrack.service.AuditLogService;
import com.schooltrack.service.LeaveService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveVerificationLogRepository logRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final IvrService ivrService;
    private final AuditLogService auditLogService;
    private final CoordinatorProfileRepository coordinatorProfileRepository;
    private final ClassTeacherProfileRepository classTeacherProfileRepository;

    public LeaveServiceImpl(LeaveRequestRepository leaveRequestRepository,
                            LeaveTypeRepository leaveTypeRepository,
                            LeaveVerificationLogRepository logRepository,
                            StudentProfileRepository studentProfileRepository,
                            UserRepository userRepository,
                            NotificationService notificationService,
                            IvrService ivrService,
                            AuditLogService auditLogService,
                            CoordinatorProfileRepository coordinatorProfileRepository,
                            ClassTeacherProfileRepository classTeacherProfileRepository) {
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.logRepository = logRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.ivrService = ivrService;
        this.auditLogService = auditLogService;
        this.coordinatorProfileRepository = coordinatorProfileRepository;
        this.classTeacherProfileRepository = classTeacherProfileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveType> getAllLeaveTypes() {
        return leaveTypeRepository.findAll();
    }

    @Override
    @Transactional
    public LeaveResponseDto applyLeave(LeaveApplyRequest request, String studentUsername) {
        User user = userRepository.findByUsername(studentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + studentUsername));

        StudentProfile student = studentProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user: " + studentUsername));

        if (request.getStudentId() != null && !request.getStudentId().equals(student.getId())) {
            throw new UnauthorizedActionException("You can only apply for your own leave");
        }

        LeaveType leaveType = null;
        if (request.getLeaveTypeId() != null) {
            leaveType = leaveTypeRepository.findById(request.getLeaveTypeId()).orElse(null);
        }
        if (leaveType == null && request.getLeaveTypeName() != null) {
            leaveType = leaveTypeRepository.findAll().stream()
                    .filter(lt -> lt.getName().equalsIgnoreCase(request.getLeaveTypeName()))
                    .findFirst().orElse(null);
        }
        if (leaveType == null) {
            leaveType = leaveTypeRepository.findAll().stream().findFirst()
                    .orElseGet(() -> leaveTypeRepository.save(new LeaveType("Medical Leave", "MEDICAL", 10)));
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("End date cannot be before start date");
        }

        LeaveRequest leave = new LeaveRequest();
        leave.setStudent(student);
        leave.setLeaveType(leaveType);
        leave.setStartDate(request.getStartDate());
        leave.setEndDate(request.getEndDate());
        leave.setReason(request.getReason());
        leave.setDocumentUrl(request.getDocumentUrl());
        leave.setParentVerificationStatus(VerificationStatus.PENDING);
        leave.setClassTeacherVerificationStatus(VerificationStatus.PENDING);
        leave.setCoordinatorVerificationStatus(VerificationStatus.PENDING);
        leave.setFinalStatus(LeaveStatus.PENDING_PARENT_VERIFICATION);

        leave = leaveRequestRepository.save(leave);

        // Initiate Parent IVR verification call simulation
        if (student.getParent() != null && student.getParent().getUser() != null) {
            String parentPhone = student.getParent().getUser().getPhone();
            ivrService.initiateVerificationCall(leave, parentPhone != null ? parentPhone : "N/A");
        }

        // Create initial verification log
        LeaveVerificationLog log = new LeaveVerificationLog(
                leave,
                user,
                "STUDENT",
                "APPLY",
                null,
                LeaveStatus.PENDING_PARENT_VERIFICATION,
                "Leave application submitted by student"
        );
        logRepository.save(log);

        auditLogService.log(user, "APPLY_LEAVE", "LEAVE_REQUEST", leave.getId(), "Applied for leave: " + leaveType.getName(), null);

        return mapToDto(leave);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getStudentLeaves(Long studentId) {
        return leaveRequestRepository.findByStudentId(studentId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getLeavesForClass(Long classId) {
        return leaveRequestRepository.findByStudentCurrentClassId(classId).stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getPendingLeavesForClassTeacher(Long classTeacherUserId) {
        return leaveRequestRepository.findAll().stream()
                .filter(l -> l.getFinalStatus() == LeaveStatus.CLASS_TEACHER_PENDING)
                .filter(l -> {
                    if (classTeacherUserId == null) return true;
                    SchoolClass sc = l.getStudent().getCurrentClass();
                    return sc != null && sc.getClassTeacher() != null && sc.getClassTeacher().getUser() != null
                            && sc.getClassTeacher().getUser().getId().equals(classTeacherUserId);
                })
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getPendingLeavesForCoordinator(Long coordinatorUserId) {
        return leaveRequestRepository.findAll().stream()
                .filter(l -> l.getFinalStatus() == LeaveStatus.COORDINATOR_PENDING)
                .filter(l -> {
                    if (coordinatorUserId == null) return true;
                    SchoolClass sc = l.getStudent().getCurrentClass();
                    return sc != null && sc.getCoordinator() != null && sc.getCoordinator().getUser() != null
                            && sc.getCoordinator().getUser().getId().equals(coordinatorUserId);
                })
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getPendingLeavesForParent(Long parentUserId) {
        return leaveRequestRepository.findAll().stream()
                .filter(l -> l.getStudent().getParent() != null && l.getStudent().getParent().getUser().getId().equals(parentUserId))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeaveResponseDto> getAllLeaves() {
        return leaveRequestRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public LeaveResponseDto getLeaveById(Long id) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + id));
        return mapToDto(leave);
    }

    @Override
    @Transactional
    public LeaveResponseDto parentVerifyLeave(Long leaveId, LeaveVerificationRequest request, String parentUsername) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveId));

        User parentUser = userRepository.findByUsername(parentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + parentUsername));

        boolean isPrincipal = parentUser.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (!isPrincipal) {
            if (leave.getStudent().getParent() == null ||
                leave.getStudent().getParent().getUser() == null ||
                !leave.getStudent().getParent().getUser().getId().equals(parentUser.getId())) {
                throw new UnauthorizedActionException("Unauthorized: You are not the registered parent for this student");
            }
        }

        if (leave.getFinalStatus() != LeaveStatus.PENDING_PARENT_VERIFICATION) {
            throw new BadRequestException("Leave is not in Stage 1 (Parent Verification) state. Current status: " + leave.getFinalStatus());
        }

        LeaveStatus prev = leave.getFinalStatus();
        LeaveStatus next;

        if ("APPROVE".equalsIgnoreCase(request.getAction())) {
            leave.setParentVerificationStatus(VerificationStatus.APPROVED);
            leave.setParentVerifiedAt(LocalDateTime.now());
            leave.setParentVerificationMethod("PARENT_PORTAL");
            leave.setParentRemarks(request.getRemarks() != null ? request.getRemarks() : "Approved by Parent");
            leave.setFinalStatus(LeaveStatus.CLASS_TEACHER_PENDING);
            next = LeaveStatus.CLASS_TEACHER_PENDING;
        } else {
            leave.setParentVerificationStatus(VerificationStatus.REJECTED);
            leave.setParentVerifiedAt(LocalDateTime.now());
            leave.setParentVerificationMethod("PARENT_PORTAL");
            leave.setParentRemarks(request.getRemarks() != null ? request.getRemarks() : "Rejected by Parent");
            leave.setFinalStatus(LeaveStatus.REJECTED);
            next = LeaveStatus.PARENT_REJECTED;
        }

        leave = leaveRequestRepository.save(leave);

        logRepository.save(new LeaveVerificationLog(
                leave, parentUser, "PARENT", request.getAction(), prev, next, request.getRemarks()
        ));

        notificationService.sendLeaveStageNotification(leave, "Parent Verification", request.getAction());
        auditLogService.log(parentUser, "PARENT_VERIFY_LEAVE", "LEAVE_REQUEST", leave.getId(), "Parent action: " + request.getAction(), null);

        return mapToDto(leave);
    }

    @Override
    @Transactional
    public LeaveResponseDto classTeacherVerifyLeave(Long leaveId, LeaveVerificationRequest request, String teacherUsername) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveId));

        User teacherUser = userRepository.findByUsername(teacherUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + teacherUsername));

        boolean isPrincipal = teacherUser.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (!isPrincipal) {
            SchoolClass sc = leave.getStudent().getCurrentClass();
            if (sc == null || sc.getClassTeacher() == null || sc.getClassTeacher().getUser() == null ||
                !sc.getClassTeacher().getUser().getId().equals(teacherUser.getId())) {
                throw new UnauthorizedActionException("Unauthorized: You are not the assigned Class Teacher for this student's class");
            }
        }

        if (leave.getFinalStatus() != LeaveStatus.CLASS_TEACHER_PENDING) {
            throw new BadRequestException("Leave is not at Stage 2 (Class Teacher Pending). Current status: " + leave.getFinalStatus());
        }

        LeaveStatus prev = leave.getFinalStatus();
        LeaveStatus next;

        if ("APPROVE".equalsIgnoreCase(request.getAction())) {
            leave.setClassTeacherVerificationStatus(VerificationStatus.APPROVED);
            leave.setClassTeacherVerifiedBy(teacherUser);
            leave.setClassTeacherVerifiedAt(LocalDateTime.now());
            leave.setClassTeacherRemarks(request.getRemarks() != null ? request.getRemarks() : "Approved by Class Teacher");
            leave.setFinalStatus(LeaveStatus.COORDINATOR_PENDING);
            next = LeaveStatus.COORDINATOR_PENDING;
        } else {
            leave.setClassTeacherVerificationStatus(VerificationStatus.REJECTED);
            leave.setClassTeacherVerifiedBy(teacherUser);
            leave.setClassTeacherVerifiedAt(LocalDateTime.now());
            leave.setClassTeacherRemarks(request.getRemarks() != null ? request.getRemarks() : "Rejected by Class Teacher");
            leave.setFinalStatus(LeaveStatus.REJECTED);
            next = LeaveStatus.CLASS_TEACHER_REJECTED;
        }

        leave = leaveRequestRepository.save(leave);

        logRepository.save(new LeaveVerificationLog(
                leave, teacherUser, "CLASS_TEACHER", request.getAction(), prev, next, request.getRemarks()
        ));

        notificationService.sendLeaveStageNotification(leave, "Class Teacher Verification", request.getAction());
        auditLogService.log(teacherUser, "TEACHER_VERIFY_LEAVE", "LEAVE_REQUEST", leave.getId(), "Class Teacher action: " + request.getAction(), null);

        return mapToDto(leave);
    }

    @Override
    @Transactional
    public LeaveResponseDto coordinatorVerifyLeave(Long leaveId, LeaveVerificationRequest request, String coordinatorUsername) {
        LeaveRequest leave = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + leaveId));

        User coordUser = userRepository.findByUsername(coordinatorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + coordinatorUsername));

        boolean isPrincipal = coordUser.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (!isPrincipal) {
            SchoolClass sc = leave.getStudent().getCurrentClass();
            boolean isAssigned = false;
            if (sc != null && sc.getCoordinator() != null && sc.getCoordinator().getUser() != null &&
                sc.getCoordinator().getUser().getId().equals(coordUser.getId())) {
                isAssigned = true;
            } else if (sc != null) {
                CoordinatorProfile cp = coordinatorProfileRepository.findByUser(coordUser)
                        .or(() -> coordinatorProfileRepository.findByUserId(coordUser.getId())).orElse(null);
                if (cp != null && cp.getAssignedWing() != null && sc.getName() != null &&
                    sc.getName().toLowerCase().contains(cp.getAssignedWing().trim().toLowerCase())) {
                    isAssigned = true;
                }
            }
            if (!isAssigned) {
                throw new UnauthorizedActionException("Unauthorized: You are not the assigned Coordinator for this student's class");
            }
        }

        if (leave.getFinalStatus() != LeaveStatus.COORDINATOR_PENDING) {
            throw new BadRequestException("Leave is not at Stage 3 (Coordinator Pending). Current status: " + leave.getFinalStatus());
        }

        LeaveStatus prev = leave.getFinalStatus();
        LeaveStatus next;

        if ("APPROVE".equalsIgnoreCase(request.getAction())) {
            leave.setCoordinatorVerificationStatus(VerificationStatus.APPROVED);
            leave.setCoordinatorVerifiedBy(coordUser);
            leave.setCoordinatorVerifiedAt(LocalDateTime.now());
            leave.setCoordinatorRemarks(request.getRemarks() != null ? request.getRemarks() : "Final approval granted by Coordinator");
            leave.setFinalStatus(LeaveStatus.APPROVED);
            next = LeaveStatus.APPROVED;
        } else {
            leave.setCoordinatorVerificationStatus(VerificationStatus.REJECTED);
            leave.setCoordinatorVerifiedBy(coordUser);
            leave.setCoordinatorVerifiedAt(LocalDateTime.now());
            leave.setCoordinatorRemarks(request.getRemarks() != null ? request.getRemarks() : "Rejected by Coordinator");
            leave.setFinalStatus(LeaveStatus.REJECTED);
            next = LeaveStatus.COORDINATOR_REJECTED;
        }

        leave = leaveRequestRepository.save(leave);

        logRepository.save(new LeaveVerificationLog(
                leave, coordUser, "COORDINATOR", request.getAction(), prev, next, request.getRemarks()
        ));

        notificationService.sendLeaveStageNotification(leave, "Coordinator Final Verification", request.getAction());
        auditLogService.log(coordUser, "COORDINATOR_VERIFY_LEAVE", "LEAVE_REQUEST", leave.getId(), "Coordinator action: " + request.getAction(), null);

        return mapToDto(leave);
    }

    private LeaveResponseDto mapToDto(LeaveRequest l) {
        LeaveResponseDto dto = new LeaveResponseDto();
        dto.setId(l.getId());
        dto.setStudentId(l.getStudent().getId());
        dto.setStudentName(l.getStudent().getUser().getFullName());
        dto.setRollNumber(l.getStudent().getRollNumber());
        dto.setAdmissionNumber(l.getStudent().getAdmissionNumber());
        if (l.getStudent().getCurrentClass() != null) {
            dto.setClassName(l.getStudent().getCurrentClass().getName());
        }
        if (l.getLeaveType() != null) {
            dto.setLeaveTypeId(l.getLeaveType().getId());
            dto.setLeaveTypeName(l.getLeaveType().getName());
        }
        dto.setStartDate(l.getStartDate());
        dto.setEndDate(l.getEndDate());
        if (l.getStartDate() != null && l.getEndDate() != null) {
            dto.setTotalDays(ChronoUnit.DAYS.between(l.getStartDate(), l.getEndDate()) + 1);
        } else {
            dto.setTotalDays(1L);
        }
        dto.setReason(l.getReason());
        dto.setDocumentUrl(l.getDocumentUrl());

        dto.setParentVerificationStatus(l.getParentVerificationStatus());
        dto.setParentVerifiedAt(l.getParentVerifiedAt());
        dto.setParentVerificationMethod(l.getParentVerificationMethod());
        dto.setParentRemarks(l.getParentRemarks());

        dto.setClassTeacherVerificationStatus(l.getClassTeacherVerificationStatus());
        if (l.getClassTeacherVerifiedBy() != null) {
            dto.setClassTeacherName(l.getClassTeacherVerifiedBy().getFullName());
        }
        dto.setClassTeacherVerifiedAt(l.getClassTeacherVerifiedAt());
        dto.setClassTeacherRemarks(l.getClassTeacherRemarks());

        dto.setCoordinatorVerificationStatus(l.getCoordinatorVerificationStatus());
        if (l.getCoordinatorVerifiedBy() != null) {
            dto.setCoordinatorName(l.getCoordinatorVerifiedBy().getFullName());
        }
        dto.setCoordinatorVerifiedAt(l.getCoordinatorVerifiedAt());
        dto.setCoordinatorRemarks(l.getCoordinatorRemarks());

        dto.setFinalStatus(l.getFinalStatus());
        dto.setCreatedAt(l.getCreatedAt());

        // Construct timeline
        List<LeaveTimelineItemDto> timeline = new ArrayList<>();
        
        // Stage 1: Parent
        String pStatus = l.getParentVerificationStatus() == VerificationStatus.APPROVED ? "APPROVED" : (l.getParentVerificationStatus() == VerificationStatus.REJECTED ? "REJECTED" : "PENDING");
        timeline.add(new LeaveTimelineItemDto(
                "STAGE 1: PARENT VERIFICATION (IVR / PORTAL)",
                l.getStudent().getParent() != null ? l.getStudent().getParent().getUser().getFullName() : "Parent",
                pStatus,
                l.getParentVerifiedAt(),
                l.getParentRemarks() != null ? l.getParentRemarks() : "Awaiting parent authorization",
                pStatus
        ));

        // Stage 2: Class Teacher
        String ctStatus = l.getClassTeacherVerificationStatus() == VerificationStatus.APPROVED ? "APPROVED" : (l.getClassTeacherVerificationStatus() == VerificationStatus.REJECTED ? "REJECTED" : (l.getParentVerificationStatus() == VerificationStatus.APPROVED ? "PENDING" : "WAITING_STAGE_1"));
        timeline.add(new LeaveTimelineItemDto(
                "STAGE 2: CLASS TEACHER REVIEW",
                l.getClassTeacherVerifiedBy() != null ? l.getClassTeacherVerifiedBy().getFullName() : "Class Teacher",
                ctStatus,
                l.getClassTeacherVerifiedAt(),
                l.getClassTeacherRemarks() != null ? l.getClassTeacherRemarks() : "Awaiting class teacher recommendation",
                ctStatus
        ));

        // Stage 3: Coordinator
        String cStatus = l.getCoordinatorVerificationStatus() == VerificationStatus.APPROVED ? "APPROVED" : (l.getCoordinatorVerificationStatus() == VerificationStatus.REJECTED ? "REJECTED" : (l.getClassTeacherVerificationStatus() == VerificationStatus.APPROVED ? "PENDING" : "WAITING_STAGE_2"));
        timeline.add(new LeaveTimelineItemDto(
                "STAGE 3: COORDINATOR FINAL APPROVAL",
                l.getCoordinatorVerifiedBy() != null ? l.getCoordinatorVerifiedBy().getFullName() : "Coordinator",
                cStatus,
                l.getCoordinatorVerifiedAt(),
                l.getCoordinatorRemarks() != null ? l.getCoordinatorRemarks() : "Awaiting academic coordinator sign-off",
                cStatus
        ));

        dto.setTimeline(timeline);
        return dto;
    }
}
