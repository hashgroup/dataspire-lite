package com.devrupt.services.dto;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class MonetaryDto implements Serializable {
    private static final long serialVersionUID = -2502235659881995209L;

    private BigDecimal amount;
    private BigDecimal grossAmount;
    private BigDecimal netAmount;
    private String vatType;
    private Double vatPercent;
    private String currency;

}
