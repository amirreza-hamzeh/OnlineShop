package com.docker.atsea.controller;

import java.util.Date;
import java.util.Objects;

import javax.servlet.ServletException;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.docker.atsea.model.Customer;
import com.docker.atsea.service.CustomerService;
import com.docker.atsea.util.CustomErrorType;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RestController
@RequestMapping(path = "/login/")
public class LoginController {
	
	public static final Logger logger = LoggerFactory.getLogger(LoginController.class);
		
	@Autowired
	CustomerService customerService;
		
	private static class UserLogin {
        public String identifier;
        public String password;
    }

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping(value = "", method = RequestMethod.POST)
	public ResponseEntity<?> login(@RequestBody final UserLogin login) 
		throws ServletException {
		
		JSONObject reponseToken = new JSONObject();
		if (login.identifier == null || login.identifier.trim().isEmpty()
				|| login.password == null || login.password.isEmpty()) {
			return new ResponseEntity<Object>(new CustomErrorType(
					"Email address or phone number and password are required."), HttpStatus.BAD_REQUEST);
		}
		String identifier = login.identifier.trim();
		Customer customer = customerService.findByEmailOrPhone(identifier);
		// Account creation still signs in the newly created customer by its legacy
		// username. Keep that internal flow working while the sign-in form accepts
		// email addresses and phone numbers.
		if (customer == null) {
			customer = customerService.findByUserName(identifier);
		}
		if (customer == null) {
			logger.error("Customer with email address or phone number {} not found.", identifier);
			return new ResponseEntity(new CustomErrorType("Customer with that email address or phone number"
					+ " not found"), HttpStatus.NOT_FOUND);
		}
		
		if (Objects.deepEquals(login.password, customer.getPassword())) {
			String token = Jwts.builder().setSubject(customer.getUsername())
                .claim("roles", customer.getUsername())
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256,"secretkey")
                .compact();
			
			reponseToken.put("token", token);
			
			return new ResponseEntity<JSONObject>(reponseToken, HttpStatus.OK);
		}
		return new ResponseEntity<Object>(new CustomErrorType("Customer name or password not found."), HttpStatus.UNAUTHORIZED);
		
		
	}
}
