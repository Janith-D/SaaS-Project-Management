package com.teamflow.task.controller;

import com.teamflow.common.response.ApiResponse;
import com.teamflow.task.dto.*;
import com.teamflow.task.service.TaskService;
import com.teamflow.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/api/v1/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateTaskRequest request) {
        TaskResponse response = taskService.createTask(projectId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Task created", response));
    }

    @GetMapping("/api/v1/projects/{projectId}/tasks")
    public ResponseEntity<ApiResponse<Page<TaskResponse>>> getProjectTasks(
            @PathVariable UUID projectId,
            TaskFilterRequest filter,
            Pageable pageable) {
        Page<TaskResponse> tasks = taskService.getProjectTasks(projectId, filter, pageable);
        return ResponseEntity.ok(ApiResponse.success(200, "Tasks retrieved", tasks));
    }

    @GetMapping("/api/v1/tasks/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(@PathVariable UUID taskId) {
        TaskResponse response = taskService.getTask(taskId);
        return ResponseEntity.ok(ApiResponse.success(200, "Task retrieved", response));
    }

    @PutMapping("/api/v1/tasks/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateTaskRequest request) {
        TaskResponse response = taskService.updateTask(taskId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Task updated", response));
    }

    @DeleteMapping("/api/v1/tasks/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable UUID taskId) {
        taskService.deleteTask(taskId, null);
        return ResponseEntity.ok(ApiResponse.success(200, "Task deleted", null));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        TaskResponse response = taskService.updateStatus(taskId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Status updated", response));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/assignee")
    public ResponseEntity<ApiResponse<TaskResponse>> updateAssignee(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateTaskAssigneeRequest request) {
        TaskResponse response = taskService.updateAssignee(taskId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Assignee updated", response));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/priority")
    public ResponseEntity<ApiResponse<TaskResponse>> updatePriority(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateTaskPriorityRequest request) {
        TaskResponse response = taskService.updatePriority(taskId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Priority updated", response));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/due-date")
    public ResponseEntity<ApiResponse<TaskResponse>> updateDueDate(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateTaskDueDateRequest request) {
        TaskResponse response = taskService.updateDueDate(taskId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Due date updated", response));
    }

    @PatchMapping("/api/v1/tasks/{taskId}/move")
    public ResponseEntity<ApiResponse<TaskResponse>> moveTask(
            @PathVariable UUID taskId,
            @Valid @RequestBody MoveTaskRequest request) {
        TaskResponse response = taskService.moveTask(taskId, request);
        return ResponseEntity.ok(ApiResponse.success(200, "Task moved", response));
    }

    @PostMapping("/api/v1/tasks/{taskId}/subtasks")
    public ResponseEntity<ApiResponse<TaskResponse>> createSubtask(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateTaskRequest request) {
        TaskResponse response = taskService.createSubtask(taskId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Subtask created", response));
    }
}
