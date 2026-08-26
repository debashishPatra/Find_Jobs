package com.labor.registration.repository;

import com.labor.registration.entity.Worker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface WorkerRepository extends JpaRepository<Worker, Long> {

    Optional<Worker> findByUserId(Long userId);

    @Query("SELECT w FROM Worker w WHERE " +
            "(:categoryId IS NULL OR w.category.id = :categoryId) AND " +
            "(:availableOnly = false OR w.available = true) AND " +
            "(:location IS NULL OR LOWER(w.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    List<Worker> search(@Param("categoryId") Long categoryId,
                         @Param("availableOnly") boolean availableOnly,
                         @Param("location") String location);
}
