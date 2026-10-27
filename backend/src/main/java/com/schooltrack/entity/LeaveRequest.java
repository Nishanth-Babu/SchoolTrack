package com.schooltrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_requests", indexes = {
    @Index(name = "idx_leave_student", columnList = "student_id"),
    @Index(name = "idx_leave_dates", columnList = "start_date, end_date"),
    @Index(name = "idx_leave_final_status", columnList = "final_status")
})
public class LeaveRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "document_url")
    private String documentUrl;

    // Stage 1: Parent Verification
    @Enumerated(EnumType.STRING)
    @Column(name = "parent_verification_status", nullable = false, length = 20)
    private VerificationStatus parentVerificationStatus = VerificationStatus.PENDING;

    @Column(name = "parent_verified_at")
    private LocalDateTime parentVerifiedAt;

    @Column(name = "parent_verification_method", length = 30)
    private String parentVerificationMethod; // IVR_MOCK, PORTAL

    @Column(name = "parent_remarks")
    private String parentRemarks;

    // Stage 2: Class Teacher Verification
    @Enumerated(EnumType.STRING)
    @Column(name = "class_teacher_verification_status", nullable = false, length = 20)
    private VerificationStatus classTeacherVerificationStatus = VerificationStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_teacher_verified_by")
    private User classTeacherVerifiedBy;

    @Column(name = "class_teacher_verified_at")
    private LocalDateTime classTeacherVerifiedAt;

    @Column(name = "class_teacher_remarks")
    private String classTeacherRemarks;

    // Stage 3: Coordinator Verification
    @Enumerated(EnumType.STRING)
    @Column(name = "coordinator_verification_status", nullable = false, length = 20)
    private VerificationStatus coordinatorVerificationStatus = VerificationStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordinator_verified_by")
    private User coordinatorVerifiedBy;

    @Column(name = "coordinator_verified_at")
    private LocalDateTime coordinatorVerifiedAt;

    @Column(name = "coordinator_remarks")
    private String coordinatorRemarks;

    // Final consolidated status
    @Enumerated(EnumType.STRING)
    @Column(name = "final_status", nullable = false, length = 35)
    private LeaveStatus finalStatus = LeaveStatus.PENDING_PARENT_VERIFICATION;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public LeaveRequest() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }
    public LeaveType getLeaveType() { return leaveType; }
    public void setLeaveType(LeaveType leaveType) { this.leaveType = leaveType; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
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
    public VerificationStatus getClassTeacherVerificationStatus() { return classTeacherVerificationStatus; }
    public void setClassTeacherVerificationStatus(VerificationStatus classTeacherVerificationStatus) { this.classTeacherVerificationStatus = classTeacherVerificationStatus; }
    public User getClassTeacherVerifiedBy() { return classTeacherVerifiedBy; }
    public void setClassTeacherVerifiedBy(User classTeacherVerifiedBy) { this.classTeacherVerifiedBy = classTeacherVerifiedBy; }
    public LocalDateTime getClassTeacherVerifiedAt() { return classTeacherVerifiedAt; }
    public void setClassTeacherVerifiedAt(LocalDateTime classTeacherVerifiedAt) { this.classTeacherVerifiedAt = classTeacherVerifiedAt; }
    public String getClassTeacherRemarks() { return classTeacherRemarks; }
    public void setClassTeacherRemarks(String classTeacherRemarks) { this.classTeacherRemarks = classTeacherRemarks; }
    public VerificationStatus getCoordinatorVerificationStatus() { return coordinatorVerificationStatus; }
    public void setCoordinatorVerificationStatus(VerificationStatus coordinatorVerificationStatus) { this.coordinatorVerificationStatus = coordinatorVerificationStatus; }
    public User getCoordinatorVerifiedBy() { return coordinatorVerifiedBy; }
    public void setCoordinatorVerifiedBy(User coordinatorVerifiedBy) { this.coordinatorVerifiedBy = coordinatorVerifiedBy; }
    public LocalDateTime getCoordinatorVerifiedAt() { return coordinatorVerifiedAt; }
    public void setCoordinatorVerifiedAt(LocalDateTime coordinatorVerifiedAt) { this.coordinatorVerifiedAt = coordinatorVerifiedAt; }
    public String getCoordinatorRemarks() { return coordinatorRemarks; }
    public void setCoordinatorRemarks(String coordinatorRemarks) { this.coordinatorRemarks = coordinatorRemarks; }
    public LeaveStatus getFinalStatus() { return finalStatus; }
    public void setFinalStatus(LeaveStatus finalStatus) { this.finalStatus = finalStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
