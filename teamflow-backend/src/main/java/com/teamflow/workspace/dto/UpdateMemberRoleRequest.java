package com.teamflow.workspace.dto;

import com.teamflow.workspace.enums.WorkspaceMemberRole;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMemberRoleRequest {
    @NotNull(message = "Role is required")
    private WorkspaceMemberRole role;
}
