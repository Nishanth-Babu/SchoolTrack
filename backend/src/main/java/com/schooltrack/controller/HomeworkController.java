package com.schooltrack.controller;

import com.schooltrack.dto.HomeworkCompletionRequest;
import com.schooltrack.dto.HomeworkCreateRequest;
import com.schooltrack.dto.HomeworkResponseDto;
import com.schooltrack.service.HomeworkService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/homework")
@Tag(name = "Digital Diary & Homework", description = "Endpoints for posting homework and managing student digital diary")
public class HomeworkController {

    private final HomeworkService homeworkService;

    public HomeworkController(HomeworkService homeworkService) {
        this.homeworkService = homeworkService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUBJECT_TEACHER', 'PRINCIPAL')")
    @Operation(summary = "Post homework assignment")
    public ResponseEntity<HomeworkResponseDto> createHomework(
            @Valid @RequestBody HomeworkCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(homeworkService.createHomework(request, userDetails.getUsername()));
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get homework for class")
    public ResponseEntity<List<HomeworkResponseDto>> getHomeworkForClass(
            @PathVariable Long classId,
            @RequestParam(required = false) Long studentId) {
        return ResponseEntity.ok(homeworkService.getHomeworkForClass(classId, studentId));
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get homework created by teacher")
    public ResponseEntity<List<HomeworkResponseDto>> getHomeworkForTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(homeworkService.getHomeworkForTeacher(teacherId));
    }

    @GetMapping("/student/{studentId}")
    @Operation(summary = "Get Student Digital Diary homework records")
    public ResponseEntity<List<HomeworkResponseDto>> getStudentDigitalDiary(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(homeworkService.getStudentDigitalDiary(studentId, userDetails != null ? userDetails.getUsername() : null));
    }

    @PutMapping("/{homeworkId}/student/{studentId}/status")
    @PreAuthorize("hasAnyRole('STUDENT', 'PARENT', 'SUBJECT_TEACHER', 'CLASS_TEACHER', 'PRINCIPAL')")
    @Operation(summary = "Mark homework completion status")
    public ResponseEntity<HomeworkResponseDto> updateCompletionStatus(
            @PathVariable Long homeworkId,
            @PathVariable Long studentId,
            @RequestBody HomeworkCompletionRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(homeworkService.updateHomeworkCompletion(homeworkId, studentId, request, userDetails != null ? userDetails.getUsername() : null));
    }

    @DeleteMapping("/{homeworkId}")
    @PreAuthorize("hasAnyRole('SUBJECT_TEACHER', 'CLASS_TEACHER', 'PRINCIPAL')")
    @Operation(summary = "Delete homework assignment")
    public ResponseEntity<Void> deleteHomework(
            @PathVariable Long homeworkId,
            @AuthenticationPrincipal UserDetails userDetails) {
        homeworkService.deleteHomework(homeworkId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
