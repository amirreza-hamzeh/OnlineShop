package com.docker.atsea.model;

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

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "comment")
public class Comment implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long commentId;

	@ManyToOne(optional = false)
	@JoinColumn(name = "productid", nullable = false)
	@JsonIgnore
	private Product product;

	@Column(name = "name", length = 255, nullable = false)
	private String name;

	@Column(name = "title", length = 255, nullable = false)
	private String title;

	@Column(name = "comment_text", length = 10000, nullable = false)
	private String text;

	@Column(name = "rating", nullable = false)
	private int rating;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "created_at", nullable = false)
	private Date createdAt;

	@Column(name = "verified", nullable = false)
	private boolean verified;

	@PrePersist
	public void setCreationDate() {
		if (createdAt == null) {
			createdAt = new Date();
		}
	}

	public long getCommentId() { return commentId; }
	public void setCommentId(long commentId) { this.commentId = commentId; }
	public Product getProduct() { return product; }
	public void setProduct(Product product) { this.product = product; }
	public String getName() { return name; }
	public void setName(String name) { this.name = name; }
	public String getTitle() { return title; }
	public void setTitle(String title) { this.title = title; }
	public String getText() { return text; }
	public void setText(String text) { this.text = text; }
	public int getRating() { return rating; }
	public void setRating(int rating) { this.rating = rating; }
	public Date getCreatedAt() { return createdAt; }
	public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
	public boolean isVerified() { return verified; }
	public void setVerified(boolean verified) { this.verified = verified; }
}
