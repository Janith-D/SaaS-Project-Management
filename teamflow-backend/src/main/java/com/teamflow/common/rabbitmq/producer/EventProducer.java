package com.teamflow.common.rabbitmq.producer;

import com.teamflow.common.rabbitmq.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class EventProducer {

    private final RabbitTemplate rabbitTemplate;

    public void publishTaskAssigned(Map<String, Object> payload) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EVENTS_EXCHANGE,
                RabbitMQConfig.TASK_ASSIGNED_ROUTING_KEY,
                payload
        );
    }

    public void publishTaskStatusChanged(Map<String, Object> payload) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EVENTS_EXCHANGE,
                RabbitMQConfig.TASK_STATUS_CHANGED_ROUTING_KEY,
                payload
        );
    }

    public void publishCommentAdded(Map<String, Object> payload) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EVENTS_EXCHANGE,
                RabbitMQConfig.COMMENT_ADDED_ROUTING_KEY,
                payload
        );
    }

    public void publishMemberInvited(Map<String, Object> payload) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EVENTS_EXCHANGE,
                RabbitMQConfig.MEMBER_INVITED_ROUTING_KEY,
                payload
        );
    }

    public void publishNotification(Map<String, Object> payload) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EVENTS_EXCHANGE,
                "notification." + payload.getOrDefault("type", "general"),
                payload
        );
    }

    public void publishEmail(Map<String, Object> payload) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EVENTS_EXCHANGE,
                "email." + payload.getOrDefault("type", "general"),
                payload
        );
    }

    public void publishAudit(Map<String, Object> payload) {
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EVENTS_EXCHANGE,
                "audit." + payload.getOrDefault("type", "general"),
                payload
        );
    }
}
