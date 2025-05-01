/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectMongoDB } from "@/lib/mongodb";
import User, { IUser } from "@/models/user";
import VerificationToken from "@/models/verificationToken";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const mongodbUri = process.env.MONGODB_URI;

if (!clientId || !clientSecret) throw new Error("Google OAuth credentials missing.");
if (!nextAuthSecret) throw new Error("NextAuth secret missing.");
if (!mongodbUri) throw new Error("Database connection string missing.");

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      async profile(profile) {
          const logPrefix = "[Google Profile]";
          try {
             await connectMongoDB();
             let user = await User.findOne({ email: profile.email });

             if (!user) {
                console.log(`${logPrefix} User not found, creating new user.`);
                user = await User.create({
                   email: profile.email,
                   name: profile.name,
                   image: profile.picture,
                   emailVerified: profile.email_verified ? new Date() : null,
                });
                console.log(`${logPrefix} New user created.`);
             } else {
                console.log(`${logPrefix} Existing user found. Checking for updates.`);
                let needsSave = false;
                 if (!user.image && profile.picture) { user.image = profile.picture; needsSave = true; }
                 if (!user.name && profile.name) { user.name = profile.name; needsSave = true; }
                 if (!user.emailVerified && profile.email_verified) { user.emailVerified = new Date(); needsSave = true; }
                 if (needsSave) await user.save();
             }

             if (!user?._id) {
                console.error(`${logPrefix} CRITICAL: User object invalid after create/find.`);
                throw new Error("Google profile handling failed.");
             }

             console.log(`${logPrefix} Returning user object.`);
             return {
                 id: (user as IUser)._id.toString(),
                 name: user.name,
                 email: user.email,
                 image: user.image
             };
          } catch(error) {
              console.error(`${logPrefix} Error:`, error);
              return { id: profile.sub, name: profile.name, email: profile.email, image: profile.picture };
          }
       }
    }),
    CredentialsProvider({
        id: "otp-credentials",
        name: "OTP Verification Token",
        credentials: {
            email: { label: "Email", type: "email" },
            verificationToken: { label: "Verification Token", type: "text" }
        },
        async authorize(credentials, _req) {
            const logPrefix = "[OTP Credentials Authorize]";

            if (!credentials?.email || !credentials?.verificationToken) {
                console.error(`${logPrefix} Error: Email or Verification Token missing.`);
                return null;
            }

            const email = credentials.email.toLowerCase().trim();
            const token = credentials.verificationToken;
            console.log(`${logPrefix} Attempting final verification for email: ${email}`);

            try {
                await connectMongoDB();
                const storedToken = await VerificationToken.findOne({ email: email, token: token });

                if (!storedToken) {
                    console.log(`${logPrefix} Failure: Verification token not found or mismatch.`);
                    return null;
                }
                console.log(`${logPrefix} Found token record. Expires: ${storedToken.expiresAt.toISOString()}`);

                if (new Date() > storedToken.expiresAt) {
                    console.log(`${logPrefix} Failure: Verification token expired.`);
                    await VerificationToken.deleteOne({ _id: storedToken._id });
                    return null;
                }

                console.log(`${logPrefix} Token is valid.`);
                await VerificationToken.deleteOne({ _id: storedToken._id });
                console.log(`${logPrefix} Deleted used verification token.`);

                const user = await User.findOne({ email: email });

                if (!user) {
                    console.error(`${logPrefix} CRITICAL: User ${email} not found after validating token!`);
                    return null;
                }

                console.log(`${logPrefix} SUCCESS: Verified token and found user. Returning user object.`);
                return {
                    id: (user as IUser)._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image
                };

            } catch (error) {
                console.error(`${logPrefix} Error during token verification for ${email}:`, error);
                return null;
            }
        }
    }),

  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user?.id) { 
          token.id = user.id;
          token.name = user.name;
          token.email = user.email;
          token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
  secret: nextAuthSecret,
  debug: process.env.NODE_ENV === 'development',
};

declare module "next-auth" {
  interface Session { user: {
      dob(dob: unknown): string | null | undefined;
      mobileNumber: string | null | undefined;
      gender: string | null | undefined;
      emailVerified: unknown; id: string; name?: string | null; email?: string | null; image?: string | null; 
}; }
  interface User { id: string; name?: string | null; email?: string | null; image?: string | null; }
}
declare module "next-auth/jwt" {
  interface JWT { id: string; name?: string | null; email?: string | null; picture?: string | null; }
}