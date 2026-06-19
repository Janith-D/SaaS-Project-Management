package com.teamflow.subscription.controller;

import com.teamflow.common.response.ApiResponse;
import com.teamflow.subscription.dto.*;
import com.teamflow.subscription.service.SubscriptionService;
import com.teamflow.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping("/api/v1/subscription-plans")
    public ResponseEntity<ApiResponse<List<SubscriptionPlanResponse>>> getAllPlans() {
        List<SubscriptionPlanResponse> plans = subscriptionService.getAllPlans();
        return ResponseEntity.ok(ApiResponse.success(200, "Plans retrieved", plans));
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/subscription")
    public ResponseEntity<ApiResponse<WorkspaceSubscriptionResponse>> getWorkspaceSubscription(
            @PathVariable UUID workspaceId) {
        WorkspaceSubscriptionResponse subscription = subscriptionService.getWorkspaceSubscription(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(200, "Subscription retrieved", subscription));
    }

    @PostMapping("/api/v1/workspaces/{workspaceId}/subscription/change-plan")
    public ResponseEntity<ApiResponse<WorkspaceSubscriptionResponse>> changePlan(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePlanRequest request) {
        WorkspaceSubscriptionResponse response = subscriptionService.changePlan(workspaceId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Plan changed", response));
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/usage")
    public ResponseEntity<ApiResponse<WorkspaceUsageResponse>> getUsage(@PathVariable UUID workspaceId) {
        WorkspaceUsageResponse usage = subscriptionService.getWorkspaceUsage(workspaceId);
        return ResponseEntity.ok(ApiResponse.success(200, "Usage retrieved", usage));
    }
}
