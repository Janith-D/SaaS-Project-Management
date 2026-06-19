package com.teamflow.subscription.dto;

import com.teamflow.subscription.enums.SubscriptionPlanCode;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangePlanRequest {
    @NotNull(message = "Plan code is required")
    private SubscriptionPlanCode planCode;
}
