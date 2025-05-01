"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { motion } from "framer-motion";
import NavbarSplitTheme from "@/components/Navbar";

const RESEND_COOLDOWN_SECONDS = 60;
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const [otpRequired, setOtpRequired] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatusMessage, setResendStatusMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (timer) {
      clearInterval(timer);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);


  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSendingOtp(true);
    setError(null);
    setResendStatusMessage(null);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });

      if (result?.error) {
        if (result.error.startsWith("OTP_REQUIRED:")) {
          const otpEmail = result.error.split(":")[1];
          setEmailForOtp(otpEmail);
          setOtpRequired(true);
          setError(null);
          setResendCooldown(0);
        } else {
          setError(result.error === "CredentialsSignin" ? "Invalid email or password." : result.error);
        }
      } else if (result?.ok) {
        router.push("/");
      } else {
         setError("An unknown error occurred during login.");
      }
    } catch (err: unknown) {
      let message = "An unexpected error occurred.";
       if (err instanceof Error) {
          message = err.message;
       }
      setError(message);
    } finally {
      setIsLoading(false);
      setIsSendingOtp(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
     setIsVerifyingOtp(true);
     setError(null);
     setResendStatusMessage(null);

     try {
       const result = await signIn("credentials", {
         redirect: false,
         email: emailForOtp,
         otp: otp,
       });

       if (result?.error) {
         setError(result.error === "CredentialsSignin" ? "Invalid OTP or it has expired." : result.error);
         setOtp("");
       } else if (result?.ok) {
         router.push("/");
       } else {
         setError("An unknown error occurred during OTP verification.");
         setOtp("");
       }
     } catch (err: unknown) {
        let message = "An unexpected error occurred.";
        if (err instanceof Error) {
            message = err.message;
        }
       setError(message);
       setOtp("");
     } finally {
       setIsLoading(false);
       setIsVerifyingOtp(false);
     }
   };

  const handleResendOtp = async () => {
      if (resendCooldown > 0 || isResendingOtp) return;

      setIsResendingOtp(true);
      setError(null);
      setResendStatusMessage("Sending new OTP...");

      try {
          const response = await fetch('/api/auth/resend-otp', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: emailForOtp }),
          });

          const data = await response.json();

          if (!response.ok) {
              setResendStatusMessage(`Error: ${data.message || 'Failed to resend OTP'}`);
          } else {
              setResendStatusMessage(data.message || "New OTP sent successfully.");
              setResendCooldown(RESEND_COOLDOWN_SECONDS);
              setOtp("");
          }

      } catch (err) {
          console.error("Exception during resend OTP:", err);
          setResendStatusMessage("An error occurred while trying to resend OTP.");
      } finally {
          setIsResendingOtp(false);
      }
  };


   const handleGoogleLogin = async () => {
     if (isLoading || isSendingOtp || isVerifyingOtp || isResendingOtp) return;

     setIsLoading(true);
     setError(null);
     setResendStatusMessage(null);

     try {
         const result = await signIn("google", { callbackUrl: "/" });
         if (result?.error) {
            setError("Failed to login with Google. Please try again.");
            setIsLoading(false);
         }
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
     } catch(err) {
         setError("An error occurred during Google Sign-in.");
         setIsLoading(false);
     }
   };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 pt-20 pb-10 px-4">
      <NavbarSplitTheme/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[var(--text-color)] p-8 rounded-xl shadow-2xl w-full max-w-md border-[1px] border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-[var(--main-color)] font-Squadaone">
          Login to PrimeDrive<span className='text-[var(--second-color)]'>.</span>
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline font-poppins">{error}</span>
          </div>
        )}

         {resendStatusMessage && (
          <div className={`px-4 py-3 rounded relative mb-4 border ${resendStatusMessage.startsWith("Error:") ? 'bg-red-100 border-red-400 text-red-700' : 'bg-green-100 border-green-400 text-green-700'}`} role="status">
            <span className="block sm:inline font-poppins">{resendStatusMessage}</span>
          </div>
        )}

        {!otpRequired ? (
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
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
               <label htmlFor="password" className="block text-sm font-medium text-gray-400 font-poppins">
                 Password
               </label>
               <input
                 id="password" name="password" type="password" autoComplete="current-password" required
                 value={password} onChange={(e) => setPassword(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins"
                 placeholder="••••••••"
                 disabled={isLoading}
               />
             </div>
             <div className="text-sm text-right">
                 <Link href="/forgot-password" className="font-medium text-[var(--second-color)] hover:text-[var(--main-color)] font-poppins">
                     Forgot your password?
                 </Link>
             </div>
             <div>
               <button
                 type="submit"
                 disabled={isLoading || isSendingOtp}
                 className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${(isLoading || isSendingOtp) ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {isSendingOtp ? 'Sending OTP...' : 'Login'}
               </button>
             </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
             <p className="text-sm text-gray-400 font-poppins text-center">
                An OTP has been sent to <strong>{emailForOtp}</strong>. Please enter it below. It&apos;s valid for 5 minutes.
             </p>
             <div>
               <label htmlFor="otp" className="block text-sm font-medium text-gray-400 font-poppins">
                 One-Time Password (OTP)
               </label>
               <input
                 id="otp" name="otp" type="text" inputMode="numeric" autoComplete="one-time-code" required
                 value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins tracking-widest text-center"
                 placeholder="Enter OTP"
                 disabled={isLoading || isVerifyingOtp}
               />
             </div>
             <div>
               <button
                 type="submit"
                 disabled={isLoading || isVerifyingOtp}
                 className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${(isLoading || isVerifyingOtp) ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {isVerifyingOtp ? 'Verifying...' : 'Verify OTP & Login'}
               </button>
             </div>
             <div className="text-center text-sm">
                 <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || isResendingOtp || isLoading}
                    className={`font-medium font-poppins transition duration-150 ease-in-out ${ (resendCooldown > 0 || isResendingOtp || isLoading) ? 'text-gray-500 cursor-not-allowed' : 'text-[var(--second-color)] hover:text-[var(--main-color)]'}`}
                  >
                     {isResendingOtp
                       ? 'Sending...'
                       : resendCooldown > 0
                         ? `Resend OTP in ${resendCooldown}s`
                         : 'Resend OTP'}
                  </button>
             </div>
             <div className="text-center">
                  <button
                      type="button"
                      onClick={() => { setOtpRequired(false); setError(null); setResendStatusMessage(null); setOtp(''); setEmail(''); setPassword(''); }}
                      className="text-sm font-medium text-gray-400 hover:text-gray-300 font-poppins"
                      disabled={isLoading || isResendingOtp}
                  >
                      Entered wrong email? Go back
                  </button>
              </div>
          </form>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"> <div className="w-full border-t border-gray-600" /> </div>
            <div className="relative flex justify-center text-sm"> <span className="px-2 bg-[var(--text-color)] text-gray-400 font-poppins">Or continue with</span> </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            <div>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || otpRequired}
                className={`w-full inline-flex justify-center items-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${(isLoading || otpRequired) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FaGoogle className="w-5 h-5 mr-2" />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400 font-poppins">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-[var(--second-color)] hover:text-[var(--main-color)]">
            Register here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;