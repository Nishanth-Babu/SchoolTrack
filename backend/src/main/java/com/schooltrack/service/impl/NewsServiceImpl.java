package com.schooltrack.service.impl;

import com.schooltrack.dto.NewsCreateRequest;
import com.schooltrack.dto.NewsResponseDto;
import com.schooltrack.entity.News;
import com.schooltrack.entity.NewsCategory;
import com.schooltrack.entity.RoleName;
import com.schooltrack.entity.User;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.exception.UnauthorizedActionException;
import com.schooltrack.repository.NewsRepository;
import com.schooltrack.repository.UserRepository;
import com.schooltrack.service.AuditLogService;
import com.schooltrack.service.NewsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsServiceImpl implements NewsService {

    private final NewsRepository newsRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    public NewsServiceImpl(NewsRepository newsRepository, UserRepository userRepository, AuditLogService auditLogService) {
        this.newsRepository = newsRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsResponseDto> getAllNews() {
        return newsRepository.findAllOrderByPinnedAndPublishedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<NewsResponseDto> getNewsByCategory(NewsCategory category) {
        return newsRepository.findByCategory(category).stream()
                .sorted((a, b) -> b.getPublishedAt().compareTo(a.getPublishedAt()))
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NewsResponseDto getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News item not found: " + id));
        return mapToDto(news);
    }

    @Override
    @Transactional
    public NewsResponseDto createNews(NewsCreateRequest request, String authorUsername) {
        User author = userRepository.findByUsername(authorUsername)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authorUsername));

        News news = new News();
        news.setTitle(request.getTitle());
        news.setDescription(request.getDescription());
        news.setCategory(request.getCategory());
        news.setPriority(request.getPriority());
        news.setImageUrl(request.getImageUrl());
        news.setAttachmentUrl(request.getAttachmentUrl());
        news.setExpiryDate(request.getExpiryDate());
        news.setPinned(request.isPinned());
        news.setAuthor(author);

        news = newsRepository.save(news);
        auditLogService.log(author, "CREATE_NEWS", "NEWS", news.getId(), "Published news: " + news.getTitle(), null);

        return mapToDto(news);
    }

    @Override
    @Transactional
    public NewsResponseDto updateNews(Long id, NewsCreateRequest request, String username) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News item not found: " + id));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        boolean isPrincipal = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (!isPrincipal && !news.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can only edit your own news items");
        }

        news.setTitle(request.getTitle());
        news.setDescription(request.getDescription());
        news.setCategory(request.getCategory());
        news.setPriority(request.getPriority());
        news.setImageUrl(request.getImageUrl());
        news.setAttachmentUrl(request.getAttachmentUrl());
        news.setExpiryDate(request.getExpiryDate());
        news.setPinned(request.isPinned());

        news = newsRepository.save(news);
        auditLogService.log(user, "UPDATE_NEWS", "NEWS", news.getId(), "Updated news: " + news.getTitle(), null);

        return mapToDto(news);
    }

    @Override
    @Transactional
    public void deleteNews(Long id, String username) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News item not found: " + id));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        boolean isPrincipal = user.getRoles().stream().anyMatch(r -> r.getName() == RoleName.ROLE_PRINCIPAL);
        if (!isPrincipal && !news.getAuthor().getId().equals(user.getId())) {
            throw new UnauthorizedActionException("You can only delete your own news items");
        }

        newsRepository.delete(news);
        auditLogService.log(user, "DELETE_NEWS", "NEWS", id, "Deleted news: " + news.getTitle(), null);
    }

    private NewsResponseDto mapToDto(News n) {
        NewsResponseDto dto = new NewsResponseDto();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setDescription(n.getDescription());
        dto.setCategory(n.getCategory());
        dto.setPriority(n.getPriority());
        dto.setImageUrl(n.getImageUrl());
        dto.setAttachmentUrl(n.getAttachmentUrl());
        dto.setAuthorId(n.getAuthor().getId());
        dto.setAuthorName(n.getAuthor().getFullName());
        dto.setAuthorRole(n.getAuthor().getRoles().stream().findFirst().map(r -> r.getName().name().replace("ROLE_", "")).orElse("STAFF"));
        dto.setPublishedAt(n.getPublishedAt());
        dto.setExpiryDate(n.getExpiryDate());
        dto.setPinned(n.isPinned());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
