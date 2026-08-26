package com.labor.registration.dto;

import com.labor.registration.entity.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private Long workerId;
    private String workerName;
    private String workerPhone;
    private String categoryName;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private LocalDate workDate;
    private String workDescription;
    private BigDecimal agreedPrice;
    private Double workerLat;
    private Double workerLng;
    private LocalDateTime locationUpdatedAt;
    private BookingStatus status;
    private LocalDateTime createdAt;
}
