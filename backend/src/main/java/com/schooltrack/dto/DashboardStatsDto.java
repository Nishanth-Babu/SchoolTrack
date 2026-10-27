package com.schooltrack.dto;

import java.util.List;

public class DashboardStatsDto {
    private long totalStudents;
    private long totalTeachers;
    private long totalClasses;
    private long totalCoordinators;
    private long todayPresent;
    private long todayAbsent;
    private long todayOnDuty;
    private long todayEffectivePresent;
    private double todayAttendancePercentage;
    private long pendingLeaveRequests;
    private long activeHomework;
    private long unreadNotifications;
    private List<NewsResponseDto> latestNews;
    private List<HomeworkResponseDto> upcomingHomework;

    public DashboardStatsDto() {}

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }
    public long getTotalTeachers() { return totalTeachers; }
    public void setTotalTeachers(long totalTeachers) { this.totalTeachers = totalTeachers; }
    public long getTotalClasses() { return totalClasses; }
    public void setTotalClasses(long totalClasses) { this.totalClasses = totalClasses; }
    public long getTotalCoordinators() { return totalCoordinators; }
    public void setTotalCoordinators(long totalCoordinators) { this.totalCoordinators = totalCoordinators; }
    public long getTodayPresent() { return todayPresent; }
    public void setTodayPresent(long todayPresent) { this.todayPresent = todayPresent; }
    public long getTodayAbsent() { return todayAbsent; }
    public void setTodayAbsent(long todayAbsent) { this.todayAbsent = todayAbsent; }
    public long getTodayOnDuty() { return todayOnDuty; }
    public void setTodayOnDuty(long todayOnDuty) { this.todayOnDuty = todayOnDuty; }
    public long getTodayEffectivePresent() { return todayEffectivePresent; }
    public void setTodayEffectivePresent(long todayEffectivePresent) { this.todayEffectivePresent = todayEffectivePresent; }
    public double getTodayAttendancePercentage() { return todayAttendancePercentage; }
    public void setTodayAttendancePercentage(double todayAttendancePercentage) { this.todayAttendancePercentage = todayAttendancePercentage; }
    public long getPendingLeaveRequests() { return pendingLeaveRequests; }
    public void setPendingLeaveRequests(long pendingLeaveRequests) { this.pendingLeaveRequests = pendingLeaveRequests; }
    public long getActiveHomework() { return activeHomework; }
    public void setActiveHomework(long activeHomework) { this.activeHomework = activeHomework; }
    public long getUnreadNotifications() { return unreadNotifications; }
    public void setUnreadNotifications(long unreadNotifications) { this.unreadNotifications = unreadNotifications; }
    public List<NewsResponseDto> getLatestNews() { return latestNews; }
    public void setLatestNews(List<NewsResponseDto> latestNews) { this.latestNews = latestNews; }
    public List<HomeworkResponseDto> getUpcomingHomework() { return upcomingHomework; }
    public void setUpcomingHomework(List<HomeworkResponseDto> upcomingHomework) { this.upcomingHomework = upcomingHomework; }
}
