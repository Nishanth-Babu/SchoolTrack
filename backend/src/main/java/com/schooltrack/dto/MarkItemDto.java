package com.schooltrack.dto;

import jakarta.validation.constraints.NotNull;

public class MarkItemDto {
    @NotNull(message = "Student ID is required")
    private Long studentId;
    private String studentName;
    private String rollNumber;

    @NotNull(message = "Marks obtained is required")
    private Double marksObtained;
    private Double maxMarks;
    private String remarks;

    public MarkItemDto() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }
    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
