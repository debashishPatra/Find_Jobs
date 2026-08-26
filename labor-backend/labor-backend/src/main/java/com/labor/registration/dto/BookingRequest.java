package com.labor.registration.dto;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotNull
    private Long workerId;

    @NotNull
    private LocalDate workDate;

    private String workDescription;
}
