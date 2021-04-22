package com.devrupt.services.dto.identity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApaleoClientDto implements Serializable
{
    private static final long serialVersionUID = 442043984480723363L;

    private List<String> allowScopeList;

    private String clientId;
}
