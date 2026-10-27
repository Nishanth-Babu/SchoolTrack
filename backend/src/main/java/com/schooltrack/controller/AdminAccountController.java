package com.schooltrack.controller;

import com.schooltrack.dto.*;
import com.schooltrack.service.AdminAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/accounts")
@Tag(name = "Admin Account Management", description = "Principal endpoints for creating, editing, disabling, and managing all staff, student, and parent accounts")
@PreAuthorize("hasRole('PRINCIPAL')")
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    public AdminAccountController(AdminAccountService adminAccountService) {
        this.adminAccountService = adminAccountService;
    }

    private String getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (auth != null && auth.getName() != null) ? auth.getName() : "principal";
    }

    @PostMapping
    @Operation(summary = "Create an account for Coordinator, Class Teacher, Subject Teacher, Student, or Parent")
    public ResponseEntity<UserDto> createAccount(@Valid @RequestBody AccountCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(adminAccountService.createAccount(request, getAuthenticatedUsername()));
    }

    @GetMapping("/role/{role}")
    @Operation(summary = "List all accounts by role")
    public ResponseEntity<List<UserDto>> getAccountsByRole(@PathVariable String role) {
        return ResponseEntity.ok(adminAccountService.getAccountsByRole(role));
    }

    @PutMapping("/{userId}/status")
    @Operation(summary = "Update account status (ACTIVE, DISABLED, DEACTIVATED)")
    public ResponseEntity<UserDto> updateStatus(@PathVariable Long userId,
                                                @Valid @RequestBody AccountStatusUpdateRequest request) {
        return ResponseEntity.ok(adminAccountService.updateAccountStatus(userId, request.getStatus(), getAuthenticatedUsername()));
    }

    @PutMapping("/{userId}/reset-password")
    @Operation(summary = "Reset password for an account")
    public ResponseEntity<Map<String, String>> resetPassword(@PathVariable Long userId,
                                                             @Valid @RequestBody AccountPasswordResetRequest request) {
        adminAccountService.resetPassword(userId, request.getNewPassword(), getAuthenticatedUsername());
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @PostMapping("/link-student-parent")
    @Operation(summary = "Link a student to a parent")
    public ResponseEntity<Map<String, String>> linkStudentParent(@RequestParam Long studentId,
                                                                 @RequestParam Long parentId) {
        adminAccountService.linkStudentParent(studentId, parentId, getAuthenticatedUsername());
        return ResponseEntity.ok(Map.of("message", "Student and parent linked successfully"));
    }

    @PostMapping("/assign-subject-teacher")
    @Operation(summary = "Assign a subject teacher to a class and subject")
    public ResponseEntity<Map<String, String>> assignSubjectTeacher(@RequestParam Long teacherProfileId,
                                                                    @RequestParam Long classId,
                                                                    @RequestParam Long subjectId) {
        adminAccountService.assignSubjectTeacher(teacherProfileId, classId, subjectId, getAuthenticatedUsername());
        return ResponseEntity.ok(Map.of("message", "Teacher assigned to subject and class successfully"));
    }

    @PostMapping("/assign-class-teacher")
    @Operation(summary = "Assign a class teacher to a class")
    public ResponseEntity<Map<String, String>> assignClassTeacher(@RequestParam Long classId,
                                                                  @RequestParam Long teacherProfileId) {
        adminAccountService.assignClassTeacher(classId, teacherProfileId, getAuthenticatedUsername());
        return ResponseEntity.ok(Map.of("message", "Class teacher assigned successfully"));
    }
}
