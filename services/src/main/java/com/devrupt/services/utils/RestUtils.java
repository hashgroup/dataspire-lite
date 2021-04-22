package com.devrupt.services.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RestUtils
{
    @Autowired
    private RestTemplate restTemplate;

    final Logger logger = LoggerFactory.getLogger(RestUtils.class);

    /**
     * @param body
     * @param headers
     * @param responseModel
     * @param <T>
     * @return
     */
    public <T> T constructRequestAndCall(String url, Object body, HttpHeaders headers,
                                         HttpMethod method, Class<T> responseModel)
    {
        HttpEntity request = new HttpEntity<>(body, headers);
        ResponseEntity<T> response = call(url, method, request, responseModel);
        return response.getBody();

    }

    /**
     * @param url
     * @param method
     * @param requestPayload
     * @param responseModel
     * @param <T>
     * @return
     */
    public <T> ResponseEntity<T> call(String url, HttpMethod method, HttpEntity requestPayload, Class<T> responseModel)
    {
        logger.info("API request {} url: {}", method, url);
        logger.info("API payload: {}", requestPayload);

        ResponseEntity<T> response = restTemplate.exchange(url, method, requestPayload, responseModel);
        logger.info("API response: {}", response);
        logger.info("------------------------------------------------------------------------------------------------");

        return response;
    }
}
