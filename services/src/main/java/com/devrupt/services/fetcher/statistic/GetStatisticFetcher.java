package com.devrupt.services.fetcher.statistic;

import com.devrupt.services.dto.statistic.StatisticDto;
import com.devrupt.services.dto.statistic.StatisticFilter;
import com.devrupt.services.service.statistic.StatisticService;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class GetStatisticFetcher implements DataFetcher<StatisticDto>
{
    @Autowired
    @Qualifier(value = "objectMapper")
    private ObjectMapper objectMapper;

    @Autowired
    private StatisticService statisticService;

    @Override
    public StatisticDto get(DataFetchingEnvironment environment) throws Exception
    {
        StatisticFilter filter = objectMapper.convertValue(environment.getArgument("filter"), StatisticFilter.class);
        return statisticService.getStatistic(filter);

    }
}
