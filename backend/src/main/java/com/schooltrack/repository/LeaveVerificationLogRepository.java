package com.schooltrack.repository;

import com.schooltrack.entity.LeaveVerificationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeaveVerificationLogRepository extends JpaRepository<LeaveVerificationLog, Long> {
    List<LeaveVerificationLog> findByLeaveRequestIdOrderByTimestampAsc(Long leaveRequestId);
}
