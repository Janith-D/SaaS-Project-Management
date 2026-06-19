package com.teamflow.project.dto;

import com.teamflow.project.enums.ProjectStatus;
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
public class UpdateProjectStatusRequest {
    @NotNull(message = "Status is required")
    private ProjectStatus status;
}
