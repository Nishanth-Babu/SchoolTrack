package com.schooltrack.service.impl;

import com.schooltrack.entity.AuditLog;
import com.schooltrack.entity.User;
import com.schooltrack.repository.AuditLogRepository;
import com.schooltrack.service.AuditLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogServiceImpl(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional
    public void log(User user, String action, String resource, Long resourceId, String details, String ipAddress) {
        AuditLog log = new AuditLog(user, action, resource, resourceId, details, ipAddress);
        auditLogRepository.save(log);
    }
}
