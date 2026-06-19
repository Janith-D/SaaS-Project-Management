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
public class ProjectDashboardResponse {
    private long totalTasks;
    private long completedTasks;
    private long blockedTasks;
    private long overdueTasks;
    private double averageCompletionTime;
    private Map<String, Long> tasksByStatus;
    private Map<String, Long> tasksByPriority;
    private Map<String, Long> tasksByMember;
}
