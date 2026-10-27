package com.schooltrack.controller;

import com.schooltrack.dto.StudentDetailDto;
import com.schooltrack.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Students", description = "Endpoints for managing student profiles and records")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    @Operation(summary = "Get all students")
    public ResponseEntity<List<StudentDetailDto>> getAllStudents(
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long parentId) {
        if (classId != null) {
            return ResponseEntity.ok(studentService.getStudentsByClassId(classId));
        }
        if (parentId != null) {
            return ResponseEntity.ok(studentService.getStudentsByParentId(parentId));
        }
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student profile by ID")
    public ResponseEntity<StudentDetailDto> getStudentById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Update student details (Principal only)")
    public ResponseEntity<StudentDetailDto> updateStudent(@PathVariable Long id, @RequestBody StudentDetailDto dto) {
        return ResponseEntity.ok(studentService.updateStudent(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PRINCIPAL')")
    @Operation(summary = "Delete student record")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }
}
