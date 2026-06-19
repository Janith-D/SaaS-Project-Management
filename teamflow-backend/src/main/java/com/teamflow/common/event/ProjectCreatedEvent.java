package com.teamflow.common.event;

import lombok.Getter;

import java.util.UUID;

@Getter
public class ProjectCreatedEvent extends BaseEvent {
    private final UUID projectId;
    private final String projectName;
    private final UUID workspaceId;
    private final UUID createdBy;

    public ProjectCreatedEvent(Object source, UUID projectId, String projectName, UUID workspaceId, UUID createdBy) {
        super(source);
        this.projectId = projectId;
        this.projectName = projectName;
        this.workspaceId = workspaceId;
        this.createdBy = createdBy;
    }
}
