package com.teamflow.workspace.dto;

import com.teamflow.workspace.enums.InvitationStatus;
import com.teamflow.workspace.enums.WorkspaceMemberRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvitationResponse {
    private UUID id;
    private UUID workspaceId;
    private String workspaceName;
    private String email;
    private WorkspaceMemberRole role;
    private InvitationStatus status;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
