package com.schooltrack.dto.ai;

public class AiChatRequest {
    private String message;
    private Long classId;
    private Long studentId;
    private String userRole;

    public AiChatRequest() {}

    public AiChatRequest(String message, Long classId, Long studentId, String userRole) {
        this.message = message;
        this.classId = classId;
        this.studentId = studentId;
        this.userRole = userRole;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }
}
