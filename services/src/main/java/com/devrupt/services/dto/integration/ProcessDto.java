package com.devrupt.services.dto.integration;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProcessDto implements Serializable
{
    private static final long serialVersionUID = 9181085176270957507L;

    private String id;

    @JsonAlias({"status"})
    private ProcessStatusEnum status;

    @JsonAlias({"message"})
    private String message;

    @JsonAlias({"dataList"})
    private List<CustomerLifetimeValueDto> response;

    @JsonAlias({"errorlog"})
    private String error;

    private Integer recordCount;

    public ProcessDto(String id, ProcessStatusEnum status, String message, Integer recordCount)
    {
        this.id = id;
        this.status = status;
        this.message = message;
        this.recordCount = recordCount;
    }
}
