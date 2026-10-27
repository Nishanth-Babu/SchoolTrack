package com.schooltrack.repository;

import com.schooltrack.entity.CoordinatorProfile;
import com.schooltrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CoordinatorProfileRepository extends JpaRepository<CoordinatorProfile, Long> {
    Optional<CoordinatorProfile> findByUser(User user);
    Optional<CoordinatorProfile> findByUserId(Long userId);
}
