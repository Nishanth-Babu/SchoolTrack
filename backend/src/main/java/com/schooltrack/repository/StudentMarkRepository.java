package com.schooltrack.repository;

import com.schooltrack.entity.StudentMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentMarkRepository extends JpaRepository<StudentMark, Long> {
    List<StudentMark> findByStudentId(Long studentId);
    List<StudentMark> findByStudentIdAndExamId(Long studentId, Long examId);
    Optional<StudentMark> findByStudentIdAndSubjectIdAndExamId(Long studentId, Long subjectId, Long examId);

    @Query("SELECT m FROM StudentMark m WHERE m.student.currentClass.id = :classId AND m.subject.id = :subjectId AND m.exam.id = :examId")
    List<StudentMark> findByClassAndSubjectAndExam(@Param("classId") Long classId, @Param("subjectId") Long subjectId, @Param("examId") Long examId);

    @Query("SELECT m FROM StudentMark m WHERE m.student.currentClass.id = :classId AND m.exam.id = :examId")
    List<StudentMark> findByClassAndExam(@Param("classId") Long classId, @Param("examId") Long examId);
}
