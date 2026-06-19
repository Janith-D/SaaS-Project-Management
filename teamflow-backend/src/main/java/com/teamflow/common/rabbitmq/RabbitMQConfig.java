package com.teamflow.common.rabbitmq;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String NOTIFICATION_QUEUE = "teamflow.notification.queue";
    public static final String EMAIL_QUEUE = "teamflow.email.queue";
    public static final String AUDIT_QUEUE = "teamflow.audit.queue";

    public static final String EVENTS_EXCHANGE = "teamflow.events.exchange";

    public static final String TASK_ASSIGNED_ROUTING_KEY = "task.assigned";
    public static final String TASK_STATUS_CHANGED_ROUTING_KEY = "task.status.changed";
    public static final String COMMENT_ADDED_ROUTING_KEY = "comment.added";
    public static final String MEMBER_INVITED_ROUTING_KEY = "member.invited";
    public static final String NOTIFICATION_ROUTING_KEY = "notification.#";
    public static final String EMAIL_ROUTING_KEY = "email.#";
    public static final String AUDIT_ROUTING_KEY = "audit.#";

    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE);
    }

    @Bean
    public Queue emailQueue() {
        return new Queue(EMAIL_QUEUE);
    }

    @Bean
    public Queue auditQueue() {
        return new Queue(AUDIT_QUEUE);
    }

    @Bean
    public TopicExchange eventsExchange() {
        return new TopicExchange(EVENTS_EXCHANGE);
    }

    @Bean
    public Binding notificationBinding() {
        return BindingBuilder.bind(notificationQueue())
                .to(eventsExchange())
                .with(NOTIFICATION_ROUTING_KEY);
    }

    @Bean
    public Binding emailBinding() {
        return BindingBuilder.bind(emailQueue())
                .to(eventsExchange())
                .with(EMAIL_ROUTING_KEY);
    }

    @Bean
    public Binding auditBinding() {
        return BindingBuilder.bind(auditQueue())
                .to(eventsExchange())
                .with(AUDIT_ROUTING_KEY);
    }

    @Bean
    public MessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate amqpTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
