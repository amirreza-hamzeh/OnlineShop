package com.docker.onlineshop.service;

import java.util.List;

import com.docker.onlineshop.model.Product;

public interface ProductService {
	
	Product findByName(String name);
		
	List<Product> findAllProducts();

	Product findById(Long productId);
	

}
