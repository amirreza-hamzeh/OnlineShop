package com.docker.onlineshop.service;

import java.util.List;

import com.docker.onlineshop.model.Comment;

public interface CommentService {
	List<Comment> findByProductId(long productId);
	Comment save(Comment comment);
}
