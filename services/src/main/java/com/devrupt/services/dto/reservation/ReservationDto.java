package com.devrupt.services.dto.reservation;

import com.devrupt.services.dto.MonetaryDto;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.List;

@Data
public class ReservationDto implements Serializable
{
    private static final long serialVersionUID = 3267036301862940434L;

    @JsonAlias({"id"})
    private String id;

    @JsonAlias({"bookingId"})
    private String bookingId;

    @JsonAlias({"status"})
    private String status;

    @JsonAlias({"arrival"})
    private OffsetDateTime arrival;

    @JsonAlias({"departure"})
    private OffsetDateTime departure;

    @JsonAlias({"created"})
    private OffsetDateTime created;

    @JsonAlias({"adults"})
    private Integer adults;

    @JsonAlias({"childrenAges"})
    private List<Integer> childrenAgeList;

    @JsonAlias({"channelCode"})
    private String channelCode;

    @JsonAlias({"timeSlices"})
    private List<ReservationTimeSliceDto> reservationTimeSliceList;

    @JsonAlias({"unit"})
    private ReservationRoomDto room;

    @JsonAlias({"primaryGuest"})
    private ReservationGuestDto guest;

    @JsonAlias({"totalGrossAmount"})
    private MonetaryDto totalGrossAmount;
}
