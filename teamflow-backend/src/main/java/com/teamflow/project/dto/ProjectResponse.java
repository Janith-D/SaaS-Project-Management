package com.teamflow.project.dto;

import com.teamflow.project.enums.ProjectStatus;
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
public class ProjectResponse {
    private UUID id;
    private UUID workspaceId;
    private String name;
    private String description;
    private ProjectStatus status;
    private LocalDateTime deadline;
    private boolean archived;
    private UUID createdBy;
    private String createdByName;
    private long memberCount;
    private long taskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
