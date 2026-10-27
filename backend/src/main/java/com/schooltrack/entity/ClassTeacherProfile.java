package com.schooltrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "class_teachers")
public class ClassTeacherProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "employee_id", unique = true, length = 30)
    private String employeeId;

    private String qualification;

    public ClassTeacherProfile() {}

    public ClassTeacherProfile(User user, String employeeId, String qualification) {
        this.user = user;
        this.employeeId = employeeId;
        this.qualification = qualification;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
}
