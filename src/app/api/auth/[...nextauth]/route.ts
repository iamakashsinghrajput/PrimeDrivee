// src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
// Import authOptions from the dedicated configuration file
import { authOptions } from "@/lib/authOptions";

// Initialize NextAuth handler using the imported authOptions
const handler = NextAuth(authOptions);

// Export the handler directly for GET and POST requests.
// This conforms to the standard pattern for App Router catch-all routes with NextAuth.
export { handler as GET, handler as POST };