package com.schooltrack.controller;

import com.schooltrack.dto.AttendanceResponseDto;
import com.schooltrack.dto.BulkAttendanceRequest;
import com.schooltrack.dto.ClassAttendanceSummaryDto;
import com.schooltrack.dto.StudentAttendanceStatsDto;
import com.schooltrack.service.AttendanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Attendance", description = "Attendance marking (PRESENT, ABSENT, ON_DUTY), calculation, and statistics")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping("/attendance")
    @PreAuthorize("hasRole('SUBJECT_TEACHER')")
    @Operation(summary = "Mark bulk attendance for a class and period (Strictly Subject Teacher for assigned class/subject)")
    public ResponseEntity<List<AttendanceResponseDto>> markBulkAttendance(
            @Valid @RequestBody BulkAttendanceRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(attendanceService.markBulkAttendance(request, userDetails.getUsername()));
    }

    @GetMapping("/attendance")
    @Operation(summary = "Get attendance by class, subject, date, and period")
    public ResponseEntity<List<AttendanceResponseDto>> getAttendance(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer period,
            @AuthenticationPrincipal UserDetails userDetails) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        String username = userDetails != null ? userDetails.getUsername() : null;

        if (classId != null && subjectId != null && period != null) {
            return ResponseEntity.ok(attendanceService.getAttendanceByClassAndSubjectAndDateAndPeriod(classId, subjectId, targetDate, period, username));
        }
        if (classId != null) {
            return ResponseEntity.ok(attendanceService.getAttendanceByClassAndDate(classId, targetDate, username));
        }
        return ResponseEntity.ok(attendanceService.getSchoolWideAttendance(targetDate, username));
    }

    @GetMapping("/attendance/student/{studentId}")
    @Operation(summary = "Get complete attendance breakdown for a student")
    public ResponseEntity<StudentAttendanceStatsDto> getStudentAttendanceStats(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(attendanceService.getStudentAttendanceStats(studentId, username));
    }

    @GetMapping("/students/{studentId}/absences")
    @Operation(summary = "Get student absence history with prior leave info")
    public ResponseEntity<List<AttendanceResponseDto>> getStudentAbsences(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(attendanceService.getStudentAbsenceHistory(studentId, username));
    }

    @GetMapping("/attendance/class/{classId}/summary")
    @Operation(summary = "Get class attendance summary statistics")
    public ResponseEntity<ClassAttendanceSummaryDto> getClassSummary(
            @PathVariable Long classId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails != null ? userDetails.getUsername() : null;
        return ResponseEntity.ok(attendanceService.getClassAttendanceSummary(classId, date != null ? date : LocalDate.now(), username));
    }
}
