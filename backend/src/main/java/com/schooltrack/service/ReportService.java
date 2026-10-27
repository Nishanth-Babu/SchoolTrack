package com.schooltrack.service;

import com.schooltrack.dto.AttendanceReportDto;
import com.schooltrack.dto.AuditLogDto;
import com.schooltrack.dto.DashboardStatsDto;
import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    AttendanceReportDto getAttendanceReport(String timeRange, Long classId);
    DashboardStatsDto getDashboardStats(String username);
    List<AuditLogDto> getAuditLogs();
}
