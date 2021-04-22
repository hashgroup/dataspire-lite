package com.devrupt.services.fetcher.statistic;

import com.devrupt.services.dto.statistic.ClvClassDto;
import com.devrupt.services.dto.statistic.ClvClassFilter;
import com.devrupt.services.service.statistic.StatisticService;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetClvClassListFetcher implements DataFetcher<List<ClvClassDto>>
{
    @Autowired
    @Qualifier(value = "objectMapper")
    private ObjectMapper objectMapper;

    @Autowired
    private StatisticService statisticService;

    @Override
    public List<ClvClassDto> get(DataFetchingEnvironment environment) throws Exception
    {
        ClvClassFilter filter = objectMapper.convertValue(environment.getArgument("filter"), ClvClassFilter.class);
        return statisticService.getClvClassList(filter);

    }
}
