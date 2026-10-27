package com.schooltrack.repository;

import com.schooltrack.entity.ClassTeacherProfile;
import com.schooltrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClassTeacherProfileRepository extends JpaRepository<ClassTeacherProfile, Long> {
    Optional<ClassTeacherProfile> findByUser(User user);
    Optional<ClassTeacherProfile> findByUserId(Long userId);
}
