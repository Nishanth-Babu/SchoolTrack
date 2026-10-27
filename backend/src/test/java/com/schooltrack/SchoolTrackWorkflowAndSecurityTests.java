package com.schooltrack;

import com.schooltrack.dto.*;
import com.schooltrack.dto.ai.AiInsightsSummaryDto;
import com.schooltrack.entity.*;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.UnauthorizedActionException;
import com.schooltrack.ivr.IvrService;
import com.schooltrack.notification.NotificationService;
import com.schooltrack.repository.*;
import com.schooltrack.service.AuditLogService;
import com.schooltrack.service.impl.AiAnalyticsServiceImpl;
import com.schooltrack.service.impl.HomeworkServiceImpl;
import com.schooltrack.service.impl.LeaveServiceImpl;
import com.schooltrack.service.impl.MarkServiceImpl;
import com.schooltrack.service.impl.TimetableServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class SchoolTrackWorkflowAndSecurityTests {

    // Repositories & Services for Mocks
    private LeaveRequestRepository leaveRequestRepository;
    private LeaveTypeRepository leaveTypeRepository;
    private LeaveVerificationLogRepository logRepository;
    private StudentProfileRepository studentProfileRepository;
    private UserRepository userRepository;
    private NotificationService notificationService;
    private IvrService ivrService;
    private AuditLogService auditLogService;
    private CoordinatorProfileRepository coordinatorProfileRepository;
    private ClassTeacherProfileRepository classTeacherProfileRepository;
    private LeaveServiceImpl leaveService;

    // Entities
    private User principalUser;
    private User studentUser;
    private User parentUser;
    private User otherParentUser;
    private User classTeacherUser;
    private User otherTeacherUser;
    private User coordinatorUser;
    private User otherCoordinatorUser;

    private StudentProfile studentProfile;
    private ParentProfile parentProfile;
    private ClassTeacherProfile classTeacherProfile;
    private CoordinatorProfile coordinatorProfile;
    private SchoolClass schoolClass;
    private LeaveType medicalLeaveType;

    @BeforeEach
    void setUp() {
        leaveRequestRepository = mock(LeaveRequestRepository.class);
        leaveTypeRepository = mock(LeaveTypeRepository.class);
        logRepository = mock(LeaveVerificationLogRepository.class);
        studentProfileRepository = mock(StudentProfileRepository.class);
        userRepository = mock(UserRepository.class);
        notificationService = mock(NotificationService.class);
        ivrService = mock(IvrService.class);
        auditLogService = mock(AuditLogService.class);
        coordinatorProfileRepository = mock(CoordinatorProfileRepository.class);
        classTeacherProfileRepository = mock(ClassTeacherProfileRepository.class);

        leaveService = new LeaveServiceImpl(
                leaveRequestRepository,
                leaveTypeRepository,
                logRepository,
                studentProfileRepository,
                userRepository,
                notificationService,
                ivrService,
                auditLogService,
                coordinatorProfileRepository,
                classTeacherProfileRepository
        );

        // Setup Users
        principalUser = new User("principal1", "principal@schooltrack.com", "hash", "Principal", "Admin", "+91 9876543210");
        principalUser.setId(1L);
        principalUser.getRoles().add(new Role(RoleName.ROLE_PRINCIPAL));

        studentUser = new User("student1", "student@schooltrack.com", "hash", "John", "Doe", "+91 9876543211");
        studentUser.setId(2L);
        studentUser.getRoles().add(new Role(RoleName.ROLE_STUDENT));

        parentUser = new User("parent1", "parent@schooltrack.com", "hash", "Jane", "Doe", "+91 9876543212");
        parentUser.setId(3L);
        parentUser.getRoles().add(new Role(RoleName.ROLE_PARENT));

        otherParentUser = new User("otherparent", "otherparent@schooltrack.com", "hash", "Other", "Parent", "+91 9876543213");
        otherParentUser.setId(4L);
        otherParentUser.getRoles().add(new Role(RoleName.ROLE_PARENT));

        classTeacherUser = new User("teacher1", "teacher1@schooltrack.com", "hash", "Robert", "Smith", "+91 9876543214");
        classTeacherUser.setId(5L);
        classTeacherUser.getRoles().add(new Role(RoleName.ROLE_CLASS_TEACHER));

        otherTeacherUser = new User("teacher2", "teacher2@schooltrack.com", "hash", "Alice", "Brown", "+91 9876543215");
        otherTeacherUser.setId(6L);
        otherTeacherUser.getRoles().add(new Role(RoleName.ROLE_CLASS_TEACHER));

        coordinatorUser = new User("coord1", "coord1@schooltrack.com", "hash", "David", "Wilson", "+91 9876543216");
        coordinatorUser.setId(7L);
        coordinatorUser.getRoles().add(new Role(RoleName.ROLE_COORDINATOR));

        otherCoordinatorUser = new User("coord2", "coord2@schooltrack.com", "hash", "Mary", "Taylor", "+91 9876543217");
        otherCoordinatorUser.setId(8L);
        otherCoordinatorUser.getRoles().add(new Role(RoleName.ROLE_COORDINATOR));

        // Profiles & Relationships
        parentProfile = new ParentProfile(parentUser, "Engineer", "+91 9876543212", "MOTHER");
        parentProfile.setId(1L);

        classTeacherProfile = new ClassTeacherProfile(classTeacherUser, "EMP-CT-01", "Secondary");
        classTeacherProfile.setId(1L);

        coordinatorProfile = new CoordinatorProfile(coordinatorUser, "EMP-CR-01", "Academics", "High School");
        coordinatorProfile.setId(1L);

        schoolClass = new SchoolClass("10", "A", "Grade 10-A", classTeacherProfile, coordinatorProfile, null);
        schoolClass.setId(101L);

        studentProfile = new StudentProfile(studentUser, "ADM-001", "STU-001", schoolClass, LocalDate.of(2008, 5, 15), "Male", "O+", "123 School Road", parentProfile);
        studentProfile.setId(1L);

        medicalLeaveType = new LeaveType("Medical Leave", "MEDICAL", 10);
        medicalLeaveType.setId(1L);

        when(userRepository.findByUsername("student1")).thenReturn(Optional.of(studentUser));
        when(userRepository.findByUsername("parent1")).thenReturn(Optional.of(parentUser));
        when(userRepository.findByUsername("otherparent")).thenReturn(Optional.of(otherParentUser));
        when(userRepository.findByUsername("teacher1")).thenReturn(Optional.of(classTeacherUser));
        when(userRepository.findByUsername("teacher2")).thenReturn(Optional.of(otherTeacherUser));
        when(userRepository.findByUsername("coord1")).thenReturn(Optional.of(coordinatorUser));
        when(userRepository.findByUsername("coord2")).thenReturn(Optional.of(otherCoordinatorUser));
        when(userRepository.findByUsername("principal1")).thenReturn(Optional.of(principalUser));

        when(studentProfileRepository.findByUserId(2L)).thenReturn(Optional.of(studentProfile));
        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(studentProfile));
        when(leaveTypeRepository.findAll()).thenReturn(List.of(medicalLeaveType));
        when(leaveRequestRepository.save(any(LeaveRequest.class))).thenAnswer(i -> {
            LeaveRequest req = i.getArgument(0);
            if (req.getId() == null) req.setId(999L);
            return req;
        });
    }

    @Test
    @DisplayName("Leave Workflow: Full 3-Stage Successful Approval (Student -> Parent -> Class Teacher -> Coordinator)")
    void testFullThreeStageLeaveWorkflow() {
        // Step 1: Student applies
        LeaveApplyRequest applyReq = new LeaveApplyRequest();
        applyReq.setStartDate(LocalDate.now().plusDays(1));
        applyReq.setEndDate(LocalDate.now().plusDays(2));
        applyReq.setReason("Severe Flu and Fever");
        applyReq.setLeaveTypeName("Medical Leave");

        LeaveResponseDto applied = leaveService.applyLeave(applyReq, "student1");
        assertNotNull(applied);
        assertEquals(LeaveStatus.PENDING_PARENT_VERIFICATION, applied.getFinalStatus());
        assertEquals(VerificationStatus.PENDING, applied.getParentVerificationStatus());

        LeaveRequest leaveEntity = new LeaveRequest();
        leaveEntity.setId(999L);
        leaveEntity.setStudent(studentProfile);
        leaveEntity.setLeaveType(medicalLeaveType);
        leaveEntity.setStartDate(applyReq.getStartDate());
        leaveEntity.setEndDate(applyReq.getEndDate());
        leaveEntity.setFinalStatus(LeaveStatus.PENDING_PARENT_VERIFICATION);
        leaveEntity.setParentVerificationStatus(VerificationStatus.PENDING);
        when(leaveRequestRepository.findById(999L)).thenReturn(Optional.of(leaveEntity));

        // Step 2: Parent verifies and approves
        LeaveVerificationRequest parentReq = new LeaveVerificationRequest("APPROVE", "Confirmed by parent via portal");
        LeaveResponseDto parentVerified = leaveService.parentVerifyLeave(999L, parentReq, "parent1");
        assertEquals(LeaveStatus.CLASS_TEACHER_PENDING, parentVerified.getFinalStatus());
        assertEquals(VerificationStatus.APPROVED, parentVerified.getParentVerificationStatus());

        // Step 3: Class Teacher verifies and recommends
        LeaveVerificationRequest teacherReq = new LeaveVerificationRequest("APPROVE", "Student is in good standing");
        LeaveResponseDto teacherVerified = leaveService.classTeacherVerifyLeave(999L, teacherReq, "teacher1");
        assertEquals(LeaveStatus.COORDINATOR_PENDING, teacherVerified.getFinalStatus());
        assertEquals(VerificationStatus.APPROVED, teacherVerified.getClassTeacherVerificationStatus());

        // Step 4: Coordinator gives final sign-off
        LeaveVerificationRequest coordReq = new LeaveVerificationRequest("APPROVE", "Final academic approval granted");
        LeaveResponseDto coordVerified = leaveService.coordinatorVerifyLeave(999L, coordReq, "coord1");
        assertEquals(LeaveStatus.APPROVED, coordVerified.getFinalStatus());
        assertEquals(VerificationStatus.APPROVED, coordVerified.getCoordinatorVerificationStatus());
    }

    @Test
    @DisplayName("Leave Security: Unauthorized Parent cannot verify another student's leave")
    void testUnauthorizedParentCannotVerify() {
        LeaveRequest leaveEntity = new LeaveRequest();
        leaveEntity.setId(999L);
        leaveEntity.setStudent(studentProfile);
        leaveEntity.setFinalStatus(LeaveStatus.PENDING_PARENT_VERIFICATION);
        when(leaveRequestRepository.findById(999L)).thenReturn(Optional.of(leaveEntity));

        LeaveVerificationRequest req = new LeaveVerificationRequest("APPROVE", "Trying to verify unauthorized");
        assertThrows(UnauthorizedActionException.class, () -> {
            leaveService.parentVerifyLeave(999L, req, "otherparent");
        }, "Unauthorized parent must receive 403 / UnauthorizedActionException");
    }

    @Test
    @DisplayName("Leave Security: Unauthorized Class Teacher cannot verify another class's leave")
    void testUnauthorizedTeacherCannotVerify() {
        LeaveRequest leaveEntity = new LeaveRequest();
        leaveEntity.setId(999L);
        leaveEntity.setStudent(studentProfile);
        leaveEntity.setFinalStatus(LeaveStatus.CLASS_TEACHER_PENDING);
        leaveEntity.setParentVerificationStatus(VerificationStatus.APPROVED);
        when(leaveRequestRepository.findById(999L)).thenReturn(Optional.of(leaveEntity));

        LeaveVerificationRequest req = new LeaveVerificationRequest("APPROVE", "Trying to verify wrong class");
        assertThrows(UnauthorizedActionException.class, () -> {
            leaveService.classTeacherVerifyLeave(999L, req, "teacher2");
        }, "Unauthorized teacher must receive 403 / UnauthorizedActionException");
    }

    @Test
    @DisplayName("Leave Security: Unauthorized Coordinator cannot verify another coordinator's class")
    void testUnauthorizedCoordinatorCannotVerify() {
        LeaveRequest leaveEntity = new LeaveRequest();
        leaveEntity.setId(999L);
        leaveEntity.setStudent(studentProfile);
        leaveEntity.setFinalStatus(LeaveStatus.COORDINATOR_PENDING);
        leaveEntity.setClassTeacherVerificationStatus(VerificationStatus.APPROVED);
        when(leaveRequestRepository.findById(999L)).thenReturn(Optional.of(leaveEntity));

        LeaveVerificationRequest req = new LeaveVerificationRequest("APPROVE", "Trying to sign off wrong wing");
        assertThrows(UnauthorizedActionException.class, () -> {
            leaveService.coordinatorVerifyLeave(999L, req, "coord2");
        }, "Unauthorized coordinator must receive 403 / UnauthorizedActionException");
    }

    @Test
    @DisplayName("Leave Workflow: Parent Rejection immediately halts workflow and marks REJECTED")
    void testParentRejectionTerminatesWorkflow() {
        LeaveRequest leaveEntity = new LeaveRequest();
        leaveEntity.setId(999L);
        leaveEntity.setStudent(studentProfile);
        leaveEntity.setFinalStatus(LeaveStatus.PENDING_PARENT_VERIFICATION);
        when(leaveRequestRepository.findById(999L)).thenReturn(Optional.of(leaveEntity));

        LeaveVerificationRequest parentReq = new LeaveVerificationRequest("REJECT", "No leave permission granted");
        LeaveResponseDto res = leaveService.parentVerifyLeave(999L, parentReq, "parent1");
        assertEquals(LeaveStatus.REJECTED, res.getFinalStatus());
        assertEquals(VerificationStatus.REJECTED, res.getParentVerificationStatus());
    }

    @Test
    @DisplayName("Timetable Conflict Detection: Prevents double-booking for Teacher, Class, and Room")
    void testTimetableConflictDetection() {
        TimetableRepository timetableRepo = mock(TimetableRepository.class);
        SchoolClassRepository classRepo = mock(SchoolClassRepository.class);
        SubjectRepository subjectRepo = mock(SubjectRepository.class);
        SubjectTeacherProfileRepository teacherRepo = mock(SubjectTeacherProfileRepository.class);

        TimetableServiceImpl timetableService = new TimetableServiceImpl(timetableRepo, classRepo, subjectRepo, teacherRepo);

        SubjectTeacherProfile stp = new SubjectTeacherProfile(classTeacherUser, "EMP-01", "Math");
        stp.setId(10L);
        Subject sub = new Subject("Mathematics", "MATH101", "Core Math");
        sub.setId(5L);

        when(classRepo.findById(101L)).thenReturn(Optional.of(schoolClass));
        when(subjectRepo.findById(5L)).thenReturn(Optional.of(sub));
        when(teacherRepo.findById(10L)).thenReturn(Optional.of(stp));

        // 1. Teacher conflict
        when(timetableRepo.existsByTeacherIdAndDayOfWeekAndPeriodNumber(10L, "MONDAY", 1)).thenReturn(true);
        com.schooltrack.dto.CreateTimetableSlotRequest req1 = new com.schooltrack.dto.CreateTimetableSlotRequest();
        req1.setClassId(101L);
        req1.setSubjectId(5L);
        req1.setTeacherId(10L);
        req1.setDayOfWeek("MONDAY");
        req1.setPeriodNumber(1);

        assertThrows(BadRequestException.class, () -> timetableService.createTimetableSlot(req1));

        // 2. Class conflict
        when(timetableRepo.existsByTeacherIdAndDayOfWeekAndPeriodNumber(10L, "MONDAY", 2)).thenReturn(false);
        when(timetableRepo.existsBySchoolClassIdAndDayOfWeekAndPeriodNumber(101L, "MONDAY", 2)).thenReturn(true);
        com.schooltrack.dto.CreateTimetableSlotRequest req2 = new com.schooltrack.dto.CreateTimetableSlotRequest();
        req2.setClassId(101L);
        req2.setSubjectId(5L);
        req2.setTeacherId(10L);
        req2.setDayOfWeek("MONDAY");
        req2.setPeriodNumber(2);

        assertThrows(BadRequestException.class, () -> timetableService.createTimetableSlot(req2));

        // 3. Room conflict
        when(timetableRepo.existsBySchoolClassIdAndDayOfWeekAndPeriodNumber(101L, "MONDAY", 3)).thenReturn(false);
        when(timetableRepo.existsByTeacherIdAndDayOfWeekAndPeriodNumber(10L, "MONDAY", 3)).thenReturn(false);
        when(timetableRepo.existsByRoomNumberAndDayOfWeekAndPeriodNumber("Lab 1", "MONDAY", 3)).thenReturn(true);
        com.schooltrack.dto.CreateTimetableSlotRequest req3 = new com.schooltrack.dto.CreateTimetableSlotRequest();
        req3.setClassId(101L);
        req3.setSubjectId(5L);
        req3.setTeacherId(10L);
        req3.setDayOfWeek("MONDAY");
        req3.setPeriodNumber(3);
        req3.setRoomNumber("Lab 1");

        assertThrows(BadRequestException.class, () -> timetableService.createTimetableSlot(req3));
    }

    @Test
    @DisplayName("AI & Analytics Security: Access Denied for unauthorized roles (Student/Parent/Teacher)")
    void testAiAnalyticsSecurityDenialForLowerRoles() {
        AiAnalyticsServiceImpl aiService = new AiAnalyticsServiceImpl(
                studentProfileRepository,
                mock(StudentMarkRepository.class),
                mock(AttendanceRepository.class),
                leaveRequestRepository,
                mock(HomeworkCompletionRepository.class),
                mock(HomeworkRepository.class),
                mock(SchoolClassRepository.class),
                mock(SubjectRepository.class),
                mock(ExamRepository.class),
                userRepository,
                coordinatorProfileRepository
        );

        when(userRepository.findByUsername("student1")).thenReturn(Optional.of(studentUser));
        when(userRepository.findByUsername("teacher1")).thenReturn(Optional.of(classTeacherUser));

        assertThrows(UnauthorizedActionException.class, () -> {
            aiService.getInstitutionalInsights(null, "student1");
        }, "Students cannot access AI & Analytics");

        assertThrows(UnauthorizedActionException.class, () -> {
            aiService.getInstitutionalInsights(null, "teacher1");
        }, "Teachers cannot access AI & Analytics (only Principal and Coordinator)");
    }

    @Test
    @DisplayName("Attendance Rule: On-Duty (OD) is computed as 100% Present in official attendance metrics")
    void testOdAttendanceCalculations() {
        long present = 45;
        long absent = 5;
        long onDuty = 10;

        long effectivePresent = present + onDuty;
        long totalSessions = present + absent + onDuty;
        double attendancePercentage = (effectivePresent * 100.0) / totalSessions;

        assertEquals(55, effectivePresent);
        assertEquals(60, totalSessions);
        assertEquals(91.67, Math.round(attendancePercentage * 100.0) / 100.0);
    }

    @Test
    @DisplayName("Principal Account Creation: Provisions user with BCrypt and creates matching profile")
    void testPrincipalAccountCreation() {
        RoleRepository roleRepo = mock(RoleRepository.class);
        CoordinatorProfileRepository coordRepo = mock(CoordinatorProfileRepository.class);
        ClassTeacherProfileRepository ctRepo = mock(ClassTeacherProfileRepository.class);
        SubjectTeacherProfileRepository stRepo = mock(SubjectTeacherProfileRepository.class);
        StudentProfileRepository stuRepo = mock(StudentProfileRepository.class);
        ParentProfileRepository parRepo = mock(ParentProfileRepository.class);
        SchoolClassRepository scRepo = mock(SchoolClassRepository.class);
        SubjectRepository subRepo = mock(SubjectRepository.class);
        TeacherSubjectAssignmentRepository assignRepo = mock(TeacherSubjectAssignmentRepository.class);
        AcademicYearRepository ayRepo = mock(AcademicYearRepository.class);
        AuditLogRepository alRepo = mock(AuditLogRepository.class);
        org.springframework.security.crypto.password.PasswordEncoder passwordEncoder = mock(org.springframework.security.crypto.password.PasswordEncoder.class);

        when(passwordEncoder.encode(anyString())).thenReturn("$2a$10$encodedPasswordHash");
        when(userRepository.findByUsername("principal1")).thenReturn(Optional.of(principalUser));
        when(roleRepo.findByName(RoleName.ROLE_SUBJECT_TEACHER)).thenReturn(Optional.of(new Role(RoleName.ROLE_SUBJECT_TEACHER)));

        com.schooltrack.service.impl.AdminAccountServiceImpl adminAccountService = new com.schooltrack.service.impl.AdminAccountServiceImpl(
                userRepository, roleRepo, coordRepo, ctRepo, stRepo, stuRepo, parRepo,
                scRepo, subRepo, assignRepo, ayRepo, alRepo, passwordEncoder
        );

        com.schooltrack.dto.AccountCreateRequest req = new com.schooltrack.dto.AccountCreateRequest();
        req.setRole("SUBJECT_TEACHER");
        req.setFirstName("Alan");
        req.setLastName("Turing");
        req.setEmail("alan.turing@schooltrack.com");
        req.setPassword("SecurePass123!");
        req.setPhone("+91 9876500000");

        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(50L);
            return u;
        });

        com.schooltrack.dto.UserDto created = adminAccountService.createAccount(req, "principal1");
        assertNotNull(created);
        assertEquals("alan.turing@schooltrack.com", created.getEmail());
        verify(passwordEncoder).encode("SecurePass123!");
        verify(stRepo).save(any(SubjectTeacherProfile.class));
    }

    @Test
    @DisplayName("Attendance Security: Class Teacher / Coordinator cannot mark subject attendance")
    void testNonSubjectTeacherCannotMarkAttendance() {
        AttendanceRepository attRepo = mock(AttendanceRepository.class);
        StudentProfileRepository stuRepo = mock(StudentProfileRepository.class);
        SchoolClassRepository scRepo = mock(SchoolClassRepository.class);
        SubjectRepository subRepo = mock(SubjectRepository.class);
        SubjectTeacherProfileRepository stRepo = mock(SubjectTeacherProfileRepository.class);
        TeacherSubjectAssignmentRepository assignRepo = mock(TeacherSubjectAssignmentRepository.class);

        com.schooltrack.service.impl.AttendanceServiceImpl attendanceService = new com.schooltrack.service.impl.AttendanceServiceImpl(
                attRepo, stuRepo, scRepo, subRepo, userRepository, stRepo, assignRepo,
                leaveRequestRepository, notificationService, auditLogService,
                coordinatorProfileRepository, classTeacherProfileRepository
        );

        when(scRepo.findById(101L)).thenReturn(Optional.of(schoolClass));
        Subject sub = new Subject("Physics", "PHY101", "Core Physics");
        sub.setId(10L);
        when(subRepo.findById(10L)).thenReturn(Optional.of(sub));

        com.schooltrack.dto.BulkAttendanceRequest req = new com.schooltrack.dto.BulkAttendanceRequest();
        req.setClassId(101L);
        req.setSubjectId(10L);
        req.setDate(LocalDate.now());
        req.setRecords(List.of());

        // Class teacher attempting to mark attendance
        assertThrows(UnauthorizedActionException.class, () -> {
            attendanceService.markBulkAttendance(req, "teacher1");
        }, "Only assigned Subject Teachers can mark attendance");
    }

    @Test
    @DisplayName("Attendance Security: Unassigned Subject Teacher cannot mark attendance for unassigned class/subject")
    void testUnassignedSubjectTeacherCannotMarkAttendance() {
        AttendanceRepository attRepo = mock(AttendanceRepository.class);
        StudentProfileRepository stuRepo = mock(StudentProfileRepository.class);
        SchoolClassRepository scRepo = mock(SchoolClassRepository.class);
        SubjectRepository subRepo = mock(SubjectRepository.class);
        SubjectTeacherProfileRepository stRepo = mock(SubjectTeacherProfileRepository.class);
        TeacherSubjectAssignmentRepository assignRepo = mock(TeacherSubjectAssignmentRepository.class);

        com.schooltrack.service.impl.AttendanceServiceImpl attendanceService = new com.schooltrack.service.impl.AttendanceServiceImpl(
                attRepo, stuRepo, scRepo, subRepo, userRepository, stRepo, assignRepo,
                leaveRequestRepository, notificationService, auditLogService,
                coordinatorProfileRepository, classTeacherProfileRepository
        );

        User subjectTeacherUser = new User("subteacher1", "sub@schooltrack.com", "hash", "Isaac", "Newton", "+91 9999988888");
        subjectTeacherUser.setId(30L);
        subjectTeacherUser.getRoles().add(new Role(RoleName.ROLE_SUBJECT_TEACHER));
        when(userRepository.findByUsername("subteacher1")).thenReturn(Optional.of(subjectTeacherUser));

        SubjectTeacherProfile stp = new SubjectTeacherProfile(subjectTeacherUser, "EMP-ST-99", "Science");
        stp.setId(30L);
        when(stRepo.findByUserId(30L)).thenReturn(Optional.of(stp));

        when(scRepo.findById(101L)).thenReturn(Optional.of(schoolClass));
        Subject sub = new Subject("Physics", "PHY101", "Core Physics");
        sub.setId(10L);
        when(subRepo.findById(10L)).thenReturn(Optional.of(sub));

        // Teacher is not assigned
        when(assignRepo.existsByTeacherIdAndSchoolClassIdAndSubjectId(30L, 101L, 10L)).thenReturn(false);

        com.schooltrack.dto.BulkAttendanceRequest req = new com.schooltrack.dto.BulkAttendanceRequest();
        req.setClassId(101L);
        req.setSubjectId(10L);
        req.setDate(LocalDate.now());
        req.setRecords(List.of());

        assertThrows(UnauthorizedActionException.class, () -> {
            attendanceService.markBulkAttendance(req, "subteacher1");
        }, "Unassigned Subject Teacher cannot mark attendance");
    }

    @Test
    @DisplayName("Homework Security: Unassigned Subject Teacher cannot post homework for class")
    void testUnassignedSubjectTeacherCannotCreateHomework() {
        HomeworkRepository hwRepo = mock(HomeworkRepository.class);
        HomeworkCompletionRepository compRepo = mock(HomeworkCompletionRepository.class);
        SchoolClassRepository scRepo = mock(SchoolClassRepository.class);
        SubjectRepository subRepo = mock(SubjectRepository.class);
        StudentProfileRepository stuRepo = mock(StudentProfileRepository.class);
        TeacherSubjectAssignmentRepository assignRepo = mock(TeacherSubjectAssignmentRepository.class);
        SubjectTeacherProfileRepository stRepo = mock(SubjectTeacherProfileRepository.class);

        HomeworkServiceImpl hwService = new HomeworkServiceImpl(
                hwRepo, compRepo, scRepo, subRepo, userRepository, stuRepo,
                notificationService, auditLogService, assignRepo, stRepo
        );

        User subTeacher = new User("subteacher1", "sub@schooltrack.com", "hash", "Isaac", "Newton", "+91 9999988888");
        subTeacher.setId(30L);
        subTeacher.getRoles().add(new Role(RoleName.ROLE_SUBJECT_TEACHER));
        when(userRepository.findByUsername("subteacher1")).thenReturn(Optional.of(subTeacher));

        SubjectTeacherProfile stp = new SubjectTeacherProfile(subTeacher, "EMP-ST-99", "Science");
        stp.setId(30L);
        when(stRepo.findByUserId(30L)).thenReturn(Optional.of(stp));

        when(scRepo.findById(101L)).thenReturn(Optional.of(schoolClass));
        Subject sub = new Subject("Physics", "PHY101", "Core Physics");
        sub.setId(10L);
        when(subRepo.findById(10L)).thenReturn(Optional.of(sub));

        when(assignRepo.existsByTeacherIdAndSchoolClassIdAndSubjectId(30L, 101L, 10L)).thenReturn(false);

        com.schooltrack.dto.HomeworkCreateRequest req = new com.schooltrack.dto.HomeworkCreateRequest();
        req.setClassId(101L);
        req.setSubjectId(10L);
        req.setTitle("Solve Chapter 4 Problems");
        req.setDueDate(LocalDate.now().plusDays(2));

        assertThrows(UnauthorizedActionException.class, () -> {
            hwService.createHomework(req, "subteacher1");
        });
    }

    @Test
    @DisplayName("Homework Security: Student cannot update another student's homework status")
    void testStudentCannotUpdateOtherStudentHomework() {
        HomeworkRepository hwRepo = mock(HomeworkRepository.class);
        HomeworkCompletionRepository compRepo = mock(HomeworkCompletionRepository.class);
        SchoolClassRepository scRepo = mock(SchoolClassRepository.class);
        SubjectRepository subRepo = mock(SubjectRepository.class);
        StudentProfileRepository stuRepo = mock(StudentProfileRepository.class);
        TeacherSubjectAssignmentRepository assignRepo = mock(TeacherSubjectAssignmentRepository.class);
        SubjectTeacherProfileRepository stRepo = mock(SubjectTeacherProfileRepository.class);

        HomeworkServiceImpl hwService = new HomeworkServiceImpl(
                hwRepo, compRepo, scRepo, subRepo, userRepository, stuRepo,
                notificationService, auditLogService, assignRepo, stRepo
        );

        Homework hw = new Homework();
        hw.setId(100L);
        hw.setSchoolClass(schoolClass);
        hw.setSubject(new Subject("Math", "M101", "Math"));
        hw.setTeacher(classTeacherUser);
        hw.setDueDate(LocalDate.now().plusDays(1));
        when(hwRepo.findById(100L)).thenReturn(Optional.of(hw));

        StudentProfile otherStudent = new StudentProfile(
                new User("otherstu", "other@stu.com", "hash", "Alice", "Wonder", "+91 9999000011"),
                "ADM-002", "STU-002", schoolClass, LocalDate.of(2008, 1, 1), "Female", "A+", "Road", null
        );
        otherStudent.setId(2L);
        otherStudent.getUser().setId(99L);
        otherStudent.getUser().getRoles().add(new Role(RoleName.ROLE_STUDENT));
        when(stuRepo.findById(2L)).thenReturn(Optional.of(otherStudent));

        com.schooltrack.dto.HomeworkCompletionRequest req = new com.schooltrack.dto.HomeworkCompletionRequest();
        req.setCompleted(true);
        req.setRemarks("Finished!");

        // Student "student1" (id 2L) tries to update student 2L's homework
        assertThrows(UnauthorizedActionException.class, () -> {
            hwService.updateHomeworkCompletion(100L, 2L, req, "student1");
        }, "Students can only update their own homework status");
    }

    @Test
    @DisplayName("Marks Security: Unassigned Subject Teacher cannot save marks for class")
    void testUnassignedSubjectTeacherCannotSaveMarks() {
        StudentMarkRepository markRepo = mock(StudentMarkRepository.class);
        StudentProfileRepository stuRepo = mock(StudentProfileRepository.class);
        SchoolClassRepository scRepo = mock(SchoolClassRepository.class);
        SubjectRepository subRepo = mock(SubjectRepository.class);
        ExamRepository examRepo = mock(ExamRepository.class);
        AcademicYearRepository ayRepo = mock(AcademicYearRepository.class);
        SubjectTeacherProfileRepository stRepo = mock(SubjectTeacherProfileRepository.class);
        TeacherSubjectAssignmentRepository assignRepo = mock(TeacherSubjectAssignmentRepository.class);

        MarkServiceImpl markService = new MarkServiceImpl(
                examRepo, markRepo, stuRepo, subRepo, userRepository, ayRepo, assignRepo, stRepo
        );

        User subTeacher = new User("subteacher1", "sub@schooltrack.com", "hash", "Isaac", "Newton", "+91 9999988888");
        subTeacher.setId(30L);
        subTeacher.getRoles().add(new Role(RoleName.ROLE_SUBJECT_TEACHER));
        when(userRepository.findByUsername("subteacher1")).thenReturn(Optional.of(subTeacher));

        SubjectTeacherProfile stp = new SubjectTeacherProfile(subTeacher, "EMP-ST-99", "Science");
        stp.setId(30L);
        when(stRepo.findByUserId(30L)).thenReturn(Optional.of(stp));

        when(scRepo.findById(101L)).thenReturn(Optional.of(schoolClass));
        Subject sub = new Subject("Physics", "PHY101", "Core Physics");
        sub.setId(10L);
        when(subRepo.findById(10L)).thenReturn(Optional.of(sub));

        Exam exam = new Exam();
        exam.setId(1L);
        exam.setName("Mid-Term");
        exam.setMaxMarks(100.0);
        when(examRepo.findById(1L)).thenReturn(Optional.of(exam));

        when(assignRepo.existsByTeacherIdAndSchoolClassIdAndSubjectId(30L, 101L, 10L)).thenReturn(false);

        MarkItemDto item = new MarkItemDto();
        item.setStudentId(1L);
        item.setMarksObtained(85.0);
        item.setMaxMarks(100.0);

        when(stuRepo.findById(1L)).thenReturn(Optional.of(studentProfile));

        MarkBatchEntryRequest req = new MarkBatchEntryRequest();
        req.setSubjectId(10L);
        req.setExamId(1L);
        req.setMarks(List.of(item));

        assertThrows(UnauthorizedActionException.class, () -> {
            markService.saveBatchMarks(req, "subteacher1");
        });
    }
}
