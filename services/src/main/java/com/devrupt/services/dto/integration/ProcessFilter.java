package com.devrupt.services.dto.integration;

import com.devrupt.services.dto.BaseFilter;
import lombok.Data;

import java.io.Serializable;

@Data
public class ProcessFilter extends BaseFilter implements Serializable
{
    private static final long serialVersionUID = 7473289124511820300L;

    private String processId;
}
