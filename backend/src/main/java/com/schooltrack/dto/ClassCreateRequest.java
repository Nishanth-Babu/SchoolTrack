package com.schooltrack.dto;

import jakarta.validation.constraints.NotBlank;

public class ClassCreateRequest {

    @NotBlank(message = "Grade is required")
    private String grade;

    @NotBlank(message = "Section is required")
    private String section;

    private String name;

    private Long classTeacherId;

    private Long coordinatorId;

    private Long academicYearId;

    public ClassCreateRequest() {}

    public ClassCreateRequest(String grade, String section, String name, Long classTeacherId, Long coordinatorId, Long academicYearId) {
        this.grade = grade;
        this.section = section;
        this.name = name;
        this.classTeacherId = classTeacherId;
        this.coordinatorId = coordinatorId;
        this.academicYearId = academicYearId;
    }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Long getClassTeacherId() { return classTeacherId; }
    public void setClassTeacherId(Long classTeacherId) { this.classTeacherId = classTeacherId; }
    public Long getCoordinatorId() { return coordinatorId; }
    public void setCoordinatorId(Long coordinatorId) { this.coordinatorId = coordinatorId; }
    public Long getAcademicYearId() { return academicYearId; }
    public void setAcademicYearId(Long academicYearId) { this.academicYearId = academicYearId; }
}
