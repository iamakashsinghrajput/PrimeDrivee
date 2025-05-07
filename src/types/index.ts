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

export interface TopSellingCar {
    id: number;
    image: string;
    model: string;
    brand: string;
    pricePerDay: number;
    rating?: number;
}



export interface IBookingFromAPI {
  _id: string;
  user: string;
  carId: number;
  carModel: string;
  carBrand: string;
  pricePerDay: number;
  totalPrice?: number;
  startDate: string;
  endDate: string;
  deliveryAddress: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      postalCode: string;
  };
  userPhoneNumber: string;
  paymentMethod: 'card' | 'upi' | 'netbanking';
  paymentDetails?: {
      provider?: string;
      orderId?: string;
      paymentId?: string;
      status?: string;
      receipt?: string;
      error?: string | null;
      amountPaid?: number;
      currency?: string;
      capturedAt?: string;
      upiVpaAttempted?: string;
  };
  status: 'PendingPayment' | 'Confirmed' | 'CancelledBySystem' | 'CancelledByUser' | 'Ongoing' | 'Completed' | 'PaymentFailed';
  createdAt: string;
  updatedAt: string;
}



export interface BookingDisplayItem {
    id: string;
    userId: string;
    carId: number;
    carModel: string;
    carBrand: string;
    pricePerDay: number;
    totalPrice?: number;
    startDate: string;
    endDate: string;
    deliveryAddress: IBookingFromAPI['deliveryAddress'];
    userPhoneNumber: string;
    paymentMethod: IBookingFromAPI['paymentMethod'];
    paymentDetails?: IBookingFromAPI['paymentDetails'];
    status: IBookingFromAPI['status'];
    createdAt: string;
    updatedAt: string;
    car: CarInfo | null;
}