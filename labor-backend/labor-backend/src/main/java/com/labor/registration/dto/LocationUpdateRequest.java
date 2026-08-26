package com.labor.registration.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class LocationUpdateRequest {
    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;
}
