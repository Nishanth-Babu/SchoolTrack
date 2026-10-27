package com.schooltrack.controller;

import com.schooltrack.dto.*;
import com.schooltrack.service.MarkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marks")
@Tag(name = "Marks & Examinations", description = "Endpoints for exam management, teacher marks batch entry, and student/parent report cards")
public class MarkController {

    private final MarkService markService;

    public MarkController(MarkService markService) {
        this.markService = markService;
    }

    @GetMapping("/exams")
    @Operation(summary = "Get list of all published exams")
    public ResponseEntity<List<ExamDto>> getAllExams() {
        return ResponseEntity.ok(markService.getAllExams());
    }

    @PostMapping("/exams")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Create an examination assessment")
    public ResponseEntity<ExamDto> createExam(@Valid @RequestBody ExamDto examDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(markService.createExam(examDto));
    }

    @PostMapping("/batch")
    @PreAuthorize("hasAnyRole('SUBJECT_TEACHER', 'CLASS_TEACHER', 'PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Save or update batch marks for students in a class and subject")
    public ResponseEntity<List<StudentMarkDto>> saveBatchMarks(@Valid @RequestBody MarkBatchEntryRequest request,
                                                               @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(markService.saveBatchMarks(request, userDetails.getUsername()));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get comprehensive report card for a student")
    public ResponseEntity<ReportCardDto> getStudentReportCard(@PathVariable Long studentId) {
        return ResponseEntity.ok(markService.getStudentReportCard(studentId));
    }

    @GetMapping("/class/{classId}/subject/{subjectId}/exam/{examId}")
    @PreAuthorize("hasAnyRole('SUBJECT_TEACHER', 'CLASS_TEACHER', 'PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Get class marks table for a specific subject and exam")
    public ResponseEntity<List<StudentMarkDto>> getClassSubjectMarks(@PathVariable Long classId,
                                                                     @PathVariable Long subjectId,
                                                                     @PathVariable Long examId) {
        return ResponseEntity.ok(markService.getClassSubjectMarks(classId, subjectId, examId));
    }
}
