package com.teamflow.activitylog.service;

import com.teamflow.activitylog.dto.ActivityLogResponse;
import com.teamflow.activitylog.entity.ActivityLog;
import com.teamflow.activitylog.repository.ActivityLogRepository;
import com.teamflow.user.entity.User;
import com.teamflow.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserService userService;

    public void log(UUID workspaceId, UUID projectId, UUID taskId, UUID actorId,
                    String action, String entityType, UUID entityId, String description) {
        User actor = userService.getUserById(actorId);
        ActivityLog log = ActivityLog.builder()
                .workspaceId(workspaceId)
                .projectId(projectId)
                .taskId(taskId)
                .actor(actor)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .description(description)
                .build();
        activityLogRepository.save(log);
    }

    public List<ActivityLogResponse> getWorkspaceLogs(UUID workspaceId) {
        return activityLogRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ActivityLogResponse> getProjectLogs(UUID projectId) {
        return activityLogRepository.findByProjectIdOrderByCreatedAtDesc(projectId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ActivityLogResponse> getTaskLogs(UUID taskId) {
        return activityLogRepository.findByTaskIdOrderByCreatedAtDesc(taskId).stream()
                .map(this::toResponse)
                .toList();
    }

    private ActivityLogResponse toResponse(ActivityLog log) {
        return ActivityLogResponse.builder()
                .id(log.getId())
                .workspaceId(log.getWorkspaceId())
                .projectId(log.getProjectId())
                .taskId(log.getTaskId())
                .actorId(log.getActor().getId())
                .actorName(log.getActor().getFullName())
                .action(log.getAction())
                .entityType(log.getEntityType())
                .entityId(log.getEntityId())
                .description(log.getDescription())
                .metadata(log.getMetadata())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
