import nodemailer from 'nodemailer';

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  console.warn("Email credentials (EMAIL_USER, EMAIL_PASS) are not set in .env.local. Emails will not be sent.");
}

let transporter: nodemailer.Transporter | null = null;
if (emailUser && emailPass) {
    try {
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
            transporter = null;
          } else {
            console.log("Nodemailer is ready to send emails.");
          }
        });
    } catch (configError) {
         console.error("Failed to create Nodemailer transporter:", configError);
         transporter = null;
    }
} else {
    console.error("Nodemailer transporter could not be created due to missing EMAIL_USER or EMAIL_PASS credentials.");
}


export const sendOtpEmail = async (to: string, otp: string): Promise<boolean> => {
  const logPrefix = "[Nodemailer sendOtpEmail]";
  if (!transporter) {
      console.error(`${logPrefix} Cannot send OTP email to ${to}: Transporter not available or not configured correctly.`);
      return false;
  }

  if (!to || !/\S+@\S+\.\S+/.test(to)) {
      console.error(`${logPrefix} Invalid 'to' email address provided: ${to}`);
      return false;
  }

  const mailOptions = {
      from: `"PrimeDrive" <${emailUser}>`,
      to: to,
      subject: 'Your PrimeDrive Login OTP',
      text: `Your One-Time Password for PrimeDrive is: ${otp}\nIt is valid for 5 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `<p>Your One-Time Password for PrimeDrive is: <strong>${otp}</strong></p><p>It is valid for 5 minutes.</p><p>If you did not request this, please ignore this email.</p>`,
  };

  try {
    console.log(`${logPrefix} Attempting to send OTP email to ${to}...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`${logPrefix} OTP email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`${logPrefix} Failed to send OTP email to ${to}:`, error);
    return false;
  }
};

export const sendPasswordResetEmail = async (to: string, resetUrl: string): Promise<boolean> => {
     const logPrefix = "[Nodemailer sendPasswordResetEmail]";
     if (!transporter) {
         console.error(`${logPrefix} Cannot send password reset email to ${to}: Transporter not available.`);
         return false;
     }
     if (!to || !/\S+@\S+\.\S+/.test(to)) {
         console.error(`${logPrefix} Invalid 'to' email address provided: ${to}`);
         return false;
     }
     if (typeof resetUrl !== 'string' || !resetUrl.startsWith('http')) {
         console.error(`${logPrefix} Invalid 'resetUrl' provided: ${resetUrl}`);
         return false;
     }

     const mailOptions = {
         from: `"PrimeDrive" <${emailUser}>`,
         to: to,
         subject: 'Reset Your PrimeDrive Password',
         text: `You requested a password reset for your PrimeDrive account.\n\nPlease click the link below to set a new password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email or contact support if you have concerns.`,
         html: `<p>You requested a password reset for your PrimeDrive account.</p><p>Please click the link below to set a new password:</p><p><a href="${resetUrl}" target="_blank" style="background-color: #f9a826; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p><p>Or copy and paste this URL into your browser:</p><p><a href="${resetUrl}" target="_blank">${resetUrl}</a></p><p>This link will expire in 1 hour.</p><hr><p style="font-size: 0.9em; color: #666;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>`,
     };

     try {
         console.log(`${logPrefix} Attempting to send password reset email to ${to}...`);
         const info = await transporter.sendMail(mailOptions);
         console.log(`${logPrefix} Password reset email sent successfully to ${to}. Message ID: ${info.messageId}`);
         return true;
     } catch (error) {
         console.error(`${logPrefix} Failed to send password reset email to ${to}:`, error);
         return false;
     }
 };