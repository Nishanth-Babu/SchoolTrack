package com.schooltrack.service;

import com.schooltrack.dto.*;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    List<AttendanceResponseDto> markBulkAttendance(BulkAttendanceRequest request, String currentUsername);
    List<AttendanceResponseDto> getAttendanceByClassAndDate(Long classId, LocalDate date, String currentUsername);
    List<AttendanceResponseDto> getAttendanceByClassAndSubjectAndDateAndPeriod(Long classId, Long subjectId, LocalDate date, Integer period, String currentUsername);
    StudentAttendanceStatsDto getStudentAttendanceStats(Long studentId, String currentUsername);
    List<AttendanceResponseDto> getStudentAbsenceHistory(Long studentId, String currentUsername);
    ClassAttendanceSummaryDto getClassAttendanceSummary(Long classId, LocalDate date, String currentUsername);
    List<AttendanceResponseDto> getSchoolWideAttendance(LocalDate date, String currentUsername);

    // Default helpers for tests / backward compatibility
    default List<AttendanceResponseDto> getAttendanceByClassAndDate(Long classId, LocalDate date) {
        return getAttendanceByClassAndDate(classId, date, null);
    }
    default List<AttendanceResponseDto> getAttendanceByClassAndSubjectAndDateAndPeriod(Long classId, Long subjectId, LocalDate date, Integer period) {
        return getAttendanceByClassAndSubjectAndDateAndPeriod(classId, subjectId, date, period, null);
    }
    default StudentAttendanceStatsDto getStudentAttendanceStats(Long studentId) {
        return getStudentAttendanceStats(studentId, null);
    }
    default List<AttendanceResponseDto> getStudentAbsenceHistory(Long studentId) {
        return getStudentAbsenceHistory(studentId, null);
    }
    default ClassAttendanceSummaryDto getClassAttendanceSummary(Long classId, LocalDate date) {
        return getClassAttendanceSummary(classId, date, null);
    }
    default List<AttendanceResponseDto> getSchoolWideAttendance(LocalDate date) {
        return getSchoolWideAttendance(date, null);
    }
}
