package com.teamflow.subscription.service;

import com.teamflow.common.exception.BadRequestException;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.subscription.dto.*;
import com.teamflow.subscription.entity.SubscriptionPlan;
import com.teamflow.subscription.entity.WorkspaceSubscription;
import com.teamflow.subscription.enums.SubscriptionPlanCode;
import com.teamflow.subscription.enums.SubscriptionStatus;
import com.teamflow.subscription.repository.SubscriptionPlanRepository;
import com.teamflow.subscription.repository.WorkspaceSubscriptionRepository;
import com.teamflow.workspace.entity.Workspace;
import com.teamflow.workspace.repository.WorkspaceMemberRepository;
import com.teamflow.workspace.repository.WorkspaceRepository;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.attachment.repository.AttachmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final WorkspaceSubscriptionRepository workspaceSubscriptionRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository memberRepository;
    private final ProjectRepository projectRepository;
    private final AttachmentRepository attachmentRepository;

    public List<SubscriptionPlanResponse> getAllPlans() {
        return planRepository.findAll().stream()
                .map(this::toPlanResponse)
                .toList();
    }

    public WorkspaceSubscriptionResponse getWorkspaceSubscription(UUID workspaceId) {
        WorkspaceSubscription subscription = workspaceSubscriptionRepository.findByWorkspaceId(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("No subscription found for this workspace"));
        return toSubscriptionResponse(subscription);
    }

    @Transactional
    public WorkspaceSubscriptionResponse changePlan(UUID workspaceId, UUID userId, ChangePlanRequest request) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found"));

        if (!workspace.getOwner().getId().equals(userId)) {
            throw new BadRequestException("Only workspace owner can change subscription");
        }

        SubscriptionPlan newPlan = planRepository.findByCode(request.getPlanCode())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));

        WorkspaceSubscription subscription = workspaceSubscriptionRepository.findByWorkspaceId(workspaceId)
                .orElse(null);

        if (subscription == null) {
            subscription = WorkspaceSubscription.builder()
                    .workspace(workspace)
                    .plan(newPlan)
                    .status(SubscriptionStatus.ACTIVE)
                    .build();
        } else {
            subscription.setPlan(newPlan);
            subscription.setStatus(SubscriptionStatus.ACTIVE);
        }

        subscription = workspaceSubscriptionRepository.save(subscription);
        return toSubscriptionResponse(subscription);
    }

    public WorkspaceUsageResponse getWorkspaceUsage(UUID workspaceId) {
        WorkspaceSubscription subscription = workspaceSubscriptionRepository.findByWorkspaceId(workspaceId)
                .orElse(null);

        SubscriptionPlan plan = subscription != null ? subscription.getPlan()
                : planRepository.findByCode(SubscriptionPlanCode.FREE)
                .orElseThrow(() -> new ResourceNotFoundException("Default plan not found"));

        long currentMembers = memberRepository.countByWorkspaceId(workspaceId);
        long currentProjects = projectRepository.countByWorkspaceId(workspaceId);
        long currentStorageBytes = 0;

        return WorkspaceUsageResponse.builder()
                .currentMembers(currentMembers)
                .maxMembers(plan.getMaxMembers())
                .currentProjects(currentProjects)
                .maxProjects(plan.getMaxProjects())
                .currentStorageBytes(currentStorageBytes)
                .maxStorageBytes(plan.getStorageBytes())
                .membersLimitExceeded(currentMembers > plan.getMaxMembers())
                .projectsLimitExceeded(currentProjects > plan.getMaxProjects())
                .storageLimitExceeded(currentStorageBytes > plan.getStorageBytes())
                .build();
    }

    private SubscriptionPlanResponse toPlanResponse(SubscriptionPlan plan) {
        return SubscriptionPlanResponse.builder()
                .id(plan.getId())
                .name(plan.getName())
                .code(plan.getCode())
                .description(plan.getDescription())
                .maxMembers(plan.getMaxMembers())
                .maxProjects(plan.getMaxProjects())
                .storageBytes(plan.getStorageBytes())
                .priceMonthly(plan.getPriceMonthly())
                .priceYearly(plan.getPriceYearly())
                .active(plan.isActive())
                .build();
    }

    private WorkspaceSubscriptionResponse toSubscriptionResponse(WorkspaceSubscription subscription) {
        return WorkspaceSubscriptionResponse.builder()
                .id(subscription.getId())
                .workspaceId(subscription.getWorkspace().getId())
                .planId(subscription.getPlan().getId())
                .planName(subscription.getPlan().getName())
                .planCode(subscription.getPlan().getCode())
                .status(subscription.getStatus())
                .maxMembers(subscription.getPlan().getMaxMembers())
                .maxProjects(subscription.getPlan().getMaxProjects())
                .storageBytes(subscription.getPlan().getStorageBytes())
                .startedAt(subscription.getStartedAt())
                .expiresAt(subscription.getExpiresAt())
                .build();
    }
}
