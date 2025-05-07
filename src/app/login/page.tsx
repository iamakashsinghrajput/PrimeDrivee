import React, { Suspense } from 'react';
import LoginForm from './login-form';

function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white">
            <p className="text-xl font-poppins">Loading Login...</p>
        </div>
    );
}

export default function LoginPageWrapper() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <LoginForm />
        </Suspense>
    );
}