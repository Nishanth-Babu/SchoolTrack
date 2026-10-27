package com.schooltrack.dto;

import java.util.List;

public class ClassDetailDto {
    private Long id;
    private String grade;
    private String section;
    private String name;
    private Long classTeacherId;
    private String classTeacherName;
    private String classTeacherEmail;
    private Long coordinatorId;
    private String coordinatorName;
    private long studentCount;
    private List<SubjectDetailDto> subjects;

    public ClassDetailDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getClassTeacherId() { return classTeacherId; }
    public void setClassTeacherId(Long classTeacherId) { this.classTeacherId = classTeacherId; }
    public String getClassTeacherName() { return classTeacherName; }
    public void setClassTeacherName(String classTeacherName) { this.classTeacherName = classTeacherName; }
    public String getClassTeacherEmail() { return classTeacherEmail; }
    public void setClassTeacherEmail(String classTeacherEmail) { this.classTeacherEmail = classTeacherEmail; }
    public Long getCoordinatorId() { return coordinatorId; }
    public void setCoordinatorId(Long coordinatorId) { this.coordinatorId = coordinatorId; }
    public String getCoordinatorName() { return coordinatorName; }
    public void setCoordinatorName(String coordinatorName) { this.coordinatorName = coordinatorName; }
    public long getStudentCount() { return studentCount; }
    public void setStudentCount(long studentCount) { this.studentCount = studentCount; }
    public List<SubjectDetailDto> getSubjects() { return subjects; }
    public void setSubjects(List<SubjectDetailDto> subjects) { this.subjects = subjects; }
}
