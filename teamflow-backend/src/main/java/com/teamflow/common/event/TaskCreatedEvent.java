package com.teamflow.common.event;

import lombok.Getter;

import java.util.UUID;

@Getter
public class TaskCreatedEvent extends BaseEvent {
    private final UUID taskId;
    private final String taskTitle;
    private final UUID projectId;
    private final UUID workspaceId;
    private final UUID reporterId;

    public TaskCreatedEvent(Object source, UUID taskId, String taskTitle, UUID projectId, UUID workspaceId, UUID reporterId) {
        super(source);
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.projectId = projectId;
        this.workspaceId = workspaceId;
        this.reporterId = reporterId;
    }
}
