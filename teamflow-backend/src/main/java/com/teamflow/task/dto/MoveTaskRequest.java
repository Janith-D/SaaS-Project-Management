package com.teamflow.task.dto;

import com.teamflow.task.enums.TaskStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MoveTaskRequest {
    @NotNull(message = "New status is required")
    private TaskStatus newStatus;

    private int position;
}
