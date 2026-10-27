package com.schooltrack.controller;

import com.schooltrack.dto.CalendarEventDto;
import com.schooltrack.dto.CreateCalendarEventRequest;
import com.schooltrack.service.CalendarEventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@Tag(name = "Calendar & School Events", description = "Academic calendar, holidays, exams, PTMs, and institutional events")
public class CalendarEventController {

    private final CalendarEventService eventService;

    public CalendarEventController(CalendarEventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    @Operation(summary = "Get all calendar events with optional type filter")
    public ResponseEntity<List<CalendarEventDto>> getAllEvents(
            @RequestParam(required = false, defaultValue = "ALL") String eventType) {
        return ResponseEntity.ok(eventService.getAllEvents(eventType));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming calendar events from today onward")
    public ResponseEntity<List<CalendarEventDto>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents());
    }

    @GetMapping("/range")
    @Operation(summary = "Get events in a specific date range")
    public ResponseEntity<List<CalendarEventDto>> getEventsForDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        return ResponseEntity.ok(eventService.getEventsForDateRange(start, end));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Create an institutional event or holiday")
    public ResponseEntity<CalendarEventDto> createEvent(@Valid @RequestBody CreateCalendarEventRequest request) {
        return new ResponseEntity<>(eventService.createEvent(request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Delete an institutional event")
    public ResponseEntity<Map<String, String>> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
    }
}
