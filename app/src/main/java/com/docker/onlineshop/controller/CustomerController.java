package com.docker.onlineshop.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.service.CustomerService;
import com.docker.onlineshop.util.CustomErrorType;
import com.docker.onlineshop.util.CustomerInfo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/api")
public class CustomerController {
	
	public static final Logger logger = LoggerFactory.getLogger(CustomerController.class);


	@Autowired
	CustomerService customerService;

	@RequestMapping(value = "/profile", method = RequestMethod.GET)
	public ResponseEntity<?> getProfile(HttpServletRequest request) {
		Customer customer = authenticatedCustomer(request);
		if (customer == null) return unauthorized();
		return new ResponseEntity<JSONObject>(new CustomerInfo().getCustomerInfo(customer), HttpStatus.OK);
	}

	@RequestMapping(value = "/profile", method = RequestMethod.PUT)
	public ResponseEntity<?> updateProfile(HttpServletRequest request, @RequestBody Customer profile) {
		Customer customer = authenticatedCustomer(request);
		if (customer == null) return unauthorized();
		if (isBlank(profile.getFirstName()) || isBlank(profile.getLastName()) || !isValidEmail(profile.getEmail())
				|| !isValidPhone(profile.getPhone()) || isBlank(profile.getStreetAddress()) || isBlank(profile.getCity())
				|| isBlank(profile.getRegion()) || isBlank(profile.getPostalCode()) || isBlank(profile.getCountry())) {
			return new ResponseEntity<CustomErrorType>(new CustomErrorType("A valid first name, last name, email, phone, and complete address are required"), HttpStatus.BAD_REQUEST);
		}
		customer.setFirstName(profile.getFirstName().trim());
		customer.setLastName(profile.getLastName().trim());
		customer.setName(customer.getFirstName() + " " + customer.getLastName());
		customer.setEmail(profile.getEmail().trim());
		customer.setPhone(profile.getPhone().trim());
		customer.setStreetAddress(profile.getStreetAddress().trim());
		customer.setCity(profile.getCity().trim());
		customer.setRegion(profile.getRegion().trim());
		customer.setPostalCode(profile.getPostalCode().trim());
		customer.setCountry(profile.getCountry().trim());
		customer.setAddress(formatAddress(customer));
		customerService.updateCustomer(customer);
		return new ResponseEntity<JSONObject>(new CustomerInfo().getCustomerInfo(customer), HttpStatus.OK);
	}

	private boolean isBlank(String value) {
		return value == null || value.trim().isEmpty();
	}

	private boolean isValidEmail(String value) {
		return !isBlank(value) && value.trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
	}

	private boolean isValidPhone(String value) {
		return !isBlank(value) && value.replaceAll("\\D", "").length() >= 7;
	}

	private String formatAddress(Customer customer) {
		return customer.getStreetAddress() + "\n" + customer.getCity() + ", " + customer.getRegion()
				+ " " + customer.getPostalCode() + "\n" + customer.getCountry();
	}

	private Customer authenticatedCustomer(HttpServletRequest request) {
		String header = request.getHeader("Authorization");
		if (header == null || !header.startsWith("Bearer ")) return null;
		try {
			Claims claims = Jwts.parser().setSigningKey("secretkey").parseClaimsJws(header.substring(7)).getBody();
			return customerService.findByUserName(claims.getSubject());
		} catch (JwtException | IllegalArgumentException exception) {
			return null;
		}
	}

	private ResponseEntity<CustomErrorType> unauthorized() {
		return new ResponseEntity<CustomErrorType>(new CustomErrorType("Sign in to access your profile"), HttpStatus.UNAUTHORIZED);
	}

	// -------------------------------------------------------------------
	//                   Customer methods
	//--------------------------------------------------------------------
	
	// -------------------Retrieve All Customers---------------------------------------------

	@RequestMapping(value = "/customer/", method = RequestMethod.GET)
	public ResponseEntity<List<JSONObject>> listAllUsers() {
		List<Customer> customer = customerService.findAllCustomers();
		if (customer.isEmpty()) {
			return new ResponseEntity<List<JSONObject>>(HttpStatus.NO_CONTENT);
		}
		
		List<JSONObject> customerData = new ArrayList<JSONObject>();
		CustomerInfo customerInfo = new CustomerInfo();
		for (Customer tempCustomer : customer) {
			customerData.add(customerInfo.getCustomerInfo(tempCustomer));
		}
		return new ResponseEntity<List<JSONObject>>(customerData, HttpStatus.OK);
	}

	// -------------------Retrieve Single Customer by Id------------------------------------------

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/customer/{customerId}", method = RequestMethod.GET)
	public ResponseEntity<?> getCustomer(@PathVariable("customerId") long customerId) {
		logger.info("Fetching Customer with id {}", customerId);
		Customer customer = customerService.findById(customerId);
		if (customer == null) {
			logger.error("Customer with id {} not found.", customerId);
			return new ResponseEntity(new CustomErrorType("Customer with id " + customerId 
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		
		CustomerInfo customerInfo = new CustomerInfo();
		JSONObject customerData = customerInfo.getCustomerInfo(customer);
		return new ResponseEntity<JSONObject>(customerData, HttpStatus.OK);
	}
	
	// -------------------Retrieve Single Customer by UserName------------------------------------------

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/customer/username={userName}", method = RequestMethod.GET)
	public ResponseEntity<?> getCustomerByUserName(@PathVariable("userName") String userName) {
		logger.info("Fetching Customer with username {}", userName);
		Customer customer = customerService.findByUserName(userName);
		if (customer == null) {
			logger.error("Customer with username {} not found.", userName);
			return new ResponseEntity(new CustomErrorType("Customer with username " + userName 
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		
		CustomerInfo customerInfo = new CustomerInfo();
		JSONObject customerData = customerInfo.getCustomerInfo(customer);
		return new ResponseEntity<JSONObject>(customerData, HttpStatus.OK);
	}

	// -------------------Retrieve Single Customer by Name------------------------------------------

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/customer/name={name}", method = RequestMethod.GET)
	public ResponseEntity<?> getCustomerByName(@PathVariable("name") String name) {
		logger.info("Fetching Customer with name {}", name);
		Customer customer = customerService.findByName(name);
		if (customer == null) {
			logger.error("Customer with name {} not found.", name);
			return new ResponseEntity(new CustomErrorType("Customer with name " + name 
					+ " not found"), HttpStatus.NOT_FOUND);
		}

		CustomerInfo customerInfo = new CustomerInfo();
		JSONObject customerData = customerInfo.getCustomerInfo(customer);
		return new ResponseEntity<JSONObject>(customerData, HttpStatus.OK);
	}
	
	// -------------------Create a Customer-------------------------------------------

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/customer/", method = RequestMethod.POST)
	public ResponseEntity<?> createCustomer(@RequestBody Customer customer, UriComponentsBuilder ucBuilder) {
		logger.info("Creating Customer : {}", customer);
		if (customer.getName() == null || customer.getName().trim().isEmpty()
				|| ((customer.getEmail() == null || customer.getEmail().trim().isEmpty())
						&& (customer.getPhone() == null || customer.getPhone().trim().isEmpty()))
				|| customer.getPassword() == null || customer.getPassword().isEmpty()) {
			return new ResponseEntity(new CustomErrorType(
					"Name, password, and either an email address or phone number are required."),
					HttpStatus.BAD_REQUEST);
		}
		
		if (customerService.customerExist(customer)) {
			logger.error("Unable to create customer because an account identifier is already in use");
			return new ResponseEntity(new CustomErrorType(
					"A customer with that email address or phone number already exists."),
					HttpStatus.CONFLICT);
		}
		
		Customer currentCustomer = customerService.createCustomer(customer);
		Long currentCustomerId = currentCustomer.getCustomerId();
		JSONObject customerInfo = new JSONObject();
		customerInfo.put("customerId", currentCustomerId);

		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(ucBuilder.path("/api/customer/{customerId").buildAndExpand(customer.getCustomerId()).toUri());;
		return new ResponseEntity<JSONObject>(customerInfo, HttpStatus.CREATED);
	}

	// ------------------- Update a Customer ------------------------------------------------

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value = "/customer/{customerId}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateCustomer(@PathVariable("customerId") long customerId, @RequestBody Customer customer) {
		logger.info("Updating customer with id {}", customerId);

		Customer currentCustomer = customerService.findById(customerId);

		if (currentCustomer == null) {
			logger.error("Unable to update. Customer with id {} not found.", customerId);
			return new ResponseEntity(new CustomErrorType("Unable to upate. Customer with id " + customerId + " not found."),
					HttpStatus.NOT_FOUND);
		}

		currentCustomer.setName(customer.getName());
		currentCustomer.setUsername(customer.getUsername());
		currentCustomer.setAddress(customer.getAddress());
		currentCustomer.setPhone(customer.getPhone());
		currentCustomer.setEmail(customer.getEmail());
		currentCustomer.setPassword(customer.getPassword());
		currentCustomer.setRole(customer.getRole());
		currentCustomer.setEnabled(customer.getEnabled());

		customerService.updateCustomer(currentCustomer);
		return new ResponseEntity<Customer>(currentCustomer, HttpStatus.OK);
	}

	// ------------------- Delete a Customer-----------------------------------------

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/customer/{customerId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteCustomer(@PathVariable("customerId") long customerId) {
		logger.info("Fetching & Deleting customer with id {}", customerId);

		Customer customer = customerService.findById(customerId);
		if (customer == null) {
			logger.error("Unable to delete. User with customer {} not found.", customerId);
			return new ResponseEntity(new CustomErrorType("Unable to delete. Customer with id " + customerId + " not found."),
					HttpStatus.NOT_FOUND);
		}
		customerService.deleteCustomerById(customerId);
		return new ResponseEntity<Customer>(HttpStatus.NO_CONTENT);
	}

	// ------------------- Delete All Customers-----------------------------

	@RequestMapping(value = "/customer/", method = RequestMethod.DELETE)
	public ResponseEntity<Customer> deleteAllCustomers() {
		logger.info("Deleting All Customers");

		customerService.deleteAllCustomers();
		return new ResponseEntity<Customer>(HttpStatus.NO_CONTENT);
	}
	
}
