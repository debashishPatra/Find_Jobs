package com.labor.registration.dto;

import com.labor.registration.entity.PriceUnit;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WorkerUpdateRequest {
    private BigDecimal price;
    private PriceUnit priceUnit;
    private Integer experienceYears;
    private String location;
    private String description;
    private Boolean available;
    private Long categoryId;
}
