package com.schooltrack.dto;

import java.util.List;
import java.util.Map;

public class ReportCardDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String admissionNumber;
    private String className;
    private String academicYear;
    private Double overallPercentage;
    private Double totalMarksObtained;
    private Double totalMaxMarks;
    private String overallGrade;
    private Double gpa;
    private int rankInClass;
    private int totalStudentsInClass;
    private List<StudentMarkDto> marks;
    private Map<String, List<StudentMarkDto>> marksByExam;

    public ReportCardDto() {}

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
    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
    public Double getOverallPercentage() { return overallPercentage; }
    public void setOverallPercentage(Double overallPercentage) { this.overallPercentage = overallPercentage; }
    public Double getTotalMarksObtained() { return totalMarksObtained; }
    public void setTotalMarksObtained(Double totalMarksObtained) { this.totalMarksObtained = totalMarksObtained; }
    public Double getTotalMaxMarks() { return totalMaxMarks; }
    public void setTotalMaxMarks(Double totalMaxMarks) { this.totalMaxMarks = totalMaxMarks; }
    public String getOverallGrade() { return overallGrade; }
    public void setOverallGrade(String overallGrade) { this.overallGrade = overallGrade; }
    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }
    public int getRankInClass() { return rankInClass; }
    public void setRankInClass(int rankInClass) { this.rankInClass = rankInClass; }
    public int getTotalStudentsInClass() { return totalStudentsInClass; }
    public void setTotalStudentsInClass(int totalStudentsInClass) { this.totalStudentsInClass = totalStudentsInClass; }
    public List<StudentMarkDto> getMarks() { return marks; }
    public void setMarks(List<StudentMarkDto> marks) { this.marks = marks; }
    public Map<String, List<StudentMarkDto>> getMarksByExam() { return marksByExam; }
    public void setMarksByExam(Map<String, List<StudentMarkDto>> marksByExam) { this.marksByExam = marksByExam; }
}
