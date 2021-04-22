package com.devrupt.services.dto.reservation;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

import java.io.Serializable;

@Data
public class ReservationRoomDto implements Serializable
{
    private static final long serialVersionUID = -3935438165956950691L;

    @JsonAlias({"id"})
    private String id;

    @JsonAlias({"name"})
    private String roomNumber;

    @JsonAlias({"description"})
    private String description;

    @JsonAlias({"unitGroupId"})
    private String roomGroupId;
}
