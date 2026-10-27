package com.schooltrack.repository;

import com.schooltrack.entity.News;
import com.schooltrack.entity.NewsCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {
    List<News> findByCategory(NewsCategory category);
    List<News> findByAuthorId(Long authorId);
    
    @Query("SELECT n FROM News n ORDER BY n.pinned DESC, n.publishedAt DESC")
    List<News> findAllOrderByPinnedAndPublishedAtDesc();
}
