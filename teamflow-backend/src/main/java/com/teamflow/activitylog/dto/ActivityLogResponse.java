package com.teamflow.activitylog.dto;

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
public class ActivityLogResponse {
    private UUID id;
    private UUID workspaceId;
    private UUID projectId;
    private UUID taskId;
    private UUID actorId;
    private String actorName;
    private String action;
    private String entityType;
    private UUID entityId;
    private String description;
    private String metadata;
    private LocalDateTime createdAt;
}
