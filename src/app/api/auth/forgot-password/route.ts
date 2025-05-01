import { NextResponse } from 'next/server';
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import PasswordResetToken from "@/models/passwordResetToken";
import { sendPasswordResetEmail } from "@/lib/nodemailer";
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        await connectMongoDB();
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required." }, { status: 400 });
        }
        console.log(`FORGOT PW API: Request received for email: ${email}`);

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.log(`FORGOT PW API: User not found for email: ${email}, sending generic response.`);
            return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });
        }

        if (!user.password) {
             console.log(`FORGOT PW API: User ${email} does not use password login. Cannot reset password.`);
             return NextResponse.json({ message: "Password reset is not available for accounts registered via social login." }, { status: 400 });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiryHours = 1;
        const expiresAt = new Date(Date.now() + tokenExpiryHours * 60 * 60 * 1000);

        console.log(`FORGOT PW API: Generated reset token for ${email}`);

        await PasswordResetToken.deleteMany({ email: user.email });
        console.log(`FORGOT PW API: Deleted existing tokens for ${email}`);

        await PasswordResetToken.create({
            email: user.email,
            token: resetToken,
            expiresAt: expiresAt,
        });
        console.log(`FORGOT PW API: Stored new reset token for ${email}`);

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;
        console.log(`FORGOT PW API: Reset URL: ${resetUrl}`);

        const emailSent = await sendPasswordResetEmail(user.email, resetUrl);
        if (!emailSent) {
             console.error(`FORGOT PW API: Failed to send password reset email to ${user.email}.`);
        } else {
             console.log(`FORGOT PW API: Password reset email sent successfully to ${user.email}.`);
        }

        return NextResponse.json({ message: "If an account with that email exists, a password reset link has been sent." }, { status: 200 });

    } catch (error) {
        console.error("FORGOT PW API: Error processing forgot password request:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}