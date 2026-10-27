package com.schooltrack.dto.ai;

import java.util.List;
import java.util.Map;

public class StudentPredictionDto {
    private Long studentId;
    private String studentName;
    private String admissionNumber;
    private String rollNumber;
    private String className;
    private Double predictedScore; // e.g. 78.0
    private Double currentAverage;  // e.g. 72.0
    private Double scoreDelta;       // e.g. +6.0
    private String status;           // ON_TRACK, NEEDS_ATTENTION, AT_RISK, EXCELLING
    private Double confidenceScore;  // e.g. 92.4
    private String modelName;        // e.g. "Random Forest + Gradient Boosting Regressor"
    private Map<String, Double> featureImportances; // "Attendance": 0.30, etc.
    private List<PerformancePoint> trend;
    private List<SubjectPrediction> subjectPredictions;
    private List<String> keyFactors;
    private List<String> recommendedInterventions;

    public static class PerformancePoint {
        private String month;
        private Double actualScore;
        private Double predictedScore;

        public PerformancePoint() {}
        public PerformancePoint(String month, Double actualScore, Double predictedScore) {
            this.month = month;
            this.actualScore = actualScore;
            this.predictedScore = predictedScore;
        }

        public String getMonth() { return month; }
        public void setMonth(String month) { this.month = month; }
        public Double getActualScore() { return actualScore; }
        public void setActualScore(Double actualScore) { this.actualScore = actualScore; }
        public Double getPredictedScore() { return predictedScore; }
        public void setPredictedScore(Double predictedScore) { this.predictedScore = predictedScore; }
    }

    public static class SubjectPrediction {
        private String subjectName;
        private Double currentMarks;
        private Double predictedMarks;
        private String status; // ON_TRACK, NEEDS_ATTENTION, AT_RISK

        public SubjectPrediction() {}
        public SubjectPrediction(String subjectName, Double currentMarks, Double predictedMarks, String status) {
            this.subjectName = subjectName;
            this.currentMarks = currentMarks;
            this.predictedMarks = predictedMarks;
            this.status = status;
        }

        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public Double getCurrentMarks() { return currentMarks; }
        public void setCurrentMarks(Double currentMarks) { this.currentMarks = currentMarks; }
        public Double getPredictedMarks() { return predictedMarks; }
        public void setPredictedMarks(Double predictedMarks) { this.predictedMarks = predictedMarks; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public StudentPredictionDto() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getAdmissionNumber() { return admissionNumber; }
    public void setAdmissionNumber(String admissionNumber) { this.admissionNumber = admissionNumber; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public Double getPredictedScore() { return predictedScore; }
    public void setPredictedScore(Double predictedScore) { this.predictedScore = predictedScore; }

    public Double getCurrentAverage() { return currentAverage; }
    public void setCurrentAverage(Double currentAverage) { this.currentAverage = currentAverage; }

    public Double getScoreDelta() { return scoreDelta; }
    public void setScoreDelta(Double scoreDelta) { this.scoreDelta = scoreDelta; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Double confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }

    public Map<String, Double> getFeatureImportances() { return featureImportances; }
    public void setFeatureImportances(Map<String, Double> featureImportances) { this.featureImportances = featureImportances; }

    public List<PerformancePoint> getTrend() { return trend; }
    public void setTrend(List<PerformancePoint> trend) { this.trend = trend; }

    public List<SubjectPrediction> getSubjectPredictions() { return subjectPredictions; }
    public void setSubjectPredictions(List<SubjectPrediction> subjectPredictions) { this.subjectPredictions = subjectPredictions; }

    public List<String> getKeyFactors() { return keyFactors; }
    public void setKeyFactors(List<String> keyFactors) { this.keyFactors = keyFactors; }

    public List<String> getRecommendedInterventions() { return recommendedInterventions; }
    public void setRecommendedInterventions(List<String> recommendedInterventions) { this.recommendedInterventions = recommendedInterventions; }
}
