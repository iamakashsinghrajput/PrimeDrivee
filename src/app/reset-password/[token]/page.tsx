"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function ResetPasswordPage() {
    const params = useParams();
    const router = useRouter();
    const token = params?.token as string | undefined;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setError("No reset token provided in the URL.");
                setIsValidToken(false);
                return;
            }
            setIsLoading(true);
            try {
                 setIsValidToken(true);
                // Placeholder for actual token verification logic
                // const response = await fetch('/api/auth/verify-reset-token', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                //     body: JSON.stringify({ token }),
                // });
                // if (!response.ok) {
                //     const errorData = await response.json().catch(() => ({ message: "Invalid or expired token" }));
                //     throw new Error(errorData.message || "Invalid or expired token");
                // }
                // const data = await response.json();
                // if (data.valid) {
                //    setIsValidToken(true);
                // } else {
                //    throw new Error("Invalid or expired token");
                // }
            } catch (err: unknown) {
                let errorMessage = "Invalid or expired password reset token.";
                 if (err instanceof Error) {
                     errorMessage = err.message;
                 }
                setError(errorMessage);
                setIsValidToken(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [token]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        if (!newPassword || !confirmPassword) {
            setError("Please enter and confirm your new password.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (!token) {
            setError("Reset token is missing.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || "Password reset successfully!");
                setNewPassword("");
                setConfirmPassword("");
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.message || "Failed to reset password.");
            }
        } catch (err) {
            console.error("Reset password fetch error:", err);
            setError("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };


    if (isLoading && isValidToken === null) {
         return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-white font-poppins">
                 Verifying token...
             </div>
         );
    }

    if (isValidToken === false) {
         return (
             <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 pt-20 pb-10 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[var(--text-color)] p-8 rounded-xl shadow-2xl w-full max-w-md border-[1px] border-gray-700 text-center"
                >
                    <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-red-400 font-poppins">Invalid Link</h2>
                    <p className="text-gray-400 font-poppins mb-6">{error || "This password reset link is invalid or has expired."}</p>
                    <Link href="/forgot-password">
                         <button className="px-6 py-2 bg-[var(--main-color)] hover:bg-[var(--second-color)] text-white font-poppins rounded-md transition duration-150 ease-in-out">
                             Request a New Link
                         </button>
                     </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 pt-20 pb-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[var(--text-color)] p-8 rounded-xl shadow-2xl w-full max-w-md border-[1px] border-gray-700"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-[var(--main-color)] font-Squadaone">
                    Reset Your Password
                </h2>

                {message && (
                     <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert">
                         <FaCheckCircle className="mr-2" />
                         <span className="block sm:inline font-poppins">{message} Redirecting to login...</span>
                     </div>
                 )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline font-poppins">{error}</span>
                    </div>
                )}

                {!message && (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="newPassword"className="block text-sm font-medium text-gray-400 font-poppins">
                                New Password
                            </label>
                            <input
                                id="newPassword" name="newPassword" type="password" required
                                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins"
                                placeholder="•••••••• (min. 6 characters)"
                                disabled={isLoading}
                            />
                        </div>

                         <div>
                            <label htmlFor="confirmPassword"className="block text-sm font-medium text-gray-400 font-poppins">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword" name="confirmPassword" type="password" required
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>
                    </form>
                )}
                 {message && (
                    <div className="mt-6 text-center">
                        <Link href="/login">
                             <button className="px-6 py-2 bg-[var(--main-color)] hover:bg-[var(--second-color)] text-white font-poppins rounded-md transition duration-150 ease-in-out">
                                 Go to Login
                             </button>
                         </Link>
                     </div>
                 )}
            </motion.div>
        </div>
    );
}