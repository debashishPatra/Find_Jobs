package com.labor.registration.repository;

import com.labor.registration.entity.Booking;
import com.labor.registration.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    List<Booking> findByWorkerIdOrderByCreatedAtDesc(Long workerId);
    List<Booking> findByWorkerUserIdOrderByCreatedAtDesc(Long workerUserId);
    boolean existsByWorkerIdAndStatus(Long workerId, BookingStatus status);
}
