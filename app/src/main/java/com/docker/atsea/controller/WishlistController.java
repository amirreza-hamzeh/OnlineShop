package com.docker.atsea.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.docker.atsea.model.Customer;
import com.docker.atsea.model.Product;
import com.docker.atsea.model.WishlistItem;
import com.docker.atsea.service.CustomerService;
import com.docker.atsea.service.ProductService;
import com.docker.atsea.service.WishlistService;
import com.docker.atsea.util.CustomErrorType;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
	@Autowired CustomerService customerService;
	@Autowired ProductService productService;
	@Autowired WishlistService wishlistService;

	@RequestMapping(value = "", method = RequestMethod.GET)
	public ResponseEntity<?> getWishlist(HttpServletRequest request) {
		Customer customer = authenticatedCustomer(request);
		if (customer == null) return unauthorized();
		return new ResponseEntity<List<WishlistItem>>(wishlistService.findForCustomer(customer.getCustomerId()), HttpStatus.OK);
	}

	@RequestMapping(value = "/product/{productId}", method = RequestMethod.POST)
	public ResponseEntity<?> addProduct(HttpServletRequest request, @PathVariable("productId") long productId) {
		Customer customer = authenticatedCustomer(request);
		if (customer == null) return unauthorized();
		Product product = productService.findById(productId);
		if (product == null) return new ResponseEntity<CustomErrorType>(new CustomErrorType("Product not found"), HttpStatus.NOT_FOUND);
		WishlistItem existing = wishlistService.find(customer.getCustomerId(), productId);
		WishlistItem item = wishlistService.add(customer, product);
		return new ResponseEntity<WishlistItem>(item, existing == null ? HttpStatus.CREATED : HttpStatus.OK);
	}

	@RequestMapping(value = "/product/{productId}", method = RequestMethod.DELETE)
	public ResponseEntity<?> removeProduct(HttpServletRequest request, @PathVariable("productId") long productId) {
		Customer customer = authenticatedCustomer(request);
		if (customer == null) return unauthorized();
		WishlistItem item = wishlistService.find(customer.getCustomerId(), productId);
		if (item == null) return new ResponseEntity<CustomErrorType>(new CustomErrorType("Product is not in this wish list"), HttpStatus.NOT_FOUND);
		wishlistService.remove(item);
		return new ResponseEntity<Object>(HttpStatus.NO_CONTENT);
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
		return new ResponseEntity<CustomErrorType>(new CustomErrorType("Sign in to access your wish list"), HttpStatus.UNAUTHORIZED);
	}
}
