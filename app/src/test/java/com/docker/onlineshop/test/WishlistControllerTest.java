package com.docker.onlineshop.test;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Collections;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.docker.onlineshop.controller.WishlistController;
import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.model.Product;
import com.docker.onlineshop.model.WishlistItem;
import com.docker.onlineshop.service.CustomerService;
import com.docker.onlineshop.service.ProductService;
import com.docker.onlineshop.service.WishlistService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RunWith(SpringRunner.class)
public class WishlistControllerTest {
	@Mock private CustomerService customerService;
	@Mock private ProductService productService;
	@Mock private WishlistService wishlistService;
	@InjectMocks private WishlistController controller;

	private MockMvc mockMvc;
	private Customer customer;
	private String authorization;

	@Before
	public void setup() {
		mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
		customer = new Customer(3L, "Alex", "Home", "alex@example.com", "555", "alex", "password", true, "USER");
		authorization = "Bearer " + Jwts.builder().setSubject("alex")
				.signWith(SignatureAlgorithm.HS256, "secretkey").compact();
		when(customerService.findByUserName("alex")).thenReturn(customer);
	}

	@Test
	public void wishlistRequiresAuthentication() throws Exception {
		mockMvc.perform(get("/api/wishlist")).andExpect(status().isUnauthorized());
	}

	@Test
	public void addAndListWishlistProductsForAuthenticatedCustomer() throws Exception {
		Product product = new Product(8L, "Bag", "A bag", 42.0, "bag.png");
		WishlistItem item = new WishlistItem();
		item.setWishlistItemId(11L);
		item.setCustomer(customer);
		item.setProduct(product);
		when(productService.findById(8L)).thenReturn(product);
		when(wishlistService.add(customer, product)).thenReturn(item);
		when(wishlistService.findForCustomer(3L)).thenReturn(Collections.singletonList(item));

		mockMvc.perform(post("/api/wishlist/product/8").header("Authorization", authorization))
				.andExpect(status().isCreated()).andExpect(jsonPath("$.product.productId", is(8)));
		mockMvc.perform(get("/api/wishlist").header("Authorization", authorization))
				.andExpect(status().isOk()).andExpect(jsonPath("$[0].wishlistItemId", is(11)));
	}

	@Test
	public void removesOnlyTheCurrentCustomersWishlistItem() throws Exception {
		WishlistItem item = new WishlistItem();
		when(wishlistService.find(3L, 8L)).thenReturn(item);
		mockMvc.perform(delete("/api/wishlist/product/8").header("Authorization", authorization))
				.andExpect(status().isNoContent());
		verify(wishlistService).remove(item);
	}
}
