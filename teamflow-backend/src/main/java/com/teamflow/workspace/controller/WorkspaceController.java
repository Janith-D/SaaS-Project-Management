package com.teamflow.workspace.controller;

import com.teamflow.common.response.ApiResponse;
import com.teamflow.user.entity.User;
import com.teamflow.workspace.dto.*;
import com.teamflow.workspace.enums.WorkspaceMemberRole;
import com.teamflow.workspace.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceResponse>> createWorkspace(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateWorkspaceRequest request) {
        WorkspaceResponse response = workspaceService.createWorkspace(user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Workspace created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceResponse>>> getUserWorkspaces(@AuthenticationPrincipal User user) {
        List<WorkspaceResponse> workspaces = workspaceService.getUserWorkspaces(user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Workspaces retrieved", workspaces));
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<ApiResponse<WorkspaceResponse>> getWorkspace(@PathVariable UUID workspaceId) {
        WorkspaceResponse response = workspaceService.getWorkspace(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(200, "Workspace retrieved", response));
    }

    @PutMapping("/{workspaceId}")
    public ResponseEntity<ApiResponse<WorkspaceResponse>> updateWorkspace(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateWorkspaceRequest request) {
        WorkspaceResponse response = workspaceService.updateWorkspace(workspaceId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Workspace updated", response));
    }

    @PatchMapping("/{workspaceId}/archive")
    public ResponseEntity<ApiResponse<Void>> archiveWorkspace(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal User user) {
        workspaceService.archiveWorkspace(workspaceId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Workspace archived", null));
    }

    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkspace(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal User user) {
        workspaceService.deleteWorkspace(workspaceId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Workspace deleted", null));
    }

    @GetMapping("/{workspaceId}/my-role")
    public ResponseEntity<ApiResponse<WorkspaceMemberRole>> getMyRole(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal User user) {
        WorkspaceMemberRole role = workspaceService.getMyRole(workspaceId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Role retrieved", role));
    }
}
