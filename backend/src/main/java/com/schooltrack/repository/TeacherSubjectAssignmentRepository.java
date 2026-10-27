package com.schooltrack.repository;

import com.schooltrack.entity.TeacherSubjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherSubjectAssignmentRepository extends JpaRepository<TeacherSubjectAssignment, Long> {
    List<TeacherSubjectAssignment> findByTeacherId(Long teacherId);
    List<TeacherSubjectAssignment> findBySchoolClassId(Long classId);
    Optional<TeacherSubjectAssignment> findByTeacherIdAndSchoolClassIdAndSubjectId(Long teacherId, Long classId, Long subjectId);
    boolean existsByTeacherIdAndSchoolClassIdAndSubjectId(Long teacherId, Long classId, Long subjectId);
}
