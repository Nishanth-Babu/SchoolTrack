package com.schooltrack.notification;

import com.schooltrack.entity.*;
import java.time.LocalDate;
import java.util.List;

public interface NotificationService {
    void sendAbsenceAlert(StudentProfile student, LocalDate date, boolean hasApprovedLeave, String leaveReason);
    void sendLeaveStageNotification(LeaveRequest leaveRequest, String stage, String action);
    void sendHomeworkNotification(Homework homework);
    void sendGeneralNotification(User recipient, User sender, String title, String message, NotificationType type, Long refId, String refType);
    List<Notification> getUserNotifications(Long userId);
    List<Notification> getUnreadUserNotifications(Long userId);
    void markAsRead(Long notificationId, Long userId);
    void markAllAsRead(Long userId);
}
