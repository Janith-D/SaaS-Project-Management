package com.teamflow.project.controller;

import com.teamflow.common.response.ApiResponse;
import com.teamflow.project.dto.*;
import com.teamflow.project.service.ProjectService;
import com.teamflow.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping("/api/v1/workspaces/{workspaceId}/projects")
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateProjectRequest request) {
        ProjectResponse response = projectService.createProject(workspaceId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Project created", response));
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/projects")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getWorkspaceProjects(@PathVariable UUID workspaceId) {
        List<ProjectResponse> projects = projectService.getWorkspaceProjects(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(200, "Projects retrieved", projects));
    }

    @GetMapping("/api/v1/projects/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProject(@PathVariable UUID projectId) {
        ProjectResponse response = projectService.getProject(projectId);
        return ResponseEntity.ok(ApiResponse.success(200, "Project retrieved", response));
    }

    @PutMapping("/api/v1/projects/{projectId}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProjectRequest request) {
        ProjectResponse response = projectService.updateProject(projectId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Project updated", response));
    }

    @PatchMapping("/api/v1/projects/{projectId}/status")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProjectStatus(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateProjectStatusRequest request) {
        ProjectResponse response = projectService.updateProjectStatus(projectId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Project status updated", response));
    }

    @DeleteMapping("/api/v1/projects/{projectId}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user) {
        projectService.deleteProject(projectId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Project deleted", null));
    }

    @PostMapping("/api/v1/projects/{projectId}/members")
    public ResponseEntity<ApiResponse<ProjectMemberResponse>> addMember(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody AddProjectMemberRequest request) {
        ProjectMemberResponse response = projectService.addMember(projectId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Member added", response));
    }

    @GetMapping("/api/v1/projects/{projectId}/members")
    public ResponseEntity<ApiResponse<List<ProjectMemberResponse>>> getProjectMembers(@PathVariable UUID projectId) {
        List<ProjectMemberResponse> members = projectService.getProjectMembers(projectId);
        return ResponseEntity.ok(ApiResponse.success(200, "Members retrieved", members));
    }

    @DeleteMapping("/api/v1/projects/{projectId}/members/{memberId}")
    public ResponseEntity<ApiResponse<Void>> removeProjectMember(
            @PathVariable UUID projectId,
            @PathVariable UUID memberId,
            @AuthenticationPrincipal User user) {
        projectService.removeMember(projectId, memberId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Member removed", null));
    }
}
