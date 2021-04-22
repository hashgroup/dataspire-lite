package com.devrupt.services.dto.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatisticDto implements Serializable
{
    private static final long serialVersionUID = 1674027690025535410L;

    private Integer totalIdentifiedGuest;
    private Integer totalPotentialVipGuest;
    private Integer highValueGuest;
}
