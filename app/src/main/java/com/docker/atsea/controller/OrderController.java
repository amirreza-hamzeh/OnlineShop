package com.docker.atsea.controller;

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

import com.docker.atsea.model.Order;
import com.docker.atsea.model.Customer;
import com.docker.atsea.service.CustomerService;
import com.docker.atsea.service.OrderService;
import com.docker.atsea.util.CustomErrorType;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/api")
public class OrderController {
	
	public static final Logger logger = LoggerFactory.getLogger(OrderController.class);
	
	@Autowired
	OrderService orderService;

	@Autowired
	CustomerService customerService;
	// -------------------------------------------------------------------
	//                   Order methods
	//--------------------------------------------------------------------


	// -------------------Create an Order-------------------------------------------
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/order/", method = RequestMethod.POST)
	public ResponseEntity<?> createOrder(HttpServletRequest request, @RequestBody Order order, UriComponentsBuilder ucBuilder) {
		Customer customer = authenticatedCustomer(request);
		if (customer == null) return unauthorized();
		order.setCustomerId(customer.getCustomerId());
		order.setStatus("Processing");
		logger.info("Creating order : {}", order);

		// The database owns order identifiers. Ignoring a client-supplied ID avoids
		// collisions and prevents one customer from targeting another order.
		order.setOrderId(null);
		Order currentOrder = orderService.createOrder(order);
		Long currentOrderId = currentOrder.getOrderId();
		JSONObject orderInfo = new JSONObject();
		orderInfo.put("orderId", currentOrderId);

		HttpHeaders headers = new HttpHeaders();
		headers.setLocation(ucBuilder.path("/api/order/{orderId}").buildAndExpand(currentOrderId).toUri());
		return new ResponseEntity<JSONObject>(orderInfo, headers, HttpStatus.CREATED);
	}

	@RequestMapping(value = "/profile/orders", method = RequestMethod.GET)
	public ResponseEntity<?> listCustomerOrders(HttpServletRequest request) {
		Customer customer = authenticatedCustomer(request);
		if (customer == null) return unauthorized();
		return new ResponseEntity<List<Order>>(orderService.findOrdersByCustomerId(customer.getCustomerId()), HttpStatus.OK);
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
		return new ResponseEntity<CustomErrorType>(new CustomErrorType("Sign in to access your orders"), HttpStatus.UNAUTHORIZED);
	}

	// ------------------- Delete an Order-----------------------------------------

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/order/{orderId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteItemById(@PathVariable("orderId") long orderId) {
		logger.info("Fetching & Deleting Item with id {}", orderId);

		Order order = orderService.findById(orderId);
		if (order == null) {
			logger.error("Unable to delete item with orderid {} not found.", orderId);
			return new ResponseEntity(new CustomErrorType("Unable to delete order. Order with id " + orderId + " not found."),
					HttpStatus.NOT_FOUND);
		}
		orderService.deleteOrderById(orderId);
		return new ResponseEntity<Order>(HttpStatus.NO_CONTENT);
	}

	
	// ------------------- Get All Orders-----------------------------
	
	@RequestMapping(value = "/order/", method = RequestMethod.GET)
	public ResponseEntity<List<Order>> listAllOrderss() {
		List<Order> order = orderService.findAllOrders();
		if (order.isEmpty()) {
			return new ResponseEntity<List<Order>>(HttpStatus.NO_CONTENT);

		}
		return new ResponseEntity<List<Order>>(order, HttpStatus.OK);
	}
	
	// -------------------Retrieve Single Order By Id------------------------------------------

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/order/{orderId}", method = RequestMethod.GET)
	public ResponseEntity<?> getOrder(@PathVariable("orderId") long orderId) {
		logger.info("Fetching Order with id {}", orderId);
		Order order = orderService.findById(orderId);
		if (order == null) {
			logger.error("Order with id {} not found.", orderId);
			return new ResponseEntity(new CustomErrorType("Order with id " + orderId 
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Order>(order, HttpStatus.OK);
	}
	
	// ---------------------Update an order-------------------------------
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@RequestMapping(value = "/order/{orderId}", method = RequestMethod.PUT)
	public ResponseEntity<?> updateOrder(@PathVariable("orderId") long orderId, @RequestBody Order order) {
		logger.info("Updating order with id {}", orderId);

		Order currentOrder = orderService.findById(orderId);

		if (currentOrder == null) {
			logger.error("Unable to update. Order with id {} not found.", orderId);
			return new ResponseEntity(new CustomErrorType("Unable to upate. Order with id " + orderId + " not found."),
					HttpStatus.NOT_FOUND);
		}

		if (order.getCustomerId() != null) currentOrder.setCustomerId(order.getCustomerId());
		if (order.getOrderDate() != null) currentOrder.setOrderDate(order.getOrderDate());
		if (order.getProductsOrdered() != null && !order.getProductsOrdered().isEmpty()) {
			currentOrder.setProductsOrdered(order.getProductsOrdered());
		}
		if (order.hasStatus()) currentOrder.setStatus(order.getStatus());
		orderService.updateOrder(currentOrder);
		
		JSONObject orderInfo = new JSONObject();
		orderInfo.put("orderId", currentOrder.getOrderId());
		orderInfo.put("customerId", currentOrder.getCustomerId());
		orderInfo.put("orderDate", currentOrder.getOrderDate());
		orderInfo.put("productsOrdered", currentOrder.getProductsOrdered());
		orderInfo.put("status", currentOrder.getStatus());
		return new ResponseEntity<JSONObject>(orderInfo, HttpStatus.OK);
	}

}
