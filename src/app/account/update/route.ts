import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { authOptions } from "@/lib/authOptions";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import mongoose from 'mongoose';

interface UpdateData {
    name?: string;
    gender?: 'male' | 'female' | 'other' | '';
    mobileNumber?: string;
    dob?: string | null;
}

interface UserDocument {
    _id: mongoose.Types.ObjectId;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    gender?: string | null;
    mobileNumber?: string | null;
    dob?: Date | null;
    emailVerified?: Date | null;
}

export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;

    try {
        await connectMongoDB();

        const body: UpdateData = await request.json();

        const { name, gender, mobileNumber, dob } = body;

        const updateFields: Record<string, string | Date | null> = {};

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length === 0) {
                return NextResponse.json({ message: "Name cannot be empty." }, { status: 400 });
            }
            updateFields.name = name.trim();
        }
        if (gender !== undefined) {
            if (gender !== "" && !['male', 'female', 'other'].includes(gender)) {
                 return NextResponse.json({ message: "Invalid gender value provided." }, { status: 400 });
            }
             updateFields.gender = gender === "" ? null : gender;
        }
        if (mobileNumber !== undefined) {
            updateFields.mobileNumber = mobileNumber.trim();
        }
        if (dob !== undefined) {
            if (dob === null || dob === "") {
                updateFields.dob = null;
            } else {
                const dateObj = new Date(dob);
                const currentYear = new Date().getFullYear();
                if (isNaN(dateObj.getTime()) || dateObj.getFullYear() < currentYear - 120 || dateObj > new Date()) {
                    return NextResponse.json({ message: "Invalid or unrealistic date of birth." }, { status: 400 });
                }
                const utcDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
                updateFields.dob = utcDate;
            }
        }


        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: "No valid fields provided for update." }, { status: 400 });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateFields },
            {
                new: true,
                runValidators: true,
                lean: true
             }
        ).select('name email image gender mobileNumber dob emailVerified') as UserDocument | null;

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        const sessionUpdateData = {
            name: updatedUser.name,
            gender: updatedUser.gender,
            mobileNumber: updatedUser.mobileNumber,
            dob: updatedUser.dob ? updatedUser.dob.toISOString() : null,
            image: updatedUser.image,
        };

        return NextResponse.json({
            message: "Profile updated successfully.",
            user: sessionUpdateData
        }, { status: 200 });

    } catch (error: unknown) {
        console.error("UPDATE API: Error during profile update:", error);
         let errorMessage = "An internal server error occurred while updating profile.";
         let statusCode = 500;

         if (error instanceof mongoose.Error.ValidationError) {
             errorMessage = `Update failed due to validation errors: ${error.message}`;
             statusCode = 400;
         } else if (error instanceof mongoose.Error.CastError) {
            errorMessage = `Update failed due to invalid data format for field ${error.path}: ${error.message}`;
             statusCode = 400;
         } else if (error instanceof SyntaxError && error.message.includes("JSON")) {
             errorMessage = "Invalid request body: Could not parse JSON.";
             statusCode = 400;
         } else if (error instanceof Error) {
             console.error(`Specific error: ${error.message}`);
         }

        return NextResponse.json({ message: errorMessage }, { status: statusCode });
    }
}