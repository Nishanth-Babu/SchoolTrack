package com.schooltrack.dto;

import jakarta.validation.constraints.NotNull;

public class CreateTimetableSlotRequest {
    @NotNull(message = "Day of week is required")
    private String dayOfWeek;

    @NotNull(message = "Period number is required")
    private Integer periodNumber;

    @NotNull(message = "Start time is required")
    private String startTime;

    @NotNull(message = "End time is required")
    private String endTime;

    @NotNull(message = "Class ID is required")
    private Long classId;

    @NotNull(message = "Subject ID is required")
    private Long subjectId;

    private Long teacherId;
    private String roomNumber;

    public CreateTimetableSlotRequest() {}

    public CreateTimetableSlotRequest(String dayOfWeek, Integer periodNumber, String startTime, String endTime,
                                      Long classId, Long subjectId, Long teacherId, String roomNumber) {
        this.dayOfWeek = dayOfWeek;
        this.periodNumber = periodNumber;
        this.startTime = startTime;
        this.endTime = endTime;
        this.classId = classId;
        this.subjectId = subjectId;
        this.teacherId = teacherId;
        this.roomNumber = roomNumber;
    }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public Integer getPeriodNumber() { return periodNumber; }
    public void setPeriodNumber(Integer periodNumber) { this.periodNumber = periodNumber; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
}
