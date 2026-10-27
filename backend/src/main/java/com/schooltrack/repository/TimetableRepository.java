package com.schooltrack.repository;

import com.schooltrack.entity.TimetableSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableSlot, Long> {

    List<TimetableSlot> findBySchoolClassIdOrderByPeriodNumberAsc(Long classId);

    List<TimetableSlot> findBySchoolClassIdAndDayOfWeekOrderByPeriodNumberAsc(Long classId, String dayOfWeek);

    List<TimetableSlot> findByTeacherIdOrderByPeriodNumberAsc(Long teacherId);

    List<TimetableSlot> findByTeacherIdAndDayOfWeekOrderByPeriodNumberAsc(Long teacherId, String dayOfWeek);

    boolean existsBySchoolClassIdAndDayOfWeekAndPeriodNumber(Long classId, String dayOfWeek, Integer periodNumber);

    boolean existsByTeacherIdAndDayOfWeekAndPeriodNumber(Long teacherId, String dayOfWeek, Integer periodNumber);

    boolean existsByRoomNumberAndDayOfWeekAndPeriodNumber(String roomNumber, String dayOfWeek, Integer periodNumber);
}
