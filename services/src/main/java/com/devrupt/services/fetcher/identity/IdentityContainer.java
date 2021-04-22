package com.devrupt.services.fetcher.identity;

import com.devrupt.services.config.graphql.typeWiring.FetcherContainer;
import graphql.schema.DataFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class IdentityContainer implements FetcherContainer
{
    @Autowired
    private GetApaleoClientFetcher getApaleoClientFetcher;

    @Autowired
    private ExchangeTokenFetcher exchangeTokenFetcher;

    @Autowired
    private RenewTokenFetcher renewTokenFetcher;

    @Override
    public Map<String, DataFetcher<?>> query()
    {
        Map<String, DataFetcher<?>> query = new HashMap<>();

        query.put("getApaleoClient", getApaleoClientFetcher);

        return query;
    }

    @Override
    public Map<String, DataFetcher<?>> mutation()
    {
        Map<String, DataFetcher<?>> mutation = new HashMap<>();

        mutation.put("exchangeToken", exchangeTokenFetcher);
        mutation.put("renewToken", renewTokenFetcher);

        return mutation;
    }
}
