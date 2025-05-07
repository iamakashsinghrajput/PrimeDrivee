import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';
import { IUser } from './user';

export interface IBooking extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId | IUser;
    carId: number;
    carModel: string;
    carBrand: string;
    pricePerDay: number;
    totalPrice?: number;
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
        signature?: string;
        status?: string;
        receipt?: string;
        error?: string | null;
        amountPaid?: number; 
        currency?: string;
        capturedAt?: Date;
        upiVpaAttempted?: string;
    };
    status: 'PendingPayment' | 'Confirmed' | 'CancelledBySystem' | 'CancelledByUser' | 'Ongoing' | 'Completed' | 'PaymentFailed';
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema<IBooking> = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: [true, 'User reference is required.'], index: true },
    carId: { type: Number, required: [true, 'Car ID is required.'], index: true },
    carModel: { type: String, required: [true, 'Car model is required.'], trim: true },
    carBrand: { type: String, required: [true, 'Car brand is required.'], trim: true },
    pricePerDay: { type: Number, required: [true, 'Price per day is required.'], min: [0, 'Price cannot be negative.'] },
    totalPrice: { type: Number, min: [0, 'Total price cannot be negative.'] },
    deliveryAddress: {
        addressLine1: { type: String, required: [true, 'Address Line 1 is required.'], trim: true },
        addressLine2: { type: String, trim: true, default: null },
        city: { type: String, required: [true, 'City is required.'], trim: true },
        postalCode: { type: String, required: [true, 'Postal code is required.'], trim: true, match: [/^\d{6}$/, 'Valid 6-digit postal code required.'] }
    },
    userPhoneNumber: { type: String, required: [true, 'Phone number is required.'], trim: true, match: [/^(?:\+91)?\s?[6-9]\d{9}$/, 'Valid 10-digit Indian mobile number required.'] },
    paymentMethod: {
        type: String, required: [true, 'Payment method is required.'],
        enum: { values: ['card', 'upi', 'netbanking'], message: 'Payment method {VALUE} is not supported.' }
    },
    paymentDetails: {
        provider: { type: String },
        orderId: { type: String, index: true, sparse: true },
        paymentId: { type: String, index: true, sparse: true },
        signature: { type: String },
        status: { type: String },
        receipt: { type: String, unique: true, sparse: true },
        error: { type: String, default: null },
        amountPaid: { type: Number },
        currency: { type: String },
        capturedAt: { type: Date },
        upiVpaAttempted: { type: String },
    },
    status: {
        type: String, required: true,
        enum: { values: ['PendingPayment', 'Confirmed', 'CancelledBySystem', 'CancelledByUser', 'Ongoing', 'Completed', 'PaymentFailed'], message: 'Booking status {VALUE} is not supported.' },
        default: 'PendingPayment', index: true,
    },
}, { timestamps: true });

BookingSchema.index({ userId: 1, carId: 1 });
BookingSchema.index({ status: 1, createdAt: -1 });

const Booking: Model<IBooking> = models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;