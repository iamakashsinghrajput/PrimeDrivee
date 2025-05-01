// src/app/login/login-form.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { signIn, SignInResponse } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import NavbarSplitTheme from "@/components/Navbar"; // Assuming this component exists

const RESEND_COOLDOWN_SECONDS = 60;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const initialError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatusMessage, setResendStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialError === 'CredentialsSignin') {
      setError('Login verification failed. Please try again.');
    } else if (initialError) {
      setError(`Login error: ${initialError}`);
    }
  }, [initialError]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => { setResendCooldown((prev) => Math.max(0, prev - 1)); }, 1000);
    }
    return () => { if (timer) clearInterval(timer); };
  }, [resendCooldown]);

  const handleCredentialsSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true); setError(null); setSuccess(null); setResendStatusMessage(null);
    console.log(`[Client] handleCredentialsSubmit: Attempting credential check & OTP request for: ${email}`);
    try {
      const response = await fetch('/api/auth/login-request-otp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log("[Client] handleCredentialsSubmit: API response:", data);
      if (!response.ok) {
        setError(data.message || 'Login failed. Please check your credentials.'); setSuccess(null);
      } else {
        setSuccess(data.message || "Credentials verified, OTP sent."); setError(null); setStep('otp'); setResendCooldown(RESEND_COOLDOWN_SECONDS);
      }
    } catch (err) {
      console.error('[Client] handleCredentialsSubmit: Network or client error:', err); setError('An unexpected network error occurred.'); setSuccess(null);
    } finally { setIsLoading(false); }
  };

  const handleOtpSubmit = async (event: React.FormEvent) => {
     event.preventDefault();
     setIsLoading(true); setError(null); setSuccess(null); setResendStatusMessage(null);
     let signInResult: SignInResponse | undefined | null = null;

     if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) { setError('Please enter a valid 6-digit OTP.'); setIsLoading(false); return; }
     console.log(`[Client] handleOtpSubmit: Verifying OTP ${otp} for ${email}`);

     try {
         const verifyResponse = await fetch('/api/auth/login-verify-otp', {
             method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp }),
         });
         const verifyData = await verifyResponse.json();
         console.log("[Client] handleOtpSubmit: Verification API response:", verifyData);
         if (!verifyResponse.ok) { setError(verifyData.message || 'OTP verification failed.'); setOtp(''); throw new Error("OTP verification API failed"); }

         const { verificationToken } = verifyData;
         if (!verificationToken) { console.error("[Client] handleOtpSubmit: Verification token missing from API response."); setError('Verification process incomplete.'); throw new Error("Missing verification token"); }

         setSuccess('OTP verified. Logging in...');
         console.log(`[Client] handleOtpSubmit: Calling signIn with otp-credentials provider for ${email}`);

         signInResult = await signIn('otp-credentials', {
             redirect: false, email: email, verificationToken: verificationToken,
         });

         console.log("[Client] handleOtpSubmit: Final signIn result:", signInResult);
         if (signInResult?.error) {
             console.error("[Client] handleOtpSubmit: Final signIn Error:", signInResult.error);
             setError(signInResult.error === 'CredentialsSignin' ? 'Final login step failed. Invalid token or session issue.' : `Login error: ${signInResult.error}`); setSuccess(null);
         } else if (signInResult?.ok) {
             setError(null); setSuccess('Login successful! Redirecting...');
         } else {
             setError('An unknown error occurred during the final login step.'); setSuccess(null);
         }
     // --- CORRECTED CATCH BLOCK ---
     } catch (err: unknown) { // Use 'unknown' (or 'any', or omit type)
         let message = 'An unexpected error occurred during verification.';
         // Type check before accessing .message
         if (err instanceof Error) {
             // Use the specific error message if available, otherwise keep the generic one
             message = err.message || message;
         } else if (typeof err === 'string') {
             // Handle cases where a string might be thrown
             message = err;
         }
         // Set error only if not already set by other logic in the try block
         if (!error && !success) {
             setError(message);
         }
         console.error('[Client] handleOtpSubmit: Client-side error:', err); // Log the original caught error
         setSuccess(null); // Clear success message on error
     // --- END CORRECTED CATCH BLOCK ---
     } finally {
         if (!signInResult?.ok || error) { setIsLoading(false); }
     }

     if (signInResult?.ok && !error) {
         console.log(`[Client] handleOtpSubmit: Redirecting to ${callbackUrl}`);
         router.push(callbackUrl);
     }
  };

  const handleGoogleLogin = () => {
    if (isLoading) return;
    setIsLoading(true); setError(null); setSuccess(null); setResendStatusMessage(null);
    console.log("[Client] handleGoogleLogin: Initiating Google Sign-In...");
    signIn('google', { callbackUrl: callbackUrl });
  };

  const handleResendOtp = async () => {
      if (resendCooldown > 0 || isResendingOtp || isLoading) return;
      setIsResendingOtp(true); setError(null); setSuccess(null); setResendStatusMessage("Sending new OTP...");
      console.log(`[Client] handleResendOtp: Requesting OTP resend for: ${email}`);
      try {
          const response = await fetch('/api/auth/resend-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
          const data = await response.json();
          console.log("[Client] handleResendOtp: Resend OTP response:", data);
          if (!response.ok) { setResendStatusMessage(`Error: ${data.message || 'Failed to resend OTP'}`); }
          else { setResendStatusMessage(data.message || "New OTP sent successfully."); setResendCooldown(RESEND_COOLDOWN_SECONDS); setOtp(""); }
      } catch (err) {
          console.error("[Client] handleResendOtp: Exception during resend OTP fetch:", err); setResendStatusMessage("An error occurred while trying to resend OTP.");
      } finally { setIsResendingOtp(false); }
  };

  const handleGoBackToCredentials = () => {
    setStep('credentials'); setError(null); setSuccess(null); setResendStatusMessage(null); setOtp(''); setIsLoading(false);
    console.log("[Client] handleGoBackToCredentials: Returning to credentials input.");
  };


  // JSX (Keep your original structure)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 pt-20 pb-10 px-4">
      <NavbarSplitTheme/>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-[var(--text-color)] p-8 rounded-xl shadow-2xl w-full max-w-md border-[1px] border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-6 text-[var(--main-color)] font-Squadaone">{step === 'credentials' ? 'Login to PrimeDrive' : 'Enter Verification Code'}<span className='text-[var(--second-color)]'>.</span></h2>
        {error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"> <span className="block sm:inline font-poppins">{error}</span> </div> )}
        {success && ( <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert"> <span className="block sm:inline font-poppins">{success}</span> </div> )}
        {resendStatusMessage && !error && !success && ( <div className={`px-4 py-3 rounded relative mb-4 border ${resendStatusMessage.startsWith("Error:") ? 'bg-red-100 border-red-400 text-red-700' : 'bg-blue-100 border-blue-400 text-blue-700'}`} role="status"> <span className="block sm:inline font-poppins">{resendStatusMessage}</span> </div> )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
             <div><label htmlFor="email" className="block text-sm font-medium text-gray-400 font-poppins">Email Address</label><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins" placeholder="you@example.com" disabled={isLoading} /></div>
             <div>
               <div className="flex items-center justify-between"><label htmlFor="password" className="block text-sm font-medium text-gray-400 font-poppins">Password</label><div className="text-sm"><Link href="/forgot-password" className="font-medium text-[var(--second-color)] hover:text-[var(--main-color)] font-poppins">Forgot password?</Link></div></div>
              <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins" placeholder="••••••••" disabled={isLoading} />
            </div>
             <div> <button type="submit" disabled={isLoading || !email || !password} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${ (isLoading || !email || !password) ? 'opacity-50 cursor-not-allowed' : ''}`} > {isLoading ? 'Verifying...' : 'Login & Send OTP'} </button> </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
             <p className="text-sm text-gray-400 font-poppins text-center">A verification code was sent to <strong>{email}</strong>. Please enter it below.</p>
             <div><label htmlFor="otp" className="block text-sm font-medium text-gray-400 font-poppins">Verification Code (OTP)</label><input id="otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))} maxLength={6} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins tracking-widest text-center" placeholder="Enter 6-digit OTP" disabled={isLoading} autoFocus /></div>
             <div> <button type="submit" disabled={isLoading || otp.length !== 6} className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${(isLoading || otp.length !== 6) ? 'opacity-50 cursor-not-allowed' : ''}`} > {isLoading ? 'Logging in...' : 'Verify Code & Login'} </button> </div>
             <div className="text-center text-sm"> <button type="button" onClick={handleResendOtp} disabled={resendCooldown > 0 || isResendingOtp || isLoading} className={`font-medium font-poppins transition duration-150 ease-in-out ${ (resendCooldown > 0 || isResendingOtp || isLoading) ? 'text-gray-500 cursor-not-allowed' : 'text-[var(--second-color)] hover:text-[var(--main-color)]'}`} > {isResendingOtp ? 'Sending...' : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'} </button> </div>
             <div className="text-center"> <button type="button" onClick={handleGoBackToCredentials} className="text-sm font-medium text-gray-400 hover:text-gray-300 font-poppins" disabled={isLoading || isResendingOtp} >Entered wrong email/password? Go back</button> </div>
          </form>
        )}
        {step === 'credentials' && (
          <div className="mt-6">
            <div className="relative"> <div className="absolute inset-0 flex items-center"> <div className="w-full border-t border-gray-600" /> </div> <div className="relative flex justify-center text-sm"> <span className="px-2 bg-[var(--text-color)] text-gray-400 font-poppins">Or continue with</span> </div> </div>
            <div className="mt-6 grid grid-cols-1 gap-3"> <div> <button onClick={handleGoogleLogin} disabled={isLoading} className={`w-full inline-flex justify-center items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} > <FaGoogle className="w-5 h-5 mr-2" /> <span>Sign in with Google</span> </button> </div> </div>
          </div>
        )}
        {step === 'credentials' && (
          <div className="mt-6 text-center text-sm text-gray-400 font-poppins"> Don&apos;t have an account?{' '} <Link href="/register" className="font-medium text-[var(--second-color)] hover:text-[var(--main-color)]"> Register here </Link> </div>
        )}
      </motion.div>
    </div>
  );
};