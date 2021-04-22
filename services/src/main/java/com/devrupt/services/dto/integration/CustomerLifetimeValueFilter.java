package com.devrupt.services.dto.integration;

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
public class CustomerLifetimeValueFilter extends BaseFilter implements Serializable
{
    private static final long serialVersionUID = 7473289124511820300L;

    private String processId;
}
