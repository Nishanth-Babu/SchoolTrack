package com.schooltrack.dto;

public class TimetableSlotDto {
    private Long id;
    private String dayOfWeek;
    private Integer periodNumber;
    private String startTime;
    private String endTime;
    private Long classId;
    private String className;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private Long teacherId;
    private String teacherName;
    private String teacherEmployeeId;
    private String roomNumber;

    public TimetableSlotDto() {}

    public TimetableSlotDto(Long id, String dayOfWeek, Integer periodNumber, String startTime, String endTime,
                            Long classId, String className, Long subjectId, String subjectName, String subjectCode,
                            Long teacherId, String teacherName, String teacherEmployeeId, String roomNumber) {
        this.id = id;
        this.dayOfWeek = dayOfWeek;
        this.periodNumber = periodNumber;
        this.startTime = startTime;
        this.endTime = endTime;
        this.classId = classId;
        this.className = className;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.subjectCode = subjectCode;
        this.teacherId = teacherId;
        this.teacherName = teacherName;
        this.teacherEmployeeId = teacherEmployeeId;
        this.roomNumber = roomNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }

    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }

    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public String getTeacherEmployeeId() { return teacherEmployeeId; }
    public void setTeacherEmployeeId(String teacherEmployeeId) { this.teacherEmployeeId = teacherEmployeeId; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
}
