package com.devrupt.services.dto.statistic;

import com.devrupt.services.dto.BaseFilter;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClvClassFilter extends BaseFilter implements Serializable
{
    private static final long serialVersionUID = 2894781484865687230L;

    private String processId;
}
