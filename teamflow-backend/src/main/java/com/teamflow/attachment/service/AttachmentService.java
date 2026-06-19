package com.teamflow.attachment.service;

import com.teamflow.attachment.dto.AttachmentResponse;
import com.teamflow.attachment.entity.Attachment;
import com.teamflow.attachment.repository.AttachmentRepository;
import com.teamflow.common.exception.ResourceNotFoundException;
import com.teamflow.common.storage.FileStorageService;
import com.teamflow.task.entity.Task;
import com.teamflow.task.repository.TaskRepository;
import com.teamflow.user.entity.User;
import com.teamflow.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final UserService userService;
    private final FileStorageService fileStorageService;

    @Transactional
    public AttachmentResponse uploadAttachment(UUID taskId, UUID userId, MultipartFile file) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
        User uploader = userService.getUserById(userId);

        String storagePath = fileStorageService.storeFile(file);

        Attachment attachment = Attachment.builder()
                .task(task)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .storagePath(storagePath)
                .uploadedBy(uploader)
                .build();
        attachment = attachmentRepository.save(attachment);

        return toAttachmentResponse(attachment);
    }

    public List<AttachmentResponse> getTaskAttachments(UUID taskId) {
        return attachmentRepository.findByTaskId(taskId).stream()
                .map(this::toAttachmentResponse)
                .toList();
    }

    public Resource downloadAttachment(UUID attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
        return fileStorageService.loadFile(attachment.getStoragePath());
    }

    @Transactional
    public void deleteAttachment(UUID attachmentId, UUID userId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
        fileStorageService.deleteFile(attachment.getStoragePath());
        attachmentRepository.delete(attachment);
    }

    private AttachmentResponse toAttachmentResponse(Attachment attachment) {
        return AttachmentResponse.builder()
                .id(attachment.getId())
                .taskId(attachment.getTask().getId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .uploadedBy(attachment.getUploadedBy().getId())
                .uploadedByName(attachment.getUploadedBy().getFullName())
                .createdAt(attachment.getCreatedAt())
                .build();
    }
}
