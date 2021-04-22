package com.devrupt.services.dto.reservation;

import com.devrupt.services.dto.BaseFilter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationFilter extends BaseFilter implements Serializable
{
    private static final long serialVersionUID = 4676727692017506990L;

    private List<String> hotelIdList;
}
