package com.teamflow.common.event;

import lombok.Getter;

import java.util.UUID;

@Getter
public class UserRegisteredEvent extends BaseEvent {
    private final UUID userId;
    private final String email;
    private final String fullName;

    public UserRegisteredEvent(Object source, UUID userId, String email, String fullName) {
        super(source);
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
    }
}
