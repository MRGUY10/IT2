package org.example.rooms_management.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.rooms_management.model.Transport;
import org.example.rooms_management.Service.TransportService;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transports")
@CrossOrigin(origins = "http://localhost:4200")
public class TransportController {

    @Autowired
    private TransportService transportService;

    // Create or Update Transport
    @PostMapping
    public ResponseEntity<Transport> createTransport(@RequestBody Transport transport) {
        Transport savedTransport = transportService.saveTransport(transport);
        return new ResponseEntity<>(savedTransport, HttpStatus.CREATED);
    }

    // Get all Transports
    @GetMapping
    public List<Transport> getAllTransports() {
        return transportService.getAllTransports();
    }

    // Get Transport by ID
    @GetMapping("/{id}")
    public ResponseEntity<Transport> getTransportById(@PathVariable Long id) {
        Optional<Transport> transport = transportService.getTransportById(id);
        return transport.map(ResponseEntity::ok)
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Delete Transport by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransport(@PathVariable Long id) {
        Optional<Transport> transport = transportService.getTransportById(id);
        if (transport.isPresent()) {
            transportService.deleteTransport(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
