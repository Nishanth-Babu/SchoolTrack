package com.schooltrack.controller;

import com.schooltrack.dto.CreateTimetableSlotRequest;
import com.schooltrack.dto.TimetableSlotDto;
import com.schooltrack.service.TimetableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timetable")
@Tag(name = "Timetable Management", description = "Period schedules, class timetables, and teacher allocations")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping("/class/{classId}")
    @Operation(summary = "Get full weekly timetable for a specific class")
    public ResponseEntity<List<TimetableSlotDto>> getTimetableForClass(@PathVariable Long classId) {
        return ResponseEntity.ok(timetableService.getTimetableForClass(classId));
    }

    @GetMapping("/class/{classId}/weekly")
    @Operation(summary = "Get weekly schedule map for a class (grouped by day of week)")
    public ResponseEntity<Map<String, List<TimetableSlotDto>>> getWeeklyScheduleForClass(@PathVariable Long classId) {
        return ResponseEntity.ok(timetableService.getWeeklyScheduleForClass(classId));
    }

    @GetMapping("/teacher/{teacherId}")
    @Operation(summary = "Get weekly timetable for a specific teacher")
    public ResponseEntity<List<TimetableSlotDto>> getTimetableForTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(timetableService.getTimetableForTeacher(teacherId));
    }

    @GetMapping("/teacher/{teacherId}/weekly")
    @Operation(summary = "Get weekly schedule map for a teacher (grouped by day of week)")
    public ResponseEntity<Map<String, List<TimetableSlotDto>>> getWeeklyScheduleForTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(timetableService.getWeeklyScheduleForTeacher(teacherId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Create or allocate a timetable slot with collision check")
    public ResponseEntity<TimetableSlotDto> createTimetableSlot(@Valid @RequestBody CreateTimetableSlotRequest request) {
        return new ResponseEntity<>(timetableService.createTimetableSlot(request), HttpStatus.CREATED);
    }

    @DeleteMapping("/{slotId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Remove a timetable slot")
    public ResponseEntity<Map<String, String>> deleteTimetableSlot(@PathVariable Long slotId) {
        timetableService.deleteTimetableSlot(slotId);
        return ResponseEntity.ok(Map.of("message", "Timetable slot deleted successfully"));
    }
}
