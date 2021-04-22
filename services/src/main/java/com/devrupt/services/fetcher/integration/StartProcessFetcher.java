package com.devrupt.services.fetcher.integration;

import com.devrupt.services.dto.integration.ProcessDto;
import com.devrupt.services.dto.integration.ProcessInput;
import com.devrupt.services.service.integration.IntegrationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class StartProcessFetcher implements DataFetcher<ProcessDto>
{
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IntegrationService integrationService;

    @Override
    public ProcessDto get(DataFetchingEnvironment environment) throws Exception
    {
        ProcessInput input = objectMapper.convertValue(environment.getArgument("input"), ProcessInput.class);
        return integrationService.startProcess(input);
    }
}
