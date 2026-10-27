package com.schooltrack.dto.ai;

import java.util.List;

public class AiStudentReportDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String admissionNumber;
    private String className;
    private String overallStatus; // ON_TRACK, NEEDS_ATTENTION, AT_RISK, EXCELLING
    private Double attendancePercentage;
    private Double averageMarks;
    private Double homeworkCompletionRate;
    private Long totalLeavesTaken;
    private String executiveSummary;
    private List<String> diagnosticInsights;
    private List<String> academicStrengths;
    private List<String> areasOfConcern;
    private List<String> recommendedActionPlan;
    private String generatedAt;

    public AiStudentReportDto() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getAdmissionNumber() { return admissionNumber; }
    public void setAdmissionNumber(String admissionNumber) { this.admissionNumber = admissionNumber; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }

    public Double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(Double attendancePercentage) { this.attendancePercentage = attendancePercentage; }

    public Double getAverageMarks() { return averageMarks; }
    public void setAverageMarks(Double averageMarks) { this.averageMarks = averageMarks; }

    public Double getHomeworkCompletionRate() { return homeworkCompletionRate; }
    public void setHomeworkCompletionRate(Double homeworkCompletionRate) { this.homeworkCompletionRate = homeworkCompletionRate; }

    public Long getTotalLeavesTaken() { return totalLeavesTaken; }
    public void setTotalLeavesTaken(Long totalLeavesTaken) { this.totalLeavesTaken = totalLeavesTaken; }

    public String getExecutiveSummary() { return executiveSummary; }
    public void setExecutiveSummary(String executiveSummary) { this.executiveSummary = executiveSummary; }

    public List<String> getDiagnosticInsights() { return diagnosticInsights; }
    public void setDiagnosticInsights(List<String> diagnosticInsights) { this.diagnosticInsights = diagnosticInsights; }

    public List<String> getAcademicStrengths() { return academicStrengths; }
    public void setAcademicStrengths(List<String> academicStrengths) { this.academicStrengths = academicStrengths; }

    public List<String> getAreasOfConcern() { return areasOfConcern; }
    public void setAreasOfConcern(List<String> areasOfConcern) { this.areasOfConcern = areasOfConcern; }

    public List<String> getRecommendedActionPlan() { return recommendedActionPlan; }
    public void setRecommendedActionPlan(List<String> recommendedActionPlan) { this.recommendedActionPlan = recommendedActionPlan; }

    public String getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(String generatedAt) { this.generatedAt = generatedAt; }
}
