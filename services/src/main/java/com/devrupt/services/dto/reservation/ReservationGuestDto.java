package com.devrupt.services.dto.reservation;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

import java.io.Serializable;

@Data
public class ReservationGuestDto implements Serializable
{
    private static final long serialVersionUID = -3914220353796288463L;

    @JsonAlias({"firstName"})
    private String firstName;

    @JsonAlias({"lastName"})
    private String lastName;

    @JsonAlias({"email"})
    private String email;

    @JsonAlias({"address"})
    private Address address;

    @Data
    public static class Address
    {
        @JsonAlias({"countryCode"})
        private String countryCode;
    }
}
