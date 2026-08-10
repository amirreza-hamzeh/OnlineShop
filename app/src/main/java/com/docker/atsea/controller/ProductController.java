package com.docker.atsea.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.docker.atsea.model.Comment;
import com.docker.atsea.model.Product;
import com.docker.atsea.service.CommentService;
import com.docker.atsea.service.ProductService;
import com.docker.atsea.util.CustomErrorType;

@RestController
@RequestMapping("/api")
public class ProductController {
	public static final Logger logger = LoggerFactory.getLogger(ProductController.class);
	
	@Autowired
	ProductService productService;

	@Autowired
	CommentService commentService;
	
	// -------------------------------------------------------------------
	//                   Product methods
	//--------------------------------------------------------------------


	// -------------------Retrieve All Products---------------------------------------------

	@RequestMapping(value = "/product/", method = RequestMethod.GET)
	public ResponseEntity<List<Product>> listAllProducts() {
		List<Product> products = productService.findAllProducts();
		if (products.isEmpty()) {
			return new ResponseEntity<List<Product>>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<List<Product>>(products, HttpStatus.OK);
	}

	// -------------------Retrieve Single Product By Id------------------------------------------

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "/product/{productId}", method = RequestMethod.GET)
	public ResponseEntity<?> getProduct(@PathVariable("productId") long productId) {
		logger.info("Fetching Product with id {}", productId);
		Product product = productService.findById(productId);
		if (product == null) {
			logger.error("Product with id {} not found.", productId);
			return new ResponseEntity(new CustomErrorType("Product with id " + productId 
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<Product>(product, HttpStatus.OK);
	}

	@RequestMapping(value = "/product/{productId}/comments", method = RequestMethod.GET)
	public ResponseEntity<?> listComments(@PathVariable("productId") long productId) {
		if (productService.findById(productId) == null) {
			return new ResponseEntity<CustomErrorType>(new CustomErrorType("Product with id " + productId
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		return new ResponseEntity<List<Comment>>(commentService.findByProductId(productId), HttpStatus.OK);
	}

	@RequestMapping(value = "/product/{productId}/comments", method = RequestMethod.POST)
	public ResponseEntity<?> createComment(@PathVariable("productId") long productId,
			@RequestBody Comment comment) {
		Product product = productService.findById(productId);
		if (product == null) {
			return new ResponseEntity<CustomErrorType>(new CustomErrorType("Product with id " + productId
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		if (comment == null || isBlank(comment.getName()) || isBlank(comment.getTitle())
				|| isBlank(comment.getText()) || comment.getRating() < 1 || comment.getRating() > 5
				|| comment.getName().trim().length() > 255 || comment.getTitle().trim().length() > 255
				|| comment.getText().trim().length() > 10000) {
			return new ResponseEntity<CustomErrorType>(new CustomErrorType("A valid name, title, text, and rating from 1 to 5 are required"), HttpStatus.BAD_REQUEST);
		}
		comment.setCommentId(0);
		comment.setName(comment.getName().trim());
		comment.setTitle(comment.getTitle().trim());
		comment.setText(comment.getText().trim());
		comment.setProduct(product);
		comment.setCreatedAt(null);
		comment.setVerified(false);
		return new ResponseEntity<Comment>(commentService.save(comment), HttpStatus.CREATED);
	}

	private boolean isBlank(String value) {
		return value == null || value.trim().isEmpty();
	}
}
