package com.eventmate.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "halls")
@NoArgsConstructor
public class Hall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hall_id")
    private Long hallId;

    @Column(name = "hall_name")
    private String hallName;

    private String categories;

    @Column(name = "image_link", columnDefinition = "TEXT")
    private String imageLink;

    private String location;

    @Column(name = "full_location", columnDefinition = "TEXT")
    private String eventType;

    private String food;

    private int capacity;

    private int budget;

    // Manual all-args constructor
    public Hall(
            Long hallId,
            String hallName,
            String categories,
            String imageLink,
            String location,
            String eventType,
            String food,
            int capacity,
            int budget) {

        this.hallId = hallId;
        this.hallName = hallName;
        this.categories = categories;
        this.imageLink = imageLink;
        this.location = location;
        this.eventType = eventType;
        this.food = food;
        this.capacity = capacity;
        this.budget = budget;
    }

    // ===== Custom getters used by ChatController =====

    public String getName() {
        return this.hallName;
    }

    public double getPricePerDay() {
        return (double) this.budget;
    }

    public String getFoodType() {
        return this.food;
    }

    // ===== Standard Getters =====

    public Long getHallId() {
        return hallId;
    }

    public String getHallName() {
        return hallName;
    }

    public String getCategories() {
        return categories;
    }

    public String getImageLink() {
        return imageLink;
    }

    public String getLocation() {
        return location;
    }

    public String getEventType() {
        return eventType;
    }

    public String getFood() {
        return food;
    }

    public int getCapacity() {
        return capacity;
    }

    public int getBudget() {
        return budget;
    }

    // ===== Setters =====

    public void setHallId(Long hallId) {
        this.hallId = hallId;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
    }

    public void setCategories(String categories) {
        this.categories = categories;
    }

    public void setImageLink(String imageLink) {
        this.imageLink = imageLink;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public void setFood(String food) {
        this.food = food;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public void setBudget(int budget) {
        this.budget = budget;
    }
}