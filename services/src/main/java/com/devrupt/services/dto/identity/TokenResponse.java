package com.devrupt.services.dto.identity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class TokenResponse implements Serializable {
    private static final long serialVersionUID = 5494766646395259427L;

    @JsonProperty(value = "id_token")
    private String idToken;

    @JsonProperty(value = "access_token")
    private String accessToken;

    @JsonProperty(value = "expires_in")
    private Long expiresIn;

    @JsonProperty(value = "token_type")
    private String tokenType;

    @JsonProperty(value = "refresh_token")
    private String refreshToken;
}
