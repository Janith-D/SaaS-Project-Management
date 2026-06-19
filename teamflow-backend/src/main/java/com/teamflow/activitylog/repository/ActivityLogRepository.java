package com.teamflow.activitylog.repository;

import com.teamflow.activitylog.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {
    List<ActivityLog> findByWorkspaceIdOrderByCreatedAtDesc(UUID workspaceId);
    List<ActivityLog> findByProjectIdOrderByCreatedAtDesc(UUID projectId);
    List<ActivityLog> findByTaskIdOrderByCreatedAtDesc(UUID taskId);
}
