package com.teamflow.common.event;

import lombok.Getter;

import java.util.UUID;

@Getter
public class MemberInvitedEvent extends BaseEvent {
    private final UUID invitationId;
    private final UUID workspaceId;
    private final String email;
    private final UUID invitedBy;

    public MemberInvitedEvent(Object source, UUID invitationId, UUID workspaceId, String email, UUID invitedBy) {
        super(source);
        this.invitationId = invitationId;
        this.workspaceId = workspaceId;
        this.email = email;
        this.invitedBy = invitedBy;
    }
}
