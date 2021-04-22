package com.devrupt.services.service.reservation;

import com.devrupt.services.dto.reservation.ReservationFilter;
import com.devrupt.services.dto.reservation.ReservationListDto;

public interface ReservationService
{
    ReservationListDto getReservationList(ReservationFilter filter);
}
