package com.schooltrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "subject_teachers")
public class SubjectTeacherProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "employee_id", unique = true, length = 30)
    private String employeeId;

    private String specialization;

    public SubjectTeacherProfile() {}

    public SubjectTeacherProfile(User user, String employeeId, String specialization) {
        this.user = user;
        this.employeeId = employeeId;
        this.specialization = specialization;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
}
