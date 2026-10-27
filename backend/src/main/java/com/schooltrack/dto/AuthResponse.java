package com.schooltrack.dto;

import java.util.List;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String username;
    private String email;
    private String teacherId;
    private String rollNumber;
    private String fullName;
    private List<String> roles;
    private String primaryRole;
    private Long profileId;
    private Long classId;
    private String className;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String username, String email, String teacherId, String rollNumber, String fullName, List<String> roles, String primaryRole, Long profileId, Long classId, String className) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.teacherId = teacherId;
        this.rollNumber = rollNumber;
        this.fullName = fullName;
        this.roles = roles;
        this.primaryRole = primaryRole;
        this.profileId = profileId;
        this.classId = classId;
        this.className = className;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public List<String> getRoles() { return roles; }
    public void setRoles(List<String> roles) { this.roles = roles; }
    public String getPrimaryRole() { return primaryRole; }
    public void setPrimaryRole(String primaryRole) { this.primaryRole = primaryRole; }
    public Long getProfileId() { return profileId; }
    public void setProfileId(Long profileId) { this.profileId = profileId; }
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
}
