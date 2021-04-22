package com.devrupt.services.config.restTemplate.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class RestTemplateException extends RuntimeException {
    private HttpStatus status;

    public RestTemplateException() {
        super();
    }

    public RestTemplateException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
