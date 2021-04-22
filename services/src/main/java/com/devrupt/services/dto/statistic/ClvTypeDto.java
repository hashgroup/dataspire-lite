package com.devrupt.services.dto.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClvTypeDto implements Serializable
{
    private static final long serialVersionUID = 1716199173524538297L;

    private String name;
    private Integer value;
}
