package com.schooltrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "principals")
public class PrincipalProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "employee_id", unique = true, length = 30)
    private String employeeId;

    private String qualification;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    public PrincipalProfile() {}

    public PrincipalProfile(User user, String employeeId, String qualification, LocalDate joiningDate) {
        this.user = user;
        this.employeeId = employeeId;
        this.qualification = qualification;
        this.joiningDate = joiningDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public LocalDate getJoiningDate() { return joiningDate; }
    public void setJoiningDate(LocalDate joiningDate) { this.joiningDate = joiningDate; }
}
