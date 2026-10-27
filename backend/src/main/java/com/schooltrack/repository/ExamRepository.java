package com.schooltrack.repository;

import com.schooltrack.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByAcademicYearId(Long academicYearId);
    List<Exam> findByPublishedTrueOrderByStartDateDesc();
}
