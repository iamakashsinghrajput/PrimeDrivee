import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import PasswordResetToken from "@/models/passwordResetToken";
import { sendPasswordResetEmail } from "@/lib/nodemailer";
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
            console.log(`${logPrefix} User not found for email: ${normalizedEmail}. Sending generic response.`);
            return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });
        }

        if (!user.password) {
             console.log(`${logPrefix} User ${normalizedEmail} does not use password login.`);
              return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiryHours = 1;
        const expiresAt = new Date(Date.now() + tokenExpiryHours * 60 * 60 * 1000);

        console.log(`${logPrefix} Generated reset token for ${normalizedEmail}`);

        await PasswordResetToken.deleteMany({ email: user.email });
        await PasswordResetToken.create({
            email: user.email,
            token: resetToken,
            expiresAt: expiresAt,
        });
        console.log(`${logPrefix} Stored new reset token for ${normalizedEmail}`);

        const nextAuthUrl = process.env.NEXTAUTH_URL;
        const vercelUrl = process.env.VERCEL_URL;
        let baseUrl = '';

        if (nextAuthUrl) {
            baseUrl = nextAuthUrl;
            console.log(`${logPrefix} Using NEXTAUTH_URL: ${baseUrl}`);
        } else if (vercelUrl) {
            baseUrl = `https://${vercelUrl}`;
            console.log(`${logPrefix} NEXTAUTH_URL not set, falling back to VERCEL_URL (https): ${baseUrl}`);
        } else {
            baseUrl = 'http://localhost:3000';
            console.warn(`${logPrefix} WARNING: NEXTAUTH_URL and VERCEL_URL not set. Falling back to default: ${baseUrl}`);
        }
        baseUrl = baseUrl.replace(/\/$/, "");


        const resetPath = '/reset-password';
        const resetUrl = `${baseUrl}${resetPath}/${resetToken}`;
        console.log(`${logPrefix} Constructed Reset URL: ${resetUrl}`);

        const emailSent = await sendPasswordResetEmail(user.email, resetUrl);
        if (!emailSent) {
             console.error(`${logPrefix} Failed to send password reset email to ${user.email}. Check Nodemailer logs/config.`);
        } else {
             console.log(`${logPrefix} Password reset email sent successfully to ${user.email}.`);
        }

        return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });

    } catch (error) {
        console.error(`${logPrefix} Unhandled error:`, error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}