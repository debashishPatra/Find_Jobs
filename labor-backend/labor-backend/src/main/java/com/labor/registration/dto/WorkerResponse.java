package com.labor.registration.dto;

import com.labor.registration.entity.PriceUnit;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkerResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String phone;
    private String categoryName;
    private Long categoryId;
    private BigDecimal price;
    private PriceUnit priceUnit;
    private Integer experienceYears;
    private String location;
    private String description;
    private Boolean available;
    private Boolean booked;
}
