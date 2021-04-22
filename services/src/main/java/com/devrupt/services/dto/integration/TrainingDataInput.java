package com.devrupt.services.dto.integration;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainingDataInput implements Serializable
{
    private static final long serialVersionUID = 5158060545432321452L;

    @JsonProperty(value = "CreatedDate")
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
    private OffsetDateTime createdDate;

    @JsonProperty(value = "Status")
    private String status;

    @JsonProperty(value = "RoomGroupID")
    private String roomGroupId;

    @JsonProperty(value = "ArrivalDate")
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
    private OffsetDateTime arrivalDate;

    @JsonProperty(value = "DepartureDate")
    @JsonFormat(shape= JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
    private OffsetDateTime departureDate;

    @JsonProperty(value = "RoomPrice")
    private BigDecimal roomPrice;

    @JsonProperty(value = "LastName")
    private String lastName;

    @JsonProperty(value = "FirstName")
    private String firstName;

    @JsonProperty(value = "Nights")
    private Integer totalNight;

    @JsonProperty(value = "Channel")
    private String channel;

    @JsonProperty(value = "TotalPayment")
    private BigDecimal totalAmount;

    @JsonProperty(value = "Country")
    private String countryCode;

    @JsonProperty(value = "Adults")
    private Integer adults;

    @JsonProperty(value = "Children")
    private Integer children;

    @JsonProperty(value = "Email")
    private String email;

    @JsonProperty(value = "RoomNo")
    private String roomNumber;

}
