package com.docker.onlineshop.service;

import java.util.List;

import com.docker.onlineshop.model.Order;

public interface OrderService {

	List<Order> findAllOrders();

	List<Order> findOrdersByCustomerId(Long customerId);
	
	Order findById(Long orderId);
	
	Order createOrder(Order order);
	
	void saveOrder(Order order);
	
	void updateOrder(Order order);
	
	void deleteOrderById(Long orderId);
	
	void deleteAllItems();

	boolean orderExists(Order order);	
}
