package com.labor.registration.controller;

import com.labor.registration.dto.WorkerResponse;
import com.labor.registration.dto.WorkerUpdateRequest;
import com.labor.registration.service.WorkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "https://find-job-search-a9ztqbrna-findjob1.vercel.app", allowCredentials = "true")    
@RequestMapping("/api/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @GetMapping
    public ResponseEntity<List<WorkerResponse>> search(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly,
            @RequestParam(required = false) String location) {
        return ResponseEntity.ok(workerService.search(categoryId, availableOnly, location));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkerResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(workerService.getById(id));
    }

    @GetMapping("/me")
    public ResponseEntity<WorkerResponse> getMyProfile() {
        return ResponseEntity.ok(workerService.getMyProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<WorkerResponse> updateMyProfile(@RequestBody WorkerUpdateRequest request) {
        return ResponseEntity.ok(workerService.updateMyProfile(request));
    }

    @PatchMapping("/me/availability")
    public ResponseEntity<WorkerResponse> toggleAvailability(@RequestBody Map<String, Boolean> body) {
        boolean available = Boolean.TRUE.equals(body.get("available"));
        return ResponseEntity.ok(workerService.toggleAvailability(available));
    }
}
