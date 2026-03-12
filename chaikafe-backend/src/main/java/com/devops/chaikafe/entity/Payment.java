package com.devops.chaikafe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String paymentMethod; // UPI, CARD, CASH

    @Column(nullable = false)
    private String paymentStatus; // PENDING, SUCCESS, FAILED

    private String transactionId;

    private LocalDateTime paymentDate;

    @Column(nullable = false)
    private BigDecimal amount;

    @OneToOne
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @PrePersist
    public void prePersist() {
        this.paymentDate = LocalDateTime.now();

        if (this.paymentStatus == null) {
            this.paymentStatus = "PENDING";
        }
    }
}
