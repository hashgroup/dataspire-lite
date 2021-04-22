package com.devrupt.services;

import com.devrupt.services.config.restTemplate.cookie.RestTemplateStandardCookieCustomizer;
import com.devrupt.services.config.restTemplate.errorHandler.RestTemplateResponseErrorHandler;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
public class ServicesApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServicesApplication.class, args);
    }

    @Bean(name = "restTemplate")
    public RestTemplate createRestTemplate() {
        return new RestTemplateBuilder()
                .additionalCustomizers(new RestTemplateStandardCookieCustomizer())
                .errorHandler(new RestTemplateResponseErrorHandler())
                .build();
    }

    @Bean(name = "objectMapper")
    public ObjectMapper createObjectMapper(){
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        objectMapper.registerModule(new JavaTimeModule());

        return objectMapper;
    }
}
