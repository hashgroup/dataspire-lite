package com.devrupt.services.fetcher.statistic;

import com.devrupt.services.dto.statistic.IdentifiedGuestSegmentationDto;
import com.devrupt.services.dto.statistic.IdentifiedGuestSegmentationFilter;
import com.devrupt.services.service.statistic.StatisticService;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GetIdentifiedGuestSegmentationFetcher implements DataFetcher<List<IdentifiedGuestSegmentationDto>>
{
    @Autowired
    @Qualifier(value = "objectMapper")
    private ObjectMapper objectMapper;

    @Autowired
    private StatisticService statisticService;

    @Override
    public List<IdentifiedGuestSegmentationDto> get(DataFetchingEnvironment environment) throws Exception
    {
        IdentifiedGuestSegmentationFilter filter = objectMapper.convertValue(environment.getArgument("filter"), IdentifiedGuestSegmentationFilter.class);
        return statisticService.getIdentifiedGuestSegmentation(filter);

    }
}
