package com.schooltrack.dto;

import java.util.List;

public class StudentAttendanceStatsDto {
    private Long studentId;
    private String studentName;
    private String admissionNumber;
    private String rollNumber;
    private String className;
    private long totalSessions;
    private long presentCount;
    private long absentCount;
    private long onDutyCount;
    private long effectivePresent; // presentCount + onDutyCount
    private double attendancePercentage; // (effectivePresent / total) * 100
    private List<AttendanceResponseDto> recentAbsences;
    private List<AttendanceResponseDto> records;

    public StudentAttendanceStatsDto() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getAdmissionNumber() { return admissionNumber; }
    public void setAdmissionNumber(String admissionNumber) { this.admissionNumber = admissionNumber; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public long getTotalSessions() { return totalSessions; }
    public void setTotalSessions(long totalSessions) { this.totalSessions = totalSessions; }
    public long getPresentCount() { return presentCount; }
    public void setPresentCount(long presentCount) { this.presentCount = presentCount; }
    public long getAbsentCount() { return absentCount; }
    public void setAbsentCount(long absentCount) { this.absentCount = absentCount; }
    public long getOnDutyCount() { return onDutyCount; }
    public void setOnDutyCount(long onDutyCount) { this.onDutyCount = onDutyCount; }
    public long getEffectivePresent() { return effectivePresent; }
    public void setEffectivePresent(long effectivePresent) { this.effectivePresent = effectivePresent; }
    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
    public List<AttendanceResponseDto> getRecentAbsences() { return recentAbsences; }
    public void setRecentAbsences(List<AttendanceResponseDto> recentAbsences) { this.recentAbsences = recentAbsences; }
    public List<AttendanceResponseDto> getRecords() { return records; }
    public void setRecords(List<AttendanceResponseDto> records) { this.records = records; }
}
