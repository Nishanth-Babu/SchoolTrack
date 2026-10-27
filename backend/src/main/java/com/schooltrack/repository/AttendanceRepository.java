package com.schooltrack.repository;

import com.schooltrack.entity.Attendance;
import com.schooltrack.entity.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate start, LocalDate end);
    List<Attendance> findBySchoolClassIdAndDate(Long classId, LocalDate date);
    List<Attendance> findBySchoolClassIdAndSubjectIdAndDateAndPeriod(Long classId, Long subjectId, LocalDate date, Integer period);
    List<Attendance> findAllByStudentIdAndSubjectIdAndDateAndPeriod(Long studentId, Long subjectId, LocalDate date, Integer period);

    default Optional<Attendance> findByStudentIdAndSubjectIdAndDateAndPeriod(Long studentId, Long subjectId, LocalDate date, Integer period) {
        List<Attendance> list = findAllByStudentIdAndSubjectIdAndDateAndPeriod(studentId, subjectId, date, period);
        return (list == null || list.isEmpty()) ? Optional.empty() : Optional.of(list.get(0));
    }
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByStudentIdAndStatus(Long studentId, AttendanceStatus status);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.date = :date AND a.status = :status")
    long countByDateAndStatus(@Param("date") LocalDate date, @Param("status") AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = :status")
    long countByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") AttendanceStatus status);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countTotalByStudentId(@Param("studentId") Long studentId);
}
