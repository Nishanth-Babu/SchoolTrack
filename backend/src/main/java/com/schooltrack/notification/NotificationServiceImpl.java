package com.schooltrack.notification;

import com.schooltrack.entity.*;
import com.schooltrack.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final NotificationRepository notificationRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    @Transactional
    public void sendAbsenceAlert(StudentProfile student, LocalDate date, boolean hasApprovedLeave, String leaveReason) {
        String studentName = student.getUser().getFullName();
        String message;
        if (hasApprovedLeave) {
            message = String.format("SchoolTrack Alert: Your child %s was marked ABSENT on %s. Prior information: Approved Leave (%s).",
                    studentName, date, leaveReason);
        } else {
            message = String.format("SchoolTrack Alert: Your child %s was marked ABSENT on %s. No prior approved leave was found.",
                    studentName, date);
        }

        // Notification to Parent
        if (student.getParent() != null && student.getParent().getUser() != null) {
            User parentUser = student.getParent().getUser();
            String parentPhone = parentUser.getPhone();
            logger.info("[ABSENCE SMS/ALERT DISPATCH] To Parent Phone: {} | Msg: \"{}\"", parentPhone, message);

            Notification notif = new Notification(
                    parentUser,
                    null,
                    "Student Absence Notice",
                    message,
                    NotificationType.ABSENCE_ALERT,
                    student.getId(),
                    "STUDENT"
            );
            notificationRepository.save(notif);
        }

        // Also notify Student profile
        Notification studentNotif = new Notification(
                student.getUser(),
                null,
                "Absence Logged",
                String.format("You were marked ABSENT on %s. %s", date, (hasApprovedLeave ? "Prior Leave on record: " + leaveReason : "No prior leave.")),
                NotificationType.ABSENCE_ALERT,
                student.getId(),
                "STUDENT"
        );
        notificationRepository.save(studentNotif);
    }

    @Override
    @Transactional
    public void sendLeaveStageNotification(LeaveRequest leaveRequest, String stage, String action) {
        String title = "Leave Request Update: " + stage;
        String message = String.format("Leave request for %s from %s to %s was %s at %s stage.",
                leaveRequest.getStudent().getUser().getFullName(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                action,
                stage);

        // Notify student
        notificationRepository.save(new Notification(
                leaveRequest.getStudent().getUser(),
                null,
                title,
                message,
                NotificationType.LEAVE_STAGE_UPDATE,
                leaveRequest.getId(),
                "LEAVE_REQUEST"
        ));

        // Notify parent
        if (leaveRequest.getStudent().getParent() != null) {
            notificationRepository.save(new Notification(
                    leaveRequest.getStudent().getParent().getUser(),
                    null,
                    title,
                    message,
                    NotificationType.LEAVE_STAGE_UPDATE,
                    leaveRequest.getId(),
                    "LEAVE_REQUEST"
            ));
        }
    }

    @Override
    @Transactional
    public void sendHomeworkNotification(Homework homework) {
        String title = "New Homework: " + homework.getSubject().getName();
        String message = String.format("New assignment '%s' due on %s for %s.",
                homework.getTitle(), homework.getDueDate(), homework.getSchoolClass().getName());

        logger.info("[HOMEWORK NOTIFICATION BROADCAST] Class: {} | Title: {}", homework.getSchoolClass().getName(), homework.getTitle());
    }

    @Override
    @Transactional
    public void sendGeneralNotification(User recipient, User sender, String title, String message, NotificationType type, Long refId, String refType) {
        Notification notification = new Notification(recipient, sender, title, message, type, refId, refType);
        notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public List<Notification> getUnreadUserNotifications(Long userId) {
        return notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.findById(notificationId).ifPresent(notif -> {
            if (notif.getRecipient().getId().equals(userId)) {
                notif.setRead(true);
                notificationRepository.save(notif);
            }
        });
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }
}
