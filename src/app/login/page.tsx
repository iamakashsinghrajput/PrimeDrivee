// src/app/login/page.tsx // <<< NEW FILE
import React, { Suspense } from 'react';
import LoginForm from './login-form'; // Import the renamed client component

// Define a simple loading component (can be more sophisticated)
function LoadingFallback() {
    // Style this to match your site's loading state
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <p className="text-xl font-poppins">Loading Login...</p>
            {/* You could add a spinner here too */}
        </div>
    );
}

// This is the actual page component now (Server Component by default)
export default function LoginPageWrapper() {
    return (
        // Wrap the Client Component that uses useSearchParams in Suspense
        <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
        </Suspense>
    );
}

// Optional: Add metadata if needed
// export const metadata = {
//   title: 'Login | PrimeDrive',
//   description: 'Login to your PrimeDrive account.',
// };