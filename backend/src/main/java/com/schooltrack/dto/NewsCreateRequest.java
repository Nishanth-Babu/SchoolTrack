package com.schooltrack.dto;

import com.schooltrack.entity.NewsCategory;
import com.schooltrack.entity.NewsPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class NewsCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Category is required")
    private NewsCategory category;

    @NotNull(message = "Priority is required")
    private NewsPriority priority;

    private String imageUrl;
    private String attachmentUrl;
    private LocalDate expiryDate;
    private boolean pinned;

    public NewsCreateRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public NewsCategory getCategory() { return category; }
    public void setCategory(NewsCategory category) { this.category = category; }
    public NewsPriority getPriority() { return priority; }
    public void setPriority(NewsPriority priority) { this.priority = priority; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public boolean isPinned() { return pinned; }
    public void setPinned(boolean pinned) { this.pinned = pinned; }
}
