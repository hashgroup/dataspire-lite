package com.devrupt.services.dto.reservation;

import com.devrupt.services.dto.MonetaryDto;
import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

import java.io.Serializable;

@Data
public class ReservationTimeSliceDto implements Serializable {
    private static final long serialVersionUID = -1542778199050489922L;

    private String from;
    private String to;

    @JsonAlias({"baseAmount"})
    private MonetaryDto roomPrice;

}
