package com.devrupt.services.controller.rest.identity;

import com.devrupt.services.config.restTemplate.exception.RestTemplateException;
import com.devrupt.services.dto.identity.TokenRequest;
import com.devrupt.services.dto.identity.TokenResponse;
import com.devrupt.services.service.identity.IdentityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@Controller
@RequestMapping(value = "/token")
public class IdentityController
{
    @Autowired
    protected IdentityService identityService;

    @PostMapping(value = "/exchange")
    public ResponseEntity<TokenResponse> exchangeToken(@RequestBody TokenRequest tokenRequest)
    {
        return ResponseEntity.ok(identityService.exchangeToken(tokenRequest));
    }

    @PostMapping(value = "/renew")
    public ResponseEntity<TokenResponse> renewToken(@RequestBody TokenRequest tokenRequest)
    {
        return ResponseEntity.ok(identityService.renewToken(tokenRequest));
    }

    @ExceptionHandler({RestTemplateException.class})
    public ResponseEntity<String> handleException(RestTemplateException ex)
    {
        return ResponseEntity.status(ex.getStatus()).body(ex.getMessage());
    }
}
