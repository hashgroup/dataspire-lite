package com.devrupt.services.fetcher.integration;

import com.devrupt.services.dto.integration.CustomerLifetimeValueDto;
import com.devrupt.services.dto.integration.CustomerLifetimeValueFilter;
import com.devrupt.services.service.integration.IntegrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetCustomerLifetimeValueListFetcher implements DataFetcher<List<CustomerLifetimeValueDto>>
{
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IntegrationService integrationService;

    @Override
    public List<CustomerLifetimeValueDto> get(DataFetchingEnvironment environment) throws Exception
    {
        CustomerLifetimeValueFilter filter = objectMapper.convertValue(environment.getArgument("filter"), CustomerLifetimeValueFilter.class);
        return integrationService.getCustomerLifetimeValueList(filter);
    }
}
