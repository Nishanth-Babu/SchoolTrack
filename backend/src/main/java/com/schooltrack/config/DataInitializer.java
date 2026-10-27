package com.schooltrack.config;

import com.schooltrack.entity.*;
import com.schooltrack.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;
    private final PrincipalProfileRepository principalRepository;
    private final CoordinatorProfileRepository coordinatorRepository;
    private final ClassTeacherProfileRepository classTeacherRepository;
    private final SubjectTeacherProfileRepository subjectTeacherRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final ParentProfileRepository parentRepository;
    private final StudentProfileRepository studentRepository;
    private final LeaveTypeRepository leaveTypeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final LeaveVerificationLogRepository leaveLogRepository;
    private final AttendanceRepository attendanceRepository;
    private final NewsRepository newsRepository;
    private final HomeworkRepository homeworkRepository;
    private final HomeworkCompletionRepository homeworkCompletionRepository;
    private final NotificationRepository notificationRepository;
    private final ExamRepository examRepository;
    private final StudentMarkRepository studentMarkRepository;
    private final FeeCategoryRepository feeCategoryRepository;
    private final FeeInvoiceRepository feeInvoiceRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final TimetableRepository timetableRepository;
    private final CalendarEventRepository calendarEventRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           AcademicYearRepository academicYearRepository,
                           PrincipalProfileRepository principalRepository,
                           CoordinatorProfileRepository coordinatorRepository,
                           ClassTeacherProfileRepository classTeacherRepository,
                           SubjectTeacherProfileRepository subjectTeacherRepository,
                           SchoolClassRepository schoolClassRepository,
                           SubjectRepository subjectRepository,
                           TeacherSubjectAssignmentRepository assignmentRepository,
                           ParentProfileRepository parentRepository,
                           StudentProfileRepository studentRepository,
                           LeaveTypeRepository leaveTypeRepository,
                           LeaveRequestRepository leaveRequestRepository,
                           LeaveVerificationLogRepository leaveLogRepository,
                           AttendanceRepository attendanceRepository,
                           NewsRepository newsRepository,
                           HomeworkRepository homeworkRepository,
                           HomeworkCompletionRepository homeworkCompletionRepository,
                           NotificationRepository notificationRepository,
                           ExamRepository examRepository,
                           StudentMarkRepository studentMarkRepository,
                           FeeCategoryRepository feeCategoryRepository,
                           FeeInvoiceRepository feeInvoiceRepository,
                           FeePaymentRepository feePaymentRepository,
                           TimetableRepository timetableRepository,
                           CalendarEventRepository calendarEventRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.academicYearRepository = academicYearRepository;
        this.principalRepository = principalRepository;
        this.coordinatorRepository = coordinatorRepository;
        this.classTeacherRepository = classTeacherRepository;
        this.subjectTeacherRepository = subjectTeacherRepository;
        this.schoolClassRepository = schoolClassRepository;
        this.subjectRepository = subjectRepository;
        this.assignmentRepository = assignmentRepository;
        this.parentRepository = parentRepository;
        this.studentRepository = studentRepository;
        this.leaveTypeRepository = leaveTypeRepository;
        this.leaveRequestRepository = leaveRequestRepository;
        this.leaveLogRepository = leaveLogRepository;
        this.attendanceRepository = attendanceRepository;
        this.newsRepository = newsRepository;
        this.homeworkRepository = homeworkRepository;
        this.homeworkCompletionRepository = homeworkCompletionRepository;
        this.notificationRepository = notificationRepository;
        this.examRepository = examRepository;
        this.studentMarkRepository = studentMarkRepository;
        this.feeCategoryRepository = feeCategoryRepository;
        this.feeInvoiceRepository = feeInvoiceRepository;
        this.feePaymentRepository = feePaymentRepository;
        this.timetableRepository = timetableRepository;
        this.calendarEventRepository = calendarEventRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepository.count() == 0) {
            seedFreshDatabase();
        } else {
            backfillAndSeedAddons();
        }
    }

    private void backfillAndSeedAddons() {
        System.out.println(">>> BACKFILLING SCHOOLTRACK USER IDENTIFIERS & MARKS/FEES/TIMETABLE/CALENDAR MODULES...");

        // Backfill Teacher IDs
        userRepository.findByUsername("principal").ifPresent(u -> { u.setTeacherId("EMP-PRIN-01"); userRepository.save(u); });
        userRepository.findByUsername("coord_senior").ifPresent(u -> { u.setTeacherId("EMP-CRD-01"); userRepository.save(u); });
        userRepository.findByUsername("coord_high").ifPresent(u -> { u.setTeacherId("EMP-CRD-02"); userRepository.save(u); });
        userRepository.findByUsername("ct_grade10a").ifPresent(u -> { u.setTeacherId("EMP-CT-01"); userRepository.save(u); });
        userRepository.findByUsername("ct_grade10b").ifPresent(u -> { u.setTeacherId("EMP-CT-02"); userRepository.save(u); });
        userRepository.findByUsername("ct_grade9a").ifPresent(u -> { u.setTeacherId("EMP-CT-03"); userRepository.save(u); });
        userRepository.findByUsername("st_math").ifPresent(u -> { u.setTeacherId("EMP-ST-01"); userRepository.save(u); });
        userRepository.findByUsername("st_physics").ifPresent(u -> { u.setTeacherId("EMP-ST-02"); userRepository.save(u); });
        userRepository.findByUsername("st_cs").ifPresent(u -> { u.setTeacherId("EMP-ST-03"); userRepository.save(u); });
        userRepository.findByUsername("st_english").ifPresent(u -> { u.setTeacherId("EMP-ST-04"); userRepository.save(u); });

        // Backfill Student Roll Numbers from StudentProfiles
        studentRepository.findAll().forEach(sp -> {
            if (sp.getUser() != null && (sp.getUser().getRollNumber() == null || sp.getUser().getRollNumber().isBlank())) {
                sp.getUser().setRollNumber(sp.getRollNumber());
                userRepository.save(sp.getUser());
            }
        });

        AcademicYear ay = academicYearRepository.findByActiveTrue().orElseGet(() ->
                academicYearRepository.findAll().stream().findFirst().orElse(null)
        );

        // Seed Exams if empty
        if (examRepository.count() == 0 && ay != null) {
            Exam exam1 = examRepository.save(new Exam("Unit Test 1 (Formative)", "Term 1", ay, 50.0, LocalDate.now().minusMonths(2), LocalDate.now().minusMonths(2).plusDays(7)));
            Exam exam2 = examRepository.save(new Exam("Mid-Term Assessment 2025", "Term 1", ay, 100.0, LocalDate.now().minusMonths(1), LocalDate.now().minusMonths(1).plusDays(10)));
            Exam exam3 = examRepository.save(new Exam("Annual Board Mock Exam", "Term 2", ay, 100.0, LocalDate.now().plusDays(15), LocalDate.now().plusDays(25)));

            Subject subMath = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("MATH")).findFirst().orElse(null);
            Subject subPhysics = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("SCI")).findFirst().orElse(null);
            Subject subCs = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("CS")).findFirst().orElse(null);
            Subject subEng = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("ENG")).findFirst().orElse(null);

            User stMathUser = userRepository.findByUsername("st_math").orElse(null);
            User stPhysicsUser = userRepository.findByUsername("st_physics").orElse(null);
            User stCsUser = userRepository.findByUsername("st_cs").orElse(null);
            User stEngUser = userRepository.findByUsername("st_english").orElse(null);

            List<StudentProfile> students = studentRepository.findAll();
            if (!students.isEmpty() && subMath != null) {
                StudentProfile s1 = students.get(0);
                studentMarkRepository.save(new StudentMark(s1, subMath, exam1, stMathUser, 47.0, 50.0, "Outstanding analytical reasoning"));
                if (subPhysics != null) studentMarkRepository.save(new StudentMark(s1, subPhysics, exam1, stPhysicsUser, 44.5, 50.0, "Great experimental clarity"));
                if (subCs != null) studentMarkRepository.save(new StudentMark(s1, subCs, exam1, stCsUser, 49.0, 50.0, "Exemplary Java code structure"));
                if (subEng != null) studentMarkRepository.save(new StudentMark(s1, subEng, exam1, stEngUser, 42.0, 50.0, "Strong comprehension skills"));

                studentMarkRepository.save(new StudentMark(s1, subMath, exam2, stMathUser, 94.0, 100.0, "Highest in class for calculus"));
                if (subPhysics != null) studentMarkRepository.save(new StudentMark(s1, subPhysics, exam2, stPhysicsUser, 88.0, 100.0, "Sound conceptual understanding"));
                if (subCs != null) studentMarkRepository.save(new StudentMark(s1, subCs, exam2, stCsUser, 97.0, 100.0, "Top scorer in Data Structures"));
                if (subEng != null) studentMarkRepository.save(new StudentMark(s1, subEng, exam2, stEngUser, 85.0, 100.0, "Good creative essay writing"));

                if (students.size() > 1) {
                    StudentProfile s2 = students.get(1);
                    studentMarkRepository.save(new StudentMark(s2, subMath, exam2, stMathUser, 96.0, 100.0, "Exceptional precision"));
                    if (subPhysics != null) studentMarkRepository.save(new StudentMark(s2, subPhysics, exam2, stPhysicsUser, 95.0, 100.0, "Top rank in thermodynamics"));
                }
            }
        }

        // Seed Fee Categories & Invoices if empty
        if (feeCategoryRepository.count() == 0 && ay != null) {
            FeeCategory catTuition = feeCategoryRepository.save(new FeeCategory("Tuition & Academic Fee - Term 1", "Comprehensive classroom tuition, academic syllabus delivery, and mentor sessions", new BigDecimal("35000.00")));
            FeeCategory catLab = feeCategoryRepository.save(new FeeCategory("Laboratory & Science Equipment", "Physics, Chemistry, Biology, and Computer AI lab maintenance & consumables", new BigDecimal("8500.00")));
            FeeCategory catLibrary = feeCategoryRepository.save(new FeeCategory("Annual Library & Digital Resources", "Library subscriptions, IEEE access, and digital textbooks", new BigDecimal("4000.00")));
            FeeCategory catSports = feeCategoryRepository.save(new FeeCategory("Sports & Extracurricular Activities", "Grounds, coaching, equipment, and sports tournament entry fees", new BigDecimal("5500.00")));

            List<StudentProfile> students = studentRepository.findAll();
            User p1User = userRepository.findByUsername("parent_arun").orElse(null);

            if (!students.isEmpty()) {
                StudentProfile s1 = students.get(0);
                FeeInvoice inv1 = new FeeInvoice("INV-2025-1001-Q1", s1, catTuition, "Tuition & Academic Fee - Term 1", new BigDecimal("35000.00"), LocalDate.now().minusMonths(1), ay);
                inv1.setPaidAmount(new BigDecimal("35000.00"));
                inv1.updateStatus();
                inv1 = feeInvoiceRepository.save(inv1);

                feePaymentRepository.save(new FeePayment(
                        inv1, s1, p1User, new BigDecimal("35000.00"), PaymentMethod.UPI, "TXN-UPI-98218312", "REC-2025-0812", "Full Term 1 tuition payment received via UPI"
                ));

                FeeInvoice inv2 = new FeeInvoice("INV-2025-1001-Q2", s1, catLab, "Laboratory & Science Equipment Fee", new BigDecimal("8500.00"), LocalDate.now().plusDays(15), ay);
                feeInvoiceRepository.save(inv2);

                FeeInvoice inv3 = new FeeInvoice("INV-2025-1001-Q3", s1, catSports, "Annual Sports & Extracurricular Club", new BigDecimal("5500.00"), LocalDate.now().plusMonths(1), ay);
                feeInvoiceRepository.save(inv3);
            }
        }

        // Seed Timetable Slots if empty
        if (timetableRepository.count() == 0) {
            seedTimetableData();
        }

        // Seed Calendar Events if empty
        if (calendarEventRepository.count() == 0) {
            seedCalendarEventsData();
        }

        System.out.println(">>> BACKFILL COMPLETED SUCCESSFULLY!");
    }

    private void seedFreshDatabase() {
        System.out.println(">>> SEEDING SCHOOLTRACK ENTERPRISE DATA FOR MYSQL (FRESH)...");

        // 1. Roles
        Map<RoleName, Role> roles = new EnumMap<>(RoleName.class);
        for (RoleName rn : RoleName.values()) {
            roles.put(rn, roleRepository.save(new Role(rn)));
        }

        // 2. Academic Year
        AcademicYear ay = academicYearRepository.save(
                new AcademicYear("2025-2026", LocalDate.of(2025, 6, 1), LocalDate.of(2026, 5, 31), true)
        );

        String pass = passwordEncoder.encode("password123");

        // 3. Principal
        User principalUser = new User("principal", "principal@schooltrack.com", pass, "Arthur", "Pendelton", "+91 98111 00001");
        principalUser.setTeacherId("EMP-PRIN-01");
        principalUser.setRoles(Set.of(roles.get(RoleName.ROLE_PRINCIPAL)));
        principalUser = userRepository.save(principalUser);
        principalRepository.save(new PrincipalProfile(principalUser, "EMP-PRIN-01", "Ph.D. Educational Leadership", LocalDate.of(2018, 5, 15)));

        // 4. Coordinators
        User coord1User = new User("coord_senior", "coord.senior@schooltrack.com", pass, "Sarah", "Jenkins", "+91 98111 00002");
        coord1User.setTeacherId("EMP-CRD-01");
        coord1User.setRoles(Set.of(roles.get(RoleName.ROLE_COORDINATOR)));
        coord1User = userRepository.save(coord1User);
        CoordinatorProfile coord1 = coordinatorRepository.save(new CoordinatorProfile(coord1User, "EMP-CRD-01", "Academics", "Senior Secondary Wing"));

        User coord2User = new User("coord_high", "coord.high@schooltrack.com", pass, "David", "Miller", "+91 98111 00003");
        coord2User.setTeacherId("EMP-CRD-02");
        coord2User.setRoles(Set.of(roles.get(RoleName.ROLE_COORDINATOR)));
        coord2User = userRepository.save(coord2User);
        CoordinatorProfile coord2 = coordinatorRepository.save(new CoordinatorProfile(coord2User, "EMP-CRD-02", "Curriculum", "High School Wing"));

        // 5. Class Teachers
        User ct1User = new User("ct_grade10a", "ct.grade10a@schooltrack.com", pass, "Elena", "Rostova", "+91 98111 00004");
        ct1User.setTeacherId("EMP-CT-01");
        ct1User.setRoles(Set.of(roles.get(RoleName.ROLE_CLASS_TEACHER)));
        ct1User = userRepository.save(ct1User);
        ClassTeacherProfile ct1 = classTeacherRepository.save(new ClassTeacherProfile(ct1User, "EMP-CT-01", "M.Ed., B.Sc. Mathematics"));

        User ct2User = new User("ct_grade10b", "ct.grade10b@schooltrack.com", pass, "Robert", "Vance", "+91 98111 00005");
        ct2User.setTeacherId("EMP-CT-02");
        ct2User.setRoles(Set.of(roles.get(RoleName.ROLE_CLASS_TEACHER)));
        ct2User = userRepository.save(ct2User);
        ClassTeacherProfile ct2 = classTeacherRepository.save(new ClassTeacherProfile(ct2User, "EMP-CT-02", "M.A. English Literature"));

        User ct3User = new User("ct_grade9a", "ct.grade9a@schooltrack.com", pass, "Karen", "Davis", "+91 98111 00006");
        ct3User.setTeacherId("EMP-CT-03");
        ct3User.setRoles(Set.of(roles.get(RoleName.ROLE_CLASS_TEACHER)));
        ct3User = userRepository.save(ct3User);
        ClassTeacherProfile ct3 = classTeacherRepository.save(new ClassTeacherProfile(ct3User, "EMP-CT-03", "M.Sc. Physics"));

        // 6. Subject Teachers
        User stMathUser = new User("st_math", "st.math@schooltrack.com", pass, "Marcus", "Aurelius", "+91 98111 00007");
        stMathUser.setTeacherId("EMP-ST-01");
        stMathUser.setRoles(Set.of(roles.get(RoleName.ROLE_SUBJECT_TEACHER)));
        stMathUser = userRepository.save(stMathUser);
        SubjectTeacherProfile stMath = subjectTeacherRepository.save(new SubjectTeacherProfile(stMathUser, "EMP-ST-01", "Advanced Calculus & Statistics"));

        User stPhysicsUser = new User("st_physics", "st.physics@schooltrack.com", pass, "Isaac", "Newton", "+91 98111 00008");
        stPhysicsUser.setTeacherId("EMP-ST-02");
        stPhysicsUser.setRoles(Set.of(roles.get(RoleName.ROLE_SUBJECT_TEACHER)));
        stPhysicsUser = userRepository.save(stPhysicsUser);
        SubjectTeacherProfile stPhysics = subjectTeacherRepository.save(new SubjectTeacherProfile(stPhysicsUser, "EMP-ST-02", "Theoretical & Applied Physics"));

        User stCsUser = new User("st_cs", "st.cs@schooltrack.com", pass, "Ada", "Lovelace", "+91 98111 00009");
        stCsUser.setTeacherId("EMP-ST-03");
        stCsUser.setRoles(Set.of(roles.get(RoleName.ROLE_SUBJECT_TEACHER)));
        stCsUser = userRepository.save(stCsUser);
        SubjectTeacherProfile stCs = subjectTeacherRepository.save(new SubjectTeacherProfile(stCsUser, "EMP-ST-03", "Computer Science & Artificial Intelligence"));

        User stEngUser = new User("st_english", "st.english@schooltrack.com", pass, "William", "Shakespeare", "+91 98111 00010");
        stEngUser.setTeacherId("EMP-ST-04");
        stEngUser.setRoles(Set.of(roles.get(RoleName.ROLE_SUBJECT_TEACHER)));
        stEngUser = userRepository.save(stEngUser);
        SubjectTeacherProfile stEng = subjectTeacherRepository.save(new SubjectTeacherProfile(stEngUser, "EMP-ST-04", "English Literature & World History"));

        // 7. Classes
        SchoolClass class10A = schoolClassRepository.save(new SchoolClass("10", "A", "Grade 10-A", ct1, coord1, ay));
        SchoolClass class10B = schoolClassRepository.save(new SchoolClass("10", "B", "Grade 10-B", ct2, coord1, ay));
        SchoolClass class9A = schoolClassRepository.save(new SchoolClass("9", "A", "Grade 9-A", ct3, coord2, ay));

        // 8. Subjects
        Subject subMath = subjectRepository.save(new Subject("Mathematics", "MATH-10", "Core Mathematics, Algebra, Trigonometry & Statistics"));
        Subject subPhysics = subjectRepository.save(new Subject("Science & Physics", "SCI-PHY-10", "Applied Physics, Mechanics & Laboratory Practicals"));
        Subject subCs = subjectRepository.save(new Subject("Computer Science", "CS-10", "Python, Java OOP, Algorithms & Database Systems"));
        Subject subEng = subjectRepository.save(new Subject("English Literature", "ENG-10", "Language Skills, Essay Writing & Classical Literature"));
        Subject subSocial = subjectRepository.save(new Subject("Social Studies", "SOC-10", "World History, Civics & Geography"));
        Subject subPe = subjectRepository.save(new Subject("Physical Education", "PE-10", "Athletics, Team Sports & Health Science"));

        // 9. Teacher Assignments
        assignmentRepository.save(new TeacherSubjectAssignment(stMath, class10A, subMath, ay));
        assignmentRepository.save(new TeacherSubjectAssignment(stPhysics, class10A, subPhysics, ay));
        assignmentRepository.save(new TeacherSubjectAssignment(stCs, class10A, subCs, ay));
        assignmentRepository.save(new TeacherSubjectAssignment(stEng, class10A, subEng, ay));

        // 10. Parents
        User p1User = new User("parent_arun", "parent.arun@schooltrack.com", pass, "Vikram", "Sharma", "+91 98765 43210");
        p1User.setRoles(Set.of(roles.get(RoleName.ROLE_PARENT)));
        p1User = userRepository.save(p1User);
        ParentProfile parent1 = parentRepository.save(new ParentProfile(p1User, "Senior Software Architect", "+91 98765 43210", "FATHER"));

        // 11. Students
        User s1User = new User("student_arun", "student.arun@schooltrack.com", pass, "Arun", "Sharma", "+91 98222 10001");
        s1User.setRollNumber("01");
        s1User.setRoles(Set.of(roles.get(RoleName.ROLE_STUDENT)));
        s1User = userRepository.save(s1User);
        StudentProfile s1 = studentRepository.save(new StudentProfile(
                s1User, "ST-2025-1001", "01", class10A, LocalDate.of(2009, 8, 14), "Male", "O+", "42 Heritage Avenue, South City", parent1
        ));

        // 12. Leave Types
        LeaveType ltMedical = leaveTypeRepository.save(new LeaveType("Medical Leave", "Approved for health-related illnesses, doctor visits, or hospitalization", 14));
        leaveTypeRepository.save(new LeaveType("Official Sports / Competition", "Representing the school at inter-district or state athletic meets", 7));
        leaveTypeRepository.save(new LeaveType("Family Obligation", "Urgent domestic occasions, family gatherings, or bereavement", 5));
        leaveTypeRepository.save(new LeaveType("Casual Leave", "Short personal leave for urgent personal matters", 3));

        // 13. Sample Leave Requests
        LeaveRequest l1 = new LeaveRequest();
        l1.setStudent(s1);
        l1.setLeaveType(ltMedical);
        l1.setStartDate(LocalDate.now());
        l1.setEndDate(LocalDate.now());
        l1.setReason("Severe viral fever and physician recommended rest");
        l1.setDocumentUrl("https://schooltrack.internal/docs/med_cert_arun_1001.pdf");
        l1.setParentVerificationStatus(VerificationStatus.APPROVED);
        l1.setParentVerifiedAt(LocalDateTime.now().minusHours(18));
        l1.setParentVerificationMethod("IVR_MOCK");
        l1.setParentRemarks("Verified via IVR tele-response #1");
        l1.setClassTeacherVerificationStatus(VerificationStatus.APPROVED);
        l1.setClassTeacherVerifiedBy(ct1User);
        l1.setClassTeacherVerifiedAt(LocalDateTime.now().minusHours(14));
        l1.setClassTeacherRemarks("Medical certificate attached, recommended.");
        l1.setCoordinatorVerificationStatus(VerificationStatus.APPROVED);
        l1.setCoordinatorVerifiedBy(coord1User);
        l1.setCoordinatorVerifiedAt(LocalDateTime.now().minusHours(10));
        l1.setCoordinatorRemarks("Approved by Academic Coordinator.");
        l1.setFinalStatus(LeaveStatus.APPROVED);
        leaveRequestRepository.save(l1);

        // 14. Examinations
        Exam exam1 = examRepository.save(new Exam("Unit Test 1 (Formative)", "Term 1", ay, 50.0, LocalDate.now().minusMonths(2), LocalDate.now().minusMonths(2).plusDays(7)));
        Exam exam2 = examRepository.save(new Exam("Mid-Term Assessment 2025", "Term 1", ay, 100.0, LocalDate.now().minusMonths(1), LocalDate.now().minusMonths(1).plusDays(10)));

        studentMarkRepository.save(new StudentMark(s1, subMath, exam1, stMathUser, 47.0, 50.0, "Outstanding analytical reasoning"));
        studentMarkRepository.save(new StudentMark(s1, subMath, exam2, stMathUser, 94.0, 100.0, "Highest in class for calculus"));

        // 15. Fees
        FeeCategory catTuition = feeCategoryRepository.save(new FeeCategory("Tuition & Academic Fee - Term 1", "Classroom tuition & mentorship", new BigDecimal("35000.00")));
        FeeCategory catLab = feeCategoryRepository.save(new FeeCategory("Laboratory & Science Equipment", "Lab maintenance", new BigDecimal("8500.00")));

        FeeInvoice inv1 = new FeeInvoice("INV-2025-1001-Q1", s1, catTuition, "Tuition & Academic Fee - Term 1", new BigDecimal("35000.00"), LocalDate.now().minusMonths(1), ay);
        inv1.setPaidAmount(new BigDecimal("35000.00"));
        inv1.updateStatus();
        inv1 = feeInvoiceRepository.save(inv1);

        feePaymentRepository.save(new FeePayment(
                inv1, s1, p1User, new BigDecimal("35000.00"), PaymentMethod.UPI, "TXN-UPI-98218312", "REC-2025-0812", "Full Term 1 tuition payment received via UPI"
        ));

        FeeInvoice inv2 = new FeeInvoice("INV-2025-1001-Q2", s1, catLab, "Laboratory & Science Equipment Fee", new BigDecimal("8500.00"), LocalDate.now().plusDays(15), ay);
        feeInvoiceRepository.save(inv2);

        // 16. Timetable & Calendar Events
        seedTimetableData();
        seedCalendarEventsData();

        System.out.println(">>> SEEDING COMPLETED SUCCESSFULLY!");
    }

    private void seedTimetableData() {
        SchoolClass class10A = schoolClassRepository.findAll().stream().filter(c -> c.getName().equals("10") && c.getSection().equals("A")).findFirst().orElse(null);
        if (class10A == null) return;

        Subject subMath = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("MATH")).findFirst().orElse(null);
        Subject subPhysics = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("SCI")).findFirst().orElse(null);
        Subject subCs = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("CS")).findFirst().orElse(null);
        Subject subEng = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("ENG")).findFirst().orElse(null);
        Subject subSocial = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("SOC")).findFirst().orElse(subMath);
        Subject subPe = subjectRepository.findAll().stream().filter(s -> s.getCode().contains("PE")).findFirst().orElse(subEng);

        SubjectTeacherProfile stMath = subjectTeacherRepository.findAll().stream().filter(t -> "EMP-ST-01".equals(t.getEmployeeId())).findFirst().orElse(null);
        SubjectTeacherProfile stPhysics = subjectTeacherRepository.findAll().stream().filter(t -> "EMP-ST-02".equals(t.getEmployeeId())).findFirst().orElse(null);
        SubjectTeacherProfile stCs = subjectTeacherRepository.findAll().stream().filter(t -> "EMP-ST-03".equals(t.getEmployeeId())).findFirst().orElse(null);
        SubjectTeacherProfile stEng = subjectTeacherRepository.findAll().stream().filter(t -> "EMP-ST-04".equals(t.getEmployeeId())).findFirst().orElse(null);

        String[] days = {"MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"};
        String[][] periodTimes = {
                {"08:30 AM", "09:15 AM"},
                {"09:15 AM", "10:00 AM"},
                {"10:15 AM", "11:00 AM"},
                {"11:00 AM", "11:45 AM"},
                {"12:30 PM", "01:15 PM"},
                {"01:15 PM", "02:00 PM"}
        };

        Subject[][] daySubjects = {
                {subMath, subPhysics, subEng, subCs, subSocial, subPe}, // Monday
                {subPhysics, subMath, subCs, subEng, subPe, subSocial}, // Tuesday
                {subCs, subEng, subMath, subPhysics, subSocial, subMath}, // Wednesday
                {subMath, subSocial, subPhysics, subCs, subEng, subPe},   // Thursday
                {subEng, subPhysics, subCs, subMath, subPe, subSocial}    // Friday
        };

        SubjectTeacherProfile[][] dayTeachers = {
                {stMath, stPhysics, stEng, stCs, stMath, stEng},
                {stPhysics, stMath, stCs, stEng, stEng, stMath},
                {stCs, stEng, stMath, stPhysics, stMath, stMath},
                {stMath, stMath, stPhysics, stCs, stEng, stEng},
                {stEng, stPhysics, stCs, stMath, stEng, stMath}
        };

        for (int d = 0; d < days.length; d++) {
            String day = days[d];
            for (int p = 0; p < 6; p++) {
                Subject subj = daySubjects[d][p];
                SubjectTeacherProfile prof = dayTeachers[d][p];
                if (subj != null) {
                    timetableRepository.save(new TimetableSlot(
                            day,
                            p + 1,
                            periodTimes[p][0],
                            periodTimes[p][1],
                            class10A,
                            subj,
                            prof,
                            "Room 10-A (Lab 2)"
                    ));
                }
            }
        }
    }

    private void seedCalendarEventsData() {
        calendarEventRepository.save(new CalendarEvent(
                "Mid-Term Board Mock Examinations",
                "Term 1 evaluation covering Mathematics, Science, Computer Science & Languages",
                "EXAM",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(12),
                "STUDENTS",
                "Main Academic Examination Wing"
        ));

        calendarEventRepository.save(new CalendarEvent(
                "Parent-Teacher Conference & Progress Review (PTM)",
                "One-on-one consultation with Class Teachers and Subject Teachers on Term 1 performance",
                "PTM",
                LocalDate.now().plusDays(18),
                LocalDate.now().plusDays(18),
                "PARENTS",
                "School Auditorium & Classrooms"
        ));

        calendarEventRepository.save(new CalendarEvent(
                "Annual Inter-School STEM & Robotics Expo",
                "Live exhibits, coding hackathon, robotics arena, and scientific innovation showcases",
                "EVENT",
                LocalDate.now().plusDays(24),
                LocalDate.now().plusDays(25),
                "ALL",
                "Innovation Centre & Gymnasium"
        ));

        calendarEventRepository.save(new CalendarEvent(
                "National Unity Day & Cultural Assembly",
                "Special morning assembly, debate competition, and cultural performances",
                "FUNCTION",
                LocalDate.now().plusDays(30),
                LocalDate.now().plusDays(30),
                "ALL",
                "Central Amphitheatre"
        ));

        calendarEventRepository.save(new CalendarEvent(
                "Autumn Semester Break / Institutional Holiday",
                "School remains closed for staff and students. Administrative offices open from 10 AM.",
                "HOLIDAY",
                LocalDate.now().plusDays(35),
                LocalDate.now().plusDays(39),
                "ALL",
                "Campus Wide"
        ));
    }
}
