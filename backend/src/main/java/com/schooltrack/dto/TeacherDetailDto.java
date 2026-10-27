package com.schooltrack.dto;

import java.util.List;

public class TeacherDetailDto {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String employeeId;
    private String role; // COORDINATOR, CLASS_TEACHER, SUBJECT_TEACHER
    private String qualification;
    private String specialization;
    private String department;
    private String assignedClass;
    private List<String> assignedSubjects;

    public TeacherDetailDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getAssignedClass() { return assignedClass; }
    public void setAssignedClass(String assignedClass) { this.assignedClass = assignedClass; }
    public List<String> getAssignedSubjects() { return assignedSubjects; }
    public void setAssignedSubjects(List<String> assignedSubjects) { this.assignedSubjects = assignedSubjects; }
}
