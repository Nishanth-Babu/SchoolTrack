package com.schooltrack.repository;

import com.schooltrack.entity.ParentProfile;
import com.schooltrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ParentProfileRepository extends JpaRepository<ParentProfile, Long> {
    Optional<ParentProfile> findByUser(User user);
    Optional<ParentProfile> findByUserId(Long userId);
}
