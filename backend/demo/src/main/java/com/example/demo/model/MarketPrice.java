package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_prices")
public class MarketPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ProductCategory category;

    @NotNull
    private String productName;

    @NotNull
    @Positive
    private BigDecimal averagePrice;

    @NotNull
    @Positive
    private BigDecimal minPrice;

    @NotNull
    @Positive
    private BigDecimal maxPrice;

    private String region; // Location/market region

    private Integer totalQuantityTraded;

    private LocalDateTime recordDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public MarketPrice() {}

    public MarketPrice(ProductCategory category, String productName, BigDecimal averagePrice, 
                       BigDecimal minPrice, BigDecimal maxPrice, String region, Integer totalQuantityTraded) {
        this.category = category;
        this.productName = productName;
        this.averagePrice = averagePrice;
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
        this.region = region;
        this.totalQuantityTraded = totalQuantityTraded;
        this.recordDate = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (recordDate == null) {
            recordDate = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }

    public BigDecimal getMinPrice() {
        return minPrice;
    }

    public void setMinPrice(BigDecimal minPrice) {
        this.minPrice = minPrice;
    }

    public BigDecimal getMaxPrice() {
        return maxPrice;
    }

    public void setMaxPrice(BigDecimal maxPrice) {
        this.maxPrice = maxPrice;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Integer getTotalQuantityTraded() {
        return totalQuantityTraded;
    }

    public void setTotalQuantityTraded(Integer totalQuantityTraded) {
        this.totalQuantityTraded = totalQuantityTraded;
    }

    public LocalDateTime getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(LocalDateTime recordDate) {
        this.recordDate = recordDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}