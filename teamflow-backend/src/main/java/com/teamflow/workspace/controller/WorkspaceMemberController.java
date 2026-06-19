package com.teamflow.workspace.controller;

import com.teamflow.common.response.ApiResponse;
import com.teamflow.user.entity.User;
import com.teamflow.workspace.dto.*;
import com.teamflow.workspace.service.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces/{workspaceId}/members")
@RequiredArgsConstructor
public class WorkspaceMemberController {

    private final WorkspaceService workspaceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceMemberResponse>>> getMembers(@PathVariable UUID workspaceId) {
        List<WorkspaceMemberResponse> members = workspaceService.getWorkspaceMembers(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(200, "Members retrieved", members));
    }

    @PatchMapping("/{memberId}/role")
    public ResponseEntity<ApiResponse<Void>> updateMemberRole(
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateMemberRoleRequest request) {
        workspaceService.updateMemberRole(workspaceId, memberId, request, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Role updated", null));
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberId,
            @AuthenticationPrincipal User user) {
        workspaceService.removeMember(workspaceId, memberId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Member removed", null));
    }
}
