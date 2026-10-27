package com.schooltrack.controller;

import com.schooltrack.dto.ClassCreateRequest;
import com.schooltrack.dto.ClassDetailDto;
import com.schooltrack.dto.SubjectDetailDto;
import com.schooltrack.service.ClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
@Tag(name = "Classes & Subjects", description = "Endpoints for viewing and managing classes, sections, and subject curricula")
public class ClassController {

    private final ClassService classService;

    public ClassController(ClassService classService) {
        this.classService = classService;
    }

    @GetMapping
    @Operation(summary = "Get all classes")
    public ResponseEntity<List<ClassDetailDto>> getAllClasses(
            @RequestParam(required = false) Long coordinatorId,
            @RequestParam(required = false) Long teacherId) {
        if (coordinatorId != null) {
            return ResponseEntity.ok(classService.getClassesByCoordinatorId(coordinatorId));
        }
        if (teacherId != null) {
            return ResponseEntity.ok(classService.getClassesBySubjectTeacherId(teacherId));
        }
        return ResponseEntity.ok(classService.getAllClasses());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get class by ID")
    public ResponseEntity<ClassDetailDto> getClassById(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getClassById(id));
    }

    @GetMapping("/teacher/{classTeacherId}")
    @Operation(summary = "Get class assigned to Class Teacher")
    public ResponseEntity<ClassDetailDto> getClassByClassTeacherId(@PathVariable Long classTeacherId) {
        return ResponseEntity.ok(classService.getClassByClassTeacherId(classTeacherId));
    }

    @PostMapping
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Create a new Class & Section (Principal only)")
    public ResponseEntity<ClassDetailDto> createClass(
            @Valid @RequestBody ClassCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(classService.createClass(request, userDetails.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Update Class & Section / Reassign Class Teacher & Coordinator (Principal only)")
    public ResponseEntity<ClassDetailDto> updateClass(
            @PathVariable Long id,
            @Valid @RequestBody ClassCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(classService.updateClass(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Delete Class & Section (Principal only)")
    public ResponseEntity<Void> deleteClass(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        classService.deleteClass(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/subjects")
    @Operation(summary = "Get subjects for a class")
    public ResponseEntity<List<SubjectDetailDto>> getSubjectsByClassId(@PathVariable Long id) {
        return ResponseEntity.ok(classService.getSubjectsByClassId(id));
    }

    @GetMapping("/subjects")
    @Operation(summary = "Get all global subjects")
    public ResponseEntity<List<SubjectDetailDto>> getAllSubjects() {
        return ResponseEntity.ok(classService.getAllSubjects());
    }

    @PostMapping("/subjects")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Create a new global subject (Principal only)")
    public ResponseEntity<SubjectDetailDto> createSubject(
            @Valid @RequestBody SubjectDetailDto request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(classService.createSubject(request, userDetails.getUsername()));
    }
}
