package com.schooltrack.repository;

import com.schooltrack.entity.HomeworkCompletion;
import com.schooltrack.entity.HomeworkStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HomeworkCompletionRepository extends JpaRepository<HomeworkCompletion, Long> {
    Optional<HomeworkCompletion> findByHomeworkIdAndStudentId(Long homeworkId, Long studentId);
    List<HomeworkCompletion> findByStudentId(Long studentId);
    List<HomeworkCompletion> findByStudentIdAndStatus(Long studentId, HomeworkStatus status);
}
