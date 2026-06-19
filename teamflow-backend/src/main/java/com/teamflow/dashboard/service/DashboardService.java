package com.teamflow.dashboard.service;

import com.teamflow.dashboard.dto.ProjectDashboardResponse;
import com.teamflow.dashboard.dto.UserDashboardResponse;
import com.teamflow.dashboard.dto.WorkspaceDashboardResponse;
import com.teamflow.project.repository.ProjectMemberRepository;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.task.repository.TaskRepository;
import com.teamflow.workspace.repository.WorkspaceMemberRepository;
import com.teamflow.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final TaskRepository taskRepository;

    public WorkspaceDashboardResponse getWorkspaceDashboard(UUID workspaceId) {
        long totalProjects = projectRepository.countByWorkspaceId(workspaceId);
        long activeProjects = projectRepository.countByWorkspaceIdAndStatus(workspaceId, "ACTIVE");
        long completedProjects = projectRepository.countByWorkspaceIdAndStatus(workspaceId, "COMPLETED");
        long totalMembers = workspaceMemberRepository.countByWorkspaceId(workspaceId);
        long totalTasks = taskRepository.countByProjectId(workspaceId);

        return WorkspaceDashboardResponse.builder()
                .totalProjects(totalProjects)
                .activeProjects(activeProjects)
                .completedProjects(completedProjects)
                .totalMembers(totalMembers)
                .totalTasks(totalTasks)
                .overdueTasks(0)
                .completionPercentage(totalTasks > 0 ? (double) completedProjects / totalProjects * 100 : 0)
                .tasksByStatus(new HashMap<>())
                .tasksByPriority(new HashMap<>())
                .build();
    }

    public ProjectDashboardResponse getProjectDashboard(UUID projectId) {
        long totalTasks = taskRepository.countByProjectId(projectId);
        long completedTasks = taskRepository.countByProjectIdAndStatus(projectId, "DONE");

        return ProjectDashboardResponse.builder()
                .totalTasks(totalTasks)
                .completedTasks(completedTasks)
                .blockedTasks(taskRepository.countByProjectIdAndStatus(projectId, "BLOCKED"))
                .overdueTasks(0)
                .averageCompletionTime(0)
                .tasksByStatus(new HashMap<>())
                .tasksByPriority(new HashMap<>())
                .tasksByMember(new HashMap<>())
                .build();
    }

    public UserDashboardResponse getUserDashboard(UUID userId) {
        return UserDashboardResponse.builder()
                .totalWorkspaces(workspaceMemberRepository.findByUserId(userId).size())
                .totalAssignedTasks(taskRepository.countByAssigneeIdAndStatusNot(userId, "DONE"))
                .overdueTasks(taskRepository.countByAssigneeIdAndDueDateBeforeAndStatusNot(userId, LocalDateTime.now(), "DONE"))
                .completedTasksThisWeek(0)
                .build();
    }
}
