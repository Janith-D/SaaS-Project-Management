package com.teamflow.comment.controller;

import com.teamflow.comment.dto.CommentResponse;
import com.teamflow.comment.dto.CreateCommentRequest;
import com.teamflow.comment.dto.UpdateCommentRequest;
import com.teamflow.comment.service.CommentService;
import com.teamflow.common.response.ApiResponse;
import com.teamflow.user.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/api/v1/tasks/{taskId}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createComment(taskId, user.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Comment added", response));
    }

    @GetMapping("/api/v1/tasks/{taskId}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getTaskComments(@PathVariable UUID taskId) {
        List<CommentResponse> comments = commentService.getTaskComments(taskId);
        return ResponseEntity.ok(ApiResponse.success(200, "Comments retrieved", comments));
    }

    @PutMapping("/api/v1/comments/{commentId}")
    public ResponseEntity<ApiResponse<CommentResponse>> updateComment(
            @PathVariable UUID commentId,
            @AuthenticationPrincipal User user,
            @Valid @RequestBody UpdateCommentRequest request) {
        CommentResponse response = commentService.updateComment(commentId, user.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(200, "Comment updated", response));
    }

    @DeleteMapping("/api/v1/comments/{commentId}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable UUID commentId,
            @AuthenticationPrincipal User user) {
        commentService.deleteComment(commentId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Comment deleted", null));
    }
}
