package com.teamflow.subscription.dto;

import com.teamflow.subscription.enums.SubscriptionPlanCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionPlanResponse {
    private UUID id;
    private String name;
    private SubscriptionPlanCode code;
    private String description;
    private int maxMembers;
    private int maxProjects;
    private long storageBytes;
    private double priceMonthly;
    private double priceYearly;
    private boolean active;
}
