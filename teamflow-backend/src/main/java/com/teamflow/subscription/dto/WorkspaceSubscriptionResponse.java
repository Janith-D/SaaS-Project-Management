package com.teamflow.subscription.dto;

import com.teamflow.subscription.enums.SubscriptionPlanCode;
import com.teamflow.subscription.enums.SubscriptionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceSubscriptionResponse {
    private UUID id;
    private UUID workspaceId;
    private UUID planId;
    private String planName;
    private SubscriptionPlanCode planCode;
    private SubscriptionStatus status;
    private int maxMembers;
    private int maxProjects;
    private long storageBytes;
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
}
