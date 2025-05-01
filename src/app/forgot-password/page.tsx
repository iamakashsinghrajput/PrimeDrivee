"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || "Password reset link sent (if account exists).");
                setEmail("");
            } else {
                setError(data.message || "Failed to send password reset link.");
            }
        } catch (err) {
            console.error("Forgot password fetch error:", err);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 pt-20 pb-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[var(--text-color)] p-8 rounded-xl shadow-2xl w-full max-w-md border-[1px] border-gray-700"
            >
                <h2 className="text-2xl font-bold text-center mb-4 text-[var(--main-color)] font-Squadaone">
                    Forgot Password<span className='text-[var(--second-color)]'>?</span>
                </h2>
                <p className="text-center text-sm font-poppins text-gray-400 mb-6">
                    Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline font-poppins">{message}</span>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline font-poppins">{error}</span>
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 font-poppins">
                            Email Address
                        </label>
                        <input
                            id="email" name="email" type="email" autoComplete="email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins"
                            placeholder="you@example.com"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400 font-poppins">
                    Remember your password?{' '}
                    <Link href="/login" className="font-medium text-[var(--second-color)] hover:text-[var(--main-color)]">
                        Login here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}