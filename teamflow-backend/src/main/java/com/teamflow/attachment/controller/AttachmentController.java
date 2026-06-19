package com.teamflow.attachment.controller;

import com.teamflow.attachment.dto.AttachmentResponse;
import com.teamflow.attachment.service.AttachmentService;
import com.teamflow.common.response.ApiResponse;
import com.teamflow.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping(value = "/api/v1/tasks/{taskId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AttachmentResponse>> uploadAttachment(
            @PathVariable UUID taskId,
            @AuthenticationPrincipal User user,
            @RequestParam("file") MultipartFile file) {
        AttachmentResponse response = attachmentService.uploadAttachment(taskId, user.getId(), file);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(201, "Attachment uploaded", response));
    }

    @GetMapping("/api/v1/tasks/{taskId}/attachments")
    public ResponseEntity<ApiResponse<List<AttachmentResponse>>> getTaskAttachments(@PathVariable UUID taskId) {
        List<AttachmentResponse> attachments = attachmentService.getTaskAttachments(taskId);
        return ResponseEntity.ok(ApiResponse.success(200, "Attachments retrieved", attachments));
    }

    @GetMapping("/api/v1/attachments/{attachmentId}/download")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable UUID attachmentId) {
        Resource resource = attachmentService.downloadAttachment(attachmentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @DeleteMapping("/api/v1/attachments/{attachmentId}")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(
            @PathVariable UUID attachmentId,
            @AuthenticationPrincipal User user) {
        attachmentService.deleteAttachment(attachmentId, user.getId());
        return ResponseEntity.ok(ApiResponse.success(200, "Attachment deleted", null));
    }
}
