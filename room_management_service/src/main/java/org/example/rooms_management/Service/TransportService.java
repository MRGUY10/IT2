package org.example.rooms_management.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.rooms_management.model.Transport;
import org.example.rooms_management.repository.TransportRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TransportService {

    @Autowired
    private TransportRepository transportRepository;

    // Create or Update Transport
    public Transport saveTransport(Transport transport) {
        return transportRepository.save(transport);
    }

    // Get all Transport records
    public List<Transport> getAllTransports() {
        return transportRepository.findAll();
    }

    // Get a Transport by ID
    public Optional<Transport> getTransportById(Long id) {
        return transportRepository.findById(id);
    }

    // Delete a Transport record by ID
    public void deleteTransport(Long id) {
        transportRepository.deleteById(id);
    }
}
