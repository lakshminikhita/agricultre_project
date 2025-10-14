package com.example.demo.repository;

import com.example.demo.model.Order;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByBuyer(User buyer);
    
    List<Order> findByStatus(OrderStatus status);
    
    Page<Order> findByBuyer(User buyer, Pageable pageable);
    
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.product.farmer.id = :farmerId")
    List<Order> findOrdersByFarmerId(@Param("farmerId") Long farmerId);
    
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE oi.product.farmer.id = :farmerId")
    Page<Order> findOrdersByFarmerId(@Param("farmerId") Long farmerId, Pageable pageable);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.buyer.id = :buyerId")
    Long countByBuyerId(@Param("buyerId") Long buyerId);
    
    @Query("SELECT COUNT(DISTINCT o) FROM Order o JOIN o.orderItems oi WHERE oi.product.farmer.id = :farmerId")
    Long countOrdersByFarmerId(@Param("farmerId") Long farmerId);
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.buyer.id = :buyerId AND o.status != 'CANCELLED'")
    BigDecimal getTotalSpentByBuyer(@Param("buyerId") Long buyerId);
    
    @Query("SELECT SUM(oi.totalPrice) FROM Order o JOIN o.orderItems oi WHERE oi.product.farmer.id = :farmerId AND o.status = 'DELIVERED'")
    BigDecimal getTotalEarningsByFarmer(@Param("farmerId") Long farmerId);
    
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findOrdersBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    Long countOrdersBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}