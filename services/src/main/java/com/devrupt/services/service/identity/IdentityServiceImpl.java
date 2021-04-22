package com.devrupt.services.service.identity;

import com.devrupt.services.dto.identity.ApaleoClientDto;
import com.devrupt.services.dto.identity.TokenRequest;
import com.devrupt.services.dto.identity.TokenRequestGrantTypeEnum;
import com.devrupt.services.dto.identity.TokenResponse;
import com.devrupt.services.utils.RestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.List;

@Service
public class IdentityServiceImpl implements IdentityService
{
    @Value("${apaleo.api.token.endpoint}")
    private String tokenEndpoint;

    @Value("${apaleo.client.id}")
    private String clientId;

    @Value("${apaleo.client.secret}")
    private String clientSecret;

    @Value("${apaleo.api.token.scope}")
    private List<String> tokenScopeList;

    @Autowired
    private RestUtils restUtils;

    /**
     * get predefined client id and scope list
     * @return
     */
    @Override
    public ApaleoClientDto getApaleoClient()
    {
        return ApaleoClientDto.builder()
                    .allowScopeList(tokenScopeList)
                    .clientId(clientId)
                .build();
    }

    /**
     * Exchange authorization code for access token
     *
     * @param tokenRequest
     * @return
     */
    public TokenResponse exchangeToken(TokenRequest tokenRequest) {

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", TokenRequestGrantTypeEnum.authorization_code.name());
        body.add("code", tokenRequest.getCode());
        body.add("redirect_uri", tokenRequest.getRedirectUrl());
        body.add("client_id", this.clientId);
        body.add("client_secret", this.clientSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        return restUtils.constructRequestAndCall(tokenEndpoint, body, headers, HttpMethod.POST, TokenResponse.class);
    }

    /**
     * Use refresh token to renew access token
     *
     * @param tokenRequest
     * @return
     */
    public TokenResponse renewToken(TokenRequest tokenRequest) {

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", TokenRequestGrantTypeEnum.refresh_token.name());
        body.add("refresh_token", tokenRequest.getRefreshToken());
        body.add("client_id", this.clientId);
        body.add("client_secret", this.clientSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        return restUtils.constructRequestAndCall(tokenEndpoint, body, headers, HttpMethod.POST, TokenResponse.class);
    }

    /**
     * create header with Bearer Auth
     * refresh token is required
     * @param refreshToken
     * @return
     */
    @Override
    public HttpHeaders getHeaderWithBearer(String refreshToken)
    {
        HttpHeaders headers = new HttpHeaders();
        TokenResponse tokenResponse = this.renewToken(TokenRequest.builder()
                .refreshToken(refreshToken)
                .build());
        headers.setBearerAuth(tokenResponse.getAccessToken());

        return headers;
    }
}
