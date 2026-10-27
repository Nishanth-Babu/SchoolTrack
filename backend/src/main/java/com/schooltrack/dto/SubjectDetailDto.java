package com.schooltrack.dto;

public class SubjectDetailDto {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Long assignedTeacherId;
    private String assignedTeacherName;

    public SubjectDetailDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getAssignedTeacherId() { return assignedTeacherId; }
    public void setAssignedTeacherId(Long assignedTeacherId) { this.assignedTeacherId = assignedTeacherId; }
    public String getAssignedTeacherName() { return assignedTeacherName; }
    public void setAssignedTeacherName(String assignedTeacherName) { this.assignedTeacherName = assignedTeacherName; }
}
