package com.schooltrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leave_verification_logs")
public class LeaveVerificationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leave_request_id", nullable = false)
    private LeaveRequest leaveRequest;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "action_by_user_id")
    private User actionBy;

    @Column(name = "actor_role", length = 30)
    private String actorRole; // PARENT, CLASS_TEACHER, COORDINATOR

    @Column(nullable = false, length = 20)
    private String action; // APPROVE, REJECT

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 35)
    private LeaveStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", length = 35)
    private LeaveStatus newStatus;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    public LeaveVerificationLog() {}

    public LeaveVerificationLog(LeaveRequest leaveRequest, User actionBy, String actorRole, String action, LeaveStatus previousStatus, LeaveStatus newStatus, String remarks) {
        this.leaveRequest = leaveRequest;
        this.actionBy = actionBy;
        this.actorRole = actorRole;
        this.action = action;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.remarks = remarks;
        this.timestamp = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LeaveRequest getLeaveRequest() { return leaveRequest; }
    public void setLeaveRequest(LeaveRequest leaveRequest) { this.leaveRequest = leaveRequest; }
    public User getActionBy() { return actionBy; }
    public void setActionBy(User actionBy) { this.actionBy = actionBy; }
    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public LeaveStatus getPreviousStatus() { return previousStatus; }
    public void setPreviousStatus(LeaveStatus previousStatus) { this.previousStatus = previousStatus; }
    public LeaveStatus getNewStatus() { return newStatus; }
    public void setNewStatus(LeaveStatus newStatus) { this.newStatus = newStatus; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
