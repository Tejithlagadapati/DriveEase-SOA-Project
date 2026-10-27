# DriveEase SOA Project

DriveEase is an academic team project built for an SOA/Microservices course. The repository contains a Spring Boot microservices backend and a React + Vite frontend for a car-rental and fleet-management workflow.

## About

The system is organized around independent services registered in Eureka, routed through a Spring Cloud API Gateway, and consumed by a frontend application. Authentication is JWT-based, and services communicate through gateway routes and internal service-to-service calls.

## Notable Features

- **Microservices architecture** with separate backend services:
  - `eureka-server` (service discovery)
  - `api-gateway` (central entry + route mapping)
  - `user-service` (auth/user domain)
  - `vehicle-service` (vehicle inventory domain)
  - `booking-service` (booking domain)
- **Dynamic routing via API Gateway** using configured `/api/auth/**`, `/api/vehicles/**`, and `/api/bookings/**` routes.
- **JWT authentication/authorization** across gateway and services.
- **Inter-service communication with OpenFeign** in booking flows.
- **React frontend with protected routes** for authenticated and admin-only pages.
- **Vite dev proxy** from frontend `/api` calls to `http://localhost:8090`.

## Tech Stack (from repository)

- **Backend:** Java, Spring Boot, Spring Cloud, Spring Security, Spring Data JPA, OpenFeign
- **Frontend:** React, Vite, React Router, Axios, Tailwind CSS
- **Database:** PostgreSQL (configured per service)

## Repository Structure

```text
DriveEase-SOA-Project/
├── driveease-backend/
│   ├── eureka-server/
│   ├── api-gateway/
│   ├── user-service/
│   ├── vehicle-service/
│   └── booking-service/
└── driveease-frontend/
```

## Prerequisites

Use the tools below before running locally:

- **Java 21** (verified in backend `pom.xml` files)
- **Node.js + npm**
- **PostgreSQL**
- **Git**

> Note: Maven Wrapper (`mvnw`) is included in each backend service, so a global Maven install is optional.

## Local Setup & Run

### 1) Clone and move to repository root

```bash
git clone https://github.com/Tejithlagadapati/DriveEase-SOA-Project.git
cd DriveEase-SOA-Project
```

### 2) Configure frontend environment

The frontend `.env` already points to the local gateway via:

```env
VITE_API_BASE_URL=/api
```

### 3) Configure backend service properties

Each backend service has `src/main/resources/application.properties` with local defaults (ports, Eureka URL, datasource URLs, JWT/internal keys).

Before running, review database and security-related values for your environment, especially datasource credentials and secrets.

### 4) Start backend services (recommended order)

Open separate terminals and run:

```bash
# Terminal 1
cd driveease-backend/eureka-server
./mvnw spring-boot:run

# Terminal 2
cd driveease-backend/user-service
./mvnw spring-boot:run

# Terminal 3
cd driveease-backend/vehicle-service
./mvnw spring-boot:run

# Terminal 4
cd driveease-backend/booking-service
./mvnw spring-boot:run

# Terminal 5
cd driveease-backend/api-gateway
./mvnw spring-boot:run
```

### 5) Start frontend

```bash
cd driveease-frontend
npm install
npm run dev
```

Frontend dev server runs on `http://localhost:5173` and proxies `/api` to the gateway (`http://localhost:8090`).

## Validation / Testing Notes

Minimal local verification commands:

```bash
# Frontend build check
cd driveease-frontend
npm run build

# Backend tests (run per service)
cd ../driveease-backend/<service-name>
./mvnw test
```

> This repository currently uses service-level Maven projects rather than one root Maven build.

## Security & Configuration Notes

- Current backend properties include development JWT/internal keys and local DB configuration. Treat these as development-only values and rotate/override for shared or production environments.
- Keep sensitive values out of commits; prefer environment-specific overrides where possible.

## Contributing Guidelines (Recommended)

This is a team academic project, so use lightweight but consistent contribution practices:

1. **Branching:** create focused feature/fix branches from the active integration branch.
2. **Commit quality:** keep commits small, descriptive, and logically grouped.
3. **Pull Requests:**
   - explain scope and intent clearly,
   - link related issue/task,
   - include testing notes (what you ran and results).
4. **Testing:** run relevant frontend build/tests and backend service tests before requesting review.
5. **Documentation:** update README or service docs when setup, behavior, or APIs change.
6. **Security hygiene:** never commit real credentials, tokens, or production secrets.

## Troubleshooting

- **Gateway/API calls failing from frontend:** confirm all backend services are running and registered with Eureka before testing UI flows.
- **Database connection errors:** verify PostgreSQL is running and matches datasource settings in each service.
- **401/403 issues:** ensure JWT-related settings are aligned across gateway and services.

---

If you'd like, this README can be split further into backend/frontend-specific setup docs while keeping this root file as a quick-start guide.
