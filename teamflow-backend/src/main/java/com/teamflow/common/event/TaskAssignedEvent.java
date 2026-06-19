package com.teamflow.common.event;

import lombok.Getter;

import java.util.UUID;

@Getter
public class TaskAssignedEvent extends BaseEvent {
    private final UUID taskId;
    private final String taskTitle;
    private final UUID projectId;
    private final UUID workspaceId;
    private final UUID assigneeId;
    private final UUID assignedBy;

    public TaskAssignedEvent(Object source, UUID taskId, String taskTitle, UUID projectId, UUID workspaceId,
                             UUID assigneeId, UUID assignedBy) {
        super(source);
        this.taskId = taskId;
        this.taskTitle = taskTitle;
        this.projectId = projectId;
        this.workspaceId = workspaceId;
        this.assigneeId = assigneeId;
        this.assignedBy = assignedBy;
    }
}
