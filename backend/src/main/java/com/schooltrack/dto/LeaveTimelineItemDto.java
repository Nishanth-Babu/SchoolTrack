package com.schooltrack.dto;

import java.time.LocalDateTime;

public class LeaveTimelineItemDto {
    private String stage; // PARENT, CLASS_TEACHER, COORDINATOR
    private String actorName;
    private String action; // PENDING, APPROVE, REJECT
    private LocalDateTime timestamp;
    private String remarks;
    private String statusBadge;

    public LeaveTimelineItemDto() {}

    public LeaveTimelineItemDto(String stage, String actorName, String action, LocalDateTime timestamp, String remarks, String statusBadge) {
        this.stage = stage;
        this.actorName = actorName;
        this.action = action;
        this.timestamp = timestamp;
        this.remarks = remarks;
        this.statusBadge = statusBadge;
    }

    public String getStage() { return stage; }
    public void setStage(String stage) { this.stage = stage; }
    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public String getStatusBadge() { return statusBadge; }
    public void setStatusBadge(String statusBadge) { this.statusBadge = statusBadge; }
}
