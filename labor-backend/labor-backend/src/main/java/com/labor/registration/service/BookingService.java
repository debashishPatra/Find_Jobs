package com.labor.registration.service;

import com.labor.registration.dto.BookingRequest;
import com.labor.registration.dto.BookingResponse;
import com.labor.registration.entity.Booking;
import com.labor.registration.entity.BookingStatus;
import com.labor.registration.entity.User;
import com.labor.registration.entity.Worker;
import com.labor.registration.repository.BookingRepository;
import com.labor.registration.repository.WorkerRepository;
import com.labor.registration.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final WorkerRepository workerRepository;
    private final CurrentUserProvider currentUserProvider;

    public BookingResponse createBooking(BookingRequest request) {
        User customer = currentUserProvider.getCurrentUser();
        Worker worker = workerRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new IllegalArgumentException("Worker not found: " + request.getWorkerId()));

        if (worker.getUser().getId().equals(customer.getId())) {
            throw new IllegalArgumentException("You cannot book yourself");
        }

        Booking booking = Booking.builder()
                .worker(worker)
                .customer(customer)
                .workDate(request.getWorkDate())
                .workDescription(request.getWorkDescription())
                .agreedPrice(worker.getPrice())
                .status(BookingStatus.PENDING)
                .build();

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getMyBookingsAsCustomer() {
        User customer = currentUserProvider.getCurrentUser();
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getMyBookingsAsWorker() {
        User user = currentUserProvider.getCurrentUser();
        return bookingRepository.findByWorkerUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookingResponse updateStatus(Long bookingId, BookingStatus newStatus) {
        User user = currentUserProvider.getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        boolean isWorker = booking.getWorker().getUser().getId().equals(user.getId());
        boolean isCustomer = booking.getCustomer().getId().equals(user.getId());

        if (!isWorker && !isCustomer) {
            throw new IllegalArgumentException("You are not part of this booking");
        }

        // Worker can accept/reject/complete; customer can only cancel
        if (isCustomer && !isWorker) {
            if (newStatus != BookingStatus.CANCELLED) {
                throw new IllegalArgumentException("Customers may only cancel a booking");
            }
            if (booking.getStatus() == BookingStatus.COMPLETED
                    || booking.getStatus() == BookingStatus.CANCELLED
                    || booking.getStatus() == BookingStatus.REJECTED) {
                throw new IllegalArgumentException("Cannot cancel a booking that is already " + booking.getStatus());
            }
        }

        booking.setStatus(newStatus);
        return toResponse(bookingRepository.save(booking));
    }

    public BookingResponse updateLocation(Long bookingId, Double lat, Double lng) {
        User user = currentUserProvider.getCurrentUser();
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

        boolean isWorker = booking.getWorker().getUser().getId().equals(user.getId());
        if (!isWorker) {
            throw new IllegalArgumentException("Only the assigned worker can update location for this booking");
        }
        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalArgumentException("Location can only be shared while the booking is ACCEPTED");
        }

        booking.setWorkerLat(lat);
        booking.setWorkerLng(lng);
        booking.setLocationUpdatedAt(java.time.LocalDateTime.now());
        return toResponse(bookingRepository.save(booking));
    }

    private BookingResponse toResponse(Booking b) {
        return BookingResponse.builder()
                .id(b.getId())
                .workerId(b.getWorker().getId())
                .workerName(b.getWorker().getUser().getFullName())
                .workerPhone(b.getWorker().getUser().getPhone())
                .categoryName(b.getWorker().getCategory().getName())
                .customerId(b.getCustomer().getId())
                .customerName(b.getCustomer().getFullName())
                .customerPhone(b.getCustomer().getPhone())
                .workDate(b.getWorkDate())
                .workDescription(b.getWorkDescription())
                .agreedPrice(b.getAgreedPrice())
                .workerLat(b.getWorkerLat())
                .workerLng(b.getWorkerLng())
                .locationUpdatedAt(b.getLocationUpdatedAt())
                .status(b.getStatus())
                .createdAt(b.getCreatedAt())
                .build();
    }
}
