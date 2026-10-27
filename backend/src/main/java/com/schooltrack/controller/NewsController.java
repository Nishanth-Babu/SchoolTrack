package com.schooltrack.controller;

import com.schooltrack.dto.NewsCreateRequest;
import com.schooltrack.dto.NewsResponseDto;
import com.schooltrack.entity.NewsCategory;
import com.schooltrack.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
@Tag(name = "School News & Announcements", description = "Endpoints for publishing and browsing school news, events, and circulars")
public class NewsController {

    private final NewsService newsService;

    public NewsController(NewsService newsService) {
        this.newsService = newsService;
    }

    @GetMapping
    @Operation(summary = "Get all school news items")
    public ResponseEntity<List<NewsResponseDto>> getAllNews(@RequestParam(required = false) NewsCategory category) {
        if (category != null) {
            return ResponseEntity.ok(newsService.getNewsByCategory(category));
        }
        return ResponseEntity.ok(newsService.getAllNews());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get news item by ID")
    public ResponseEntity<NewsResponseDto> getNewsById(@PathVariable Long id) {
        return ResponseEntity.ok(newsService.getNewsById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR', 'CLASS_TEACHER', 'SUBJECT_TEACHER')")
    @Operation(summary = "Post new school news (Principal, Coordinator, Teachers)")
    public ResponseEntity<NewsResponseDto> createNews(
            @Valid @RequestBody NewsCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(newsService.createNews(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR', 'CLASS_TEACHER', 'SUBJECT_TEACHER')")
    @Operation(summary = "Update news item")
    public ResponseEntity<NewsResponseDto> updateNews(
            @PathVariable Long id,
            @Valid @RequestBody NewsCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(newsService.updateNews(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR', 'CLASS_TEACHER', 'SUBJECT_TEACHER')")
    @Operation(summary = "Delete news item")
    public ResponseEntity<Void> deleteNews(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        newsService.deleteNews(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
