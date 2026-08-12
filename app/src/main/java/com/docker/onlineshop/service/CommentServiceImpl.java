package com.docker.onlineshop.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.docker.onlineshop.model.Comment;
import com.docker.onlineshop.repositories.CommentRepository;

@Service("commentService")
@Transactional
public class CommentServiceImpl implements CommentService {

	@Autowired
	private CommentRepository commentRepository;

	public List<Comment> findByProductId(long productId) {
		return commentRepository.findByProductProductIdOrderByCreatedAtDesc(productId);
	}

	public Comment save(Comment comment) {
		return commentRepository.save(comment);
	}
}
