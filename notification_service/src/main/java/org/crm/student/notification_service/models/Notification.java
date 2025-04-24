package org.crm.student.notification_service.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String recipient;  // Email or phone number
    private String message;
    private boolean read = false;  // Mark as read/unread
    private LocalDateTime createdAt = LocalDateTime.now();
}
