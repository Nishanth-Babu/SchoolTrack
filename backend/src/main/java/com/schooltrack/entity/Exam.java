package com.schooltrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "exams", indexes = {
    @Index(name = "idx_exam_term", columnList = "term"),
    @Index(name = "idx_exam_academic_year", columnList = "academic_year_id")
})
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name; // e.g. "Unit Test 1", "Mid-Term Examination 2025", "Annual Final Exam"

    @Column(nullable = false, length = 50)
    private String term; // e.g. "Term 1", "Term 2", "Term 3", "Final"

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "academic_year_id", nullable = false)
    private AcademicYear academicYear;

    @Column(name = "max_marks", nullable = false)
    private Double maxMarks = 100.0;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_published", nullable = false)
    private boolean published = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Exam() {}

    public Exam(String name, String term, AcademicYear academicYear, Double maxMarks, LocalDate startDate, LocalDate endDate) {
        this.name = name;
        this.term = term;
        this.academicYear = academicYear;
        this.maxMarks = maxMarks != null ? maxMarks : 100.0;
        this.startDate = startDate;
        this.endDate = endDate;
        this.published = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTerm() { return term; }
    public void setTerm(String term) { this.term = term; }
    public AcademicYear getAcademicYear() { return academicYear; }
    public void setAcademicYear(AcademicYear academicYear) { this.academicYear = academicYear; }
    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) { this.maxMarks = maxMarks; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
