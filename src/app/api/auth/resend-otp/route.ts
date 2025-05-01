import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Otp from "@/models/otp";
import { sendOtpEmail } from "@/lib/nodemailer";
import crypto from 'crypto';

const generateOtp = (length: number = 6): string => {
  return crypto.randomInt(10**(length-1), 10**length).toString();
};

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required." }, { status: 400 });
        }

        console.log(`RESEND API: Request received for email: ${email}`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`RESEND API: User not found for email: ${email}`);
            return NextResponse.json({ message: "If an account exists for this email, a new OTP has been sent." }, { status: 200 });
        }

        const newOtp = generateOtp();
        const expiryMinutes = 5;
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        console.log(`RESEND API: Generated new OTP ${newOtp} for ${email}`);

        await Otp.deleteMany({ email: email });
        console.log(`RESEND API: Deleted previous OTPs for ${email}`);

        await Otp.create({
            email: email,
            otp: newOtp,
            expiresAt: expiresAt,
        });
        console.log(`RESEND API: Stored new OTP for ${email}`);

        sendOtpEmail(email, newOtp)
          .then(sent => {
              if(sent) {
                 console.log(`RESEND API: Successfully triggered email sending for ${email}.`);
              } else {
                  console.error(`RESEND API: Failed to trigger email sending for ${email} (check nodemailer logs).`);
              }
          })
          .catch(err => {
              console.error("RESEND API: Error sending OTP email in background:", err);
          });

        return NextResponse.json({ message: "A new OTP has been sent to your email address." }, { status: 200 });

    } catch (error) {
        console.error("RESEND API: Error processing resend request:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}