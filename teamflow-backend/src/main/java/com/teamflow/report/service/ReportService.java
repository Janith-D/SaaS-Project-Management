package com.teamflow.report.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.teamflow.project.entity.Project;
import com.teamflow.project.repository.ProjectRepository;
import com.teamflow.task.entity.Task;
import com.teamflow.task.repository.TaskRepository;
import com.teamflow.workspace.entity.Workspace;
import com.teamflow.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final WorkspaceRepository workspaceRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public byte[] generateProjectPdf(UUID projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        List<Task> tasks = taskRepository.findByProjectIdOrderByPositionAsc(projectId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            document.add(new Paragraph("Project Report: " + (project != null ? project.getName() : "N/A")));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(5);
            table.addCell("Title");
            table.addCell("Status");
            table.addCell("Priority");
            table.addCell("Assignee");
            table.addCell("Due Date");

            for (Task task : tasks) {
                table.addCell(task.getTitle());
                table.addCell(task.getStatus().name());
                table.addCell(task.getPriority().name());
                table.addCell(task.getAssignee() != null ? task.getAssignee().getFullName() : "Unassigned");
                table.addCell(task.getDueDate() != null ? task.getDueDate().toString() : "N/A");
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }

        return baos.toByteArray();
    }

    public byte[] generateWorkspacePdf(UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId).orElse(null);
        List<Project> projects = projectRepository.findByWorkspaceIdOrderByCreatedAtDesc(workspaceId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document();
        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            document.add(new Paragraph("Workspace Report: " + (workspace != null ? workspace.getName() : "N/A")));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.addCell("Project Name");
            table.addCell("Status");
            table.addCell("Tasks");
            table.addCell("Created");

            for (Project project : projects) {
                long taskCount = taskRepository.countByProjectId(project.getId());
                table.addCell(project.getName());
                table.addCell(project.getStatus().name());
                table.addCell(String.valueOf(taskCount));
                table.addCell(project.getCreatedAt() != null ? project.getCreatedAt().toLocalDate().toString() : "N/A");
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }

        return baos.toByteArray();
    }

    public byte[] generateProjectExcel(UUID projectId) {
        Project project = projectRepository.findById(projectId).orElse(null);
        List<Task> tasks = taskRepository.findByProjectIdOrderByPositionAsc(projectId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook()) {
            org.apache.poi.xssf.usermodel.XSSFSheet sheet = workbook.createSheet("Tasks");

            String[] headers = {"Title", "Status", "Priority", "Type", "Assignee", "Due Date"};
            org.apache.poi.xssf.usermodel.XSSFRow headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (Task task : tasks) {
                org.apache.poi.xssf.usermodel.XSSFRow row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(task.getTitle());
                row.createCell(1).setCellValue(task.getStatus().name());
                row.createCell(2).setCellValue(task.getPriority().name());
                row.createCell(3).setCellValue(task.getType().name());
                row.createCell(4).setCellValue(task.getAssignee() != null ? task.getAssignee().getFullName() : "Unassigned");
                row.createCell(5).setCellValue(task.getDueDate() != null ? task.getDueDate().toString() : "");
            }

            workbook.write(baos);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel", e);
        }

        return baos.toByteArray();
    }
}
