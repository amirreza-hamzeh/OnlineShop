package com.docker.onlineshop.test;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import javax.servlet.FilterChain;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.docker.onlineshop.controller.LoginController;
import com.docker.onlineshop.controller.PurchaseController;
import com.docker.onlineshop.controller.UtilityController;
import com.docker.onlineshop.exception.AuthenticationExceptionHandler;
import com.docker.onlineshop.model.Customer;
import com.docker.onlineshop.security.JwtFilter;
import com.docker.onlineshop.service.CustomerService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@RunWith(SpringRunner.class)
public class InfrastructureControllerTest {
    @Mock private CustomerService customerService;
    @Mock private JdbcTemplate jdbcTemplate;
    @Mock private FilterChain filterChain;
    @InjectMocks private LoginController loginController;
    @InjectMocks private UtilityController utilityController;

    private MockMvc loginMvc;

    @Before
    public void setup() {
        loginMvc = MockMvcBuilders.standaloneSetup(loginController)
                .setControllerAdvice(new AuthenticationExceptionHandler()).build();
    }

    @Test
    public void loginValidatesCredentialsAndReturnsSignedToken() throws Exception {
        Customer customer = new Customer(2L, "Ford", "Betelgeuse", "ford@example.com", null,
                "ford@example.com", "towel", true, "USER");
        when(customerService.findByEmailOrPhone("ford@example.com")).thenReturn(customer);

        loginMvc.perform(post("/login/").contentType(MediaType.APPLICATION_JSON)
                .content("{\"identifier\":\" ford@example.com \",\"password\":\"towel\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.token", notNullValue()));
        loginMvc.perform(post("/login/").contentType(MediaType.APPLICATION_JSON)
                .content("{\"identifier\":\"ford@example.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.errorMessage").value("The email address or password is incorrect."));
        loginMvc.perform(post("/login/").contentType(MediaType.APPLICATION_JSON)
                .content("{\"identifier\":\"unknown@example.com\",\"password\":\"towel\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(jsonPath("$.errorMessage").value("The email address or password is incorrect."));
        loginMvc.perform(post("/login/").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
        loginMvc.perform(post("/login/").contentType(MediaType.APPLICATION_JSON).content("null"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorMessage")
                        .value("Email address or phone number and password are required."));
    }

    @Test
    public void utilityHealthCheckReportsDatabaseSuccessAndFailure() throws Exception {
        MockMvc utilityMvc = MockMvcBuilders.standaloneSetup(utilityController).build();
        when(jdbcTemplate.queryForObject(org.mockito.Matchers.anyString(), org.mockito.Matchers.eq(String.class)))
                .thenReturn("2026-08-12 10:30");
        utilityMvc.perform(get("/utility/healthcheck/"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("2026-08-12 10:30"));

        when(jdbcTemplate.queryForObject(org.mockito.Matchers.anyString(), org.mockito.Matchers.eq(String.class)))
                .thenThrow(new RuntimeException("database unavailable"));
        utilityMvc.perform(get("/utility/healthcheck/"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.errorMessage", containsString("Database not responding")));
    }

    @Test
    public void purchaseEndpointReturnsConfirmation() throws Exception {
        MockMvc mvc = MockMvcBuilders.standaloneSetup(new PurchaseController()).build();
        mvc.perform(get("/purchase/"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.message", containsString("Thank you")));
    }

    @Test
    public void jwtFilterAcceptsSignedTokensAndRejectsMissingHeaders() throws Exception {
        JwtFilter filter = new JwtFilter();
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer " + Jwts.builder().setSubject("ford@example.com")
                .signWith(SignatureAlgorithm.HS256, "secretkey").compact());
        MockHttpServletResponse response = new MockHttpServletResponse();
        filter.doFilter(request, response, filterChain);
        org.junit.Assert.assertEquals("ford@example.com",
                ((io.jsonwebtoken.Claims) request.getAttribute("claims")).getSubject());
        org.mockito.Mockito.verify(filterChain).doFilter(request, response);

        try {
            filter.doFilter(new MockHttpServletRequest(), new MockHttpServletResponse(), filterChain);
            org.junit.Assert.fail("A request without an Authorization header must be rejected");
        } catch (javax.servlet.ServletException expected) {
            org.junit.Assert.assertTrue(expected.getMessage().contains("Authorization"));
        }
    }
}
