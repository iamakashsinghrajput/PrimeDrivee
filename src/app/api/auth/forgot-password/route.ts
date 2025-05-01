// src/app/api/forgot-password/route.ts

import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb"; // Adjust path if needed
import User from "@/models/user"; // Adjust path if needed
import PasswordResetToken from "@/models/passwordResetToken"; // Adjust path if needed
import { sendPasswordResetEmail } from "@/lib/nodemailer"; // Adjust path if needed
import crypto from 'crypto';

export async function POST(request: Request) {
    const logPrefix = "[API Forgot Password]";
    try {
        await connectMongoDB();
        const { email } = await request.json();

        if (!email || typeof email !== 'string') {
            console.log(`${logPrefix} Error: Email is required and must be a string.`);
            return NextResponse.json({ message: "Email is required." }, { status: 400 });
        }
        const normalizedEmail = email.toLowerCase().trim();
        console.log(`${logPrefix} Request received for email: ${normalizedEmail}`);

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            // SECURITY: Generic response even if user not found
            console.log(`${logPrefix} User not found for email: ${normalizedEmail}. Sending generic response.`);
            return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });
        }

        // Check if user has a password (e.g., not only social login)
        if (!user.password) {
             console.log(`${logPrefix} User ${normalizedEmail} does not use password login.`);
             // You might still send the generic success message here for security,
             // or return a specific error if preferred. Sending generic is often better.
             // return NextResponse.json({ message: "Password reset is not available for accounts registered via social login." }, { status: 400 });
              return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });
        }

        // Generate Token and Expiry
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiryHours = 1; // e.g., 1 hour
        const expiresAt = new Date(Date.now() + tokenExpiryHours * 60 * 60 * 1000);

        console.log(`${logPrefix} Generated reset token for ${normalizedEmail}`);

        // Store Token (Delete old ones first)
        await PasswordResetToken.deleteMany({ email: user.email });
        await PasswordResetToken.create({
            email: user.email,
            token: resetToken,
            expiresAt: expiresAt,
        });
        console.log(`${logPrefix} Stored new reset token for ${normalizedEmail}`);

        // --- Determine Base URL ---
        // Prioritize NEXTAUTH_URL, fall back to VERCEL_URL (HTTPS assumed)
        const nextAuthUrl = process.env.NEXTAUTH_URL;
        const vercelUrl = process.env.VERCEL_URL;
        let baseUrl = '';

        if (nextAuthUrl) {
            baseUrl = nextAuthUrl;
            console.log(`${logPrefix} Using NEXTAUTH_URL: ${baseUrl}`);
        } else if (vercelUrl) {
            // VERCEL_URL doesn't include the protocol, so add https://
            baseUrl = `https://${vercelUrl}`;
            console.log(`${logPrefix} NEXTAUTH_URL not set, falling back to VERCEL_URL (https): ${baseUrl}`);
        } else {
            // Fallback for local development if neither is set (shouldn't happen on Vercel)
            baseUrl = 'http://localhost:3000'; // Or your default local URL
            console.warn(`${logPrefix} WARNING: NEXTAUTH_URL and VERCEL_URL not set. Falling back to default: ${baseUrl}`);
        }
        // Ensure no trailing slash from environment variable if NEXTAUTH_URL is used
        baseUrl = baseUrl.replace(/\/$/, "");
        // --- End Determine Base URL ---


        const resetPath = '/reset-password'; // Define path separately
        const resetUrl = `${baseUrl}${resetPath}/${resetToken}`;
        console.log(`${logPrefix} Constructed Reset URL: ${resetUrl}`);

        // Send Email (Await is good practice here)
        const emailSent = await sendPasswordResetEmail(user.email, resetUrl);
        if (!emailSent) {
             // Log error, but still return generic success to user
             console.error(`${logPrefix} Failed to send password reset email to ${user.email}. Check Nodemailer logs/config.`);
        } else {
             console.log(`${logPrefix} Password reset email sent successfully to ${user.email}.`);
        }

        // Return generic success message regardless of user existence or email success
        return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });

    } catch (error) {
        console.error(`${logPrefix} Unhandled error:`, error);
        // Avoid exposing internal details in production errors
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}