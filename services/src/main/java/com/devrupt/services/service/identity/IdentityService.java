package com.devrupt.services.service.identity;

import com.devrupt.services.dto.identity.ApaleoClientDto;
import com.devrupt.services.dto.identity.TokenRequest;
import com.devrupt.services.dto.identity.TokenResponse;
import org.springframework.http.HttpHeaders;

import java.util.List;

public interface IdentityService
{
    ApaleoClientDto getApaleoClient();

    TokenResponse exchangeToken(TokenRequest requestToken);

    TokenResponse renewToken(TokenRequest requestToken);

    HttpHeaders getHeaderWithBearer(String refreshToken);
}
