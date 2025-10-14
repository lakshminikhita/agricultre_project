package com.example.demo.controller;

import com.example.demo.model.MarketPrice;
import com.example.demo.model.ProductCategory;
import com.example.demo.repository.MarketPriceRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/market")
public class MarketController {

    @Autowired
    MarketPriceRepository marketPriceRepository;

    @Autowired
    ProductRepository productRepository;

    @GetMapping("/prices")
    public ResponseEntity<List<MarketPrice>> getMarketPrices(
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) String productName,
            @RequestParam(required = false) String region,
            @RequestParam(defaultValue = "10") int limit) {
        
        List<MarketPrice> prices;
        
        if (productName != null && !productName.trim().isEmpty()) {
            prices = marketPriceRepository.findLatestPricesByProductName(
                productName.trim(), PageRequest.of(0, limit));
        } else if (category != null) {
            prices = marketPriceRepository.findLatestPricesByCategory(
                category, PageRequest.of(0, limit));
        } else {
            prices = marketPriceRepository.findAll(
                PageRequest.of(0, limit, org.springframework.data.domain.Sort.by("recordDate").descending())
            ).getContent();
        }
        
        return ResponseEntity.ok(prices);
    }

    @GetMapping("/prices/product/{productName}")
    public ResponseEntity<List<MarketPrice>> getPriceHistoryForProduct(
            @PathVariable String productName,
            @RequestParam(defaultValue = "30") int days) {
        
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        LocalDateTime now = LocalDateTime.now();
        
        List<MarketPrice> prices = marketPriceRepository.findPricesBetweenDates(since, now);
        List<MarketPrice> productPrices = prices.stream()
            .filter(p -> p.getProductName().toLowerCase().contains(productName.toLowerCase()))
            .toList();
        
        return ResponseEntity.ok(productPrices);
    }

    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getMarketTrends() {
        Map<String, Object> trends = new HashMap<>();
        
        // Get latest prices by category
        Map<ProductCategory, List<MarketPrice>> categoryPrices = new HashMap<>();
        for (ProductCategory category : ProductCategory.values()) {
            List<MarketPrice> prices = marketPriceRepository.findLatestPricesByCategory(
                category, PageRequest.of(0, 5));
            if (!prices.isEmpty()) {
                categoryPrices.put(category, prices);
            }
        }
        
        trends.put("categoryPrices", categoryPrices);
        
        // Get total products available by category
        Map<ProductCategory, Long> productCounts = new HashMap<>();
        for (ProductCategory category : ProductCategory.values()) {
            long count = productRepository.findByCategory(category).size();
            productCounts.put(category, count);
        }
        
        trends.put("productCounts", productCounts);
        
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/average-price/{productName}")
    public ResponseEntity<Map<String, Object>> getAveragePrice(
            @PathVariable String productName,
            @RequestParam(defaultValue = "30") int days) {
        
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        
        BigDecimal averagePrice = marketPriceRepository.getAveragePriceForProduct(productName, since)
            .orElse(BigDecimal.ZERO);
        
        Map<String, Object> result = new HashMap<>();
        result.put("productName", productName);
        result.put("averagePrice", averagePrice);
        result.put("period", days + " days");
        result.put("calculatedAt", LocalDateTime.now());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/categories")
    public ResponseEntity<ProductCategory[]> getProductCategories() {
        return ResponseEntity.ok(ProductCategory.values());
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Total products available
        long totalProducts = productRepository.count();
        stats.put("totalProducts", totalProducts);
        
        // Products by category
        Map<ProductCategory, Long> productsByCategory = new HashMap<>();
        for (ProductCategory category : ProductCategory.values()) {
            long count = productRepository.findByCategory(category).size();
            productsByCategory.put(category, count);
        }
        stats.put("productsByCategory", productsByCategory);
        
        // Recent market activity (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        LocalDateTime now = LocalDateTime.now();
        List<MarketPrice> recentPrices = marketPriceRepository.findPricesBetweenDates(weekAgo, now);
        stats.put("recentMarketActivity", recentPrices.size());
        
        return ResponseEntity.ok(stats);
    }
}