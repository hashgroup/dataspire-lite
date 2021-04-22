package com.devrupt.services.fetcher.identity;

import com.devrupt.services.dto.identity.ApaleoClientDto;
import com.devrupt.services.service.identity.IdentityService;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GetApaleoClientFetcher implements DataFetcher<ApaleoClientDto>
{
    @Autowired
    private IdentityService tokenService;

    @Override
    public ApaleoClientDto get(DataFetchingEnvironment environment) throws Exception
    {
        return tokenService.getApaleoClient();
    }
}
