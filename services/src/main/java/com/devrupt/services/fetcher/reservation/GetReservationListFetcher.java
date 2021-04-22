package com.devrupt.services.fetcher.reservation;

import com.devrupt.services.dto.reservation.ReservationFilter;
import com.devrupt.services.dto.reservation.ReservationListDto;
import com.devrupt.services.service.reservation.ReservationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import graphql.schema.DataFetcher;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class GetReservationListFetcher implements DataFetcher<ReservationListDto>
{
    @Autowired
    @Qualifier(value = "objectMapper")
    private ObjectMapper objectMapper;

    @Autowired
    private ReservationService reservationService;

    @Override
    public ReservationListDto get(DataFetchingEnvironment environment) throws Exception
    {
        ReservationFilter filter = objectMapper.convertValue(environment.getArgument("filter"), ReservationFilter.class);
        return reservationService.getReservationList(filter);

    }
}
