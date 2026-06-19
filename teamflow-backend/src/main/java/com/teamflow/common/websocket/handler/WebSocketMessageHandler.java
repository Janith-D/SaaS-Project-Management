package com.teamflow.common.websocket.handler;

import com.teamflow.common.security.PermissionService;
import com.teamflow.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class WebSocketMessageHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final PermissionService permissionService;

    @MessageMapping("/workspaces/{workspaceId}/typing")
    public void handleTyping(@DestinationVariable UUID workspaceId,
                             @Payload Map<String, String> payload,
                             Principal principal) {
        String username = payload.getOrDefault("username", "Someone");
        String topic = "/topic/workspaces/" + workspaceId;
        messagingTemplate.convertAndSend(topic,
                Map.of("type", "TYPING", "username", username, "workspaceId", workspaceId.toString()));
    }

    @MessageMapping("/projects/{projectId}/comment")
    public void handleCommentUpdate(@DestinationVariable UUID projectId,
                                    @Payload Map<String, Object> payload) {
        String topic = "/topic/projects/" + projectId;
        messagingTemplate.convertAndSend(topic, payload);
    }

    @MessageMapping("/projects/{projectId}/task-moved")
    public void handleTaskMoved(@DestinationVariable UUID projectId,
                                @Payload Map<String, Object> payload) {
        String topic = "/topic/projects/" + projectId;
        messagingTemplate.convertAndSend(topic,
                Map.of("type", "TASK_MOVED", "data", payload));
    }
}
