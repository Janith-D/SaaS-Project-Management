package com.teamflow.workspace.service;

import com.teamflow.common.exception.BadRequestException;
import com.teamflow.common.exception.ForbiddenException;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.notification.enums.NotificationType;
import com.teamflow.notification.service.NotificationService;
import com.teamflow.user.entity.User;
import com.teamflow.user.service.UserService;
import com.teamflow.workspace.dto.*;
import com.teamflow.workspace.entity.Invitation;
import com.teamflow.workspace.entity.Workspace;
import com.teamflow.workspace.entity.WorkspaceMember;
import com.teamflow.workspace.enums.InvitationStatus;
import com.teamflow.workspace.enums.WorkspaceMemberRole;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.workspace.repository.InvitationRepository;
import com.teamflow.workspace.repository.WorkspaceMemberRepository;
import com.teamflow.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final InvitationRepository invitationRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    @Transactional
    public WorkspaceResponse createWorkspace(UUID ownerId, CreateWorkspaceRequest request) {
        User owner = userService.getUserById(ownerId);
        Workspace workspace = Workspace.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(owner)
                .archived(false)
                .build();
        workspace = workspaceRepository.save(workspace);

        WorkspaceMember ownerMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(owner)
                .role(WorkspaceMemberRole.WORKSPACE_OWNER)
                .build();
        memberRepository.save(ownerMember);

        return toWorkspaceResponse(workspace);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getUserWorkspaces(UUID userId) {
        List<WorkspaceMember> memberships = memberRepository.findByUserId(userId);
        return memberships.stream()
                .map(m -> toWorkspaceResponse(m.getWorkspace()))
                .toList();
    }

    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspace(UUID workspaceId) {
        Workspace workspace = findWorkspace(workspaceId);
        return toWorkspaceResponse(workspace);
    }

    @Transactional
    public WorkspaceResponse updateWorkspace(UUID workspaceId, UUID userId, UpdateWorkspaceRequest request) {
        Workspace workspace = findWorkspace(workspaceId);
        checkOwnerOrAdmin(workspaceId, userId);

        if (request.getName() != null) workspace.setName(request.getName());
        if (request.getDescription() != null) workspace.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) workspace.setLogoUrl(request.getLogoUrl());

        workspace = workspaceRepository.save(workspace);
        return toWorkspaceResponse(workspace);
    }

    @Transactional
    public void archiveWorkspace(UUID workspaceId, UUID userId) {
        Workspace workspace = findWorkspace(workspaceId);
        checkOwnerOrAdmin(workspaceId, userId);
        workspace.setArchived(true);
        workspaceRepository.save(workspace);
    }

    @Transactional
    public void deleteWorkspace(UUID workspaceId, UUID userId) {
        Workspace workspace = findWorkspace(workspaceId);
        if (!workspace.getOwner().getId().equals(userId)) {
            throw new BadRequestException("Only workspace owner can delete workspace");
        }
        workspaceRepository.delete(workspace);
    }

    @Transactional
    public InvitationResponse inviteMember(UUID workspaceId, UUID inviterId, InviteMemberRequest request) {
        Workspace workspace = findWorkspace(workspaceId);
        checkOwnerOrAdmin(workspaceId, inviterId);

        if (userService.getUserByEmail(request.getEmail()) != null) {
            User invitedUser = userService.getUserByEmail(request.getEmail());
            if (memberRepository.existsByWorkspaceIdAndUserId(workspaceId, invitedUser.getId())) {
                throw new BadRequestException("User is already a member of this workspace");
            }
        }

        invitationRepository.findByWorkspaceIdAndEmailAndStatus(workspaceId, request.getEmail(), InvitationStatus.PENDING)
                .ifPresent(inv -> { throw new BadRequestException("Pending invitation already exists for this email"); });

        User inviter = userService.getUserById(inviterId);
        Invitation invitation = Invitation.builder()
                .workspace(workspace)
                .email(request.getEmail())
                .token(UUID.randomUUID().toString())
                .role(request.getRole())
                .invitedBy(inviter)
                .status(InvitationStatus.PENDING)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        invitation = invitationRepository.save(invitation);

        // Notify invited user if they exist
        try {
            User invitedUser = userService.getUserByEmail(request.getEmail());
            if (invitedUser != null) {
                notificationService.createNotification(
                        invitedUser.getId(),
                        NotificationType.INVITATION_SENT,
                        "Workspace Invitation",
                        "You have been invited to join \"" + workspace.getName() + "\" by " + inviter.getFullName(),
                        "WORKSPACE",
                        workspaceId
                );
            }
        } catch (Exception ignored) {
            // User not found by email, skip in-app notification
        }

        return toInvitationResponse(invitation);
    }

    @Transactional(readOnly = true)
    public List<InvitationResponse> getWorkspaceInvitations(UUID workspaceId) {
        return invitationRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toInvitationResponse)
                .toList();
    }

    @Transactional
    public void acceptInvitation(String token, UUID userId) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid invitation token"));

        if (invitation.isExpired() || invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException("Invitation is expired or already processed");
        }

        User user = userService.getUserById(userId);
        if (!user.getEmail().equals(invitation.getEmail())) {
            throw new BadRequestException("This invitation was sent to a different email");
        }

        WorkspaceMember member = WorkspaceMember.builder()
                .workspace(invitation.getWorkspace())
                .user(user)
                .role(invitation.getRole())
                .build();
        memberRepository.save(member);

        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitationRepository.save(invitation);

        // Notify workspace owner/admins that invitation was accepted
        List<WorkspaceMember> admins = memberRepository.findByWorkspaceId(invitation.getWorkspace().getId()).stream()
                .filter(m -> m.getRole() == WorkspaceMemberRole.WORKSPACE_OWNER || m.getRole() == WorkspaceMemberRole.WORKSPACE_ADMIN)
                .toList();
        for (WorkspaceMember admin : admins) {
            if (!admin.getUser().getId().equals(userId)) {
                notificationService.createNotification(
                        admin.getUser().getId(),
                        NotificationType.INVITATION_SENT,
                        "Invitation Accepted",
                        user.getFullName() + " accepted the invitation to \"" + invitation.getWorkspace().getName() + "\"",
                        "WORKSPACE",
                        invitation.getWorkspace().getId()
                );
            }
        }
    }

    @Transactional
    public void declineInvitation(String token, UUID userId) {
        Invitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid invitation token"));

        User user = userService.getUserById(userId);
        if (!user.getEmail().equals(invitation.getEmail())) {
            throw new BadRequestException("This invitation was sent to a different email");
        }

        invitation.setStatus(InvitationStatus.DECLINED);
        invitationRepository.save(invitation);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceMemberResponse> getWorkspaceMembers(UUID workspaceId) {
        return memberRepository.findByWorkspaceId(workspaceId).stream()
                .map(this::toWorkspaceMemberResponse)
                .toList();
    }

    @Transactional
    public void updateMemberRole(UUID workspaceId, UUID memberId, UpdateMemberRoleRequest request, UUID userId) {
        checkOwnerOrAdmin(workspaceId, userId);
        WorkspaceMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (member.getRole() == WorkspaceMemberRole.WORKSPACE_OWNER) {
            throw new BadRequestException("Cannot change owner's role");
        }
        member.setRole(request.getRole());
        memberRepository.save(member);
    }

    @Transactional
    public void removeMember(UUID workspaceId, UUID memberId, UUID userId) {
        checkOwnerOrAdmin(workspaceId, userId);
        WorkspaceMember member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (member.getRole() == WorkspaceMemberRole.WORKSPACE_OWNER) {
            throw new BadRequestException("Cannot remove workspace owner");
        }
        memberRepository.delete(member);
    }

    @Transactional(readOnly = true)
    public WorkspaceMemberRole getMyRole(UUID workspaceId, UUID userId) {
        return memberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .map(WorkspaceMember::getRole)
                .orElseThrow(() -> new ForbiddenException("Not a member of this workspace"));
    }

    public long getMemberCount(UUID workspaceId) {
        return memberRepository.countByWorkspaceId(workspaceId);
    }

    public long getProjectCount(UUID workspaceId) {
        return projectRepository.countByWorkspaceId(workspaceId);
    }

    private Workspace findWorkspace(UUID workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));
    }

    private void checkOwnerOrAdmin(UUID workspaceId, UUID userId) {
        WorkspaceMember member = memberRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new BadRequestException("Not a member of this workspace"));
        if (member.getRole() != WorkspaceMemberRole.WORKSPACE_OWNER &&
                member.getRole() != WorkspaceMemberRole.WORKSPACE_ADMIN) {
            throw new BadRequestException("Insufficient permissions");
        }
    }

    private WorkspaceResponse toWorkspaceResponse(Workspace workspace) {
        return WorkspaceResponse.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .logoUrl(workspace.getLogoUrl())
                .slug(workspace.getName().toLowerCase().replaceAll("\\s+", "-"))
                .ownerId(workspace.getOwner().getId())
                .ownerName(workspace.getOwner().getFullName())
                .archived(workspace.isArchived())
                .memberCount(getMemberCount(workspace.getId()))
                .projectCount(getProjectCount(workspace.getId()))
                .plan("FREE")
                .createdAt(workspace.getCreatedAt())
                .build();
    }

    private InvitationResponse toInvitationResponse(Invitation invitation) {
        return InvitationResponse.builder()
                .id(invitation.getId())
                .workspaceId(invitation.getWorkspace().getId())
                .workspaceName(invitation.getWorkspace().getName())
                .email(invitation.getEmail())
                .role(invitation.getRole())
                .status(invitation.getStatus())
                .expiresAt(invitation.getExpiresAt())
                .createdAt(invitation.getCreatedAt())
                .build();
    }

    private WorkspaceMemberResponse toWorkspaceMemberResponse(WorkspaceMember member) {
        return WorkspaceMemberResponse.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .fullName(member.getUser().getFullName())
                .email(member.getUser().getEmail())
                .profileImageUrl(member.getUser().getProfileImageUrl())
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}
