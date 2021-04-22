package com.devrupt.services.service.reservation;

import com.devrupt.services.dto.reservation.ReservationFilter;
import com.devrupt.services.dto.reservation.ReservationListDto;
import com.devrupt.services.service.identity.IdentityService;
import com.devrupt.services.utils.RestUtils;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;

@Service
public class ReservationServiceImpl implements ReservationService
{

    @Value("${apaleo.api.reservation.endpoint}")
    private String reservationEndpoint;

    @Value("${data.reservation.year-history.number}")
    private Integer yearHistoryRange;

    @Autowired
    private RestUtils restUtils;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private IdentityService tokenService;

    /**
     * Get reservation data
     * @param filter
     * @return
     */
    @Override
    public ReservationListDto getReservationList(ReservationFilter filter)
    {
        ReservationListDto rs = new ReservationListDto();

        OffsetDateTime to = OffsetDateTime.of(LocalDateTime.of(2021, 12, 31, 23, 59, 59), ZoneOffset.UTC).withNano(0);
        OffsetDateTime from = OffsetDateTime.of(LocalDateTime.of(2021 - yearHistoryRange, 1, 1, 0, 0, 0), ZoneOffset.UTC).withNano(0);

        String dateTimeTo = to.format(DateTimeFormatter.ISO_DATE_TIME);
        String dateTimeFrom = from.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);

        String url = UriComponentsBuilder
                .fromHttpUrl(reservationEndpoint)
                .queryParam("expand", "timeSlices")
                .queryParam("dateFilter", "Arrival")
                .queryParam("from", dateTimeFrom)
                .queryParam("to", dateTimeTo)
                .queryParam("propertyIds", String.join(",", filter.getHotelIdList()))
                .build().toUriString();

        HttpHeaders headers = tokenService.getHeaderWithBearer(filter.getRefreshToken());

        JsonNode jsonResponse = restUtils.constructRequestAndCall(url, new LinkedMultiValueMap<>(), headers, HttpMethod.GET, JsonNode.class);
        if (jsonResponse != null && jsonResponse.get("reservations") != null)
        {
            rs = objectMapper.convertValue(jsonResponse, ReservationListDto.class);
        }

        return rs;
    }

}
