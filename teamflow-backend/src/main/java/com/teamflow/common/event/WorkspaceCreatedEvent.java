package com.teamflow.common.event;

import lombok.Getter;

import java.util.UUID;

@Getter
public class WorkspaceCreatedEvent extends BaseEvent {
    private final UUID workspaceId;
    private final String workspaceName;
    private final UUID ownerId;

    public WorkspaceCreatedEvent(Object source, UUID workspaceId, String workspaceName, UUID ownerId) {
        super(source);
        this.workspaceId = workspaceId;
        this.workspaceName = workspaceName;
        this.ownerId = ownerId;
    }
}
