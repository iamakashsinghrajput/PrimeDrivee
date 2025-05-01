import mongoose, { Schema, Document, models, Model } from 'mongoose';
import { IUser } from './user';

export interface IBooking extends Document {
    user: mongoose.Schema.Types.ObjectId | IUser;
    carId: number;
    carModel: string;
    carBrand: string;
    pricePerDay: number;
    deliveryAddress: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        postalCode: string;
    };
    userPhoneNumber: string;
    paymentMethod: 'card' | 'upi' | 'netbanking';
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required.'],
        index: true,
    },
    carId: {
        type: Number,
        required: [true, 'Car ID is required.'],
        index: true,
    },
    carModel: { type: String, required: [true, 'Car model is required.'] },
    carBrand: { type: String, required: [true, 'Car brand is required.'] },
    pricePerDay: { type: Number, required: [true, 'Price per day is required.'] },
    deliveryAddress: {
        addressLine1: {
            type: String,
            required: [true, 'Address Line 1 is required.'],
            trim: true
        },
        addressLine2: {
            type: String,
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required.'],
            trim: true
        },
        postalCode: {
            type: String,
            required: [true, 'Postal code is required.'],
            trim: true,
            match: [/^\d{6}$/, 'Please provide a valid 6-digit postal code.']
        },
    },
    userPhoneNumber: {
        type: String,
        required: [true, 'Phone number is required.'],
        trim: true,
        match: [/^(?:\+91)?\s?\d{10}$/, 'Please provide a valid 10-digit Indian phone number (e.g., 9876543210 or +919876543210).']
    },
    paymentMethod: {
        type: String,
        required: [true, 'Payment method is required.'],
        enum: {
            values: ['card', 'upi', 'netbanking'],
            message: '{VALUE} is not a supported payment method.'
        },
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
        index: true,
    },
}, { timestamps: true });

const Booking: Model<IBooking> = models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;