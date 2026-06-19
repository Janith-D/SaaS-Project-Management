package com.teamflow.subscription.dto;

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
public class WorkspaceUsageResponse {
    private long currentMembers;
    private int maxMembers;
    private long currentProjects;
    private int maxProjects;
    private long currentStorageBytes;
    private long maxStorageBytes;
    private boolean membersLimitExceeded;
    private boolean projectsLimitExceeded;
    private boolean storageLimitExceeded;
}
