package com.example.demo.controller;

import com.example.demo.dto.MessageResponse;
import com.example.demo.dto.ProductRequest;
import com.example.demo.model.Product;
import com.example.demo.model.ProductCategory;
import com.example.demo.model.ProductStatus;
import com.example.demo.model.User;
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
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping("/all")
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) ProductCategory category,
            @RequestParam(required = false) String search) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : 
            Sort.by(sortBy).ascending();
            
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Product> products;
        
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findAvailableProductsBySearchTerm(
                ProductStatus.AVAILABLE, search.trim(), pageable);
        } else if (category != null) {
            products = productRepository.findByStatusAndCategory(
                ProductStatus.AVAILABLE, category, pageable);
        } else {
            products = productRepository.findByStatus(ProductStatus.AVAILABLE, pageable);
        }
        
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Product>> getProductsByFarmer(@PathVariable Long farmerId) {
        List<Product> products = productRepository.findByFarmerId(farmerId);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getMyProducts() {
        // For basic project - return all available products (no user authentication needed)
        List<Product> products = productRepository.findByStatus(ProductStatus.AVAILABLE);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductRequest productRequest) {
        try {
            // For basic project - create a default farmer user if none exists
            User farmer = userRepository.findByEmail("farmer@demo.com")
                .orElseGet(() -> {
                    User newFarmer = new User();
                    newFarmer.setName("Demo Farmer");
                    newFarmer.setEmail("farmer@demo.com");
                    newFarmer.setPassword("password");
                    newFarmer.setUserType(com.example.demo.model.UserType.FARMER);
                    return userRepository.save(newFarmer);
                });

            Product product = new Product(
                productRequest.getName(),
                productRequest.getDescription(),
                productRequest.getCategory(),
                productRequest.getPricePerUnit(),
                productRequest.getUnit(),
                productRequest.getQuantityAvailable(),
                productRequest.getLocation(),
                farmer
            );

            product.setImageUrl(productRequest.getImageUrl());
            product.setHarvestDate(productRequest.getHarvestDate());
            product.setExpiryDate(productRequest.getExpiryDate());
            product.setQuality(productRequest.getQuality());

            Product savedProduct = productRepository.save(product);
            return ResponseEntity.ok(savedProduct);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Failed to create product! " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, 
                                          @Valid @RequestBody ProductRequest productRequest,
                                          Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            Optional<Product> productOptional = productRepository.findById(id);
            if (!productOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Product product = productOptional.get();
            
            // Check if the product belongs to the authenticated farmer
            if (!product.getFarmer().getId().equals(userPrincipal.getId())) {
                return ResponseEntity.status(403)
                    .body(new MessageResponse("Error: You can only update your own products!"));
            }

            // Update product fields
            product.setName(productRequest.getName());
            product.setDescription(productRequest.getDescription());
            product.setCategory(productRequest.getCategory());
            product.setPricePerUnit(productRequest.getPricePerUnit());
            product.setUnit(productRequest.getUnit());
            product.setQuantityAvailable(productRequest.getQuantityAvailable());
            product.setLocation(productRequest.getLocation());
            product.setImageUrl(productRequest.getImageUrl());
            product.setHarvestDate(productRequest.getHarvestDate());
            product.setExpiryDate(productRequest.getExpiryDate());
            product.setQuality(productRequest.getQuality());

            Product updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(updatedProduct);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Failed to update product! " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            Optional<Product> productOptional = productRepository.findById(id);
            if (!productOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Product product = productOptional.get();
            
            // For basic project - allow deletion of any product
            productRepository.delete(product);
            return ResponseEntity.ok(new MessageResponse("Product deleted successfully!"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Failed to delete product! " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<?> updateProductStatus(@PathVariable Long id, 
                                               @RequestParam ProductStatus status,
                                               Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            Optional<Product> productOptional = productRepository.findById(id);
            if (!productOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Product product = productOptional.get();
            
            // Check if the product belongs to the authenticated farmer
            if (!product.getFarmer().getId().equals(userPrincipal.getId())) {
                return ResponseEntity.status(403)
                    .body(new MessageResponse("Error: You can only update your own products!"));
            }

            product.setStatus(status);
            Product updatedProduct = productRepository.save(product);
            return ResponseEntity.ok(updatedProduct);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Failed to update product status! " + e.getMessage()));
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<ProductCategory[]> getProductCategories() {
        return ResponseEntity.ok(ProductCategory.values());
    }
}