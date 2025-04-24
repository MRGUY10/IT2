package org.example.rooms_management.model;

import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private Double cost;
    private Boolean available;
    private int capacity;

    @Column(name = "reserved_by")
    private Long reservedBy;

    // Empty constructor
    public Room() {
    }

    // All-args constructor
    public Room(Long id, String type, Double cost, Boolean available, int capacity, Long reservedBy) {
        this.id = id;
        this.type = type;
        this.cost = cost;
        this.available = available;
        this.capacity = capacity;
        this.reservedBy = reservedBy;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Boolean getAvailable() {
        return available;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public Long getReservedBy() {
        return reservedBy;
    }

    public void setReservedBy(Long reservedBy) {
        this.reservedBy = reservedBy;
    }
}