package com.schooltrack.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.schooltrack.entity.LeaveStatus;
import com.schooltrack.entity.VerificationStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class LeaveResponseDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String admissionNumber;
    private String className;
    private Long leaveTypeId;
    private String leaveTypeName;
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalDays;
    private String reason;
    private String documentUrl;

    // Stage 1
    private VerificationStatus parentVerificationStatus;
    private LocalDateTime parentVerifiedAt;
    private String parentVerificationMethod;
    private String parentRemarks;

    // Stage 2
    private VerificationStatus classTeacherVerificationStatus;
    private String classTeacherName;
    private LocalDateTime classTeacherVerifiedAt;
    private String classTeacherRemarks;

    // Stage 3
    private VerificationStatus coordinatorVerificationStatus;
    private String coordinatorName;
    private LocalDateTime coordinatorVerifiedAt;
    private String coordinatorRemarks;

    private LeaveStatus finalStatus;
    private LocalDateTime createdAt;
    private List<LeaveTimelineItemDto> timeline;

    public LeaveResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Long getLeaveTypeId() { return leaveTypeId; }
    public void setLeaveTypeId(Long leaveTypeId) { this.leaveTypeId = leaveTypeId; }
    public String getLeaveTypeName() { return leaveTypeName; }
    public void setLeaveTypeName(String leaveTypeName) { this.leaveTypeName = leaveTypeName; }

    @JsonProperty("leaveType")
    public String getLeaveType() { return leaveTypeName != null ? leaveTypeName : "Medical Leave"; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public long getTotalDays() { return totalDays; }
    public void setTotalDays(long totalDays) { this.totalDays = totalDays; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getDocumentUrl() { return documentUrl; }
    public void setDocumentUrl(String documentUrl) { this.documentUrl = documentUrl; }

    public VerificationStatus getParentVerificationStatus() { return parentVerificationStatus; }
    public void setParentVerificationStatus(VerificationStatus parentVerificationStatus) { this.parentVerificationStatus = parentVerificationStatus; }
    public LocalDateTime getParentVerifiedAt() { return parentVerifiedAt; }
    public void setParentVerifiedAt(LocalDateTime parentVerifiedAt) { this.parentVerifiedAt = parentVerifiedAt; }
    public String getParentVerificationMethod() { return parentVerificationMethod; }
    public void setParentVerificationMethod(String parentVerificationMethod) { this.parentVerificationMethod = parentVerificationMethod; }
    public String getParentRemarks() { return parentRemarks; }
    public void setParentRemarks(String parentRemarks) { this.parentRemarks = parentRemarks; }

    @JsonProperty("ivrConfirmed")
    public boolean isIvrConfirmed() {
        return "IVR_MOCK_CALL".equalsIgnoreCase(parentVerificationMethod) || "IVR".equalsIgnoreCase(parentVerificationMethod);
    }

    public VerificationStatus getClassTeacherVerificationStatus() { return classTeacherVerificationStatus; }
    public void setClassTeacherVerificationStatus(VerificationStatus classTeacherVerificationStatus) { this.classTeacherVerificationStatus = classTeacherVerificationStatus; }

    @JsonProperty("teacherVerificationStatus")
    public VerificationStatus getTeacherVerificationStatus() { return classTeacherVerificationStatus; }

    public String getClassTeacherName() { return classTeacherName; }
    public void setClassTeacherName(String classTeacherName) { this.classTeacherName = classTeacherName; }
    public LocalDateTime getClassTeacherVerifiedAt() { return classTeacherVerifiedAt; }
    public void setClassTeacherVerifiedAt(LocalDateTime classTeacherVerifiedAt) { this.classTeacherVerifiedAt = classTeacherVerifiedAt; }

    @JsonProperty("teacherVerifiedAt")
    public LocalDateTime getTeacherVerifiedAt() { return classTeacherVerifiedAt; }

    public String getClassTeacherRemarks() { return classTeacherRemarks; }
    public void setClassTeacherRemarks(String classTeacherRemarks) { this.classTeacherRemarks = classTeacherRemarks; }

    @JsonProperty("teacherRemarks")
    public String getTeacherRemarks() { return classTeacherRemarks; }

    public VerificationStatus getCoordinatorVerificationStatus() { return coordinatorVerificationStatus; }
    public void setCoordinatorVerificationStatus(VerificationStatus coordinatorVerificationStatus) { this.coordinatorVerificationStatus = coordinatorVerificationStatus; }

    @JsonProperty("coordinatorApprovalStatus")
    public VerificationStatus getCoordinatorApprovalStatus() { return coordinatorVerificationStatus; }

    public String getCoordinatorName() { return coordinatorName; }
    public void setCoordinatorName(String coordinatorName) { this.coordinatorName = coordinatorName; }
    public LocalDateTime getCoordinatorVerifiedAt() { return coordinatorVerifiedAt; }
    public void setCoordinatorVerifiedAt(LocalDateTime coordinatorVerifiedAt) { this.coordinatorVerifiedAt = coordinatorVerifiedAt; }

    @JsonProperty("coordinatorApprovedAt")
    public LocalDateTime getCoordinatorApprovedAt() { return coordinatorVerifiedAt; }

    public String getCoordinatorRemarks() { return coordinatorRemarks; }
    public void setCoordinatorRemarks(String coordinatorRemarks) { this.coordinatorRemarks = coordinatorRemarks; }

    public LeaveStatus getFinalStatus() { return finalStatus; }
    public void setFinalStatus(LeaveStatus finalStatus) { this.finalStatus = finalStatus; }

    @JsonProperty("status")
    public String getStatus() { return finalStatus != null ? finalStatus.name() : "PENDING"; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<LeaveTimelineItemDto> getTimeline() { return timeline; }
    public void setTimeline(List<LeaveTimelineItemDto> timeline) { this.timeline = timeline; }
}
