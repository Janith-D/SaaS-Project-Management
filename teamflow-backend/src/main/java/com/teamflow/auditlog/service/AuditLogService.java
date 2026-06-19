package com.teamflow.auditlog.service;

import com.teamflow.auditlog.dto.AuditLogResponse;
import com.teamflow.auditlog.entity.AuditLog;
import com.teamflow.auditlog.enums.AuditEventType;
import com.teamflow.auditlog.repository.AuditLogRepository;
import com.teamflow.user.entity.User;
import com.teamflow.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserService userService;

    public void log(UUID userId, AuditEventType eventType, String description, HttpServletRequest request) {
        User user = userId != null ? userService.getUserById(userId) : null;
        AuditLog log = AuditLog.builder()
                .user(user)
                .eventType(eventType)
                .description(description)
                .ipAddress(request != null ? request.getRemoteAddr() : null)
                .userAgent(request != null ? request.getHeader("User-Agent") : null)
                .build();
        auditLogRepository.save(log);
    }

    public List<AuditLogResponse> getAllLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AuditLogResponse> getLogsByUser(UUID userId) {
        return auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<AuditLogResponse> getLogsByEventType(AuditEventType eventType) {
        return auditLogRepository.findByEventTypeOrderByCreatedAtDesc(eventType).stream()
                .map(this::toResponse)
                .toList();
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return AuditLogResponse.builder()
                .id(log.getId())
                .userId(log.getUser() != null ? log.getUser().getId() : null)
                .userEmail(log.getUser() != null ? log.getUser().getEmail() : null)
                .eventType(log.getEventType())
                .description(log.getDescription())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
