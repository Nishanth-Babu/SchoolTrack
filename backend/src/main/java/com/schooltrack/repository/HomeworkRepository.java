package com.schooltrack.repository;

import com.schooltrack.entity.Homework;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HomeworkRepository extends JpaRepository<Homework, Long> {
    List<Homework> findBySchoolClassIdOrderByDueDateDesc(Long classId);
    List<Homework> findByTeacherIdOrderByDueDateDesc(Long teacherId);
    
    @Query("SELECT h FROM Homework h WHERE h.schoolClass.id = :classId AND h.dueDate >= :today ORDER BY h.dueDate ASC")
    List<Homework> findUpcomingByClassId(@Param("classId") Long classId, @Param("today") LocalDate today);

    @Query("SELECT h FROM Homework h WHERE h.schoolClass.id = :classId AND h.dueDate < :today ORDER BY h.dueDate DESC")
    List<Homework> findOverdueByClassId(@Param("classId") Long classId, @Param("today") LocalDate today);
}
