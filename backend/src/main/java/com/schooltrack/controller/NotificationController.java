package com.schooltrack.controller;

import com.schooltrack.dto.NotificationDto;
import com.schooltrack.entity.User;
import com.schooltrack.exception.ResourceNotFoundException;
import com.schooltrack.notification.NotificationService;
import com.schooltrack.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "User notification center, unread alerts, and read receipt updates")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @GetMapping
    @Operation(summary = "Get user notifications")
    public ResponseEntity<List<NotificationDto>> getNotifications(
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        var notifs = unreadOnly ?
                notificationService.getUnreadUserNotifications(user.getId()) :
                notificationService.getUserNotifications(user.getId());

        List<NotificationDto> dtos = notifs.stream().map(n -> {
            NotificationDto dto = new NotificationDto();
            dto.setId(n.getId());
            dto.setTitle(n.getTitle());
            dto.setMessage(n.getMessage());
            dto.setType(n.getType());
            dto.setRead(n.isRead());
            dto.setReferenceId(n.getReferenceId());
            dto.setReferenceType(n.getReferenceType());
            dto.setCreatedAt(n.getCreatedAt());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationService.markAsRead(id, user.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationService.markAllAsRead(user.getId());
        return ResponseEntity.ok().build();
    }
}
