package com.schooltrack.controller;

import com.schooltrack.dto.AttendanceReportDto;
import com.schooltrack.dto.AuditLogDto;
import com.schooltrack.dto.DashboardStatsDto;
import com.schooltrack.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Reports & Analytics", description = "Endpoints for school metrics, dashboard summaries, and audit logs")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/reports/attendance")
    @Operation(summary = "Get detailed attendance reports with trends and comparison")
    public ResponseEntity<AttendanceReportDto> getAttendanceReport(
            @RequestParam(required = false) String timeRange,
            @RequestParam(required = false) Long classId) {
        return ResponseEntity.ok(reportService.getAttendanceReport(timeRange, classId));
    }

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Get aggregated dashboard statistics for current user")
    public ResponseEntity<DashboardStatsDto> getDashboardStats(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reportService.getDashboardStats(userDetails.getUsername()));
    }

    @GetMapping("/audit-logs")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "View system audit trail (Principal only)")
    public ResponseEntity<List<AuditLogDto>> getAuditLogs() {
        return ResponseEntity.ok(reportService.getAuditLogs());
    }
}
