package com.devops.chaikafe.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column(nullable = false)
    private String status; // PLACED, PREPARING, COMPLETED, CANCELLED

    @Column(nullable = false)
    private BigDecimal totalAmount;

    private String deliveryType; // DINE_IN, TAKEAWAY, DELIVERY

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    private Payment payment;

    @PrePersist
    public void prePersist() {
        this.orderDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();

        if (this.status == null) {
            this.status = "PLACED";
        }

        if (this.deliveryType == null) {
            this.deliveryType = "TAKEAWAY";
        }

        if (this.totalAmount == null) {
            this.totalAmount = BigDecimal.ZERO;
        }
    }
}
