package com.schooltrack.dto;

import java.util.List;

public class AttendanceReportDto {
    private String timeRange; // DAILY, WEEKLY, MONTHLY
    private long totalRecords;
    private long totalPresent;
    private long totalAbsent;
    private long totalOnDuty;
    private long effectivePresent;
    private double overallPercentage;
    private List<MonthlyTrendDto> monthlyTrends;
    private List<ClassComparisonDto> classComparison;

    public AttendanceReportDto() {}

    public String getTimeRange() { return timeRange; }
    public void setTimeRange(String timeRange) { this.timeRange = timeRange; }
    public long getTotalRecords() { return totalRecords; }
    public void setTotalRecords(long totalRecords) { this.totalRecords = totalRecords; }
    public long getTotalPresent() { return totalPresent; }
    public void setTotalPresent(long totalPresent) { this.totalPresent = totalPresent; }
    public long getTotalAbsent() { return totalAbsent; }
    public void setTotalAbsent(long totalAbsent) { this.totalAbsent = totalAbsent; }
    public long getTotalOnDuty() { return totalOnDuty; }
    public void setTotalOnDuty(long totalOnDuty) { this.totalOnDuty = totalOnDuty; }
    public long getEffectivePresent() { return effectivePresent; }
    public void setEffectivePresent(long effectivePresent) { this.effectivePresent = effectivePresent; }
    public double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(double overallPercentage) { this.overallPercentage = overallPercentage; }
    public List<MonthlyTrendDto> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<MonthlyTrendDto> monthlyTrends) { this.monthlyTrends = monthlyTrends; }
    public List<ClassComparisonDto> getClassComparison() { return classComparison; }
    public void setClassComparison(List<ClassComparisonDto> classComparison) { this.classComparison = classComparison; }
}
