package com.schooltrack.repository;

import com.schooltrack.entity.LeaveRequest;
import com.schooltrack.entity.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStudentId(Long studentId);
    List<LeaveRequest> findByStudentCurrentClassId(Long classId);
    List<LeaveRequest> findByFinalStatus(LeaveStatus status);
    
    @Query("SELECT l FROM LeaveRequest l WHERE l.student.id = :studentId AND :targetDate BETWEEN l.startDate AND l.endDate AND l.finalStatus = 'APPROVED' ORDER BY l.id DESC")
    List<LeaveRequest> findApprovedLeavesForStudentAndDate(@Param("studentId") Long studentId, @Param("targetDate") LocalDate targetDate);

    default Optional<LeaveRequest> findApprovedLeaveForStudentAndDate(Long studentId, LocalDate targetDate) {
        List<LeaveRequest> list = findApprovedLeavesForStudentAndDate(studentId, targetDate);
        return (list == null || list.isEmpty()) ? Optional.empty() : Optional.of(list.get(0));
    }

    @Query("SELECT l FROM LeaveRequest l WHERE l.student.id = :studentId AND :targetDate BETWEEN l.startDate AND l.endDate")
    List<LeaveRequest> findLeavesForStudentAndDate(@Param("studentId") Long studentId, @Param("targetDate") LocalDate targetDate);

    @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.finalStatus IN ('PENDING_PARENT_VERIFICATION', 'CLASS_TEACHER_PENDING', 'COORDINATOR_PENDING')")
    long countPendingLeaves();

    @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.student.currentClass.id = :classId AND l.finalStatus = 'CLASS_TEACHER_PENDING'")
    long countClassTeacherPendingLeaves(@Param("classId") Long classId);

    @Query("SELECT COUNT(l) FROM LeaveRequest l WHERE l.student.parent.id = :parentId AND l.finalStatus = 'PENDING_PARENT_VERIFICATION'")
    long countParentPendingLeaves(@Param("parentId") Long parentId);
}
