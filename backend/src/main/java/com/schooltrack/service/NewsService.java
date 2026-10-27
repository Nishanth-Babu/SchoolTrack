package com.schooltrack.service;

import com.schooltrack.dto.NewsCreateRequest;
import com.schooltrack.dto.NewsResponseDto;
import com.schooltrack.entity.NewsCategory;
import java.util.List;

public interface NewsService {
    List<NewsResponseDto> getAllNews();
    List<NewsResponseDto> getNewsByCategory(NewsCategory category);
    NewsResponseDto getNewsById(Long id);
    NewsResponseDto createNews(NewsCreateRequest request, String authorUsername);
    NewsResponseDto updateNews(Long id, NewsCreateRequest request, String username);
    void deleteNews(Long id, String username);
}
