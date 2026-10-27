package com.schooltrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_marks", uniqueConstraints = {
    @UniqueConstraint(name = "uk_student_subject_exam", columnNames = {"student_id", "subject_id", "exam_id"})
}, indexes = {
    @Index(name = "idx_mark_student", columnList = "student_id"),
    @Index(name = "idx_mark_subject", columnList = "subject_id"),
    @Index(name = "idx_mark_exam", columnList = "exam_id")
})
public class StudentMark {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Column(name = "marks_obtained", nullable = false)
    private Double marksObtained;

    @Column(name = "max_marks", nullable = false)
    private Double maxMarks = 100.0;

    @Column(name = "percentage", nullable = false)
    private Double percentage;

    @Column(name = "grade", length = 10)
    private String grade; // A+, A, B+, B, C, D, F

    @Column(length = 255)
    private String remarks;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public StudentMark() {}

    public StudentMark(StudentProfile student, Subject subject, Exam exam, User teacher, Double marksObtained, Double maxMarks, String remarks) {
        this.student = student;
        this.subject = subject;
        this.exam = exam;
        this.teacher = teacher;
        this.marksObtained = marksObtained;
        this.maxMarks = (maxMarks != null && maxMarks > 0) ? maxMarks : (exam != null ? exam.getMaxMarks() : 100.0);
        this.remarks = remarks;
        calculateGradeAndPercentage();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        calculateGradeAndPercentage();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculateGradeAndPercentage();
    }

    public void calculateGradeAndPercentage() {
        if (this.maxMarks == null || this.maxMarks <= 0) {
            this.maxMarks = 100.0;
        }
        if (this.marksObtained != null) {
            this.percentage = Math.round((this.marksObtained / this.maxMarks) * 10000.0) / 100.0;
            if (this.percentage >= 90.0) {
                this.grade = "A+";
            } else if (this.percentage >= 80.0) {
                this.grade = "A";
            } else if (this.percentage >= 70.0) {
                this.grade = "B+";
            } else if (this.percentage >= 60.0) {
                this.grade = "B";
            } else if (this.percentage >= 50.0) {
                this.grade = "C";
            } else if (this.percentage >= 35.0) {
                this.grade = "D";
            } else {
                this.grade = "F";
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }
    public User getTeacher() { return teacher; }
    public void setTeacher(User teacher) { this.teacher = teacher; }
    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
        calculateGradeAndPercentage();
    }
    public Double getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Double maxMarks) {
        this.maxMarks = maxMarks;
        calculateGradeAndPercentage();
    }
    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
