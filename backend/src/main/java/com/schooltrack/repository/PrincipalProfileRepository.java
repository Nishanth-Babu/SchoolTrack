package com.schooltrack.repository;

import com.schooltrack.entity.PrincipalProfile;
import com.schooltrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PrincipalProfileRepository extends JpaRepository<PrincipalProfile, Long> {
    Optional<PrincipalProfile> findByUser(User user);
    Optional<PrincipalProfile> findByUserId(Long userId);
}
