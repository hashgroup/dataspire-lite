package com.devrupt.services.dto.integration;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

import java.io.Serializable;

@Data
public class CustomerLifetimeValueDto implements Serializable
{
    private static final long serialVersionUID = -1123138396743430876L;

    @JsonAlias({"FirstName"})
    private String firstName;

    @JsonAlias({"LastName"})
    private String lastName;

    @JsonAlias({"Email"})
    private String email;

    @JsonAlias({"GuestID"})
    private String guestId;

    @JsonAlias({"LTV_Class"})
    private Double ltvClass;

    @JsonAlias({"CLV_Low_Prob"})
    private Double low;

    @JsonAlias({"CLV_Mid_Prob"})
    private Double mid;

    @JsonAlias({"CLV_High_Prob"})
    private Double high;

    @JsonAlias({"Guest_Type"})
    private String type;

}
