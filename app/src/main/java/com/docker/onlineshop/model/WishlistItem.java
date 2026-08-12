package com.docker.onlineshop.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.UniqueConstraint;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "wishlist_item", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "customerid", "productid" }) })
public class WishlistItem implements Serializable {

	private static final long serialVersionUID = 6846304112158158261L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long wishlistItemId;

	@JsonIgnore
	@ManyToOne(optional = false)
	@JoinColumn(name = "customerid", nullable = false)
	private Customer customer;

	@ManyToOne(optional = false)
	@JoinColumn(name = "productid", nullable = false)
	private Product product;

	@Column(name = "created_at", nullable = false)
	@Temporal(TemporalType.TIMESTAMP)
	private Date createdAt;

	@PrePersist
	public void setCreationDate() {
		if (createdAt == null) {
			createdAt = new Date();
		}
	}

	public Long getWishlistItemId() { return wishlistItemId; }
	public void setWishlistItemId(Long wishlistItemId) { this.wishlistItemId = wishlistItemId; }
	public Customer getCustomer() { return customer; }
	public void setCustomer(Customer customer) { this.customer = customer; }
	public Product getProduct() { return product; }
	public void setProduct(Product product) { this.product = product; }
	public Date getCreatedAt() { return createdAt; }
	public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
