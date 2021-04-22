package com.devrupt.services.dto.statistic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IdentifiedGuestSegmentationDto implements Serializable
{
    private static final long serialVersionUID = -663898947565644922L;
    
    private String segment;
    private Double value;
}
