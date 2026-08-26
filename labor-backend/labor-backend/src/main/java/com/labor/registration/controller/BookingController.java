package com.labor.registration.controller;

import com.labor.registration.dto.BookingRequest;
import com.labor.registration.dto.BookingResponse;
import com.labor.registration.dto.BookingStatusUpdateRequest;
import com.labor.registration.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> myBookingsAsCustomer() {
        return ResponseEntity.ok(bookingService.getMyBookingsAsCustomer());
    }

    @GetMapping("/worker")
    public ResponseEntity<List<BookingResponse>> myBookingsAsWorker() {
        return ResponseEntity.ok(bookingService.getMyBookingsAsWorker());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable Long id,
                                                          @Valid @RequestBody BookingStatusUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateStatus(id, request.getStatus()));
    }

    @PatchMapping("/{id}/location")
    public ResponseEntity<BookingResponse> updateLocation(@PathVariable Long id,
                                                            @Valid @RequestBody com.labor.registration.dto.LocationUpdateRequest request) {
        return ResponseEntity.ok(bookingService.updateLocation(id, request.getLatitude(), request.getLongitude()));
    }
}
