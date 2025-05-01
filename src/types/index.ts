import { StaticImageData } from 'next/image';
import React from 'react';

export interface CarDetail {
    id: number;
    image: StaticImageData;
    imageGallery?: {
        front?: StaticImageData;
        back?: StaticImageData;
        left?: StaticImageData;
        right?: StaticImageData;
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

export interface CarInfo {
    id: number;
    brand: string;
    model: string;
    image: StaticImageData | string;
}

export interface OfferItem {
  id: number | string;
  icon: React.ElementType;
  title: string;
  description: string;
  bgColorClass?: string;
  iconColorClass?: string;
}

export interface FeatureItem {
  id: number | string;
  icon: React.ElementType;
  title: string;
  description: string;
  bgColorClass?: string;
  iconColorClass?: string;
}

export interface Booking {
  id: string;
  userId: string;
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice?: number;
  status: 'Confirmed' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Pending';
  createdAt: string;
}

export interface BookingDisplayItem extends Omit<Booking, 'carId' | 'userId'>{
  car: CarInfo | null;
}

export interface TopSellingCar {
    id: number;
    image: string;
    model: string;
    brand: string;
    pricePerDay: number;
    rating?: number;
}