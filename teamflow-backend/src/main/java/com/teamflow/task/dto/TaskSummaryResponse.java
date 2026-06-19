package com.teamflow.task.dto;

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
public class TaskSummaryResponse {
    private UUID id;
    private String title;
    private String type;
    private String status;
    private String priority;
    private UUID assigneeId;
    private String assigneeName;
    private String assigneeImage;
    private LocalDateTime dueDate;
    private Integer position;
    private long subtaskCount;
    private long completedSubtaskCount;
}
