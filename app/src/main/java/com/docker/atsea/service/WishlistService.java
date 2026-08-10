package com.docker.atsea.service;

import java.util.List;

import com.docker.atsea.model.Customer;
import com.docker.atsea.model.Product;
import com.docker.atsea.model.WishlistItem;

public interface WishlistService {
	List<WishlistItem> findForCustomer(Long customerId);
	WishlistItem find(Long customerId, long productId);
	WishlistItem add(Customer customer, Product product);
	void remove(WishlistItem item);
}
