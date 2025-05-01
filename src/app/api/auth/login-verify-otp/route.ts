import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Otp from "@/models/otp";
import VerificationToken from "@/models/verificationToken";
import crypto from 'crypto';

const generateVerificationToken = (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
};

export async function POST(request: Request) {
    const logPrefix = "[API Verify OTP]";
    console.log(`${logPrefix} Request received.`);
    try {
        await connectMongoDB();
        const { email, otp } = await request.json();

        if (!email || !otp) {
            console.log(`${logPrefix} Error: Email and OTP are required.`);
            return NextResponse.json({ message: "Email and OTP are required." }, { status: 400 });
        }
        if (typeof otp !== 'string' || !/^\d{6}$/.test(otp)) {
             console.log(`${logPrefix} Error: Invalid OTP format received: ${otp}`);
             return NextResponse.json({ message: "Invalid OTP format. Please enter the 6-digit code." }, { status: 400 });
        }
        const normalizedEmail = email.toLowerCase().trim();
        console.log(`${logPrefix} Attempting verification for email: ${normalizedEmail}`);

        const storedOtp = await Otp.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

        if (!storedOtp) {
            console.log(`${logPrefix} Failure: No OTP found for email: ${normalizedEmail}`);
            return NextResponse.json({ message: "Invalid or expired OTP. Please request a new one." }, { status: 400 });
        }
        console.log(`${logPrefix} Found stored OTP record expires at ${storedOtp.expiresAt.toISOString()}`);

        if (new Date() > storedOtp.expiresAt) {
            console.log(`${logPrefix} Failure: OTP expired for email ${normalizedEmail}.`);
            await Otp.deleteOne({ _id: storedOtp._id });
            return NextResponse.json({ message: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        if (storedOtp.otp !== otp) {
            console.log(`${logPrefix} Failure: Invalid OTP provided for email ${normalizedEmail}.`);
            return NextResponse.json({ message: "Invalid OTP entered. Please check the code." }, { status: 400 });
        }

        console.log(`${logPrefix} OTP verification successful for ${normalizedEmail}. Deleting OTP record.`);
        await Otp.deleteOne({ _id: storedOtp._id });

        const user = await User.exists({ email: normalizedEmail });
        if (!user) {
            console.error(`${logPrefix} CRITICAL: User ${normalizedEmail} not found after successful OTP verify!`);
            return NextResponse.json({ message: "Verification successful but user data could not be found." }, { status: 404 });
        }
        console.log(`${logPrefix} User ${normalizedEmail} confirmed to exist.`);

        const token = generateVerificationToken();
        const tokenExpiryMinutes = 2;
        const tokenExpiresAt = new Date(Date.now() + tokenExpiryMinutes * 60 * 1000);

        await VerificationToken.deleteMany({ email: normalizedEmail });
        await VerificationToken.create({
            email: normalizedEmail,
            token: token,
            expiresAt: tokenExpiresAt,
        });
        console.log(`${logPrefix} Generated and stored verification token for ${normalizedEmail}. Expires at ${tokenExpiresAt.toISOString()}`);

        console.log(`${logPrefix} Returning success response with verification token.`);
        return NextResponse.json({
            message: "OTP verified successfully. Proceeding to login.",
            verificationToken: token
        }, { status: 200 });

    } catch (error) {
        console.error(`${logPrefix} Unhandled exception:`, error);
        return NextResponse.json({ message: "An internal server error occurred during OTP verification." }, { status: 500 });
    }
}