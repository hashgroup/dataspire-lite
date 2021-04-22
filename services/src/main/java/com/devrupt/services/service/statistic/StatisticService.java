package com.devrupt.services.service.statistic;

import com.devrupt.services.dto.statistic.*;

import java.io.IOException;
import java.util.List;

public interface StatisticService
{
    StatisticDto getStatistic(StatisticFilter filter) throws IOException;

    List<IdentifiedGuestSegmentationDto> getIdentifiedGuestSegmentation(IdentifiedGuestSegmentationFilter filter) throws IOException;

    List<ClvClassDto> getClvClassList(ClvClassFilter filter) throws IOException;

}
