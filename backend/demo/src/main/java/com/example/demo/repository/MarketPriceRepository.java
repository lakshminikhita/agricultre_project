package com.example.demo.repository;

import com.example.demo.model.MarketPrice;
import com.example.demo.model.ProductCategory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {
    
    List<MarketPrice> findByCategory(ProductCategory category);
    
    List<MarketPrice> findByProductName(String productName);
    
    List<MarketPrice> findByRegion(String region);
    
    @Query("SELECT mp FROM MarketPrice mp WHERE mp.productName = :productName ORDER BY mp.recordDate DESC")
    List<MarketPrice> findLatestPricesByProductName(@Param("productName") String productName, Pageable pageable);
    
    @Query("SELECT mp FROM MarketPrice mp WHERE mp.category = :category ORDER BY mp.recordDate DESC")
    List<MarketPrice> findLatestPricesByCategory(@Param("category") ProductCategory category, Pageable pageable);
    
    @Query("SELECT mp FROM MarketPrice mp WHERE mp.recordDate BETWEEN :startDate AND :endDate")
    List<MarketPrice> findPricesBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(mp.averagePrice) FROM MarketPrice mp WHERE mp.productName = :productName AND mp.recordDate >= :since")
    Optional<BigDecimal> getAveragePriceForProduct(@Param("productName") String productName, @Param("since") LocalDateTime since);
    
    @Query("SELECT mp FROM MarketPrice mp WHERE mp.productName = :productName AND mp.region = :region ORDER BY mp.recordDate DESC")
    List<MarketPrice> findLatestPricesByProductAndRegion(@Param("productName") String productName, 
                                                        @Param("region") String region, 
                                                        Pageable pageable);
}