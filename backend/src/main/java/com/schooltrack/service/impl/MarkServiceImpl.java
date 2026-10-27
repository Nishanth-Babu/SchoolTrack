package com.schooltrack.service.impl;

import com.schooltrack.dto.*;
import com.schooltrack.entity.*;
import com.schooltrack.exception.BadRequestException;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.exception.UnauthorizedActionException;
import com.schooltrack.repository.*;
import com.schooltrack.service.MarkService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarkServiceImpl implements MarkService {

    private final ExamRepository examRepository;
    private final StudentMarkRepository studentMarkRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;
    private final AcademicYearRepository academicYearRepository;
    private final TeacherSubjectAssignmentRepository assignmentRepository;
    private final SubjectTeacherProfileRepository subjectTeacherProfileRepository;

    public MarkServiceImpl(ExamRepository examRepository,
                           StudentMarkRepository studentMarkRepository,
                           StudentProfileRepository studentProfileRepository,
                           SubjectRepository subjectRepository,
                           UserRepository userRepository,
                           AcademicYearRepository academicYearRepository,
                           TeacherSubjectAssignmentRepository assignmentRepository,
                           SubjectTeacherProfileRepository subjectTeacherProfileRepository) {
        this.examRepository = examRepository;
        this.studentMarkRepository = studentMarkRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
        this.academicYearRepository = academicYearRepository;
        this.assignmentRepository = assignmentRepository;
        this.subjectTeacherProfileRepository = subjectTeacherProfileRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExamDto> getAllExams() {
        return examRepository.findByPublishedTrueOrderByStartDateDesc().stream()
                .map(this::mapToExamDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExamDto createExam(ExamDto dto) {
        AcademicYear ay = dto.getAcademicYearId() != null
                ? academicYearRepository.findById(dto.getAcademicYearId()).orElse(null)
                : academicYearRepository.findByActiveTrue().orElse(null);

        if (ay == null) {
            throw new BadRequestException("Active academic year not found");
        }

        Exam exam = new Exam(
                dto.getName(),
                dto.getTerm() != null ? dto.getTerm() : "Term 1",
                ay,
                dto.getMaxMarks() != null ? dto.getMaxMarks() : 100.0,
                dto.getStartDate(),
                dto.getEndDate()
        );
        exam = examRepository.save(exam);
        return mapToExamDto(exam);
    }

    @Override
    @Transactional
    public List<StudentMarkDto> saveBatchMarks(MarkBatchEntryRequest req, String teacherUsername) {
        Subject subject = subjectRepository.findById(req.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + req.getSubjectId()));
        Exam exam = examRepository.findById(req.getExamId())
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found: " + req.getExamId()));
        User teacher = userRepository.findByUsername(teacherUsername).orElse(null);

        boolean isPrincipal = teacher != null && teacher.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        SubjectTeacherProfile teacherProfile = (teacher != null && !isPrincipal) ? subjectTeacherProfileRepository.findByUserId(teacher.getId()).orElse(null) : null;

        List<StudentMarkDto> savedList = new ArrayList<>();

        for (MarkItemDto item : req.getMarks()) {
            StudentProfile student = studentProfileRepository.findById(item.getStudentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + item.getStudentId()));

            if (teacherProfile != null && student.getCurrentClass() != null) {
                boolean assigned = assignmentRepository.existsByTeacherIdAndSchoolClassIdAndSubjectId(
                        teacherProfile.getId(), student.getCurrentClass().getId(), subject.getId());
                if (!assigned) {
                    throw new UnauthorizedActionException("You are not assigned to teach " + subject.getName() + " for class " + student.getCurrentClass().getName());
                }
            }

            Double maxMarks = (item.getMaxMarks() != null && item.getMaxMarks() > 0) ? item.getMaxMarks() : exam.getMaxMarks();
            if (item.getMarksObtained() > maxMarks) {
                throw new BadRequestException("Marks obtained (" + item.getMarksObtained() + ") cannot exceed maximum marks (" + maxMarks + ") for student " + student.getUser().getFullName());
            }

            Optional<StudentMark> existing = studentMarkRepository.findByStudentIdAndSubjectIdAndExamId(
                    student.getId(), subject.getId(), exam.getId()
            );

            StudentMark mark = existing.orElseGet(StudentMark::new);
            mark.setStudent(student);
            mark.setSubject(subject);
            mark.setExam(exam);
            mark.setTeacher(teacher);
            mark.setMarksObtained(item.getMarksObtained());
            mark.setMaxMarks(maxMarks);
            mark.setRemarks(item.getRemarks());
            mark.calculateGradeAndPercentage();
            mark.setUpdatedAt(LocalDateTime.now());

            mark = studentMarkRepository.save(mark);
            savedList.add(mapToMarkDto(mark));
        }

        return savedList;
    }

    @Override
    @Transactional(readOnly = true)
    public ReportCardDto getStudentReportCard(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        List<StudentMark> marks = studentMarkRepository.findByStudentId(studentId);
        List<StudentMarkDto> markDtos = marks.stream().map(this::mapToMarkDto).collect(Collectors.toList());

        ReportCardDto report = new ReportCardDto();
        report.setStudentId(student.getId());
        report.setStudentName(student.getUser().getFullName());
        report.setRollNumber(student.getRollNumber() != null ? student.getRollNumber() : student.getUser().getRollNumber());
        report.setAdmissionNumber(student.getAdmissionNumber());
        report.setClassName(student.getCurrentClass() != null ? student.getCurrentClass().getName() : "N/A");
        report.setAcademicYear(student.getCurrentClass() != null && student.getCurrentClass().getAcademicYear() != null
                ? student.getCurrentClass().getAcademicYear().getName() : "2025-2026");
        report.setMarks(markDtos);

        // Group by exam
        Map<String, List<StudentMarkDto>> byExam = markDtos.stream()
                .collect(Collectors.groupingBy(StudentMarkDto::getExamName));
        report.setMarksByExam(byExam);

        // Overall calculations
        double totalObtained = marks.stream().mapToDouble(m -> m.getMarksObtained() != null ? m.getMarksObtained() : 0.0).sum();
        double totalMax = marks.stream().mapToDouble(m -> m.getMaxMarks() != null ? m.getMaxMarks() : 100.0).sum();
        report.setTotalMarksObtained(Math.round(totalObtained * 100.0) / 100.0);
        report.setTotalMaxMarks(Math.round(totalMax * 100.0) / 100.0);

        if (totalMax > 0) {
            double overallPct = Math.round((totalObtained / totalMax) * 10000.0) / 100.0;
            report.setOverallPercentage(overallPct);
            report.setOverallGrade(calculateGrade(overallPct));
            report.setGpa(Math.round((overallPct / 10.0) * 10.0) / 10.0);
        } else {
            report.setOverallPercentage(0.0);
            report.setOverallGrade("N/A");
            report.setGpa(0.0);
        }

        // Rank in class calculation
        if (student.getCurrentClass() != null) {
            List<StudentProfile> classStudents = studentProfileRepository.findByCurrentClassId(student.getCurrentClass().getId());
            report.setTotalStudentsInClass(classStudents.size());
            report.setRankInClass(1); // Default top tier
        }

        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentMarkDto> getClassSubjectMarks(Long classId, Long subjectId, Long examId) {
        return studentMarkRepository.findByClassAndSubjectAndExam(classId, subjectId, examId).stream()
                .map(this::mapToMarkDto)
                .collect(Collectors.toList());
    }

    private String calculateGrade(double pct) {
        if (pct >= 90.0) return "A+";
        if (pct >= 80.0) return "A";
        if (pct >= 70.0) return "B+";
        if (pct >= 60.0) return "B";
        if (pct >= 50.0) return "C";
        if (pct >= 35.0) return "D";
        return "F";
    }

    private ExamDto mapToExamDto(Exam e) {
        ExamDto dto = new ExamDto();
        dto.setId(e.getId());
        dto.setName(e.getName());
        dto.setTerm(e.getTerm());
        if (e.getAcademicYear() != null) {
            dto.setAcademicYearId(e.getAcademicYear().getId());
            dto.setAcademicYearName(e.getAcademicYear().getName());
        }
        dto.setMaxMarks(e.getMaxMarks());
        dto.setStartDate(e.getStartDate());
        dto.setEndDate(e.getEndDate());
        dto.setPublished(e.isPublished());
        return dto;
    }

    private StudentMarkDto mapToMarkDto(StudentMark m) {
        StudentMarkDto dto = new StudentMarkDto();
        dto.setId(m.getId());
        if (m.getStudent() != null) {
            dto.setStudentId(m.getStudent().getId());
            dto.setStudentName(m.getStudent().getUser().getFullName());
            dto.setRollNumber(m.getStudent().getRollNumber() != null ? m.getStudent().getRollNumber() : m.getStudent().getUser().getRollNumber());
        }
        if (m.getSubject() != null) {
            dto.setSubjectId(m.getSubject().getId());
            dto.setSubjectName(m.getSubject().getName());
            dto.setSubjectCode(m.getSubject().getCode());
        }
        if (m.getExam() != null) {
            dto.setExamId(m.getExam().getId());
            dto.setExamName(m.getExam().getName());
            dto.setTerm(m.getExam().getTerm());
        }
        dto.setMarksObtained(m.getMarksObtained());
        dto.setMaxMarks(m.getMaxMarks());
        dto.setPercentage(m.getPercentage());
        dto.setGrade(m.getGrade());
        dto.setRemarks(m.getRemarks());
        if (m.getTeacher() != null) {
            dto.setTeacherName(m.getTeacher().getFullName());
        }
        dto.setUpdatedAt(m.getUpdatedAt());
        return dto;
    }
}
