package com.devrupt.services.dto.integration;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProcessDetails implements Serializable
{
    private static final long serialVersionUID = 6814152055794948012L;

    @JsonAlias({"TotalRecords"})
    private Integer totalRecordCount;
}
