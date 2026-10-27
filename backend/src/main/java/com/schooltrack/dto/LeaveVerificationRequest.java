package com.schooltrack.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public class LeaveVerificationRequest {
    @NotBlank(message = "Action must be APPROVE or REJECT")
    @JsonAlias({"status", "decision"})
    private String action; // APPROVE, REJECT, APPROVED, REJECTED

    private String remarks;

    @JsonAlias("ivrConfirmed")
    private Boolean ivrConfirmed;

    public LeaveVerificationRequest() {}

    public LeaveVerificationRequest(String action, String remarks) {
        this.action = action;
        this.remarks = remarks;
    }

    public String getAction() {
        if (action == null) return null;
        String clean = action.trim().toUpperCase();
        if (clean.equals("APPROVED")) return "APPROVE";
        if (clean.equals("REJECTED")) return "REJECT";
        return clean;
    }

    public void setAction(String action) { this.action = action; }

    public void setStatus(String status) {
        if (this.action == null || this.action.isEmpty()) {
            this.action = status;
        }
    }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public Boolean getIvrConfirmed() { return ivrConfirmed; }
    public void setIvrConfirmed(Boolean ivrConfirmed) { this.ivrConfirmed = ivrConfirmed; }
}
