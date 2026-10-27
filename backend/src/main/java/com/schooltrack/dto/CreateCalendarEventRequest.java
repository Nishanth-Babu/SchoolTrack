package com.schooltrack.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateCalendarEventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Event type is required (EVENT, HOLIDAY, EXAM, PTM, FUNCTION)")
    private String eventType;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    private LocalDate endDate;

    private String targetAudience;
    private String location;

    public CreateCalendarEventRequest() {}

    public CreateCalendarEventRequest(String title, String description, String eventType,
                                      LocalDate startDate, LocalDate endDate, String targetAudience, String location) {
        this.title = title;
        this.description = description;
        this.eventType = eventType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.targetAudience = targetAudience;
        this.location = location;
    }

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
}
