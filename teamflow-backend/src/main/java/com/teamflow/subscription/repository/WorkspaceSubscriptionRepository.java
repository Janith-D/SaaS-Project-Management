package com.teamflow.subscription.repository;

import com.teamflow.subscription.entity.WorkspaceSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface WorkspaceSubscriptionRepository extends JpaRepository<WorkspaceSubscription, UUID> {
    Optional<WorkspaceSubscription> findByWorkspaceId(UUID workspaceId);
}
