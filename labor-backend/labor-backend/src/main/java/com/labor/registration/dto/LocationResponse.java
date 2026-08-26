package com.labor.registration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponse {
    private Double latitude;
    private Double longitude;
    private LocalDateTime updatedAt;
    private boolean sharing; // false if worker hasn't shared a location yet
}
