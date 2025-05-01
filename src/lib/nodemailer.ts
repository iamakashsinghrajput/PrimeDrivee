import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.warn("Email credentials (EMAIL_USER, EMAIL_PASS) are not set. Emails will not be sent.");
}

let transporter: nodemailer.Transporter | null = null;
if (emailUser && emailPass) {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });
    transporter.verify((error) => {
      if (error) {
        console.error("Nodemailer configuration error:", error);
      } else {
        console.log("Nodemailer is ready to send emails.");
      }
    });
} else {
    console.error("Nodemailer transporter could not be created due to missing credentials.");
}


export const sendOtpEmail = async (to: string, otp: string): Promise<boolean> => {
  if (!transporter) {
      console.error("Cannot send OTP email: Transporter not available.");
      return false;
  }
  try {
    const info = await transporter.sendMail({
      from: `PrimeDrive <${emailUser}>`,
      to: to,
      subject: 'Your PrimeDrive Login OTP',
      text: `Your One-Time Password for PrimeDrive is: ${otp}\nIt is valid for 5 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `<p>Your One-Time Password for PrimeDrive is: <strong>${otp}</strong></p><p>It is valid for 5 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
    });
    console.log(`OTP email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Failed to send OTP email to ${to}:`, error);
    return false;
  }
};

export const sendPasswordResetEmail = async (to: string, resetUrl: string): Promise<boolean> => {
    if (!transporter) {
        console.error("Cannot send password reset email: Transporter not available.");
        return false;
    }
    try {
        const info = await transporter.sendMail({
            from: `PrimeDrive <${emailUser}>`,
            to: to,
            subject: 'Reset Your PrimeDrive Password',
            text: `You requested a password reset for your PrimeDrive account.\n\nPlease click the link below to set a new password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email or contact support if you have concerns.`,
            html: `<p>You requested a password reset for your PrimeDrive account.</p>
                   <p>Please click the link below to set a new password:</p>
                   <p><a href="${resetUrl}" target="_blank" style="background-color: #f9a826; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
                   <p>Or copy and paste this URL into your browser:</p>
                   <p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p>
                   <p>This link will expire in 1 hour.</p>
                   <hr>
                   <p style="font-size: 0.9em; color: #666;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>`,
        });
        console.log(`Password reset email sent successfully to ${to}. Message ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`Failed to send password reset email to ${to}:`, error);
        return false;
    }
};