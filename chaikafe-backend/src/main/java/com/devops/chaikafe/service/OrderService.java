package com.devops.chaikafe.service;

import com.devops.chaikafe.dto.OrderItemRequestDto;
import com.devops.chaikafe.dto.OrderRequestDto;
import com.devops.chaikafe.dto.OrderResponseDto;
import com.devops.chaikafe.entity.MenuItem;
import com.devops.chaikafe.entity.Order;
import com.devops.chaikafe.entity.OrderItem;
import com.devops.chaikafe.entity.User;
import com.devops.chaikafe.repository.MenuItemRepository;
import com.devops.chaikafe.repository.OrderRepository;
import com.devops.chaikafe.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        MenuItemRepository menuItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public OrderResponseDto createOrder(OrderRequestDto orderRequestDto) {

        User user = userRepository.findById(orderRequestDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setDeliveryType(orderRequestDto.getDeliveryType());
        order.setStatus("PLACED");

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequestDto itemDto : orderRequestDto.getItems()) {

            MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found"));

            if (menuItem.getStockQuantity() == null || menuItem.getStockQuantity() <= 0) {
                throw new RuntimeException(menuItem.getName() + " is out of stock");
            }

            if (itemDto.getQuantity() > menuItem.getStockQuantity()) {
                throw new RuntimeException(
                        "Not enough stock for " + menuItem.getName() +
                        ". Available stock: " + menuItem.getStockQuantity()
                );
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(menuItem.getPrice());

            BigDecimal subtotal = menuItem.getPrice()
                    .multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            orderItem.setSubtotal(subtotal);

            totalAmount = totalAmount.add(subtotal);
            orderItems.add(orderItem);

            int remainingStock = menuItem.getStockQuantity() - itemDto.getQuantity();
            menuItem.setStockQuantity(remainingStock);

            if (remainingStock <= 0) {
                menuItem.setIsAvailable(false);
            } else {
                menuItem.setIsAvailable(true);
            }

            menuItemRepository.save(menuItem);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        return new OrderResponseDto(
                savedOrder.getId(),
                savedOrder.getStatus(),
                savedOrder.getTotalAmount(),
                savedOrder.getDeliveryType()
        );
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}