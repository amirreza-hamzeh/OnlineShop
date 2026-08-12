package com.docker.onlineshop.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.docker.onlineshop.model.WishlistItem;

@Repository
public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
	List<WishlistItem> findByCustomerCustomerIdOrderByCreatedAtDesc(Long customerId);
	WishlistItem findByCustomerCustomerIdAndProductProductId(Long customerId, long productId);
}
