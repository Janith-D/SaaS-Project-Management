package com.teamflow.auditlog.dto;

import com.teamflow.auditlog.enums.AuditEventType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private UUID id;
    private UUID userId;
    private String userEmail;
    private AuditEventType eventType;
    private String description;
    private String ipAddress;
    private LocalDateTime createdAt;
}
