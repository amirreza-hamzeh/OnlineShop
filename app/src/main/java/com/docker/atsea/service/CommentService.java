package com.docker.atsea.service;

import java.util.List;

import com.docker.atsea.model.Comment;

public interface CommentService {
	List<Comment> findByProductId(long productId);
	Comment save(Comment comment);
}
