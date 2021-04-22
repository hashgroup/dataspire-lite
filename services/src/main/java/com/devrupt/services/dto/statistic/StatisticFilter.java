package com.devrupt.services.dto.statistic;

import com.devrupt.services.dto.BaseFilter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticFilter extends BaseFilter implements Serializable
{
    private static final long serialVersionUID = 5718550641540688377L;

    private String processId;
}
