package com.docker.atsea.model;

import java.io.Serializable;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@Entity
@Table(name = "orders")
@JsonInclude(Include.NON_NULL)
public class Order implements Serializable {
	
	private static final long serialVersionUID = 8367647197454666804L;

	@Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long orderId;
	
    @CreationTimestamp
    @Temporal(TemporalType.DATE)
    @Column(name = "orderdate" )
    private Date orderDate;
        
    @Column(name = "customerid")
    private Long customerId;

    // Keep this nullable for databases that already contain orders. The getter
    // supplies the initial state for legacy rows created before status existed.
    @Column(name = "status")
    private String status;
    
    @ElementCollection
    @MapKeyColumn(name="productid")
    @Column(name = "productsordered")
    @CollectionTable(name="orderquantities", joinColumns=@JoinColumn(name="orderid"))
    Map<Integer, Integer> productsOrdered = new HashMap<Integer, Integer>();

    
    public Order(){
		
	}
	
	public Order(Long orderId, Date orderDate, Long productId, Map<Integer, Integer> productsOrdered) {
    	this.orderId = orderId;
    	this.orderDate = orderDate;
    	this.productsOrdered = productsOrdered;
	}

    public Order(Long orderId, Date orderDate, Long productId, Map<Integer, Integer> productsOrdered, Long customerId) { 
    	this.orderId = orderId;
    	this.orderDate = orderDate;
    	this.productsOrdered = productsOrdered;
    	this.customerId = customerId;
    };

	public Long getCustomerId() {
		return customerId;
	}
	
    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getStatus() {
        if (status == null || status.trim().isEmpty()) return "Processing";
        if ("shipped".equalsIgnoreCase(status)) return "Shipped";
        if ("delivered".equalsIgnoreCase(status)) return "Delivered";
        return "Processing";
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean hasStatus() {
        return status != null && !status.trim().isEmpty();
    }
    
    public Long getOrderId() {
    	return orderId;
    }
    
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
    
    public Date getOrderDate() {
    	return orderDate;
    }
    
    public void setOrderDate(Date orderDate) {
        this.orderDate = orderDate;
    }
        
    public Map<Integer, Integer> getProductsOrdered() {
    	return productsOrdered;
    }
    
    public void setProductsOrdered(Map<Integer, Integer> productsOrdered) {
    	this.productsOrdered = productsOrdered;
    }
    	
	@Override
	public String toString() {
		return "Order [customerId = " + customerId + 
				      "orderDate= " + orderDate + 
				      "orderId = "+ orderId + 
				      "status = " + getStatus() +
				      "productsOrdered = " + productsOrdered +
				      "]";
	}
}
