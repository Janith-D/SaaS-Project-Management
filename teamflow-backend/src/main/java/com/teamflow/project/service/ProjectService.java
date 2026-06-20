package com.teamflow.project.service;

import com.teamflow.common.exception.BadRequestException;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.notification.enums.NotificationType;
import com.teamflow.notification.service.NotificationService;
import com.teamflow.project.dto.*;
import com.teamflow.project.entity.Project;
import com.teamflow.project.entity.ProjectMember;
import com.teamflow.project.enums.ProjectMemberRole;
import com.teamflow.project.enums.ProjectStatus;
import com.teamflow.project.repository.ProjectMemberRepository;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.task.repository.TaskRepository;
import com.teamflow.user.entity.User;
import com.teamflow.user.service.UserService;
import com.teamflow.workspace.entity.Workspace;
import com.teamflow.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;
    private final WorkspaceRepository workspaceRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public ProjectResponse createProject(UUID workspaceId, UUID userId, CreateProjectRequest request) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
        User creator = userService.getUserById(userId);

        Project project = Project.builder()
                .workspace(workspace)
                .name(request.getName())
                .description(request.getDescription())
                .status(ProjectStatus.PLANNING)
                .deadline(request.getDeadline())
                .archived(false)
                .createdBy(creator)
                .build();
        project = projectRepository.save(project);

        ProjectMember manager = ProjectMember.builder()
                .project(project)
                .user(creator)
                .role(ProjectMemberRole.PROJECT_MANAGER)
                .build();
        memberRepository.save(manager);

        return toProjectResponse(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getWorkspaceProjects(UUID workspaceId) {
        return projectRepository.findByWorkspaceIdAndArchivedFalseOrderByCreatedAtDesc(workspaceId).stream()
                .map(this::toProjectResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID projectId) {
        Project project = findProject(projectId);
        return toProjectResponse(project);
    }

    @Transactional
    public ProjectResponse updateProject(UUID projectId, UUID userId, UpdateProjectRequest request) {
        Project project = findProject(projectId);
        checkManager(project, userId);

        if (request.getName() != null) project.setName(request.getName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getDeadline() != null) project.setDeadline(request.getDeadline());

        project = projectRepository.save(project);
        return toProjectResponse(project);
    }

    @Transactional
    public ProjectResponse updateProjectStatus(UUID projectId, UUID userId, UpdateProjectStatusRequest request) {
        Project project = findProject(projectId);
        checkManager(project, userId);
        ProjectStatus oldStatus = project.getStatus();
        project.setStatus(request.getStatus());
        project = projectRepository.save(project);

        if (request.getStatus() == ProjectStatus.COMPLETED && oldStatus != ProjectStatus.COMPLETED) {
            List<ProjectMember> members = memberRepository.findByProjectId(projectId);
            for (ProjectMember member : members) {
                if (!member.getUser().getId().equals(userId)) {
                    notificationService.createNotification(
                            member.getUser().getId(),
                            NotificationType.PROJECT_COMPLETED,
                            "Project Completed: " + project.getName(),
                            "Project \"" + project.getName() + "\" has been marked as completed",
                            "PROJECT",
                            projectId
                    );
                }
            }
        }

        return toProjectResponse(project);
    }

    @Transactional
    public void deleteProject(UUID projectId, UUID userId) {
        Project project = findProject(projectId);
        checkManager(project, userId);
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectMemberResponse addMember(UUID projectId, UUID userId, AddProjectMemberRequest request) {
        Project project = findProject(projectId);
        checkManager(project, userId);

        if (memberRepository.existsByProjectIdAndUserId(projectId, request.getUserId())) {
            throw new BadRequestException("User is already a project member");
        }

        User memberUser = userService.getUserById(request.getUserId());
        ProjectMember member = ProjectMember.builder()
                .project(project)
                .user(memberUser)
                .role(request.getRole())
                .build();
        member = memberRepository.save(member);

        return toProjectMemberResponse(member);
    }

    @Transactional(readOnly = true)
    public List<ProjectMemberResponse> getProjectMembers(UUID projectId) {
        return memberRepository.findByProjectId(projectId).stream()
                .map(this::toProjectMemberResponse)
                .toList();
    }

    @Transactional
    public void removeMember(UUID projectId, UUID memberId, UUID userId) {
        Project project = findProject(projectId);
        checkManager(project, userId);
        memberRepository.deleteById(memberId);
    }

    private Project findProject(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    private void checkManager(Project project, UUID userId) {
        ProjectMember member = memberRepository.findByProjectIdAndUserId(project.getId(), userId)
                .orElseThrow(() -> new BadRequestException("Not a project member"));
        if (member.getRole() != ProjectMemberRole.PROJECT_MANAGER) {
            throw new BadRequestException("Only project managers can perform this action");
        }
    }

    private ProjectResponse toProjectResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .workspaceId(project.getWorkspace().getId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .deadline(project.getDeadline())
                .archived(project.isArchived())
                .createdBy(project.getCreatedBy().getId())
                .createdByName(project.getCreatedBy().getFullName())
                .memberCount(memberRepository.countByProjectId(project.getId()))
                .taskCount(taskRepository.countByProjectId(project.getId()))
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    private ProjectMemberResponse toProjectMemberResponse(ProjectMember member) {
        return ProjectMemberResponse.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .fullName(member.getUser().getFullName())
                .email(member.getUser().getEmail())
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
