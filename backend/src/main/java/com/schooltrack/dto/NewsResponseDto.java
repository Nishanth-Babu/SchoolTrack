package com.schooltrack.dto;

import com.schooltrack.entity.NewsCategory;
import com.schooltrack.entity.NewsPriority;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class NewsResponseDto {
    private Long id;
    private String title;
    private String description;
    private NewsCategory category;
    private NewsPriority priority;
    private String imageUrl;
    private String attachmentUrl;
    private Long authorId;
    private String authorName;
    private String authorRole;
    private LocalDateTime publishedAt;
    private LocalDate expiryDate;
    private boolean isPinned;
    private LocalDateTime createdAt;

    public NewsResponseDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getAuthorRole() { return authorRole; }
    public void setAuthorRole(String authorRole) { this.authorRole = authorRole; }
    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }
    public LocalDate getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDate expiryDate) { this.expiryDate = expiryDate; }
    public boolean isPinned() { return isPinned; }
    public void setPinned(boolean pinned) { isPinned = pinned; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
