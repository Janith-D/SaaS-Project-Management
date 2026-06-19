package com.teamflow.comment.service;

import com.teamflow.comment.dto.CommentResponse;
import com.teamflow.comment.dto.CreateCommentRequest;
import com.teamflow.comment.dto.UpdateCommentRequest;
import com.teamflow.comment.entity.Comment;
import com.teamflow.comment.repository.CommentRepository;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.task.entity.Task;
import com.teamflow.task.repository.TaskRepository;
import com.teamflow.user.entity.User;
import com.teamflow.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;

    @Transactional
    public CommentResponse createComment(UUID taskId, UUID userId, CreateCommentRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User author = userService.getUserById(userId);

        Comment comment = Comment.builder()
                .task(task)
                .author(author)
                .content(request.getContent())
                .build();
        comment = commentRepository.save(comment);

        return toCommentResponse(comment);
    }

    public List<CommentResponse> getTaskComments(UUID taskId) {
        return commentRepository.findByTaskIdOrderByCreatedAtAsc(taskId).stream()
                .map(this::toCommentResponse)
                .toList();
    }

    @Transactional
    public CommentResponse updateComment(UUID commentId, UUID userId, UpdateCommentRequest request) {
        Comment comment = findComment(commentId);
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not your comment");
        }
        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        return toCommentResponse(comment);
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID userId) {
        Comment comment = findComment(commentId);
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new org.springframework.security.access.AccessDeniedException("Not your comment");
        }
        commentRepository.delete(comment);
    }

    private Comment findComment(UUID commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
    }

    private CommentResponse toCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .taskId(comment.getTask().getId())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getFullName())
                .authorProfileImage(comment.getAuthor().getProfileImageUrl())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
