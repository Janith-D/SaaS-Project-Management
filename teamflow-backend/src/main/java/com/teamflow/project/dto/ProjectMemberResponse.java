package com.teamflow.project.dto;

import com.teamflow.project.enums.ProjectMemberRole;
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
public class ProjectMemberResponse {
    private UUID id;
    private UUID userId;
    private String fullName;
    private String email;
    private ProjectMemberRole role;
    private LocalDateTime joinedAt;
}
