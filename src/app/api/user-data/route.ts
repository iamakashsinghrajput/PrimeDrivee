import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Session } from "next-auth";

async function getSensitiveUserData(userId: string) {
    console.log(`API: Fetching sensitive data for user ID: ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
        userId: userId,
        accountBalance: Math.random() * 1000,
        preferences: { theme: 'dark', notifications: true },
        lastLogin: new Date().toISOString(),
    };
}


export async function GET() {
    const session: Session | null = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        console.log("API /user-data: Authentication failed - No session or user ID found.");
        return NextResponse.json(
            { message: "Unauthorized: You must be logged in to access this resource." },
            { status: 401 }
        );
    }
    console.log(`API /user-data: Authenticated access by user: ${session.user.email} (ID: ${session.user.id})`);

    try {
        const userData = await getSensitiveUserData(session.user.id);

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

// export async function POST(request: Request) {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//         return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }
//     return NextResponse.json({ message: "Data created" }, { status: 201 });
// }