package com.labor.registration.dto;

import com.labor.registration.entity.BookingStatus;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class BookingStatusUpdateRequest {
    @NotNull
    private BookingStatus status;
}
