package com.schooltrack.dto;

import java.time.LocalDate;

public class ClassAttendanceSummaryDto {
    private LocalDate date;
    private Long classId;
    private String className;
    private long totalStudents;
    private long presentCount;
    private long absentCount;
    private long onDutyCount;
    private long effectivePresent;
    private double attendancePercentage;

    public ClassAttendanceSummaryDto() {}

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
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
}
