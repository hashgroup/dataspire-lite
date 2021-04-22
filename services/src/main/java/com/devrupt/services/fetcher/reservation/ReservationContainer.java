package com.devrupt.services.fetcher.reservation;

import com.devrupt.services.config.graphql.typeWiring.FetcherContainer;
import graphql.schema.DataFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ReservationContainer implements FetcherContainer
{
    @Autowired
    private GetReservationListFetcher getReservationListFetcher;

    @Override
    public Map<String, DataFetcher<?>> query()
    {
        Map<String, DataFetcher<?>> query = new HashMap<>();

        query.put("getReservationList", getReservationListFetcher);

        return query;
    }

    @Override
    public Map<String, DataFetcher<?>> mutation()
    {
        Map<String, DataFetcher<?>> mutation = new HashMap<>();

        return mutation;
    }
}
