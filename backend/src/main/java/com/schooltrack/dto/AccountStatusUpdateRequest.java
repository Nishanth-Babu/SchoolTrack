package com.schooltrack.dto;

import jakarta.validation.constraints.NotNull;

public class AccountStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private String status; // ACTIVE, DISABLED, DEACTIVATED

    public AccountStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
