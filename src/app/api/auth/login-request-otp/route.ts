import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Otp from "@/models/otp";
import { sendOtpEmail } from "@/lib/nodemailer";
import crypto from 'crypto';
import bcrypt from "bcrypt";

const generateOtp = (length: number = 6): string => {
  const otpNum = crypto.randomInt(0, 10**length);
  return otpNum.toString().padStart(length, '0');
};

export async function POST(request: Request) {
    const logPrefix = "[API Request OTP]";
    console.log(`${logPrefix} Request received.`);
    try {
        await connectMongoDB();
        const { email, password } = await request.json();

        if (!email || !password) {
            console.log(`${logPrefix} Error: Email and Password are required.`);
            return NextResponse.json({ message: "Email and Password are required." }, { status: 400 });
        }
        const normalizedEmail = email.toLowerCase().trim();

        console.log(`${logPrefix} Searching for user: ${normalizedEmail}`);
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            console.log(`${logPrefix} User not found for email: ${normalizedEmail}.`);
            return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
        }

        if (!user.password) {
             console.log(`${logPrefix} User ${normalizedEmail} found but has no password set (likely social login).`);
             return NextResponse.json({ message: "Password login not enabled for this account." }, { status: 403 });
        }

        console.log(`${logPrefix} Comparing password for user ${user._id}`);
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            console.log(`${logPrefix} Password mismatch for user ${user._id}`);
            return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
        }

        console.log(`${logPrefix} Credentials valid for ${user._id}. Proceeding with OTP.`);

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

        return NextResponse.json({ message: "Credentials verified. An OTP has been sent to your email." }, { status: 200 });

    } catch (error) {
        console.error(`${logPrefix} Unhandled exception:`, error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}