package com.teamflow.task.dto;

import com.teamflow.task.enums.TaskPriority;
import com.teamflow.task.enums.TaskStatus;
import com.teamflow.task.enums.TaskType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskFilterRequest {
    private TaskStatus status;
    private TaskPriority priority;
    private TaskType type;
    private UUID assigneeId;
    private String keyword;
}
