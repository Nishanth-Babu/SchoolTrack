package com.schooltrack.controller;

import com.schooltrack.dto.LeaveApplyRequest;
import com.schooltrack.dto.LeaveResponseDto;
import com.schooltrack.dto.LeaveVerificationRequest;
import com.schooltrack.entity.LeaveType;
import com.schooltrack.service.LeaveService;
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
@RequestMapping("/api/leaves")
@Tag(name = "Leave Management", description = "Leave applications and 3-stage verification (Parent -> Class Teacher -> Coordinator)")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping("/types")
    @Operation(summary = "Get all available leave types")
    public ResponseEntity<List<LeaveType>> getLeaveTypes() {
        return ResponseEntity.ok(leaveService.getAllLeaveTypes());
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Apply for leave (Student only)")
    public ResponseEntity<LeaveResponseDto> applyLeave(
            @Valid @RequestBody LeaveApplyRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.applyLeave(request, userDetails.getUsername()));
    }

    @GetMapping
    @Operation(summary = "Get leave requests (filterable by studentId, classId, role)")
    public ResponseEntity<List<LeaveResponseDto>> getLeaves(
            @RequestParam(required = false) Long studentId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) String pendingForRole,
            @RequestParam(required = false) Long userId) {
        if (studentId != null) {
            return ResponseEntity.ok(leaveService.getStudentLeaves(studentId));
        }
        if (classId != null) {
            return ResponseEntity.ok(leaveService.getLeavesForClass(classId));
        }
        if ("CLASS_TEACHER".equalsIgnoreCase(pendingForRole)) {
            return ResponseEntity.ok(leaveService.getPendingLeavesForClassTeacher(userId));
        }
        if ("COORDINATOR".equalsIgnoreCase(pendingForRole)) {
            return ResponseEntity.ok(leaveService.getPendingLeavesForCoordinator(userId));
        }
        if ("PARENT".equalsIgnoreCase(pendingForRole)) {
            return ResponseEntity.ok(leaveService.getPendingLeavesForParent(userId));
        }
        return ResponseEntity.ok(leaveService.getAllLeaves());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get leave details with verification timeline")
    public ResponseEntity<LeaveResponseDto> getLeaveById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveService.getLeaveById(id));
    }

    @PutMapping("/{id}/parent-verify")
    @PreAuthorize("hasAnyRole('PARENT', 'PRINCIPAL')")
    @Operation(summary = "Stage 1: Parent Verification (Approve or Reject)")
    public ResponseEntity<LeaveResponseDto> parentVerify(
            @PathVariable Long id,
            @Valid @RequestBody LeaveVerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.parentVerifyLeave(id, request, userDetails.getUsername()));
    }

    @PutMapping("/{id}/parent-approve")
    @PreAuthorize("hasAnyRole('PARENT', 'PRINCIPAL')")
    public ResponseEntity<LeaveResponseDto> parentApprove(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.parentVerifyLeave(id, new LeaveVerificationRequest("APPROVE", "Approved via portal"), userDetails.getUsername()));
    }

    @PutMapping("/{id}/parent-reject")
    @PreAuthorize("hasAnyRole('PARENT', 'PRINCIPAL')")
    public ResponseEntity<LeaveResponseDto> parentReject(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.parentVerifyLeave(id, new LeaveVerificationRequest("REJECT", "Rejected via portal"), userDetails.getUsername()));
    }

    @PutMapping("/{id}/teacher-verify")
    @PreAuthorize("hasAnyRole('CLASS_TEACHER', 'PRINCIPAL')")
    @Operation(summary = "Stage 2: Class Teacher Verification (Approve or Reject)")
    public ResponseEntity<LeaveResponseDto> teacherVerify(
            @PathVariable Long id,
            @Valid @RequestBody LeaveVerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.classTeacherVerifyLeave(id, request, userDetails.getUsername()));
    }

    @PutMapping("/{id}/teacher-approve")
    @PreAuthorize("hasAnyRole('CLASS_TEACHER', 'PRINCIPAL')")
    public ResponseEntity<LeaveResponseDto> teacherApprove(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.classTeacherVerifyLeave(id, new LeaveVerificationRequest("APPROVE", "Recommended by Class Teacher"), userDetails.getUsername()));
    }

    @PutMapping("/{id}/teacher-reject")
    @PreAuthorize("hasAnyRole('CLASS_TEACHER', 'PRINCIPAL')")
    public ResponseEntity<LeaveResponseDto> teacherReject(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.classTeacherVerifyLeave(id, new LeaveVerificationRequest("REJECT", "Declined by Class Teacher"), userDetails.getUsername()));
    }

    @PutMapping("/{id}/coordinator-verify")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'PRINCIPAL')")
    @Operation(summary = "Stage 3: Coordinator Verification (Final Approval or Reject)")
    public ResponseEntity<LeaveResponseDto> coordinatorVerify(
            @PathVariable Long id,
            @Valid @RequestBody LeaveVerificationRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.coordinatorVerifyLeave(id, request, userDetails.getUsername()));
    }

    @PutMapping("/{id}/coordinator-approve")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'PRINCIPAL')")
    public ResponseEntity<LeaveResponseDto> coordinatorApprove(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.coordinatorVerifyLeave(id, new LeaveVerificationRequest("APPROVE", "Final approval granted"), userDetails.getUsername()));
    }

    @PutMapping("/{id}/coordinator-reject")
    @PreAuthorize("hasAnyRole('COORDINATOR', 'PRINCIPAL')")
    public ResponseEntity<LeaveResponseDto> coordinatorReject(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(leaveService.coordinatorVerifyLeave(id, new LeaveVerificationRequest("REJECT", "Declined at Coordinator stage"), userDetails.getUsername()));
    }
}
