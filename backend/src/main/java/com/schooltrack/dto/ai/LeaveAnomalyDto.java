package com.schooltrack.dto.ai;

import java.time.LocalDate;
import java.util.List;

public class LeaveAnomalyDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String className;
    private String anomalyType; // FREQUENT_MONDAY_FRIDAY, CONSECUTIVE_EXTENDED, PRE_EXAM_PATTERN, REPEATED_UNEXCUSED
    private String severity; // HIGH, MEDIUM, LOW
    private int leaveCount;
    private double anomalyConfidence; // e.g. 88.5
    private String patternDescription;
    private List<LocalDate> flagDates;
    private String suggestedAction;

    public LeaveAnomalyDto() {}

    public LeaveAnomalyDto(Long studentId, String studentName, String rollNumber, String className, String anomalyType, String severity, int leaveCount, double anomalyConfidence, String patternDescription, List<LocalDate> flagDates, String suggestedAction) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.rollNumber = rollNumber;
        this.className = className;
        this.anomalyType = anomalyType;
        this.severity = severity;
        this.leaveCount = leaveCount;
        this.anomalyConfidence = anomalyConfidence;
        this.patternDescription = patternDescription;
        this.flagDates = flagDates;
        this.suggestedAction = suggestedAction;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getAnomalyType() { return anomalyType; }
    public void setAnomalyType(String anomalyType) { this.anomalyType = anomalyType; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public int getLeaveCount() { return leaveCount; }
    public void setLeaveCount(int leaveCount) { this.leaveCount = leaveCount; }

    public double getAnomalyConfidence() { return anomalyConfidence; }
    public void setAnomalyConfidence(double anomalyConfidence) { this.anomalyConfidence = anomalyConfidence; }

    public String getPatternDescription() { return patternDescription; }
    public void setPatternDescription(String patternDescription) { this.patternDescription = patternDescription; }

    public List<LocalDate> getFlagDates() { return flagDates; }
    public void setFlagDates(List<LocalDate> flagDates) { this.flagDates = flagDates; }

    public String getSuggestedAction() { return suggestedAction; }
    public void setSuggestedAction(String suggestedAction) { this.suggestedAction = suggestedAction; }
}
