package com.schooltrack.controller;

import com.schooltrack.dto.ai.*;
import com.schooltrack.service.AiAnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI & Analytics", description = "Machine Learning performance prediction, at-risk detection, diagnostic reports, and conversational AI assistant for Principal & Coordinators")
public class AiAnalyticsController {

    private final AiAnalyticsService aiAnalyticsService;

    public AiAnalyticsController(AiAnalyticsService aiAnalyticsService) {
        this.aiAnalyticsService = aiAnalyticsService;
    }

    @GetMapping("/insights")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Get institutional AI insights, alerts, and risk metrics within role hierarchy")
    public ResponseEntity<AiInsightsSummaryDto> getInsights(
            @RequestParam(required = false) Long classId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiAnalyticsService.getInstitutionalInsights(classId, userDetails.getUsername()));
    }

    @GetMapping("/predict/student/{studentId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Get student ML performance prediction, trend, and score delta within role hierarchy")
    public ResponseEntity<StudentPredictionDto> getStudentPrediction(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiAnalyticsService.getStudentPerformancePrediction(studentId, userDetails.getUsername()));
    }

    @GetMapping("/predict/students")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Get ML performance predictions for all students within role hierarchy")
    public ResponseEntity<List<StudentPredictionDto>> getAllStudentPredictions(
            @RequestParam(required = false) Long classId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiAnalyticsService.getAllStudentPredictions(classId, userDetails.getUsername()));
    }

    @GetMapping("/report/student/{studentId}")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Generate comprehensive diagnostic AI progress report for a student within role hierarchy")
    public ResponseEntity<AiStudentReportDto> getStudentReport(
            @PathVariable Long studentId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiAnalyticsService.generateAiStudentReport(studentId, userDetails.getUsername()));
    }

    @PostMapping("/chat")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Query conversational AI assistant for educational analytics within role hierarchy")
    public ResponseEntity<AiChatResponse> chatWithAi(
            @RequestBody AiChatRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiAnalyticsService.processAiChatQuery(request, userDetails.getUsername()));
    }

    @GetMapping("/clusters")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Get K-Means behavioral student clusters and interventions within role hierarchy")
    public ResponseEntity<List<StudentClusterDto>> getStudentClusters(
            @RequestParam(required = false) Long classId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiAnalyticsService.getStudentClusters(classId, userDetails.getUsername()));
    }

    @GetMapping("/leave-anomalies")
    @PreAuthorize("hasAnyRole('PRINCIPAL', 'COORDINATOR')")
    @Operation(summary = "Detect unusual student leave patterns within role hierarchy")
    public ResponseEntity<List<LeaveAnomalyDto>> getLeaveAnomalies(
            @RequestParam(required = false) Long classId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(aiAnalyticsService.getLeaveAnomalies(classId, userDetails.getUsername()));
    }
}
