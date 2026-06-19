package com.teamflow.auditlog.repository;

import com.teamflow.auditlog.entity.AuditLog;
import com.teamflow.auditlog.enums.AuditEventType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<AuditLog> findByEventTypeOrderByCreatedAtDesc(AuditEventType eventType);
    List<AuditLog> findAllByOrderByCreatedAtDesc();
}
