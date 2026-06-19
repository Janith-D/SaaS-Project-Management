package com.teamflow.attachment.dto;

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
public class AttachmentResponse {
    private UUID id;
    private UUID taskId;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private UUID uploadedBy;
    private String uploadedByName;
    private LocalDateTime createdAt;
}
