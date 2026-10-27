package com.schooltrack.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_admission", columnList = "admission_number"),
    @Index(name = "idx_student_class", columnList = "class_id")
})
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "admission_number", unique = true, nullable = false, length = 30)
    private String admissionNumber;

    @Column(name = "roll_number", length = 20)
    private String rollNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "class_id")
    private SchoolClass currentClass;

    private LocalDate dob;

    @Column(length = 20)
    private String gender;

    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    @Column(columnDefinition = "TEXT")
    private String address;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parent_id")
    private ParentProfile parent;

    public StudentProfile() {}

    public StudentProfile(User user, String admissionNumber, String rollNumber, SchoolClass currentClass, LocalDate dob, String gender, String bloodGroup, String address, ParentProfile parent) {
        this.user = user;
        this.admissionNumber = admissionNumber;
        this.rollNumber = rollNumber;
        this.currentClass = currentClass;
        this.dob = dob;
        this.gender = gender;
        this.bloodGroup = bloodGroup;
        this.address = address;
        this.parent = parent;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getAdmissionNumber() { return admissionNumber; }
    public void setAdmissionNumber(String admissionNumber) { this.admissionNumber = admissionNumber; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public SchoolClass getCurrentClass() { return currentClass; }
    public void setCurrentClass(SchoolClass currentClass) { this.currentClass = currentClass; }
    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getBloodGroup() { return bloodGroup; }
    public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public ParentProfile getParent() { return parent; }
    public void setParent(ParentProfile parent) { this.parent = parent; }
}
