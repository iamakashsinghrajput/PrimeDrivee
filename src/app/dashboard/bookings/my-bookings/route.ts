/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { connectMongoDB } from "@/lib/mongodb";
import Booking, { IBooking } from "@/models/booking";

export async function GET(request: Request) {
    const logPrefix = "[API MyBookings]";
    console.log(`${logPrefix} Request received for GET /dashboard/bookings/my-bookings`);
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        console.log(`${logPrefix} Error: Not authenticated.`);
        return NextResponse.json({ message: "User not authenticated." }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(`${logPrefix} Fetching bookings for user ID: ${userId}`);

    try {
        await connectMongoDB();
        console.log(`${logPrefix} MongoDB connected.`);

        const userBookings: IBooking[] = await Booking.find({ user: userId })
            .sort({ createdAt: -1 })
            .lean();

        console.log(`${logPrefix} Found ${userBookings.length} bookings for user ID: ${userId}`);
        return NextResponse.json(userBookings, { status: 200 });

    } catch (error: unknown) {
        console.error(`${logPrefix} CRITICAL Error fetching user bookings:`, error);
        const errorMessage = error instanceof Error ? error.message : "An unknown internal server error occurred.";
        return NextResponse.json(
            {
              message: "Could not retrieve bookings due to a server error.",
              errorDetail: errorMessage
            },
            { status: 500 }
        );
    }
}