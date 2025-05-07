import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Booking from "@/models/booking";
import Razorpay from 'razorpay';
import { allCarsDetailData } from '@/data/carData';
import mongoose from 'mongoose';
import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance: Razorpay | null = null;
if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    try {
        razorpayInstance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
        console.log("[API CreatePO] Razorpay instance initialized.");
    } catch (e) {
        console.error("[API CreatePO] Error initializing Razorpay:", e);
    }
} else {
    console.error("[API CreatePO] Razorpay keys not configured.");
}

const calculateTotalAmount = (carId: number, days: number = 1): number | null => {
    const car = allCarsDetailData.find(c => c.id === carId);
    if (!car || typeof car.pricePerDay !== 'number' || car.pricePerDay <= 0) return null;
    return car.pricePerDay * days * 100;
};

export async function POST(request: Request) {
    const logPrefix = "[API CreatePO]";
    console.log(`${logPrefix} Request received.`);

    if (!razorpayInstance) {
        console.error(`${logPrefix} Razorpay instance not initialized.`);
        return NextResponse.json({ message: "Payment gateway configuration error." }, { status: 503 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        console.log(`${logPrefix} Not authenticated.`);
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    try {
        await connectMongoDB();
        const body = await request.json();
        const { carId, address, phoneNumber, paymentMethod } = body;

        if (!carId || typeof carId !== 'number' ||
            !address || typeof address.addressLine1 !== 'string' || typeof address.city !== 'string' || typeof address.postalCode !== 'string' ||
            !phoneNumber || typeof phoneNumber !== 'string' ||
            !paymentMethod || !['card', 'upi', 'netbanking'].includes(paymentMethod)) {
            console.log(`${logPrefix} Missing or invalid required fields.`);
            return NextResponse.json({ message: "Missing or invalid required fields." }, { status: 400 });
        }

        const carNumericId = carId;
        const carDetails = allCarsDetailData.find(c => c.id === carNumericId);
        if (!carDetails) return NextResponse.json({ message: "Invalid car selected." }, { status: 400 });

        const rentalDays = 1;
        const amountInPaise = calculateTotalAmount(carNumericId, rentalDays);
        if (amountInPaise === null || amountInPaise <= 0) return NextResponse.json({ message: "Could not calculate price for the selected car." }, { status: 400 });

        const user = await User.findById(session.user.id);
        if (!user || !user._id) return NextResponse.json({ message: "Authenticated user not found in database." }, { status: 404 });

        const internalBookingId = new mongoose.Types.ObjectId();
        const timestampPart = Date.now().toString(36);
        const randomPart = crypto.randomBytes(6).toString('hex');
        let receiptId = `bk_${timestampPart}_${randomPart}`;
        if (receiptId.length > 40) {
             receiptId = receiptId.substring(0, 40);
        }
        console.log(`${logPrefix} Generated receiptId: ${receiptId} (length: ${receiptId.length})`);


        const preliminaryBooking = new Booking({
            _id: internalBookingId,
            user: user._id,
            carId: carNumericId,
            carModel: carDetails.model,
            carBrand: carDetails.brand,
            pricePerDay: carDetails.pricePerDay,
            totalPrice: amountInPaise / 100,
            deliveryAddress: address,
            userPhoneNumber: phoneNumber,
            paymentMethod: paymentMethod,
            status: 'PendingPayment',
            paymentDetails: {
                provider: 'razorpay',
                receipt: receiptId,
            }
        });
        await preliminaryBooking.save();
        console.log(`${logPrefix} Preliminary booking ${preliminaryBooking._id} saved.`);

        const orderOptions = {
            amount: amountInPaise,
            currency: "INR" as const,
            receipt: receiptId,
            notes: {
                userId: user._id.toString(),
                userEmail: user.email ?? 'N/A',
                carId: String(carNumericId),
                carModel: carDetails.model,
                internalBookingId: preliminaryBooking._id.toString(),
            },
        };

        console.log(`${logPrefix} Creating Razorpay order with options:`, orderOptions);
        const order = await razorpayInstance.orders.create(orderOptions);
        console.log(`${logPrefix} Razorpay order created:`, order);

        if (!order || !order.id) {
            preliminaryBooking.status = 'PaymentFailed';
            preliminaryBooking.paymentDetails = { ...preliminaryBooking.paymentDetails, error: 'Razorpay order creation failed at gateway' };
            await preliminaryBooking.save();
            return NextResponse.json({ message: "Failed to initiate payment with gateway." }, { status: 502 });
        }

        preliminaryBooking.paymentDetails = { ...preliminaryBooking.paymentDetails, orderId: order.id };
        await preliminaryBooking.save();

        return NextResponse.json({
            message: "Payment order created successfully.",
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: RAZORPAY_KEY_ID,
            internalBookingId: preliminaryBooking._id.toString(),
            userDetails: { name: user.name || "", email: user.email || "", contact: phoneNumber, }
        }, { status: 200 });

    } catch (error: unknown) {
        console.error(`${logPrefix} Error:`, error);
        let errorMessage = "An internal server error occurred.";
        let statusCode = 500;
        if (error instanceof mongoose.Error.ValidationError) {
            errorMessage = "Booking data validation failed: " + error.message;
            statusCode = 400;
        } else if (typeof error === 'object' && error !== null && 'statusCode' in error && 'error' in error) {
            const rzpError = error as { statusCode: number; error: { code: string; description: string; reason?: string } };
            console.error(`${logPrefix} Razorpay API Error:`, rzpError.error);
            errorMessage = `Payment gateway error: ${rzpError.error.description || rzpError.error.code}`;
            statusCode = rzpError.statusCode === 400 ? 400 : 502;
        } else if (error instanceof Error) {
        }
        return NextResponse.json({ message: errorMessage }, { status: statusCode });
    }
}