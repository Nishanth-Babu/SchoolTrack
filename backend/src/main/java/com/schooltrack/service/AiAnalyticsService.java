package com.schooltrack.service;

import com.schooltrack.dto.ai.*;
import java.util.List;

public interface AiAnalyticsService {
    AiInsightsSummaryDto getInstitutionalInsights(Long classId, String username);
    StudentPredictionDto getStudentPerformancePrediction(Long studentId, String username);
    List<StudentPredictionDto> getAllStudentPredictions(Long classId, String username);
    AiStudentReportDto generateAiStudentReport(Long studentId, String username);
    AiChatResponse processAiChatQuery(AiChatRequest request, String username);
    List<StudentClusterDto> getStudentClusters(Long classId, String username);
    List<LeaveAnomalyDto> getLeaveAnomalies(Long classId, String username);
}
