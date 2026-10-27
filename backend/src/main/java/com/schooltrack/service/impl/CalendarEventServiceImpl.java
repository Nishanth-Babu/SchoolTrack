package com.schooltrack.service.impl;

import com.schooltrack.dto.CalendarEventDto;
import com.schooltrack.dto.CreateCalendarEventRequest;
import com.schooltrack.entity.CalendarEvent;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.repository.CalendarEventRepository;
import com.schooltrack.service.CalendarEventService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalendarEventServiceImpl implements CalendarEventService {

    private final CalendarEventRepository eventRepository;

    public CalendarEventServiceImpl(CalendarEventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDto> getAllEvents(String eventType) {
        List<CalendarEvent> events;
        if (eventType != null && !eventType.isBlank() && !eventType.equalsIgnoreCase("ALL")) {
            events = eventRepository.findByEventTypeOrderByStartDateAsc(eventType.toUpperCase());
        } else {
            events = eventRepository.findByOrderByStartDateAsc();
        }
        return events.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDto> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDate.now())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CalendarEventDto> getEventsForDateRange(LocalDate start, LocalDate end) {
        return eventRepository.findEventsInDateRange(start, end)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CalendarEventDto createEvent(CreateCalendarEventRequest request) {
        CalendarEvent event = new CalendarEvent(
                request.getTitle(),
                request.getDescription(),
                request.getEventType().toUpperCase(),
                request.getStartDate(),
                request.getEndDate(),
                request.getTargetAudience() != null ? request.getTargetAudience().toUpperCase() : "ALL",
                request.getLocation() != null ? request.getLocation() : "Campus"
        );

        CalendarEvent saved = eventRepository.save(event);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public void deleteEvent(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Calendar event not found with id: " + id);
        }
        eventRepository.deleteById(id);
    }

    private CalendarEventDto mapToDto(CalendarEvent event) {
        return new CalendarEventDto(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventType(),
                event.getStartDate(),
                event.getEndDate(),
                event.getTargetAudience(),
                event.getLocation(),
                event.getCreatedAt()
        );
    }
}
