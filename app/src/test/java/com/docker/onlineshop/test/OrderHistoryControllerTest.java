package com.docker.onlineshop.test;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.MediaType;

import com.docker.onlineshop.controller.OrderController;
import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.model.Order;
import com.docker.onlineshop.service.CustomerService;
import com.docker.onlineshop.service.OrderService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RunWith(SpringRunner.class)
public class OrderHistoryControllerTest {
	@Mock private OrderService orderService;
	@Mock private CustomerService customerService;
	@InjectMocks private OrderController controller;

	private MockMvc mockMvc;
	private String authorization;
	private Order order;

	@Before
	public void setup() {
		mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		Customer customer = new Customer(3L, "Alex", "Address", "alex@example.com", "5551234567", "alex", "secret", true, "USER");
		order = new Order();
		order.setOrderId(42L);
		order.setCustomerId(3L);
		order.setStatus("Shipped");
		authorization = "Bearer " + Jwts.builder().setSubject("alex")
				.signWith(SignatureAlgorithm.HS256, "secretkey").compact();
		when(customerService.findByUserName("alex")).thenReturn(customer);
		when(orderService.findOrdersByCustomerId(3L)).thenReturn(Arrays.asList(order));
	}

	@Test
	public void statusOnlyUpdatesPreserveExistingOrderDetails() throws Exception {
		when(orderService.findById(42L)).thenReturn(order);
		mockMvc.perform(put("/api/order/42").contentType(MediaType.APPLICATION_JSON)
				.content("{\"status\":\"delivered\"}"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.customerId", is(3)))
				.andExpect(jsonPath("$.status", is("Delivered")));
		org.junit.Assert.assertEquals(Long.valueOf(3L), order.getCustomerId());
	}

	@Test
	public void creatingAnOrderUsesTheAuthenticatedCustomerAndGeneratedId() throws Exception {
		Order createdOrder = new Order();
		createdOrder.setOrderId(42L);
		when(orderService.createOrder(Mockito.any(Order.class))).thenReturn(createdOrder);

		mockMvc.perform(post("/api/order/").header("Authorization", authorization)
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"orderId\":99,\"customerId\":88,\"status\":\"Delivered\","
						+ "\"productsOrdered\":{\"1\":2}}"))
				.andExpect(status().isCreated())
				.andExpect(header().string("Location", "http://localhost/api/order/42"))
				.andExpect(jsonPath("$.orderId", is(42)));

		ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
		Mockito.verify(orderService).createOrder(captor.capture());
		org.junit.Assert.assertNull(captor.getValue().getOrderId());
		org.junit.Assert.assertEquals(Long.valueOf(3L), captor.getValue().getCustomerId());
		org.junit.Assert.assertEquals("Processing", captor.getValue().getStatus());
	}

	@Test
	public void ordersRequireAuthentication() throws Exception {
		mockMvc.perform(get("/api/profile/orders")).andExpect(status().isUnauthorized());
	}

	@Test
	public void listsOnlyTheAuthenticatedCustomersOrders() throws Exception {
		mockMvc.perform(get("/api/profile/orders").header("Authorization", authorization))
				.andExpect(status().isOk()).andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].orderId", is(42)))
				.andExpect(jsonPath("$[0].status", is("Shipped")));
	}
}
