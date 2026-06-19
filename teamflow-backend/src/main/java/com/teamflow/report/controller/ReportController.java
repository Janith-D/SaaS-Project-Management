package com.teamflow.report.controller;

import com.teamflow.common.response.ApiResponse;
import com.teamflow.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/api/v1/projects/{projectId}/reports/pdf")
    public ResponseEntity<byte[]> getProjectPdf(@PathVariable UUID projectId) {
        byte[] pdfBytes = reportService.generateProjectPdf(projectId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=project-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/api/v1/workspaces/{workspaceId}/reports/pdf")
    public ResponseEntity<byte[]> getWorkspacePdf(@PathVariable UUID workspaceId) {
        byte[] pdfBytes = reportService.generateWorkspacePdf(workspaceId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=workspace-report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/api/v1/projects/{projectId}/reports/excel")
    public ResponseEntity<byte[]> getProjectExcel(@PathVariable UUID projectId) {
        byte[] excelBytes = reportService.generateProjectExcel(projectId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=project-report.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelBytes);
    }
}
