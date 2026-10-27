package com.schooltrack.repository;

import com.schooltrack.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {

    List<CalendarEvent> findByOrderByStartDateAsc();

    List<CalendarEvent> findByEventTypeOrderByStartDateAsc(String eventType);

    @Query("SELECT e FROM CalendarEvent e WHERE e.endDate >= :today ORDER BY e.startDate ASC")
    List<CalendarEvent> findUpcomingEvents(@Param("today") LocalDate today);

    @Query("SELECT e FROM CalendarEvent e WHERE (e.startDate BETWEEN :start AND :end) OR (e.endDate BETWEEN :start AND :end) ORDER BY e.startDate ASC")
    List<CalendarEvent> findEventsInDateRange(@Param("start") LocalDate start, @Param("end") LocalDate end);
}
