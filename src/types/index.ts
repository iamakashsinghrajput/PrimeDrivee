import { StaticImageData } from 'next/image';
import React from 'react'; // Import React for React.ElementType

// Keep CarDetail as is, but define imageGallery properties
export interface CarDetail {
    id: number;
    image: StaticImageData;
    // Define the expected structure for imageGallery
    imageGallery?: {
        front?: StaticImageData;
        back?: StaticImageData;
        left?: StaticImageData;
        right?: StaticImageData;
        // Add any other potential gallery views like interior, dashboard etc.
        interior1?: StaticImageData;
        interior2?: StaticImageData;
        dashboard?: StaticImageData;
    };
    model: string;
    brand: string;
    bodyType?: string;
    transmission?: 'Manual' | 'Automatic';
    fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
    engine?: string;
    mileage?: string;
    seats: number;
    pricePerDay: number;
    description?: string;
    featuresList?: string[];
}

// Keep CarSummary as is
export interface CarSummary {
    id: number;
    image: StaticImageData;
    model: string;
    brand: string;
    bodyType?: string;
    transmission?: 'Manual' | 'Automatic';
    seats: number;
    pricePerDay: number;
}

// Define a simpler CarInfo for booking list
export interface CarInfo {
    id: number;
    brand: string;
    model: string;
    image: StaticImageData | string; // Allow string for potential URLs from DB
}

// Keep OfferItem & FeatureItem as is
export interface OfferItem {
  id: number | string;
  icon: React.ElementType; // Use React.ElementType for component types
  title: string;
  description: string;
  bgColorClass?: string;
  iconColorClass?: string;
}

export interface FeatureItem {
  id: number | string;
  icon: React.ElementType; // Use React.ElementType for component types
  title: string;
  description: string;
  bgColorClass?: string;
  iconColorClass?: string;
}

// Keep Booking as is
export interface Booking {
  id: string; // Usually from MongoDB ObjectId .toString()
  userId: string; // Or ObjectId if needed
  carId: number;
  startDate: string; // ISO String format date
  endDate: string; // ISO String format date
  totalPrice?: number;
  status: 'Confirmed' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Pending'; // Add pending if needed
  createdAt: string; // ISO String format date
}

// CORRECTED: BookingDisplayItem uses CarInfo
export interface BookingDisplayItem extends Omit<Booking, 'carId' | 'userId'>{
  car: CarInfo | null; // Reference the related car info
}

// Example type for what CarGridItem might expect (replace with actual if different)
export interface TopSellingCar {
    id: number;
    image: string; // Expecting a URL string, not StaticImageData
    model: string;
    brand: string;
    pricePerDay: number;
    rating?: number; // Example optional property
}