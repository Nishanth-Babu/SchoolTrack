package com.schooltrack.dto;

import com.schooltrack.entity.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

public class AttendanceMarkItemDto {
    @NotNull
    private Long studentId;

    @NotNull
    private AttendanceStatus status; // PRESENT, ABSENT, ON_DUTY

    private String remarks;

    public AttendanceMarkItemDto() {}

    public AttendanceMarkItemDto(Long studentId, AttendanceStatus status, String remarks) {
        this.studentId = studentId;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
