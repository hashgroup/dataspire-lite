package com.devrupt.services.dto.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClvClassDto implements Serializable
{
    private static final long serialVersionUID = -2245077293398638709L;

    private String name;
    private List<ClvTypeDto> typeList;
}
