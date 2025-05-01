import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import PasswordResetToken from "@/models/passwordResetToken";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ message: "Token and new password are required." }, { status: 400 });
        }
        if (newPassword.length < 6) {
             return NextResponse.json({ message: "Password must be at least 6 characters long." }, { status: 400 });
        }

        console.log(`RESET PW API: Request received for token: ${token.substring(0, 10)}...`);

        const resetTokenDoc = await PasswordResetToken.findOne({ token: token });

        if (!resetTokenDoc) {
            console.log(`RESET PW API: Invalid token provided.`);
            return NextResponse.json({ message: "Invalid or expired password reset token." }, { status: 400 });
        }

        if (new Date() > resetTokenDoc.expiresAt) {
            console.log(`RESET PW API: Expired token provided for email ${resetTokenDoc.email}.`);
            await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id });
            return NextResponse.json({ message: "Invalid or expired password reset token." }, { status: 400 });
        }

        const user = await User.findOne({ email: resetTokenDoc.email });
        if (!user) {
            console.error(`RESET PW API: User not found for valid token associated with email ${resetTokenDoc.email}.`);
            await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id });
            return NextResponse.json({ message: "An error occurred. User not found." }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log(`RESET PW API: Hashed new password for ${user.email}`);

        user.password = hashedPassword;
        await user.save();
        console.log(`RESET PW API: Password updated successfully for ${user.email}`);

        await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id });
        console.log(`RESET PW API: Deleted used reset token for ${user.email}`);

        return NextResponse.json({ message: "Password has been reset successfully." }, { status: 200 });

    } catch (error) {
        console.error("RESET PW API: Error processing reset password request:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}