package com.docker.onlineshop.service;


import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.repositories.CustomerRepository;

@Service("customerService")
@Transactional
public class CustomerServiceImpl implements CustomerService {
	
	@Autowired
	private CustomerRepository customerRepository;

	public Customer findById(Long customerId) {
		return customerRepository.findOne(customerId);
	}

	public Customer findByUserName(String name) {
		return customerRepository.findByUserName(name);
	}

	public Customer findByEmailOrPhone(String identifier) {
		return customerRepository.findByEmailOrPhone(normalizeIdentifier(identifier));
	}

	public Customer findByName(String name) {
		return customerRepository.findByName(name);
	}
	
	public Customer createCustomer(Customer customer) {
		customer.setName(customer.getName().trim());
		customer.setEmail(normalizeEmail(customer.getEmail()));
		customer.setPhone(normalizePhone(customer.getPhone()));
		// Spring Security still requires a username column. Keep it internal and
		// derive it from whichever unique contact identifier the customer supplied.
		customer.setUsername(customer.getEmail() != null ? customer.getEmail() : customer.getPhone());
		customer = customerRepository.save(customer);
		customerRepository.flush();
		return customer;
	}
	
	public void saveCustomer(Customer customer) {
		customerRepository.save(customer);
	}

	public void updateCustomer(Customer customer) {
		customerRepository.save(customer);
	}

	public void deleteAllCustomers() {
		customerRepository.deleteAll();
	}

	public List<Customer> findAllCustomers() {
		return (List<Customer>) customerRepository.findAll();
	}
	
	public boolean customerExist(Customer customer) {
		String email = normalizeEmail(customer.getEmail());
		String phone = normalizePhone(customer.getPhone());
		return (email != null && customerRepository.findByEmailOrPhone(email) != null)
				|| (phone != null && customerRepository.findByEmailOrPhone(phone) != null);
	}

	private String normalizeIdentifier(String identifier) {
		return identifier != null && identifier.contains("@")
				? normalizeEmail(identifier) : normalizePhone(identifier);
	}

	private String normalizeEmail(String email) {
		if (email == null || email.trim().isEmpty()) return null;
		return email.trim().toLowerCase(Locale.ROOT);
	}

	private String normalizePhone(String phone) {
		if (phone == null || phone.trim().isEmpty()) return null;
		return phone.replaceAll("\\D", "");
	}

	public void deleteCustomerById(Long customerId) {
		customerRepository.delete(customerId);		
	}
}
