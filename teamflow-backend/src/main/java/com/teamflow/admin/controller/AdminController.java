package com.teamflow.admin.controller;

import com.teamflow.auditlog.dto.AuditLogResponse;
import com.teamflow.auditlog.enums.AuditEventType;
import com.teamflow.auditlog.service.AuditLogService;
import com.teamflow.common.response.ApiResponse;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.user.entity.User;
import com.teamflow.user.repository.UserRepository;
import com.teamflow.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AuditLogService auditLogService;
    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final ProjectRepository projectRepository;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(200, "Users retrieved", users));
    }

    @PatchMapping("/users/{userId}/disable")
    public ResponseEntity<ApiResponse<Void>> disableUser(@PathVariable UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(200, "User disabled", null));
    }

    @GetMapping("/workspaces")
    public ResponseEntity<ApiResponse<List>> getAllWorkspaces() {
        List workspaces = workspaceRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success(200, "Workspaces retrieved", workspaces));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAuditLogs(
            @RequestParam(required = false) UUID userId,
            @RequestParam(required = false) AuditEventType eventType) {

        List<AuditLogResponse> logs;
        if (userId != null) {
            logs = auditLogService.getLogsByUser(userId);
        } else if (eventType != null) {
            logs = auditLogService.getLogsByEventType(eventType);
        } else {
            logs = auditLogService.getAllLogs();
        }

        return ResponseEntity.ok(ApiResponse.success(200, "Audit logs retrieved", logs));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        long activeUsers = userRepository.findAll().stream().filter(User::isActive).count();
        stats.put("activeUsers", activeUsers);
        stats.put("totalWorkspaces", workspaceRepository.count());
        stats.put("totalProjects", projectRepository.count());
        return ResponseEntity.ok(ApiResponse.success(200, "Platform stats retrieved", stats));
    }
}
