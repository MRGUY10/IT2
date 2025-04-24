package org.example.rooms_management.Service;

import org.example.rooms_management.model.Room;
import org.example.rooms_management.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    // Get available rooms
    public List<Room> getAvailableRooms() {
        return roomRepository.findByAvailable(true);
    }

    // Reserve a room
    public Room reserveRoom(Long roomId, Long studentId) {
        Optional<Room> roomOptional = roomRepository.findById(roomId);
        if (roomOptional.isEmpty()) {
            throw new RuntimeException("Room not found");
        }

        Room room = roomOptional.get();

        // Check if room type capacity is exceeded
        int reservedCount = roomRepository.countReservedRoomsByType(room.getType());
        if (reservedCount >= room.getCapacity()) {
            room.setAvailable(false); // Mark room type as unavailable if capacity exceeded
            roomRepository.save(room);
            throw new RuntimeException("No more rooms available for this type.");
        }

        if (!room.getAvailable()) {
            throw new RuntimeException("Room is already reserved.");
        }

        // Reserve room for student
        room.setAvailable(false);
        room.setReservedBy(studentId);
        return roomRepository.save(room);
    }

    // Get room details
    public Room getRoomDetails(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
    }

    // Add a new room
    public Room addRoom(Room room) {
        room.setAvailable(true); // Default to available
        return roomRepository.save(room);
    }

    // Update room details
    public Room updateRoom(Long roomId, Room updatedRoom) {
        Room existingRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        existingRoom.setType(updatedRoom.getType());
        existingRoom.setCost(updatedRoom.getCost());
        existingRoom.setAvailable(updatedRoom.getAvailable());
        existingRoom.setCapacity(updatedRoom.getCapacity());
        return roomRepository.save(existingRoom);
    }

    // Delete a room
    public void deleteRoom(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        roomRepository.delete(room);
    }

    // List all rooms
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

}
