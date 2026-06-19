package com.teamflow.task.dto;

import com.teamflow.task.enums.TaskPriority;
import com.teamflow.task.enums.TaskType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CreateTaskRequest {
    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 300)
    private String title;

    private String description;

    @NotNull(message = "Type is required")
    private TaskType type;

    @NotNull(message = "Priority is required")
    private TaskPriority priority;

    private UUID assigneeId;
    private LocalDateTime dueDate;
    private Double estimatedHours;
    private String labels;
    private UUID parentTaskId;
}
