package com.teamflow.workspace.dto;

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
public class WorkspaceMemberResponse {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private WorkspaceMemberRole role;
    private LocalDateTime joinedAt;
}
