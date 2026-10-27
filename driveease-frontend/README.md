# DriveEase Frontend (React + Vite)

A modern, responsive, and robust frontend for the **DriveEase Car Rental & Fleet Management System**, engineered to connect seamlessly with the DriveEase Spring Boot SOA Microservices architecture.

---

## 🚀 Key Features

- **Microservice Integration via API Gateway**:
  - Connects to Spring Cloud Gateway on port `8090`.
  - Auto-configured Vite dev proxy for `/api` requests without CORS hurdles.
  - Full JWT authentication bearer token injection on every protected request.
- **Role-Based Access Control (RBAC)**:
  - **Customer Role**: Fleet browsing, real-time date and price calculation, vehicle reservation, viewing personal bookings, booking cancellation, and vehicle return.
  - **Admin Role**: Comprehensive operations dashboard, vehicle inventory CRUD, real-time vehicle status overrides, and booking lifecycle state approvals.
- **Built-in Resilience & Demo Mode**:
  - Seamless fallback data store when Spring Boot microservices are not currently booted up, enabling immediate offline demonstration and testing.
  - One-click demo role switcher (`Admin` / `Customer`) in the navbar and login page.
- **Strict Compliance with Backend Contracts**:
  - Validates `@FutureOrPresent` start dates, `endDate >= startDate`.
  - Enforces Spring Boot backend status transitions:
    - `PENDING` → `CONFIRMED` (locks vehicle to `RESERVED`)
    - `CONFIRMED` → `ACTIVE` (locks vehicle to `RENTED`)
    - `ACTIVE` → `COMPLETED` (frees vehicle back to `AVAILABLE`)
    - `PENDING` / `CONFIRMED` → `CANCELLED` (frees vehicle back to `AVAILABLE`)

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite 5
- **Styling**: Tailwind CSS + PostCSS + Autoprefixer
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The app will be accessible at: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

---

## 🔗 Connected Backend Microservices

| Service | Port | Description |
|---|---|---|
| **API Gateway** | `8090` | Central entry point & JWT filter |
| **Eureka Discovery** | `8761` | Service Registry |
| **Vehicle Service** | `8081` | Inventory, rates & status |
| **Booking Service** | `8082` | Reservations & Feign orchestration |
| **User Service** | `8083` | Authentication & JWT token issuing |
