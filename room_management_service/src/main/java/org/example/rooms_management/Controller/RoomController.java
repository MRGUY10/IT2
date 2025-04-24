package org.example.rooms_management.Controller;
import org.example.rooms_management.Service.RoomService;
import org.example.rooms_management.model.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // Get all available rooms
    @GetMapping("/available")
    public List<Room> getAvailableRooms() {
        return roomService.getAvailableRooms();
    }

    // Reserve a room
    @PostMapping("/{roomId}/reserve")
    public ResponseEntity<Room> reserveRoom(@PathVariable Long roomId, @RequestParam Long studentId) {
        try {
            Room reservedRoom = roomService.reserveRoom(roomId, studentId);
            return ResponseEntity.ok(reservedRoom);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }


    // Get room details
    @GetMapping("/{roomId}")
    public Room getRoomDetails(@PathVariable Long roomId) {
        return roomService.getRoomDetails(roomId);
    }

    // Add a new room
    @PostMapping("")
    public Room addRoom(@RequestBody Room room) {
        return roomService.addRoom(room);
    }

    // Update room details
    @PutMapping("/{roomId}")
    public Room updateRoom(@PathVariable Long roomId, @RequestBody Room updatedRoom) {
        return roomService.updateRoom(roomId, updatedRoom);
    }

    // Delete a room
    @DeleteMapping("/{roomId}")
    public void deleteRoom(@PathVariable Long roomId) {
        roomService.deleteRoom(roomId);
    }
    @GetMapping("")
    public ResponseEntity<List<Room>> getAllRooms() {
        try {
            List<Room> allRooms = roomService.getAllRooms();
            return ResponseEntity.ok(allRooms);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
