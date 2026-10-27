package com.schooltrack.service;

import com.schooltrack.dto.*;
import java.util.List;

public interface MarkService {
    List<ExamDto> getAllExams();
    ExamDto createExam(ExamDto examDto);
    List<StudentMarkDto> saveBatchMarks(MarkBatchEntryRequest request, String teacherUsername);
    ReportCardDto getStudentReportCard(Long studentId);
    List<StudentMarkDto> getClassSubjectMarks(Long classId, Long subjectId, Long examId);
}
