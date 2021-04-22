package com.devrupt.services.fetcher.identity;

import com.devrupt.services.dto.identity.TokenRequest;
import com.devrupt.services.dto.identity.TokenResponse;
import com.devrupt.services.service.identity.IdentityService;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RenewTokenFetcher implements DataFetcher<TokenResponse>
{
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IdentityService tokenService;

    @Override
    public TokenResponse get(DataFetchingEnvironment environment) throws Exception
    {
        TokenRequest tokenRequest = objectMapper.convertValue(environment.getArgument("input"), TokenRequest.class);
        return tokenService.renewToken(tokenRequest);
    }
}
