package com.schooltrack.repository;

import com.schooltrack.entity.SchoolClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolClassRepository extends JpaRepository<SchoolClass, Long> {
    List<SchoolClass> findByCoordinatorId(Long coordinatorId);
    Optional<SchoolClass> findByClassTeacherId(Long classTeacherId);
    Optional<SchoolClass> findByGradeAndSection(String grade, String section);
    boolean existsByGradeAndSection(String grade, String section);
    boolean existsByGradeAndSectionAndAcademicYearId(String grade, String section, Long academicYearId);
}
