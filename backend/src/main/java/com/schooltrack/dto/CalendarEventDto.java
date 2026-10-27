package com.schooltrack.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CalendarEventDto {
    private Long id;
    private String title;
    private String description;
    private String eventType; // EVENT, HOLIDAY, EXAM, PTM, FUNCTION, ACADEMIC
    private LocalDate startDate;
    private LocalDate endDate;
    private String targetAudience;
    private String location;
    private LocalDateTime createdAt;

    public CalendarEventDto() {}

    public CalendarEventDto(Long id, String title, String description, String eventType, LocalDate startDate,
                            LocalDate endDate, String targetAudience, String location, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.targetAudience = targetAudience;
        this.location = location;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
