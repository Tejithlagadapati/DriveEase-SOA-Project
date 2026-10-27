// Initial fallback / mock data when backend services are not running
export const INITIAL_VEHICLES = [
  {
    id: 1,
    registrationNumber: "KA-01-AB-1234",
    brand: "Tesla",
    model: "Model 3 Performance",
    vehicleType: "SEDAN",
    year: 2023,
    dailyRate: 95.0,
    status: "AVAILABLE",
    createdAt: "2026-01-10T09:00:00",
    updatedAt: "2026-01-10T09:00:00",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    registrationNumber: "MH-02-CD-5678",
    brand: "BMW",
    model: "X5 xDrive40i",
    vehicleType: "SUV",
    year: 2024,
    dailyRate: 140.0,
    status: "AVAILABLE",
    createdAt: "2026-01-12T10:30:00",
    updatedAt: "2026-01-12T10:30:00",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    registrationNumber: "DL-03-EF-9012",
    brand: "Mercedes-Benz",
    model: "C-Class AMG Line",
    vehicleType: "SEDAN",
    year: 2023,
    dailyRate: 120.0,
    status: "RESERVED",
    createdAt: "2026-01-15T14:20:00",
    updatedAt: "2026-01-15T14:20:00",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    registrationNumber: "KA-04-GH-3456",
    brand: "Audi",
    model: "Q7 S-Line Quattro",
    vehicleType: "SUV",
    year: 2023,
    dailyRate: 135.0,
    status: "RENTED",
    createdAt: "2026-01-18T11:15:00",
    updatedAt: "2026-01-18T11:15:00",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    registrationNumber: "TS-05-IJ-7890",
    brand: "Porsche",
    model: "911 Carrera S",
    vehicleType: "COUPE",
    year: 2024,
    dailyRate: 240.0,
    status: "AVAILABLE",
    createdAt: "2026-01-20T16:45:00",
    updatedAt: "2026-01-20T16:45:00",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    registrationNumber: "DL-08-KL-1122",
    brand: "Ford",
    model: "Mustang GT 5.0",
    vehicleType: "COUPE",
    year: 2023,
    dailyRate: 110.0,
    status: "MAINTENANCE",
    createdAt: "2026-01-22T08:00:00",
    updatedAt: "2026-01-22T08:00:00",
    image: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    registrationNumber: "KA-05-MN-3344",
    brand: "Hyundai",
    model: "Ioniq 5 AWD",
    vehicleType: "SUV",
    year: 2024,
    dailyRate: 85.0,
    status: "AVAILABLE",
    createdAt: "2026-01-25T13:10:00",
    updatedAt: "2026-01-25T13:10:00",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    registrationNumber: "MH-12-PQ-5566",
    brand: "Toyota",
    model: "Camry Hybrid",
    vehicleType: "SEDAN",
    year: 2023,
    dailyRate: 75.0,
    status: "AVAILABLE",
    createdAt: "2026-01-28T09:40:00",
    updatedAt: "2026-01-28T09:40:00",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80"
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 101,
    vehicleId: 3,
    userId: 2,
    startDate: "2026-10-28",
    endDate: "2026-10-31",
    status: "CONFIRMED",
    createdAt: "2026-10-24T12:00:00",
    updatedAt: "2026-10-24T12:05:00"
  },
  {
    id: 102,
    vehicleId: 4,
    userId: 2,
    startDate: "2026-10-25",
    endDate: "2026-10-29",
    status: "ACTIVE",
    createdAt: "2026-10-20T15:30:00",
    updatedAt: "2026-10-25T09:00:00"
  },
  {
    id: 103,
    vehicleId: 1,
    userId: 2,
    startDate: "2026-10-10",
    endDate: "2026-10-14",
    status: "COMPLETED",
    createdAt: "2026-10-05T10:15:00",
    updatedAt: "2026-10-14T17:00:00"
  }
];

export const DEMO_USERS = [
  {
    userId: 1,
    name: "System Admin",
    email: "admin@driveease.com",
    role: "ADMIN",
    password: "password123"
  },
  {
    userId: 2,
    name: "John Customer",
    email: "john@example.com",
    role: "CUSTOMER",
    password: "password123"
  }
];

// Helper to get image based on vehicle brand / type
export function getVehicleImage(vehicle) {
  if (vehicle.image) return vehicle.image;
  const brand = (vehicle.brand || '').toLowerCase();
  const type = (vehicle.vehicleType || '').toLowerCase();

  if (brand.includes('tesla')) return "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80";
  if (brand.includes('bmw')) return "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80";
  if (brand.includes('mercedes')) return "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80";
  if (brand.includes('audi')) return "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80";
  if (brand.includes('porsche')) return "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";
  if (brand.includes('ford') || brand.includes('mustang')) return "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80";
  if (type.includes('suv')) return "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80";
  return "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";
}
