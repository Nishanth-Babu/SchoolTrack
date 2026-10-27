package com.schooltrack.service;

import com.schooltrack.entity.User;

public interface AuditLogService {
    void log(User user, String action, String resource, Long resourceId, String details, String ipAddress);
}
