package com.teamflow.activitylog.controller;

import com.teamflow.activitylog.dto.ActivityLogResponse;
import com.teamflow.activitylog.service.ActivityLogService;
import com.teamflow.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @GetMapping("/api/v1/workspaces/{workspaceId}/activity-logs")
    public ResponseEntity<ApiResponse<List<ActivityLogResponse>>> getWorkspaceLogs(@PathVariable UUID workspaceId) {
        List<ActivityLogResponse> logs = activityLogService.getWorkspaceLogs(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(200, "Activity logs retrieved", logs));
    }

    @GetMapping("/api/v1/projects/{projectId}/activity-logs")
    public ResponseEntity<ApiResponse<List<ActivityLogResponse>>> getProjectLogs(@PathVariable UUID projectId) {
        List<ActivityLogResponse> logs = activityLogService.getProjectLogs(projectId);
        return ResponseEntity.ok(ApiResponse.success(200, "Activity logs retrieved", logs));
    }

    @GetMapping("/api/v1/tasks/{taskId}/activity-logs")
    public ResponseEntity<ApiResponse<List<ActivityLogResponse>>> getTaskLogs(@PathVariable UUID taskId) {
        List<ActivityLogResponse> logs = activityLogService.getTaskLogs(taskId);
        return ResponseEntity.ok(ApiResponse.success(200, "Activity logs retrieved", logs));
    }
}
