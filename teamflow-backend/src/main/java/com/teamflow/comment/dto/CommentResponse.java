package com.teamflow.comment.dto;

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
public class CommentResponse {
    private UUID id;
    private UUID taskId;
    private UUID authorId;
    private String authorName;
    private String authorProfileImage;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
