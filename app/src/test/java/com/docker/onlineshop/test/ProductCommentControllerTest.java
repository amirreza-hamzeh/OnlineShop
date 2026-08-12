package com.docker.onlineshop.test;

import static org.hamcrest.Matchers.is;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

import com.docker.onlineshop.controller.ProductController;
import com.docker.onlineshop.model.Comment;
import com.docker.onlineshop.model.Product;
import com.docker.onlineshop.service.CommentService;
import com.docker.onlineshop.service.ProductService;

@RunWith(SpringRunner.class)
public class ProductCommentControllerTest {

	@Mock
	private ProductService productService;

	@Mock
	private CommentService commentService;

	@InjectMocks
	private ProductController productController;

	private MockMvc mockMvc;

	@Before
	public void setup() {
		mockMvc = MockMvcBuilders.standaloneSetup(productController).build();
	}

	@Test
	public void createCommentPersistsItForTheRequestedProduct() throws Exception {
		Product product = new Product(7L, "Lamp", "A lamp", 25.0, "lamp.png");
		when(productService.findById(7L)).thenReturn(product);
		when(commentService.save(any(Comment.class))).thenAnswer(invocation -> {
			Comment comment = (Comment) invocation.getArguments()[0];
			comment.setCommentId(12L);
			comment.setCreationDate();
			return comment;
		});

		mockMvc.perform(post("/api/product/7/comments")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"  Alex  \",\"title\":\"Useful\",\"text\":\"Works well\",\"rating\":5}"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.commentId", is(12)))
				.andExpect(jsonPath("$.name", is("Alex")))
				.andExpect(jsonPath("$.verified", is(false)));

		verify(commentService).save(any(Comment.class));
	}

	@Test
	public void createCommentRejectsInvalidRatings() throws Exception {
		when(productService.findById(7L)).thenReturn(new Product());

		mockMvc.perform(post("/api/product/7/comments")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Alex\",\"title\":\"Nope\",\"text\":\"Invalid\",\"rating\":6}"))
				.andExpect(status().isBadRequest());
	}

	@Test
	public void createCommentRejectsValuesThatDoNotFitDatabaseColumns() throws Exception {
		when(productService.findById(7L)).thenReturn(new Product());
		StringBuilder longName = new StringBuilder();
		for (int index = 0; index < 256; index++) {
			longName.append('a');
		}

		mockMvc.perform(post("/api/product/7/comments")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"" + longName + "\",\"title\":\"Title\",\"text\":\"Text\",\"rating\":5}"))
				.andExpect(status().isBadRequest());
	}
}
