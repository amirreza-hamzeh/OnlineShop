package com.docker.onlineshop.service;

import java.util.List;

import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.model.Product;
import com.docker.onlineshop.model.WishlistItem;

public interface WishlistService {
	List<WishlistItem> findForCustomer(Long customerId);
	WishlistItem find(Long customerId, long productId);
	WishlistItem add(Customer customer, Product product);
	void remove(WishlistItem item);
}
