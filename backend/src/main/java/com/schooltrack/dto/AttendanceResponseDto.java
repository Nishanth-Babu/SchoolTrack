package com.schooltrack.dto;

import com.schooltrack.entity.AttendanceStatus;
import java.time.LocalDate;

public class AttendanceResponseDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String admissionNumber;
    private String rollNumber;
    private Long classId;
    private String className;
    private Long subjectId;
    private String subjectName;
    private LocalDate date;
    private Integer period;
    private AttendanceStatus status;
    private String remarks;
    private String priorLeaveInfo; // E.g. "Approved Medical Leave" or "No Prior Leave"

    public AttendanceResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    public String getAdmissionNumber() { return admissionNumber; }
    public void setAdmissionNumber(String admissionNumber) { this.admissionNumber = admissionNumber; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Integer getPeriod() { return period; }
    public void setPeriod(Integer period) { this.period = period; }
    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getPriorLeaveInfo() { return priorLeaveInfo; }
    public void setPriorLeaveInfo(String priorLeaveInfo) { this.priorLeaveInfo = priorLeaveInfo; }
}
