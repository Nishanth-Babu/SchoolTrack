package com.schooltrack.repository;

import com.schooltrack.entity.SubjectTeacherProfile;
import com.schooltrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SubjectTeacherProfileRepository extends JpaRepository<SubjectTeacherProfile, Long> {
    Optional<SubjectTeacherProfile> findByUser(User user);
    Optional<SubjectTeacherProfile> findByUserId(Long userId);
}
