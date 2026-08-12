package com.docker.onlineshop.test;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.docker.onlineshop.controller.CustomerController;
import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.service.CustomerService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RunWith(SpringRunner.class)
public class CustomerProfileControllerTest {
	@Mock private CustomerService customerService;
	@InjectMocks private CustomerController controller;

	private MockMvc mockMvc;
	private Customer customer;
	private String authorization;

	@Before
	public void setup() {
		mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		customer = new Customer(3L, "Alex", "Old address", "alex@example.com", "5551234567", "alex", "secret", true, "USER");
		customer.setFirstName("Alex");
		customer.setLastName("Morgan");
		customer.setStreetAddress("Old street");
		customer.setCity("Old city");
		customer.setRegion("WA");
		customer.setPostalCode("98101");
		customer.setCountry("United States");
		authorization = "Bearer " + Jwts.builder().setSubject("alex")
				.signWith(SignatureAlgorithm.HS256, "secretkey").compact();
		when(customerService.findByUserName("alex")).thenReturn(customer);
	}

	@Test
	public void profileRequiresAuthentication() throws Exception {
		mockMvc.perform(get("/api/profile")).andExpect(status().isUnauthorized());
	}

	@Test
	public void getsAndUpdatesOnlyEditableProfileFields() throws Exception {
		mockMvc.perform(get("/api/profile").header("Authorization", authorization))
				.andExpect(status().isOk()).andExpect(jsonPath("$.customerId", is(3)))
				.andExpect(jsonPath("$.email", is("alex@example.com")));

		String body = "{\"firstName\":\"Taylor\",\"lastName\":\"Morgan\",\"email\":\"new@example.com\","
				+ "\"phone\":\"555-765-4321\",\"streetAddress\":\"123 Market St\",\"city\":\"Seattle\","
				+ "\"region\":\"WA\",\"postalCode\":\"98101\",\"country\":\"United States\","
				+ "\"password\":\"attacker-value\",\"role\":\"ADMIN\"}";
		mockMvc.perform(put("/api/profile").header("Authorization", authorization)
				.contentType(MediaType.APPLICATION_JSON).content(body))
				.andExpect(status().isOk()).andExpect(jsonPath("$.firstName", is("Taylor")))
				.andExpect(jsonPath("$.lastName", is("Morgan"))).andExpect(jsonPath("$.city", is("Seattle")));

		verify(customerService).updateCustomer(customer);
		org.junit.Assert.assertEquals("secret", customer.getPassword());
		org.junit.Assert.assertEquals("USER", customer.getRole());
		org.junit.Assert.assertEquals("Taylor Morgan", customer.getName());
		org.junit.Assert.assertEquals("123 Market St\nSeattle, WA 98101\nUnited States", customer.getAddress());
	}

	@Test
	public void rejectsInvalidContactDetails() throws Exception {
		String body = "{\"firstName\":\"Alex\",\"lastName\":\"Morgan\",\"email\":\"invalid\",\"phone\":\"12\","
				+ "\"streetAddress\":\"Home\",\"city\":\"Seattle\",\"region\":\"WA\",\"postalCode\":\"98101\",\"country\":\"US\"}";
		mockMvc.perform(put("/api/profile").header("Authorization", authorization)
				.contentType(MediaType.APPLICATION_JSON).content(body))
				.andExpect(status().isBadRequest());
	}
}
