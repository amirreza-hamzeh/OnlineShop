package com.docker.onlineshop.exception;

/**
 * Raised when supplied login credentials do not identify an authenticated user.
 *
 * The exception deliberately does not say which credential was incorrect so the
 * API does not disclose whether a customer account exists.
 */
public class InvalidCredentialsException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public InvalidCredentialsException() {
		super("The email address or password is incorrect.");
	}
}
