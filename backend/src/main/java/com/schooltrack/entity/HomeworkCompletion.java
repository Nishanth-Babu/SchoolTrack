package com.schooltrack.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "homework_completion", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"homework_id", "student_id"})
})
public class HomeworkCompletion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "homework_id", nullable = false)
    private Homework homework;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private HomeworkStatus status = HomeworkStatus.PENDING;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    public HomeworkCompletion() {}

    public HomeworkCompletion(Homework homework, StudentProfile student, HomeworkStatus status) {
        this.homework = homework;
        this.student = student;
        this.status = status;
        if (status == HomeworkStatus.COMPLETED) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Homework getHomework() { return homework; }
    public void setHomework(Homework homework) { this.homework = homework; }
    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }
    public HomeworkStatus getStatus() { return status; }
    public void setStatus(HomeworkStatus status) { 
        this.status = status;
        if (status == HomeworkStatus.COMPLETED) {
            this.completedAt = LocalDateTime.now();
        } else {
            this.completedAt = null;
        }
    }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
