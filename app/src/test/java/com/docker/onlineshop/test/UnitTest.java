package com.docker.onlineshop.test;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit4.SpringRunner;

import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.model.Order;
import com.docker.onlineshop.model.Product;
import com.docker.onlineshop.repositories.CustomerRepository;
import com.docker.onlineshop.repositories.OrderRepository;
import com.docker.onlineshop.repositories.ProductRepository;
import com.docker.onlineshop.service.CustomerService;
import com.docker.onlineshop.service.CustomerServiceImpl;
import com.docker.onlineshop.service.OrderService;
import com.docker.onlineshop.service.OrderServiceImpl;
import com.docker.onlineshop.service.ProductService;
import com.docker.onlineshop.service.ProductServiceImpl;


@SuppressWarnings("serial")
@RunWith(SpringRunner.class)
public class UnitTest {
	@Mock
	CustomerRepository customerRepository;
	
	@Mock
	CustomerService customerService;

	@InjectMocks
	CustomerServiceImpl mockCustomerServiceImpl = new CustomerServiceImpl();	
	
	@Mock
	ProductRepository productRepository;
	
	@Mock
	ProductService productService;
	
	@InjectMocks
	ProductServiceImpl mockProductServiceImpl = new ProductServiceImpl();
	
	@Mock
	OrderRepository orderRepository;
	
	@Mock
	OrderService orderService;
	
	@InjectMocks
	OrderServiceImpl mockOrderServiceImpl = new OrderServiceImpl();
	
	// Mock customer
	public Customer returnCustomer = new Customer(1L, "Arthur Dent", "Dockerland", "ad@null.com", "415-555-5555",
			"arthurd", "docker!", true, "ADMIN");
	
	// Mock product
	public Product returnProduct = new Product(1l, "Container", "container picture", 25.50, "http://localhost:8080/onlineshop/static/images/container.jpg");
	
	// Mock order
	public Date orderDate = new Date(); 
	private static Map<Integer, Integer> productsOrdered;
    static{
      productsOrdered =   new HashMap<Integer, Integer>() {{
            put(2, 4);
            put(3, 9);
            put(4, 16);
        }};
    }
	public Order mockOrder = new Order(1L, orderDate, 2l, productsOrdered);
	public Order referenceOrder = new Order(1l, orderDate, 2l, productsOrdered);
	
	// Test CustomerService implementation
	@Test
	public void whenCustomerUserNameIsProvided_theReturnedNameIsCorrect() {
		Mockito.when(mockCustomerServiceImpl.findByUserName("arthurd")).thenReturn(returnCustomer);
		String testName = returnCustomer.getName();
		Assert.assertEquals("Arthur Dent", testName);
	}

	@Test
	public void createCustomerUsesNormalizedEmailAsInternalIdentifier() {
		Customer customer = new Customer(0L, "  Arthur Dent  ", "Not provided", "  AD@NULL.COM ", null,
				null, "docker!", true, "USER");
		Mockito.when(customerRepository.save(customer)).thenReturn(customer);

		mockCustomerServiceImpl.createCustomer(customer);

		Assert.assertEquals("Arthur Dent", customer.getName());
		Assert.assertEquals("ad@null.com", customer.getEmail());
		Assert.assertNull(customer.getPhone());
		Assert.assertEquals("ad@null.com", customer.getUsername());
	}

	@Test
	public void createCustomerUsesNormalizedPhoneWhenEmailIsAbsent() {
		Customer customer = new Customer(0L, "Ford Prefect", "Not provided", null, "+1 (415) 555-5555",
				null, "docker!", true, "USER");
		Mockito.when(customerRepository.save(customer)).thenReturn(customer);

		mockCustomerServiceImpl.createCustomer(customer);

		Assert.assertEquals("14155555555", customer.getPhone());
		Assert.assertEquals("14155555555", customer.getUsername());
	}

	@Test
	public void findCustomerNormalizesEitherLoginIdentifier() {
		mockCustomerServiceImpl.findByEmailOrPhone("  AD@NULL.COM ");
		Mockito.verify(customerRepository).findByEmailOrPhone("ad@null.com");

		mockCustomerServiceImpl.findByEmailOrPhone("+1 (415) 555-5555");
		Mockito.verify(customerRepository).findByEmailOrPhone("14155555555");
	}
	
	// Test ProductService implementation
	@Test
	public void whenProductIdIdProvided_theReturnedDescriptionIsIncorrect(){
		Mockito.when(mockProductServiceImpl.findById(1l)).thenReturn(returnProduct);
		String testDescription = returnProduct.getDescription();
		Assert.assertNotEquals("a whale", testDescription);
	}
	
	// Test OrderService implementation
	@Test
	public void whenOrderFindById_theReferenceOrderDoesNotMatch() {
		Mockito.when(mockOrderServiceImpl.findById(1l)).thenReturn(referenceOrder);
		Assert.assertNotEquals(mockOrder, referenceOrder);
	}

	@Test
	public void orderStatusSupportsLegacyRowsAndKnownFulfillmentStates() {
		mockOrder.setStatus(null);
		Assert.assertEquals("Processing", mockOrder.getStatus());
		Assert.assertFalse(mockOrder.hasStatus());
		mockOrder.setStatus("SHIPPED");
		Assert.assertEquals("Shipped", mockOrder.getStatus());
		Assert.assertTrue(mockOrder.hasStatus());
		mockOrder.setStatus("delivered");
		Assert.assertEquals("Delivered", mockOrder.getStatus());
	}
	
}
