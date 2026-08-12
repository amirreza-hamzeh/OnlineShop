package com.docker.onlineshop.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;

import com.docker.onlineshop.service.CustomerService;
import com.docker.onlineshop.service.CustomerServiceImpl;
import com.docker.onlineshop.service.OrderService;
import com.docker.onlineshop.service.OrderServiceImpl;
import com.docker.onlineshop.service.ProductService;
import com.docker.onlineshop.service.ProductServiceImpl;
import com.mchange.v2.c3p0.ComboPooledDataSource;

public class BeanConfiguration {

	@Bean
	public CustomerService customerService() {
		return new CustomerServiceImpl();
	}
	
	@Bean
	public OrderService orderService() {
		return new OrderServiceImpl();
	}
	
	@Bean
	public ProductService productService() {
		return new ProductServiceImpl();
	}

	// Implement C3P0 connection pooling
	@Bean
	@ConfigurationProperties("onlineshop.datasource")
	public ComboPooledDataSource dataSource() {
	    return new ComboPooledDataSource();
	}
}
