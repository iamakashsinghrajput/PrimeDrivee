// src/lib/authOptions.ts

import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user"; // Ensure IUser/User type is handled correctly
import Otp from "@/models/otp";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "@/lib/nodemailer";
import crypto from 'crypto';
import { Types } from 'mongoose';

// Keep necessary environment variable checks and definitions
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
// Ensure MONGODB_URI, EMAIL_USER, EMAIL_PASS are also checked if needed here

if (!clientId || !clientSecret) {
    throw new Error("Google OAuth credentials missing.");
}
if (!nextAuthSecret) {
    throw new Error("NextAuth secret missing.");
}
// Add other checks as necessary

const generateOtp = (length: number = 6): string => {
  return crypto.randomInt(10**(length-1), 10**length).toString();
};

interface LeanUser {
  _id: Types.ObjectId;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  gender?: 'male' | 'female' | 'other' | null;
  mobileNumber?: string | null;
  dob?: Date | null;
  emailVerified?: Date | null;
}

// Define and EXPORT authOptions
export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      async profile(profile) {
        try {
          await connectMongoDB();
          let user = await User.findOne({ email: profile.email });

          if (!user) {
            user = await User.create({
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              emailVerified: profile.email_verified ? new Date() : null,
            });
          } else {
            let needsSave = false;
            if (!user.image && profile.picture) {
              user.image = profile.picture;
              needsSave = true;
            }
            if (!user.name && profile.name) {
                user.name = profile.name;
                needsSave = true;
            }
            if (!user.emailVerified && profile.email_verified) {
                user.emailVerified = new Date();
                needsSave = true;
            }
            if (needsSave) {
               await user.save();
            }
          }

          if (!user || !user._id) {
              throw new Error("User creation or retrieval failed in Google profile function.");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
            console.error("Error processing Google profile:", error);
             return {
                 id: profile.sub,
                 name: profile.name,
                 email: profile.email,
                 image: profile.picture
             };
        }
      }
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP", type: "text" },
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials, _req) {
        if (!credentials) {
          throw new Error("No credentials provided.");
        }

        try {
          await connectMongoDB();
          const { email, password, otp } = credentials;

          if (!email) {
             throw new Error("Email is required.");
          }

          const user = await User.findOne({ email: email.toLowerCase() });

          if (!user) {
            throw new Error("Invalid credentials.");
          }

          if (!user._id) {
              throw new Error("User found but missing _id.");
          }


          if (otp) {
            const storedOtp = await Otp.findOne({ email: email }).sort({ createdAt: -1 });

            if (!storedOtp) {
               throw new Error("OTP not found or expired. Please try logging in again.");
            }

            if (new Date() > storedOtp.expiresAt) {
               await Otp.deleteOne({ _id: storedOtp._id });
               throw new Error("OTP has expired. Please try logging in again.");
            }

            if (storedOtp.otp === otp) {
              await Otp.deleteOne({ _id: storedOtp._id });

              if (!user.emailVerified) {
                 user.emailVerified = new Date();
                 await user.save();
              }

              return {
                  id: user._id.toString(),
                  name: user.name,
                  email: user.email,
                  image: user.image
              };
            } else {
              throw new Error("Invalid OTP.");
            }
          }
          else if (password) {
             if (!user.password) {
                 throw new Error("Invalid credentials or sign-in method.");
             }

             const isPasswordCorrect = await bcrypt.compare(password, user.password);

             if (!isPasswordCorrect) {
                throw new Error("Invalid credentials.");
             }

             const newOtp = generateOtp();
             const expiryMinutes = 5;
             const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

             await Otp.deleteMany({ email: email });

             await Otp.create({ email: email, otp: newOtp, expiresAt: expiresAt });

             sendOtpEmail(email, newOtp)
                .then(sent => {
                    if(!sent) console.error(`Authorize: Failed to trigger email sending for ${email} (check nodemailer logs).`);
                })
                .catch(err => {
                    console.error("Authorize: Background error sending OTP email:", err);
                });

             throw new Error(`OTP_REQUIRED:${email}`);

          } else {
              throw new Error("Invalid request.");
          }
        } catch (error: unknown) {
           let errorMessage = "Authorization failed.";
           if (error instanceof Error) {
                errorMessage = error.message;
                if (error.message.startsWith("OTP_REQUIRED:")) {
                   throw error;
                }
           }
           console.error("Error during authorization process:", errorMessage);
           throw new Error(errorMessage);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session: updateSessionData }) {
        let dbUser: LeanUser | null = null;

        if (user?.id && trigger === 'signIn') {
            token.id = user.id;
            try {
                await connectMongoDB();
                dbUser = await User.findById(user.id).lean<LeanUser>();
            } catch (error) {
                console.error("JWT: Error fetching user on initial sign-in:", error);
            }
        }
        else if (token?.id) {
             if (trigger === "update" || !token.gender || !token.mobileNumber || !token.dob) {
                 try {
                    await connectMongoDB();
                    dbUser = await User.findById(token.id).lean<LeanUser>();
                 } catch (error) {
                    console.error("JWT: Error re-fetching user:", error);
                 }
             }
        }

         if (trigger === "update" && updateSessionData) {
            token = { ...token, ...updateSessionData };
            if(!dbUser && token.id){
                 try {
                    await connectMongoDB();
                    dbUser = await User.findById(token.id).lean<LeanUser>();
                 } catch (error) {
                    console.error("JWT: Error fetching user on update trigger:", error);
                 }
            }
        }

        if (dbUser) {
            token.id = dbUser._id.toString();
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.picture = dbUser.image;
            token.gender = dbUser.gender;
            token.mobileNumber = dbUser.mobileNumber;
            token.dob = dbUser.dob ? dbUser.dob.toISOString() : null;
            token.emailVerified = dbUser.emailVerified ? dbUser.emailVerified.toISOString() : null;
        }

        return token;
    },

    async session({ session, token }) {
        if (token?.id) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.email = token.email;
            session.user.image = token.picture;
            session.user.gender = token.gender;
            session.user.mobileNumber = token.mobileNumber;
            session.user.dob = token.dob;
            session.user.emailVerified = token.emailVerified;
        } else {
            console.warn("Session Callback: Token or token.id missing.");
        }
        return session;
    },
  },

  pages: {
    signIn: '/login',
  },

  secret: nextAuthSecret,
};

// Keep the type declarations here or move them to a central types file (e.g., src/types/next-auth.d.ts)
declare module "next-auth" {
    interface Session {
      user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        gender?: 'male' | 'female' | 'other' | null;
        mobileNumber?: string | null;
        dob?: string | null;
        emailVerified?: string | null;
      };
    }
     interface User {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
     }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name?: string | null;
        email?: string | null;
        picture?: string | null;
        gender?: 'male' | 'female' | 'other' | null;
        mobileNumber?: string | null;
        dob?: string | null;
        emailVerified?: string | null;
    }
}