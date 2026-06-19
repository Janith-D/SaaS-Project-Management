package com.teamflow.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KanbanBoardResponse {
    private List<KanbanColumn> columns;
    private UUID projectId;

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class KanbanColumn {
        private String status;
        private String title;
        private List<TaskSummaryResponse> tasks;
    }
}
