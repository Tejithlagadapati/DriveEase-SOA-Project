package com.driveease.vehicle.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String vehicleType;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private BigDecimal dailyRate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // No-argument constructor required by JPA
    public Vehicle() {
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public Integer getYear() {
        return year;
    }

    public BigDecimal getDailyRate() {
        return dailyRate;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setDailyRate(BigDecimal dailyRate) {
        this.dailyRate = dailyRate;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Automatically called before inserting into database
    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();

        if (status == null) {
            status = VehicleStatus.AVAILABLE;
        }
    }

    // Automatically called before updating database
    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}