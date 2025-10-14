package com.example.demo.dto;

import com.example.demo.model.ProductCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductRequest {
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 500)
    private String description;

    @NotNull
    private ProductCategory category;

    @NotNull
    @Positive
    private BigDecimal pricePerUnit;

    @NotBlank
    @Size(max = 20)
    private String unit;

    @NotNull
    @Positive
    private Integer quantityAvailable;

    @NotBlank
    @Size(max = 100)
    private String location;

    private String imageUrl;

    private LocalDateTime harvestDate;

    private LocalDateTime expiryDate;

    @Size(max = 50)
    private String quality;

    // Constructors
    public ProductRequest() {}

    public ProductRequest(String name, String description, ProductCategory category, 
                         BigDecimal pricePerUnit, String unit, Integer quantityAvailable, 
                         String location) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.pricePerUnit = pricePerUnit;
        this.unit = unit;
        this.quantityAvailable = quantityAvailable;
        this.location = location;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getQuantityAvailable() {
        return quantityAvailable;
    }

    public void setQuantityAvailable(Integer quantityAvailable) {
        this.quantityAvailable = quantityAvailable;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getHarvestDate() {
        return harvestDate;
    }

    public void setHarvestDate(LocalDateTime harvestDate) {
        this.harvestDate = harvestDate;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }
}