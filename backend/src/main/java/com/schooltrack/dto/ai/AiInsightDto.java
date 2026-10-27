package com.schooltrack.dto.ai;

public class AiInsightDto {
    private String id;
    private String category; // ACADEMIC, ATTENDANCE, LEAVE_ANOMALY, HOMEWORK
    private String severity; // CRITICAL, WARNING, INFO, POSITIVE
    private String title;
    private String description;
    private String metric;
    private String recommendation;
    private Long referenceId; // classId or studentId if applicable
    private String referenceType;

    public AiInsightDto() {}

    public AiInsightDto(String id, String category, String severity, String title, String description, String metric, String recommendation, Long referenceId, String referenceType) {
        this.id = id;
        this.category = category;
        this.severity = severity;
        this.title = title;
        this.description = description;
        this.metric = metric;
        this.recommendation = recommendation;
        this.referenceId = referenceId;
        this.referenceType = referenceType;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }

    public String getReferenceType() { return referenceType; }
    public void setReferenceType(String referenceType) { this.referenceType = referenceType; }
}
