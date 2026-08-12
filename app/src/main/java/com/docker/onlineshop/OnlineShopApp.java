package com.docker.onlineshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import com.docker.onlineshop.configuration.JpaConfiguration;
import com.docker.onlineshop.controller.LoginController;
import com.docker.onlineshop.security.JwtFilter;


@Import(JpaConfiguration.class)
@SpringBootApplication(scanBasePackages={"com.docker.onlineshop"})
@EntityScan("com.docker.onlineshop.model")
@EnableJpaRepositories("com.docker.onlineshop.repository")
public class OnlineShopApp {

	@Bean
    public FilterRegistrationBean jwtFilter() {
        final FilterRegistrationBean registrationBean = new FilterRegistrationBean();
        registrationBean.setFilter(new JwtFilter());
        registrationBean.addUrlPatterns("/purchase/*");

        return registrationBean;
    }
	
	public static void main(String[] args) {
		SpringApplication.run(OnlineShopApp.class, args);
	}
}
