package com.driveease.vehicle.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class VehicleRequest {

    @NotBlank
    private String registrationNumber;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @NotBlank
    private String vehicleType;

    @NotNull
    @Min(1900)
    private Integer year;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal dailyRate;

    // Getters

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

    // Setters

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
}