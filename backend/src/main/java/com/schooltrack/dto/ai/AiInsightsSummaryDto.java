package com.schooltrack.dto.ai;

import java.util.List;

public class AiInsightsSummaryDto {
    private int totalAtRiskStudents;
    private int attendanceAlertsCount;
    private int subjectAlertsCount;
    private int unusualLeavePatternsCount;
    private double institutionalHealthScore; // e.g. 84.5%
    private List<AiInsightDto> insights;

    public AiInsightsSummaryDto() {}

    public AiInsightsSummaryDto(int totalAtRiskStudents, int attendanceAlertsCount, int subjectAlertsCount, int unusualLeavePatternsCount, double institutionalHealthScore, List<AiInsightDto> insights) {
        this.totalAtRiskStudents = totalAtRiskStudents;
        this.attendanceAlertsCount = attendanceAlertsCount;
        this.subjectAlertsCount = subjectAlertsCount;
        this.unusualLeavePatternsCount = unusualLeavePatternsCount;
        this.institutionalHealthScore = institutionalHealthScore;
        this.insights = insights;
    }

    public int getTotalAtRiskStudents() { return totalAtRiskStudents; }
    public void setTotalAtRiskStudents(int totalAtRiskStudents) { this.totalAtRiskStudents = totalAtRiskStudents; }

    public int getAttendanceAlertsCount() { return attendanceAlertsCount; }
    public void setAttendanceAlertsCount(int attendanceAlertsCount) { this.attendanceAlertsCount = attendanceAlertsCount; }

    public int getSubjectAlertsCount() { return subjectAlertsCount; }
    public void setSubjectAlertsCount(int subjectAlertsCount) { this.subjectAlertsCount = subjectAlertsCount; }

    public int getUnusualLeavePatternsCount() { return unusualLeavePatternsCount; }
    public void setUnusualLeavePatternsCount(int unusualLeavePatternsCount) { this.unusualLeavePatternsCount = unusualLeavePatternsCount; }

    public double getInstitutionalHealthScore() { return institutionalHealthScore; }
    public void setInstitutionalHealthScore(double institutionalHealthScore) { this.institutionalHealthScore = institutionalHealthScore; }

    public List<AiInsightDto> getInsights() { return insights; }
    public void setInsights(List<AiInsightDto> insights) { this.insights = insights; }
}
