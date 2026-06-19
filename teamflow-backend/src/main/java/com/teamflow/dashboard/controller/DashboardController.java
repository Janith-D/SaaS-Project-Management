package com.teamflow.dashboard.controller;

import com.teamflow.common.response.ApiResponse;
import com.teamflow.common.security.PermissionService;
import com.teamflow.dashboard.dto.ProjectDashboardResponse;
import com.teamflow.dashboard.dto.UserDashboardResponse;
import com.teamflow.dashboard.dto.WorkspaceDashboardResponse;
import com.teamflow.dashboard.service.DashboardService;
import com.teamflow.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final PermissionService permissionService;

    @GetMapping("/workspaces/{workspaceId}/dashboard")
    public ResponseEntity<ApiResponse<WorkspaceDashboardResponse>> getWorkspaceDashboard(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal User user) {
        permissionService.requireWorkspaceAccess(user.getId(), workspaceId);
        WorkspaceDashboardResponse dashboard = dashboardService.getWorkspaceDashboard(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(200, "Workspace dashboard fetched successfully", dashboard));
    }

    @GetMapping("/projects/{projectId}/dashboard")
    public ResponseEntity<ApiResponse<ProjectDashboardResponse>> getProjectDashboard(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user) {
        permissionService.requireProjectAccess(user.getId(), projectId);
        ProjectDashboardResponse dashboard = dashboardService.getProjectDashboard(projectId);
        return ResponseEntity.ok(ApiResponse.success(200, "Project dashboard fetched successfully", dashboard));
    }

    @GetMapping("/users/me/dashboard")
    public ResponseEntity<ApiResponse<UserDashboardResponse>> getUserDashboard(
            @AuthenticationPrincipal User user) {
        UserDashboardResponse dashboard = dashboardService.getUserDashboard(user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "User dashboard fetched successfully", dashboard));
    }
}
