package com.teamflow.subscription.entity;

import com.teamflow.subscription.enums.SubscriptionPlanCode;
import jakarta.persistence.*;
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
@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private SubscriptionPlanCode code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_members", nullable = false)
    private Integer maxMembers;

    @Column(name = "max_projects", nullable = false)
    private Integer maxProjects;

    @Column(name = "storage_bytes", nullable = false)
    private Long storageBytes;

    @Column(name = "price_monthly", nullable = false)
    private Double priceMonthly;

    @Column(name = "price_yearly", nullable = false)
    private Double priceYearly;

    @Column(name = "is_active", nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
