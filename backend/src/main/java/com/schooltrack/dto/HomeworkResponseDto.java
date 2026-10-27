package com.schooltrack.dto;

import com.schooltrack.entity.HomeworkPriority;
import com.schooltrack.entity.HomeworkStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class HomeworkResponseDto {
    private Long id;
    private Long classId;
    private String className;
    private Long subjectId;
    private String subjectName;
    private String subjectCode;
    private Long teacherId;
    private String teacherName;
    private String title;
    private String description;
    private LocalDate assignedDate;
    private LocalDate dueDate;
    private HomeworkPriority priority;
    private String attachmentUrl;
    private HomeworkStatus completionStatus; // PENDING, COMPLETED
    private LocalDateTime completedAt;
    private String remarks;
    private boolean isOverdue;

    public HomeworkResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClassId() { return classId; }
    public void setClassId(Long classId) { this.classId = classId; }
    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }
    public Long getSubjectId() { return subjectId; }
    public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
    public String getSubjectName() { return subjectName; }
    public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
    public String getSubjectCode() { return subjectCode; }
    public void setSubjectCode(String subjectCode) { this.subjectCode = subjectCode; }
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }
    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getAssignedDate() { return assignedDate; }
    public void setAssignedDate(LocalDate assignedDate) { this.assignedDate = assignedDate; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public HomeworkPriority getPriority() { return priority; }
    public void setPriority(HomeworkPriority priority) { this.priority = priority; }
    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
    public HomeworkStatus getCompletionStatus() { return completionStatus; }
    public void setCompletionStatus(HomeworkStatus completionStatus) { this.completionStatus = completionStatus; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public boolean isOverdue() { return isOverdue; }
    public void setOverdue(boolean overdue) { isOverdue = overdue; }
}
