package com.docker.atsea.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.docker.atsea.model.Order;

@Repository
@Transactional
public interface OrderRepository extends JpaRepository<Order, Long> {
	List<Order> findByCustomerIdOrderByOrderDateDescOrderIdDesc(Long customerId);
}
