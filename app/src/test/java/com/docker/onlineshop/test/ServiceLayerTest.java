package com.docker.onlineshop.test;

import static org.junit.Assert.assertSame;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringRunner;

import com.docker.onlineshop.model.Comment;
import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.model.Order;
import com.docker.onlineshop.model.Product;
import com.docker.onlineshop.model.WishlistItem;
import com.docker.onlineshop.repositories.CommentRepository;
import com.docker.onlineshop.repositories.CustomerRepository;
import com.docker.onlineshop.repositories.OrderRepository;
import com.docker.onlineshop.repositories.ProductRepository;
import com.docker.onlineshop.repositories.WishlistRepository;
import com.docker.onlineshop.service.CommentServiceImpl;
import com.docker.onlineshop.service.CustomerServiceImpl;
import com.docker.onlineshop.service.OrderServiceImpl;
import com.docker.onlineshop.service.ProductServiceImpl;
import com.docker.onlineshop.service.WishlistServiceImpl;

@RunWith(SpringRunner.class)
public class ServiceLayerTest {
    @Mock private CustomerRepository customerRepository;
    @Mock private ProductRepository productRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private CommentRepository commentRepository;
    @Mock private WishlistRepository wishlistRepository;

    @InjectMocks private CustomerServiceImpl customerService;
    @InjectMocks private ProductServiceImpl productService;
    @InjectMocks private OrderServiceImpl orderService;
    @InjectMocks private CommentServiceImpl commentService;
    @InjectMocks private WishlistServiceImpl wishlistService;

    private Customer customer;
    private Product product;

    @Before
    public void setup() {
        customer = new Customer(4L, "Trillian", "Earth", "trillian@example.com", null,
                "trillian@example.com", "secret", true, "USER");
        product = new Product(9L, "Towel", "Always know where it is", 12.5, "towel.png");
    }

    @Test
    public void customerCrudAndDuplicateChecksDelegateToRepository() {
        List<Customer> customers = Arrays.asList(customer);
        when(customerRepository.findOne(4L)).thenReturn(customer);
        when(customerRepository.findByUserName("trillian@example.com")).thenReturn(customer);
        when(customerRepository.findByName("Trillian")).thenReturn(customer);
        when(customerRepository.findAll()).thenReturn(customers);
        when(customerRepository.findByEmailOrPhone("trillian@example.com")).thenReturn(customer);

        assertSame(customer, customerService.findById(4L));
        assertSame(customer, customerService.findByUserName("trillian@example.com"));
        assertSame(customer, customerService.findByName("Trillian"));
        assertSame(customers, customerService.findAllCustomers());
        org.junit.Assert.assertTrue(customerService.customerExist(customer));

        customerService.saveCustomer(customer);
        customerService.updateCustomer(customer);
        customerService.deleteCustomerById(4L);
        customerService.deleteAllCustomers();
        verify(customerRepository, Mockito.times(2)).save(customer);
        verify(customerRepository).delete(4L);
        verify(customerRepository).deleteAll();
    }

    @Test
    public void productAndCommentQueriesReturnRepositoryResults() {
        Comment comment = new Comment();
        List<Product> products = Arrays.asList(product);
        List<Comment> comments = Arrays.asList(comment);
        when(productRepository.findAll()).thenReturn(products);
        when(productRepository.findOne(9L)).thenReturn(product);
        when(productRepository.findByName("Towel")).thenReturn(product);
        when(commentRepository.findByProductProductIdOrderByCreatedAtDesc(9L)).thenReturn(comments);
        when(commentRepository.save(comment)).thenReturn(comment);

        assertSame(products, productService.findAllProducts());
        assertSame(product, productService.findById(9L));
        assertSame(product, productService.findByName("Towel"));
        assertSame(comments, commentService.findByProductId(9L));
        assertSame(comment, commentService.save(comment));
    }

    @Test
    public void orderLifecycleAndCustomerHistoryDelegateToRepository() {
        Order order = new Order();
        order.setOrderId(13L);
        List<Order> orders = Arrays.asList(order);
        when(orderRepository.save(order)).thenReturn(order);
        when(orderRepository.findOne(13L)).thenReturn(order);
        when(orderRepository.findAll()).thenReturn(orders);
        when(orderRepository.findByCustomerIdOrderByOrderDateDescOrderIdDesc(4L)).thenReturn(orders);

        assertSame(order, orderService.createOrder(order));
        verify(orderRepository).flush();
        org.junit.Assert.assertTrue(orderService.orderExists(order));
        assertSame(orders, orderService.findAllOrders());
        assertSame(orders, orderService.findOrdersByCustomerId(4L));
        orderService.saveOrder(order);
        orderService.updateOrder(order);
        orderService.deleteOrderById(13L);
        orderService.deleteAllItems();
        verify(orderRepository, Mockito.times(3)).save(order);
        verify(orderRepository).delete(13L);
        verify(orderRepository).deleteAll();
    }

    @Test
    public void wishlistAddIsIdempotentAndRemoveIsScopedToTheItem() {
        WishlistItem existing = new WishlistItem();
        when(wishlistRepository.findByCustomerCustomerIdAndProductProductId(4L, 9L)).thenReturn(existing);
        assertSame(existing, wishlistService.add(customer, product));
        verify(wishlistRepository, never()).save(Mockito.any(WishlistItem.class));

        when(wishlistRepository.findByCustomerCustomerIdAndProductProductId(4L, 9L)).thenReturn(null);
        when(wishlistRepository.save(Mockito.any(WishlistItem.class))).thenAnswer(invocation -> invocation.getArguments()[0]);
        WishlistItem created = wishlistService.add(customer, product);
        assertSame(customer, created.getCustomer());
        assertSame(product, created.getProduct());
        wishlistService.remove(created);
        verify(wishlistRepository).delete(created);
    }
}
