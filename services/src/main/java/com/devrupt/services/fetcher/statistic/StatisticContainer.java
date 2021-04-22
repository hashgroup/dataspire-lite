package com.devrupt.services.fetcher.statistic;

import com.devrupt.services.config.graphql.typeWiring.FetcherContainer;
import graphql.schema.DataFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class StatisticContainer implements FetcherContainer
{
    @Autowired
    private GetClvClassListFetcher getClvClassListFetcher;

    @Autowired
    private GetIdentifiedGuestSegmentationFetcher getIdentifiedGuestSegmentationFetcher;

    @Autowired
    private GetStatisticFetcher getStatisticFetcher;

    @Override
    public Map<String, DataFetcher<?>> query()
    {
        Map<String, DataFetcher<?>> query = new HashMap<>();

        query.put("getClvClassList", getClvClassListFetcher);
        query.put("getIdentifiedGuestSegmentation", getIdentifiedGuestSegmentationFetcher);
        query.put("getStatistic", getStatisticFetcher);

        return query;
    }

    @Override
    public Map<String, DataFetcher<?>> mutation()
    {
        Map<String, DataFetcher<?>> mutation = new HashMap<>();

        return mutation;
    }
}
