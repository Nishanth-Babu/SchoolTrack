package com.schooltrack.repository;

import com.schooltrack.entity.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {
    Optional<AcademicYear> findByCurrentTrue();
    default Optional<AcademicYear> findByActiveTrue() {
        return findByCurrentTrue();
    }
    Optional<AcademicYear> findByName(String name);
}
