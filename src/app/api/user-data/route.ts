// src/app/api/user-data/route.ts

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Adjust path if needed
import { Session } from "next-auth"; // Import Session type for clarity

// Example function to get some user-specific data (replace with your actual logic)
async function getSensitiveUserData(userId: string) {
    // In a real app, you would fetch data from your database based on userId
    console.log(`API: Fetching sensitive data for user ID: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate DB query
    return {
        userId: userId,
        accountBalance: Math.random() * 1000, // Dummy data
        preferences: { theme: 'dark', notifications: true }, // Dummy data
        lastLogin: new Date().toISOString(),
    };
}


export async function GET() {
    // Fetch the session within the API route handler
    const session: Session | null = await getServerSession(authOptions);

    // --- Authentication Check ---
    if (!session || !session.user || !session.user.id) {
        console.log("API /user-data: Authentication failed - No session or user ID found.");
        // If no session or user ID, return a 401 Unauthorized response
        return NextResponse.json(
            { message: "Unauthorized: You must be logged in to access this resource." },
            { status: 401 }
        );
    }
    // --- End Authentication Check ---

    // If authenticated, proceed with API logic
    console.log(`API /user-data: Authenticated access by user: ${session.user.email} (ID: ${session.user.id})`);

    try {
        // Example: Fetch data specific to the logged-in user
        const userData = await getSensitiveUserData(session.user.id);

        // Return the protected data with a 200 OK status
        return NextResponse.json(
            {
                message: "Successfully fetched user data.",
                data: userData,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("API /user-data: Error fetching user data:", error);
        return NextResponse.json(
            { message: "Internal Server Error: Failed to fetch user data." },
            { status: 500 }
        );
    }
}

// You can add POST, PUT, DELETE handlers similarly, always checking the session first.
// export async function POST(request: Request) {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     // ... handle POST logic ...
//     return NextResponse.json({ message: "Data created" }, { status: 201 });
// }