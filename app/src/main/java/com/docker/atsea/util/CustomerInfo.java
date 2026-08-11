package com.docker.atsea.util;

import org.json.simple.JSONObject;

import com.docker.atsea.model.Customer;

public class CustomerInfo {
	
	@SuppressWarnings("unchecked")
	public JSONObject getCustomerInfo(Customer customer) {
		JSONObject customerInfo = new JSONObject();
		customerInfo.put("customerId", customer.getCustomerId());
		customerInfo.put("name", customer.getName());
		customerInfo.put("firstName", customer.getFirstName());
		customerInfo.put("lastName", customer.getLastName());
		customerInfo.put("username", customer.getUsername());
		customerInfo.put("email", customer.getEmail());
		customerInfo.put("phone", customer.getPhone());
		customerInfo.put("address", customer.getAddress());
		customerInfo.put("streetAddress", customer.getStreetAddress());
		customerInfo.put("city", customer.getCity());
		customerInfo.put("region", customer.getRegion());
		customerInfo.put("postalCode", customer.getPostalCode());
		customerInfo.put("country", customer.getCountry());
		
		return customerInfo;
	}

}
