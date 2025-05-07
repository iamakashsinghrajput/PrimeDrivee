import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcrypt";
import mongoose from 'mongoose';
import { sendOtpEmail } from "@/lib/nodemailer";

const generateOtp = (length: number = 6): string => {
  return Math.floor(Math.random() * (10**length - 10**(length-1)) + 10**(length-1)).toString();
};

export async function POST(request: Request) {
    try {
        const { name, email, password, gender, mobileNumber, dob } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });
        }

        await connectMongoDB();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "User with this email already exists." }, { status: 409 });
        }

        if (mobileNumber) {
            const existingPhone = await User.findOne({ mobileNumber });
            if (existingPhone) {
              return NextResponse.json({ message: "User with this mobile number already exists." }, { status: 409 });
            }
        }

        if(password.length < 6) {
             return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        let dateOfBirth: Date | undefined;
        if (dob) {
            const parsedDate = new Date(dob);
            if (isNaN(parsedDate.getTime())) {
                 return NextResponse.json({ message: "Invalid Date of Birth format." }, { status: 400 });
            }
            dateOfBirth = parsedDate;
        }

        await User.create({
            name,
            email,
            password: hashedPassword,
            gender,
            mobileNumber,
            dob: dateOfBirth,
        });

        const newOtp = generateOtp();
        console.log(`REGISTER API: Generated OTP ${newOtp} for ${email}`);

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.error("REGISTER API: Email credentials are missing in environment variables.");
        } else {
            console.log("REGISTER API: Email credentials found.");
        }

        const sent = await sendOtpEmail(email, newOtp);
        if (sent) {
            console.log(`REGISTER API: Successfully sent OTP email to ${email}.`);
        } else {
            console.error(`REGISTER API: Failed to send OTP email to ${email}.`);
        }

        return NextResponse.json({ message: "User registered successfully. OTP sent to email." }, { status: 201 });

    } catch (error: unknown) {
        console.error("Register API: Error during registration:", error);

         if (error instanceof mongoose.Error.ValidationError) {
             const messages = Object.values(error.errors).map((el) => {
                 if (el && typeof el === 'object' && 'message' in el) {
                     return el.message as string;
                 }
                 return 'Unknown validation error';
             });
             return NextResponse.json({ message: `Validation failed: ${messages.join(', ')}` }, { status: 400 });
         }

         let errorMessage = "An internal server error occurred during registration.";
         if (error instanceof Error) {
             errorMessage = error.message;
         }

        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
