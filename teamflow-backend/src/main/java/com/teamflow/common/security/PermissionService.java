package com.teamflow.common.security;

import com.teamflow.common.exception.ForbiddenException;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.project.entity.Project;
import com.teamflow.project.entity.ProjectMember;
import com.teamflow.project.enums.ProjectMemberRole;
import com.teamflow.project.repository.ProjectMemberRepository;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.task.entity.Task;
import com.teamflow.task.repository.TaskRepository;
import com.teamflow.workspace.entity.WorkspaceMember;
import com.teamflow.workspace.enums.WorkspaceMemberRole;
import com.teamflow.workspace.repository.WorkspaceMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.EnumSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PermissionService {

    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    private static final Set<WorkspaceMemberRole> WORKSPACE_ADMIN_ROLES = EnumSet.of(
            WorkspaceMemberRole.WORKSPACE_OWNER,
            WorkspaceMemberRole.WORKSPACE_ADMIN
    );

    private static final Set<WorkspaceMemberRole> WORKSPACE_WRITE_ROLES = EnumSet.of(
            WorkspaceMemberRole.WORKSPACE_OWNER,
            WorkspaceMemberRole.WORKSPACE_ADMIN,
            WorkspaceMemberRole.PROJECT_MANAGER,
            WorkspaceMemberRole.MEMBER
    );

    private static final Set<ProjectMemberRole> PROJECT_WRITE_ROLES = EnumSet.of(
            ProjectMemberRole.PROJECT_MANAGER,
            ProjectMemberRole.MEMBER
    );

    public WorkspaceMember getWorkspaceMember(UUID userId, UUID workspaceId) {
        return workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new ForbiddenException("You do not have access to this workspace"));
    }

    public void requireWorkspaceAccess(UUID userId, UUID workspaceId) {
        boolean hasAccess = workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, userId);
        if (!hasAccess) {
            throw new ForbiddenException("You do not have access to this workspace");
        }
    }

    public void requireWorkspaceAdmin(UUID userId, UUID workspaceId) {
        WorkspaceMember member = getWorkspaceMember(userId, workspaceId);
        if (!WORKSPACE_ADMIN_ROLES.contains(member.getRole())) {
            throw new ForbiddenException("You do not have permission to perform this action");
        }
    }

    public void requireWorkspaceOwner(UUID userId, UUID workspaceId) {
        WorkspaceMember member = getWorkspaceMember(userId, workspaceId);
        if (member.getRole() != WorkspaceMemberRole.WORKSPACE_OWNER) {
            throw new ForbiddenException("Only workspace owners can perform this action");
        }
    }

    public boolean canManageWorkspace(UUID userId, UUID workspaceId) {
        return workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .map(m -> WORKSPACE_ADMIN_ROLES.contains(m.getRole()))
                .orElse(false);
    }

    public boolean canCreateProject(UUID userId, UUID workspaceId) {
        return workspaceMemberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .map(m -> WORKSPACE_ADMIN_ROLES.contains(m.getRole()) ||
                        m.getRole() == WorkspaceMemberRole.PROJECT_MANAGER)
                .orElse(false);
    }

    public void requireCreateProject(UUID userId, UUID workspaceId) {
        if (!canCreateProject(userId, workspaceId)) {
            throw new ForbiddenException("You do not have permission to create projects");
        }
    }

    public ProjectMember getProjectMember(UUID userId, UUID projectId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> new ForbiddenException("You do not have access to this project"));
    }

    public void requireProjectAccess(UUID userId, UUID projectId) {
        boolean hasAccess = projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
        if (!hasAccess) {
            throw new ForbiddenException("You do not have access to this project");
        }
    }

    public boolean canManageTask(UUID userId, UUID taskId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        return canManageTaskForProject(userId, task.getProject().getId());
    }

    public boolean canManageTaskForProject(UUID userId, UUID projectId) {
        return projectMemberRepository.findByProjectIdAndUserId(projectId, userId)
                .map(m -> PROJECT_WRITE_ROLES.contains(m.getRole()))
                .orElse(false);
    }

    public void requireManageTask(UUID userId, UUID taskId) {
        if (!canManageTask(userId, taskId)) {
            throw new ForbiddenException("You do not have permission to manage this task");
        }
    }

    public boolean canViewProject(UUID userId, UUID projectId) {
        return projectMemberRepository.existsByProjectIdAndUserId(projectId, userId);
    }

    public void requireViewProject(UUID userId, UUID projectId) {
        if (!canViewProject(userId, projectId)) {
            throw new ForbiddenException("You do not have access to this project");
        }
    }
}
