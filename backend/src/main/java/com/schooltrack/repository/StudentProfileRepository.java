package com.schooltrack.repository;

import com.schooltrack.entity.SchoolClass;
import com.schooltrack.entity.StudentProfile;
import com.schooltrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
    List<StudentProfile> findByCurrentClass(SchoolClass schoolClass);
    List<StudentProfile> findByCurrentClassId(Long classId);
    List<StudentProfile> findByParentId(Long parentId);
    Optional<StudentProfile> findByAdmissionNumber(String admissionNumber);
}
