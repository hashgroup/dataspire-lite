package com.devrupt.services.dto;

import lombok.Data;

@Data
public class BaseFilter
{
    private String refreshToken;

    private Integer pageNumber;

    private Integer pageSize;
}
