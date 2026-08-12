package com.docker.onlineshop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.model.Product;
import com.docker.onlineshop.model.WishlistItem;
import com.docker.onlineshop.repositories.WishlistRepository;

@Service("wishlistService")
@Transactional
public class WishlistServiceImpl implements WishlistService {
	@Autowired
	private WishlistRepository wishlistRepository;

	public List<WishlistItem> findForCustomer(Long customerId) {
		return wishlistRepository.findByCustomerCustomerIdOrderByCreatedAtDesc(customerId);
	}

	public WishlistItem find(Long customerId, long productId) {
		return wishlistRepository.findByCustomerCustomerIdAndProductProductId(customerId, productId);
	}

	public WishlistItem add(Customer customer, Product product) {
		WishlistItem existing = find(customer.getCustomerId(), product.getProductId());
		if (existing != null) return existing;
		WishlistItem item = new WishlistItem();
		item.setCustomer(customer);
		item.setProduct(product);
		return wishlistRepository.save(item);
	}

	public void remove(WishlistItem item) {
		wishlistRepository.delete(item);
	}
}
