package com.devrupt.services.dto.integration;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessInput implements Serializable
{
    private static final long serialVersionUID = 2063062041934642956L;

    private String processId;
    private String refreshToken;
    private List<String> hotelIdList;
}
