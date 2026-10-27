package com.schooltrack.dto.ai;

import java.util.List;

public class StudentClusterDto {
    private String clusterId;
    private String clusterName;
    private String description;
    private String color; // e.g. emerald, amber, rose, sky, indigo
    private int studentCount;
    private double percentageOfTotal;
    private double avgAttendance;
    private double avgMarks;
    private double avgHomeworkRate;
    private List<String> characteristics;
    private List<String> recommendedStrategies;

    public StudentClusterDto() {}

    public StudentClusterDto(String clusterId, String clusterName, String description, String color, int studentCount, double percentageOfTotal, double avgAttendance, double avgMarks, double avgHomeworkRate, List<String> characteristics, List<String> recommendedStrategies) {
        this.clusterId = clusterId;
        this.clusterName = clusterName;
        this.description = description;
        this.color = color;
        this.studentCount = studentCount;
        this.percentageOfTotal = percentageOfTotal;
        this.avgAttendance = avgAttendance;
        this.avgMarks = avgMarks;
        this.avgHomeworkRate = avgHomeworkRate;
        this.characteristics = characteristics;
        this.recommendedStrategies = recommendedStrategies;
    }

    public String getClusterId() { return clusterId; }
    public void setClusterId(String clusterId) { this.clusterId = clusterId; }

    public String getClusterName() { return clusterName; }
    public void setClusterName(String clusterName) { this.clusterName = clusterName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public int getStudentCount() { return studentCount; }
    public void setStudentCount(int studentCount) { this.studentCount = studentCount; }

    public double getPercentageOfTotal() { return percentageOfTotal; }
    public void setPercentageOfTotal(double percentageOfTotal) { this.percentageOfTotal = percentageOfTotal; }

    public double getAvgAttendance() { return avgAttendance; }
    public void setAvgAttendance(double avgAttendance) { this.avgAttendance = avgAttendance; }

    public double getAvgMarks() { return avgMarks; }
    public void setAvgMarks(double avgMarks) { this.avgMarks = avgMarks; }

    public double getAvgHomeworkRate() { return avgHomeworkRate; }
    public void setAvgHomeworkRate(double avgHomeworkRate) { this.avgHomeworkRate = avgHomeworkRate; }

    public List<String> getCharacteristics() { return characteristics; }
    public void setCharacteristics(List<String> characteristics) { this.characteristics = characteristics; }

    public List<String> getRecommendedStrategies() { return recommendedStrategies; }
    public void setRecommendedStrategies(List<String> recommendedStrategies) { this.recommendedStrategies = recommendedStrategies; }
}
