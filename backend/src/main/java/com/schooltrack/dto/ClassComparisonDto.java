package com.schooltrack.dto;

public class ClassComparisonDto {
    private String className;
    private long totalStudents;
    private double attendancePercentage;

    public ClassComparisonDto() {}

    public ClassComparisonDto(String className, long totalStudents, double attendancePercentage) {
        this.className = className;
        this.totalStudents = totalStudents;
        this.attendancePercentage = attendancePercentage;
    }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
}
