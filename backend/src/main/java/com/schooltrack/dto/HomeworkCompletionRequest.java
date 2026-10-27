package com.schooltrack.dto;

public class HomeworkCompletionRequest {
    private boolean completed;
    private String remarks;

    public HomeworkCompletionRequest() {}

    public HomeworkCompletionRequest(boolean completed, String remarks) {
        this.completed = completed;
        this.remarks = remarks;
    }

    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}