package com.example.demo.controller;

import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.OrderRequest;
import com.example.demo.model.*;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.math.BigDecimal;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/my-orders")
    public ResponseEntity<Page<Order>> getMyOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // For basic project - return all orders or create demo buyer
        User buyer = userRepository.findByEmail("buyer@demo.com")
            .orElseGet(() -> {
                User newBuyer = new User();
                newBuyer.setName("Demo Buyer");
                newBuyer.setEmail("buyer@demo.com");
                newBuyer.setPassword("password");
                newBuyer.setUserType(UserType.BUYER);
                return userRepository.save(newBuyer);
            });

        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> orders = orderRepository.findByBuyer(buyer, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/farmer-orders")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<Page<Order>> getFarmerOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("orderDate").descending());
        Page<Order> orders = orderRepository.findOrdersByFarmerId(userPrincipal.getId(), pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Optional<Order> orderOptional = orderRepository.findById(id);
        
        if (!orderOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Order order = orderOptional.get();
        
        // Check if user is authorized to view this order (buyer or farmer involved)
        boolean isAuthorized = order.getBuyer().getId().equals(userPrincipal.getId());
        
        if (!isAuthorized) {
            // Check if user is a farmer who has products in this order
            boolean isFarmerInOrder = order.getOrderItems().stream()
                .anyMatch(item -> item.getProduct().getFarmer().getId().equals(userPrincipal.getId()));
            
            if (!isFarmerInOrder) {
                return ResponseEntity.status(403).build();
            }
        }
        
        return ResponseEntity.ok(order);
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        try {
            // For basic project - create or get demo buyer
            User buyer = userRepository.findByEmail("buyer@demo.com")
                .orElseGet(() -> {
                    User newBuyer = new User();
                    newBuyer.setName("Demo Buyer");
                    newBuyer.setEmail("buyer@demo.com");
                    newBuyer.setPassword("password");
                    newBuyer.setUserType(UserType.BUYER);
                    return userRepository.save(newBuyer);
                });

            // Calculate total amount and validate products
            BigDecimal totalAmount = BigDecimal.ZERO;
            
            for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
                Optional<Product> productOptional = productRepository.findById(itemRequest.getProductId());
                
                if (!productOptional.isPresent()) {
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Product not found with ID: " + itemRequest.getProductId()));
                }

                Product product = productOptional.get();
                
                if (product.getStatus() != ProductStatus.AVAILABLE) {
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Product '" + product.getName() + "' is not available!"));
                }

                if (product.getQuantityAvailable() < itemRequest.getQuantity()) {
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Insufficient quantity for product '" + product.getName() + "'"));
                }

                BigDecimal itemTotal = product.getPricePerUnit().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
                totalAmount = totalAmount.add(itemTotal);
            }

            // Create order
            Order order = new Order(buyer, totalAmount, orderRequest.getDeliveryAddress());
            order.setNotes(orderRequest.getNotes());
            Order savedOrder = orderRepository.save(order);

            // Create order items and update product quantities
            for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
                Product product = productRepository.findById(itemRequest.getProductId()).get();
                
                OrderItem orderItem = new OrderItem(
                    savedOrder, 
                    product, 
                    itemRequest.getQuantity(), 
                    product.getPricePerUnit()
                );
                orderItemRepository.save(orderItem);

                // Update product quantity
                product.setQuantityAvailable(product.getQuantityAvailable() - itemRequest.getQuantity());
                if (product.getQuantityAvailable() == 0) {
                    product.setStatus(ProductStatus.OUT_OF_STOCK);
                }
                productRepository.save(product);
            }

            return ResponseEntity.ok(savedOrder);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Failed to create order! " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, 
                                             @RequestParam OrderStatus status,
                                             Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            Optional<Order> orderOptional = orderRepository.findById(id);
            if (!orderOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Order order = orderOptional.get();
            
            // Check authorization - buyer can cancel, farmers can update delivery status
            boolean isAuthorized = false;
            
            if (order.getBuyer().getId().equals(userPrincipal.getId())) {
                // Buyer can only cancel pending orders
                if (status == OrderStatus.CANCELLED && order.getStatus() == OrderStatus.PENDING) {
                    isAuthorized = true;
                }
            } else {
                // Check if user is a farmer involved in this order
                boolean isFarmerInOrder = order.getOrderItems().stream()
                    .anyMatch(item -> item.getProduct().getFarmer().getId().equals(userPrincipal.getId()));
                
                if (isFarmerInOrder) {
                    isAuthorized = true;
                }
            }
            
            if (!isAuthorized) {
                return ResponseEntity.status(403)
                    .body(new MessageResponse("Error: You are not authorized to update this order!"));
            }

            order.setStatus(status);
            Order updatedOrder = orderRepository.save(order);
            
            return ResponseEntity.ok(updatedOrder);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Failed to update order status! " + e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> getOrderStatistics(Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            Long totalOrders = orderRepository.countOrdersByFarmerId(userPrincipal.getId());
            BigDecimal totalEarnings = orderRepository.getTotalEarningsByFarmer(userPrincipal.getId());
            
            if (totalEarnings == null) {
                totalEarnings = BigDecimal.ZERO;
            }
            
            return ResponseEntity.ok(new OrderStatistics(totalOrders, totalEarnings));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Failed to get statistics! " + e.getMessage()));
        }
    }

    // Inner class for order statistics response
    public static class OrderStatistics {
        private Long totalOrders;
        private BigDecimal totalEarnings;

        public OrderStatistics(Long totalOrders, BigDecimal totalEarnings) {
            this.totalOrders = totalOrders;
            this.totalEarnings = totalEarnings;
        }

        // Getters and setters
        public Long getTotalOrders() {
            return totalOrders;
        }

        public void setTotalOrders(Long totalOrders) {
            this.totalOrders = totalOrders;
        }

        public BigDecimal getTotalEarnings() {
            return totalEarnings;
        }

        public void setTotalEarnings(BigDecimal totalEarnings) {
            this.totalEarnings = totalEarnings;
        }
    }
}