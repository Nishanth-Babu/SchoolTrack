package com.schooltrack.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class BulkAttendanceRequest {
    @NotNull
    private Long classId;

    @NotNull
    private Long subjectId;

    @NotNull
    private LocalDate date;

    @NotNull
    private Integer period;

    @NotEmpty
    private List<AttendanceMarkItemDto> records;

    public BulkAttendanceRequest() {}

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public Integer getPeriod() { return period; }
    public void setPeriod(Integer period) { this.period = period; }
    public List<AttendanceMarkItemDto> getRecords() { return records; }
    public void setRecords(List<AttendanceMarkItemDto> records) { this.records = records; }
}
