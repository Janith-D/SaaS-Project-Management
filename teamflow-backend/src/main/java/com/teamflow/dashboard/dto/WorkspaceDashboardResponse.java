package com.teamflow.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceDashboardResponse {
    private long totalProjects;
    private long activeProjects;
    private long completedProjects;
    private long totalMembers;
    private long totalTasks;
    private long overdueTasks;
    private double completionPercentage;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksByPriority;
}
