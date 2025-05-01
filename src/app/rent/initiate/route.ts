import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectMongoDB } from "@/lib/mongodb";
import Booking from "@/models/booking";
import { allCarsDetailData } from '@/data/carData';
import mongoose, { Types } from 'mongoose';

interface InitiateRequestBody {
    carId: number;
    address: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        postalCode: string;
    };
    phoneNumber: string;
    paymentMethod: 'card' | 'upi' | 'netbanking';
}

interface IBookingDocument extends mongoose.Document {
    _id: Types.ObjectId;
    user: Types.ObjectId;
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
    status: string;
}


export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        await connectMongoDB();
        const body: InitiateRequestBody = await request.json();

        const { carId, address, phoneNumber, paymentMethod } = body;

        if (!carId || !address || !phoneNumber || !paymentMethod || !address.addressLine1 || !address.city || !address.postalCode) {
            return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
        }
        if (!['card', 'upi', 'netbanking'].includes(paymentMethod)) {
             return NextResponse.json({ message: "Invalid payment method." }, { status: 400 });
        }

        const carData = allCarsDetailData.find(car => car.id === carId);
        if (!carData) {
            return NextResponse.json({ message: "Car not found." }, { status: 404 });
        }

        const newBooking = await Booking.create({
            user: userId,
            carId: carData.id,
            carModel: carData.model,
            carBrand: carData.brand,
            pricePerDay: carData.pricePerDay,
            deliveryAddress: {
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2 || '',
                city: address.city,
                postalCode: address.postalCode,
            },
            userPhoneNumber: phoneNumber,
            paymentMethod: paymentMethod,
            status: 'pending',
        }) as unknown as IBookingDocument;

        return NextResponse.json({
            message: "Rental initiated successfully. Proceed to confirmation.",
            bookingId: newBooking._id.toString()
        }, { status: 201 });

    } catch (error: unknown) {
        console.error("API /initiate: Error initiating rental:", error);
        let errorMessage = "An internal server error occurred.";
        let statusCode = 500;

        if (error instanceof mongoose.Error.ValidationError) {
            errorMessage = `Validation Error: ${error.message}`;
            statusCode = 400;
        } else if (error instanceof SyntaxError && error.message.includes("JSON")) {
            errorMessage = "Invalid request body: Could not parse JSON.";
            statusCode = 400;
        } else if (error instanceof Error) {
             errorMessage = error.message;
        }

        return NextResponse.json({ message: errorMessage }, { status: statusCode });
    }
}