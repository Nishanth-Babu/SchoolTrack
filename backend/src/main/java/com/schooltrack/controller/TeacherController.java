package com.schooltrack.controller;

import com.schooltrack.dto.TeacherDetailDto;
import com.schooltrack.service.TeacherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@Tag(name = "Teachers & Staff", description = "Endpoints for managing Coordinators, Class Teachers, and Subject Teachers")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping
    @Operation(summary = "Get all teachers")
    public ResponseEntity<List<TeacherDetailDto>> getAllTeachers(@RequestParam(required = false) String role) {
        if ("COORDINATOR".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(teacherService.getCoordinators());
        }
        if ("CLASS_TEACHER".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(teacherService.getClassTeachers());
        }
        if ("SUBJECT_TEACHER".equalsIgnoreCase(role)) {
            return ResponseEntity.ok(teacherService.getSubjectTeachers());
        }
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get teacher by ID")
    public ResponseEntity<TeacherDetailDto> getTeacherById(@PathVariable Long id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    @PostMapping("/{teacherId}/assign")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Assign a Subject Teacher to a Class and Subject (Principal only)")
    public ResponseEntity<Void> assignSubjectTeacher(@PathVariable Long teacherId,
                                                    @RequestParam Long classId,
                                                    @RequestParam Long subjectId) {
        teacherService.assignSubjectTeacherToClass(teacherId, classId, subjectId);
        return ResponseEntity.ok().build();
    }
}
