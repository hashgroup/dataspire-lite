package com.devrupt.services.dto.reservation;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationListDto implements Serializable
{
    private static final long serialVersionUID = -3822301434422959925L;

    @JsonAlias({"reservations"})
    private List<ReservationDto> data;
    @JsonAlias({"count"})
    private Integer count;
}
