package com.teamflow.workspace.controller;

import com.teamflow.common.response.ApiResponse;
import com.teamflow.user.entity.User;
import com.teamflow.workspace.dto.*;
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
@RequiredArgsConstructor
public class InvitationController {

    private final WorkspaceService workspaceService;

    @PostMapping("/api/v1/workspaces/{workspaceId}/invitations")
    public ResponseEntity<ApiResponse<InvitationResponse>> inviteMember(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody InviteMemberRequest request) {
        InvitationResponse response = workspaceService.inviteMember(workspaceId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Invitation sent", response));
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/invitations")
    public ResponseEntity<ApiResponse<List<InvitationResponse>>> getInvitations(@PathVariable UUID workspaceId) {
        List<InvitationResponse> invitations = workspaceService.getWorkspaceInvitations(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(200, "Invitations retrieved", invitations));
    }

    @PostMapping("/api/v1/invitations/{token}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptInvitation(
            @PathVariable String token,
            @AuthenticationPrincipal User user) {
        workspaceService.acceptInvitation(token, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Invitation accepted", null));
    }

    @PostMapping("/api/v1/invitations/{token}/decline")
    public ResponseEntity<ApiResponse<Void>> declineInvitation(
            @PathVariable String token,
            @AuthenticationPrincipal User user) {
        workspaceService.declineInvitation(token, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Invitation declined", null));
    }
}
