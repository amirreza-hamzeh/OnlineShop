package com.docker.onlineshop.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.docker.onlineshop.util.CustomErrorType;

@RestControllerAdvice
public class AuthenticationExceptionHandler {

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<CustomErrorType> handleInvalidCredentials(InvalidCredentialsException exception) {
		return new ResponseEntity<CustomErrorType>(
				new CustomErrorType(exception.getMessage()), HttpStatus.UNAUTHORIZED);
	}
}
