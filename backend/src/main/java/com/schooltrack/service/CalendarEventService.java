package com.schooltrack.service;

import com.schooltrack.dto.CalendarEventDto;
import com.schooltrack.dto.CreateCalendarEventRequest;

import java.time.LocalDate;
import java.util.List;

public interface CalendarEventService {

    List<CalendarEventDto> getAllEvents(String eventType);

    List<CalendarEventDto> getUpcomingEvents();

    List<CalendarEventDto> getEventsForDateRange(LocalDate start, LocalDate end);

    CalendarEventDto createEvent(CreateCalendarEventRequest request);

    void deleteEvent(Long id);
}
