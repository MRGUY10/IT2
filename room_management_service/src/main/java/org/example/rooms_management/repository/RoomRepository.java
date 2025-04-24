package org.example.rooms_management.repository;

import org.example.rooms_management.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    List<Room> findByAvailable(Boolean available);

    // Custom method to count the number of rooms reserved by type
    int countReservedRoomsByType(String type);
}
