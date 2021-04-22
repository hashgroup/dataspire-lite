package com.devrupt.services.dto.identity;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenRequest implements Serializable {
    private static final long serialVersionUID = -1515159842729588157L;

    private String idempotencyKey;

    private String code;

    private String clientId;

    @JsonAlias({"redirectUri"})
    private String redirectUrl;

    private String refreshToken;

}
