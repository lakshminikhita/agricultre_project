package com.example.demo.repository;

import com.example.demo.model.Product;
import com.example.demo.model.ProductCategory;
import com.example.demo.model.ProductStatus;
import com.example.demo.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    List<Product> findByFarmer(User farmer);
    
    List<Product> findByCategory(ProductCategory category);
    
    List<Product> findByStatus(ProductStatus status);
    
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    
    Page<Product> findByStatusAndCategory(ProductStatus status, ProductCategory category, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = :status AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Product> findAvailableProductsBySearchTerm(@Param("status") ProductStatus status, 
                                                   @Param("searchTerm") String searchTerm, 
                                                   Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.farmer.id = :farmerId")
    List<Product> findByFarmerId(@Param("farmerId") Long farmerId);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND p.location LIKE %:location%")
    List<Product> findAvailableProductsByLocation(@Param("location") String location);
    
    @Query("SELECT COUNT(p) FROM Product p WHERE p.farmer.id = :farmerId")
    Long countByFarmerId(@Param("farmerId") Long farmerId);
    
    @Query("SELECT SUM(p.quantityAvailable) FROM Product p WHERE p.farmer.id = :farmerId AND p.status = 'AVAILABLE'")
    Integer getTotalAvailableQuantityByFarmerId(@Param("farmerId") Long farmerId);
}