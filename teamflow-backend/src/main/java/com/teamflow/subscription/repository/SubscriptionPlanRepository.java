package com.teamflow.subscription.repository;

import com.teamflow.subscription.entity.SubscriptionPlan;
import com.teamflow.subscription.enums.SubscriptionPlanCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, UUID> {
    Optional<SubscriptionPlan> findByCode(SubscriptionPlanCode code);
}
