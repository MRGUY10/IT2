package org.example.rooms_management.repository;

import org.example.rooms_management.model.Transport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransportRepository extends JpaRepository<Transport, Long> {
    // Custom queries can be added here if needed
}
