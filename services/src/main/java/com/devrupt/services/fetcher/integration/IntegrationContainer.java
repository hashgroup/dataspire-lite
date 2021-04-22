package com.devrupt.services.fetcher.integration;

import com.devrupt.services.config.graphql.typeWiring.FetcherContainer;
import graphql.schema.DataFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class IntegrationContainer implements FetcherContainer
{
    @Autowired
    private GetProcessStateFetcher getProcessStateFetcher;

    @Autowired
    private StartProcessFetcher startProcessFetcher;

    @Autowired
    private GetCustomerLifetimeValueListFetcher getCustomerLifetimeValueListFetcher;

    @Autowired
    private GetTotalRecordCountFetcher getTotalRecordCountFetcher;

    @Override
    public Map<String, DataFetcher<?>> query()
    {
        Map<String, DataFetcher<?>> query = new HashMap<>();

        query.put("getProcessState", getProcessStateFetcher);
        query.put("getCustomerLifetimeValueList", getCustomerLifetimeValueListFetcher);
        query.put("getTotalRecordCount", getTotalRecordCountFetcher);

        return query;
    }

    @Override
    public Map<String, DataFetcher<?>> mutation()
    {
        Map<String, DataFetcher<?>> mutation = new HashMap<>();

        mutation.put("startProcess", startProcessFetcher);

        return mutation;
    }
}
