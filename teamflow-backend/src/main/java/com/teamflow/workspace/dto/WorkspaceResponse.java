package com.teamflow.workspace.dto;

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
public class WorkspaceResponse {
    private UUID id;
    private String name;
    private String description;
    private String logoUrl;
    private String slug;
    private UUID ownerId;
    private String ownerName;
    private boolean archived;
    private long memberCount;
    private long projectCount;
    private String plan;
    private LocalDateTime createdAt;
}
