import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Otp from "@/models/otp";
import { sendOtpEmail } from "@/lib/nodemailer";
import crypto from 'crypto';

const generateOtp = (length: number = 6): string => {
  const otpNum = crypto.randomInt(0, 10**length);
  return otpNum.toString().padStart(length, '0');
};

export async function POST(request: Request) {
    const logPrefix = "[Resend OTP API]";
    console.log(`${logPrefix} Request received.`);
    try {
        await connectMongoDB();
        const { email } = await request.json();

        if (!email) {
            console.log(`${logPrefix} Error: Email is required.`);
            return NextResponse.json({ message: "Email is required." }, { status: 400 });
        }
        const normalizedEmail = email.toLowerCase().trim();
        console.log(`${logPrefix} Processing resend for: ${normalizedEmail}`);

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.log(`${logPrefix} User not found for ${normalizedEmail}. Sending generic success response.`);
            return NextResponse.json({ message: "If an account exists for this email, a new OTP has been sent." }, { status: 200 });
        }

        console.log(`${logPrefix} User found for ${normalizedEmail}. Generating new OTP.`);
        const newOtp = generateOtp();
        const expiryMinutes = 5;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        await Otp.deleteMany({ email: normalizedEmail });
        console.log(`${logPrefix} Deleted previous OTPs for ${normalizedEmail}`);

        await Otp.create({
            email: normalizedEmail,
            otp: newOtp,
            expiresAt: expiresAt,
        });
        console.log(`${logPrefix} Stored new OTP ${newOtp} for ${normalizedEmail}.`);

        const sent = await sendOtpEmail(normalizedEmail, newOtp);
        if (sent) {
            console.log(`${logPrefix} Successfully triggered OTP email to ${normalizedEmail}.`);
        } else {
            console.error(`${logPrefix} Failed to trigger OTP email to ${normalizedEmail}.`);
        }

        return NextResponse.json({ message: "A new OTP has been sent to your email address." }, { status: 200 });

    } catch (error) {
        console.error(`${logPrefix} Error processing resend request:`, error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}