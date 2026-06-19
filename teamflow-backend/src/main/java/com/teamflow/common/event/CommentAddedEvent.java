package com.teamflow.common.event;

import lombok.Getter;

import java.util.UUID;

@Getter
public class CommentAddedEvent extends BaseEvent {
    private final UUID commentId;
    private final UUID taskId;
    private final UUID authorId;
    private final String content;

    public CommentAddedEvent(Object source, UUID commentId, UUID taskId, UUID authorId, String content) {
        super(source);
        this.commentId = commentId;
        this.taskId = taskId;
        this.authorId = authorId;
        this.content = content;
    }
}
