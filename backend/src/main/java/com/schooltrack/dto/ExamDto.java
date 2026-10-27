package com.schooltrack.dto;

import java.time.LocalDate;

public class ExamDto {
    private Long id;
    private String name;
    private String term;
    private Long academicYearId;
    private String academicYearName;
    private Double maxMarks;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean published;

    public ExamDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }
    public Long getAcademicYearId() { return academicYearId; }
    public void setAcademicYearId(Long academicYearId) { this.academicYearId = academicYearId; }
    public String getAcademicYearName() { return academicYearName; }
    public void setAcademicYearName(String academicYearName) { this.academicYearName = academicYearName; }
    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
}
