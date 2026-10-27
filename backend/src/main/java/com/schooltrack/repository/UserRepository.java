package com.schooltrack.repository;

import com.schooltrack.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByTeacherId(String teacherId);
    Optional<User> findByRollNumber(String rollNumber);
    Optional<User> findByPhone(String phone);

    @Query("SELECT u FROM User u WHERE u.username = :identifier OR u.email = :identifier OR u.teacherId = :identifier OR u.rollNumber = :identifier OR u.phone = :identifier")
    Optional<User> findByIdentifier(@Param("identifier") String identifier);

    Optional<User> findByUsernameOrEmail(String username, String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByTeacherId(String teacherId);
    boolean existsByRollNumber(String rollNumber);
}
