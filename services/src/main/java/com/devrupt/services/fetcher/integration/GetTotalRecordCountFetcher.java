package com.devrupt.services.fetcher.integration;

import com.devrupt.services.dto.integration.ProcessFilter;
import com.devrupt.services.service.integration.IntegrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class GetTotalRecordCountFetcher implements DataFetcher<Integer>
{
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IntegrationService integrationService;

    @Override
    public Integer get(DataFetchingEnvironment environment) throws Exception
    {
        ProcessFilter filter = objectMapper.convertValue(environment.getArgument("filter"), ProcessFilter.class);
        return integrationService.getTotalRecordCount(filter);
    }
}
