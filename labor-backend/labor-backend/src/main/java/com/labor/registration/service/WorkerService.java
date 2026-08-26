package com.labor.registration.service;

import com.labor.registration.dto.WorkerResponse;
import com.labor.registration.dto.WorkerUpdateRequest;
import com.labor.registration.entity.BookingStatus;
import com.labor.registration.entity.Category;
import com.labor.registration.entity.User;
import com.labor.registration.entity.Worker;
import com.labor.registration.repository.BookingRepository;
import com.labor.registration.repository.CategoryRepository;
import com.labor.registration.repository.WorkerRepository;
import com.labor.registration.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkerService {

    private final WorkerRepository workerRepository;
    private final CategoryRepository categoryRepository;
    private final BookingRepository bookingRepository;
    private final CurrentUserProvider currentUserProvider;

    public List<WorkerResponse> search(Long categoryId, boolean availableOnly, String location) {
        return workerRepository.search(categoryId, availableOnly, location)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public WorkerResponse getById(Long id) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Worker not found: " + id));
        return toResponse(worker);
    }

    public WorkerResponse getMyProfile() {
        User user = currentUserProvider.getCurrentUser();
        Worker worker = workerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Worker profile not found"));
        return toResponse(worker);
    }

    public WorkerResponse updateMyProfile(WorkerUpdateRequest request) {
        User user = currentUserProvider.getCurrentUser();
        Worker worker = workerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Worker profile not found"));

        if (request.getPrice() != null) worker.setPrice(request.getPrice());
        if (request.getPriceUnit() != null) worker.setPriceUnit(request.getPriceUnit());
        if (request.getExperienceYears() != null) worker.setExperienceYears(request.getExperienceYears());
        if (request.getLocation() != null) worker.setLocation(request.getLocation());
        if (request.getDescription() != null) worker.setDescription(request.getDescription());
        if (request.getAvailable() != null) worker.setAvailable(request.getAvailable());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid categoryId"));
            worker.setCategory(category);
        }

        return toResponse(workerRepository.save(worker));
    }

    public WorkerResponse toggleAvailability(boolean available) {
        User user = currentUserProvider.getCurrentUser();
        Worker worker = workerRepository.findByUserId(user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Worker profile not found"));
        worker.setAvailable(available);
        return toResponse(workerRepository.save(worker));
    }

    private WorkerResponse toResponse(Worker w) {
        return WorkerResponse.builder()
                .id(w.getId())
                .userId(w.getUser().getId())
                .fullName(w.getUser().getFullName())
                .phone(w.getUser().getPhone())
                .categoryId(w.getCategory().getId())
                .categoryName(w.getCategory().getName())
                .price(w.getPrice())
                .priceUnit(w.getPriceUnit())
                .experienceYears(w.getExperienceYears())
                .location(w.getLocation())
                .description(w.getDescription())
                .available(w.getAvailable())
                .booked(bookingRepository.existsByWorkerIdAndStatus(w.getId(), BookingStatus.ACCEPTED))
                .build();
    }
}
