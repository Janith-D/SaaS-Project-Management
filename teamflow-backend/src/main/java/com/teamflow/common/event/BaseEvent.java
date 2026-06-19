package com.teamflow.common.event;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
public abstract class BaseEvent extends ApplicationEvent {
    private final LocalDateTime occurredAt;

    public BaseEvent(Object source) {
        super(source);
        this.occurredAt = LocalDateTime.now();
    }
}
