package com.schooltrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "coordinators")
public class CoordinatorProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "employee_id", unique = true, length = 30)
    private String employeeId;

    private String department;

    @Column(name = "assigned_wing")
    private String assignedWing; // e.g., Senior Secondary, High School, Middle School

    public CoordinatorProfile() {}

    public CoordinatorProfile(User user, String employeeId, String department, String assignedWing) {
        this.user = user;
        this.employeeId = employeeId;
        this.department = department;
        this.assignedWing = assignedWing;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getAssignedWing() { return assignedWing; }
    public void setAssignedWing(String assignedWing) { this.assignedWing = assignedWing; }
}
