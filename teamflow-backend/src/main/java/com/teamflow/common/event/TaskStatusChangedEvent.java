package com.teamflow.common.event;

import lombok.Getter;

import java.util.UUID;

@Getter
public class TaskStatusChangedEvent extends BaseEvent {
    private final UUID taskId;
    private final String taskTitle;
    private final UUID projectId;
    private final UUID workspaceId;
    private final String oldStatus;
    private final String newStatus;
    private final UUID changedBy;

    public TaskStatusChangedEvent(Object source, UUID taskId, String taskTitle, UUID projectId, UUID workspaceId,
                                  String oldStatus, String newStatus, UUID changedBy) {
        super(source);
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.projectId = projectId;
        this.workspaceId = workspaceId;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedBy = changedBy;
    }
}
