package com.teamflow.task.dto;

import com.teamflow.task.enums.TaskPriority;
import com.teamflow.task.enums.TaskStatus;
import com.teamflow.task.enums.TaskType;
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
public class TaskResponse {
    private UUID id;
    private UUID projectId;
    private UUID parentTaskId;
    private String title;
    private String description;
    private TaskType type;
    private TaskStatus status;
    private TaskPriority priority;
    private UUID assigneeId;
    private String assigneeName;
    private UUID reporterId;
    private String reporterName;
    private LocalDateTime dueDate;
    private Double estimatedHours;
    private Double actualHours;
    private String labels;
    private int position;
    private long subtaskCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
