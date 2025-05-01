"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name || !email || !password || !gender || !mobileNumber || !dob) {
      setError("All fields are necessary.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            email,
            password,
            gender,
            mobileNumber,
            dob
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful, redirecting to login...");
        router.push('/login');
      } else {
        setError(data.message || `Registration failed with status: ${response.status}`);
        console.error("Registration failed:", data);
      }
    } catch (error) {
      console.error("Exception during registration fetch:", error);
      setError("An error occurred during registration. Please try again.");
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
        className="bg-[var(--text-color)] p-8 rounded-xl shadow-2xl w-full max-w-md border-[1px] mt-6 border-gray-700"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-[var(--main-color)] font-Squadaone">
          Create Account
        </h2>
        <p className="text-center text-sm font-poppins text-gray-400 mb-6">
          Fill in the details to join PrimeDrive<span className='text-[var(--second-color)]'>.</span>
        </p>

        {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
             <span className="block sm:inline font-poppins">{error}</span>
           </div>
         )}

        <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-400 font-poppins'>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins"
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>

            <div>
               <label htmlFor="email" className="block text-sm font-medium text-gray-400 font-poppins">
                 Email Address
               </label>
               <input
                 id="email"
                 name="email"
                 type="email"
                 autoComplete="email"
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
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
                 id="password"
                 name="password"
                 type="password"
                 autoComplete="new-password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins"
                 placeholder="•••••••• (min. 6 characters)"
                 disabled={isLoading}
               />
             </div>

             <div>
               <label htmlFor="gender" className="block text-sm font-medium text-gray-400 font-poppins">
                 Gender
               </label>
               <select
                 id="gender"
                 name="gender"
                 required
                 value={gender}
                 onChange={(e) => setGender(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins"
                 disabled={isLoading}
               >
                 <option value="" disabled className="text-gray-500">Select Gender</option>
                 <option value="male">Male</option>
                 <option value="female">Female</option>
                 <option value="other">Other</option>
               </select>
             </div>

             <div>
               <label htmlFor='mobileNumber' className='block text-sm font-medium text-gray-400 font-poppins'>
                 Mobile Number
               </label>
               <input
                 id="mobileNumber"
                 type="tel"
                 name="mobileNumber"
                 required
                 value={mobileNumber}
                 onChange={(e) => setMobileNumber(e.target.value)}
                 className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins"
                 placeholder="+91 12345 67890"
                 disabled={isLoading}
               />
             </div>

              <div>
                <label htmlFor='dob' className='block text-sm font-medium text-gray-400 font-poppins'>
                  Date of Birth
                </label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  className="
                    mt-1 block w-full px-3 py-2          /* Layout & Spacing */
                    bg-gray-700 border border-gray-600   /* Background & Border */
                    rounded-md shadow-sm                  /* Appearance */
                    placeholder-gray-500                 /* Explicit Placeholder Color for consistency */
                    text-white                           /* Text Color */
                    font-poppins sm:text-sm              /* Font Styling */
                    focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] /* Focus State - Adjusted ring */
                    disabled:opacity-50 disabled:cursor-not-allowed /* Disabled State */

                    /* Hints for the browser's date picker UI */
                    [color-scheme:dark]                  /* Suggest dark mode for the picker (browser/OS dependent) */
                    accent-[var(--second-color)]         /* Attempt to color accents in the picker (e.g., selected date - browser dependent) */

                    /* Attempt to style the calendar icon (Webkit/Blink browsers like Chrome/Edge/Safari) */
                    [&::-webkit-calendar-picker-indicator]:text-gray-400 /* Default color */
                    dark:[&::-webkit-calendar-picker-indicator]:filter dark:[&::-webkit-calendar-picker-indicator]:invert /* Try to make it white in dark mode */
                    [&::-webkit-calendar-picker-indicator]:hover:text-gray-200 /* Hover state */
                    dark:[&::-webkit-calendar-picker-indicator]:hover:opacity-80 /* Hover state in dark */
                  "
                  disabled={isLoading}
                />
              </div>


          <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400 font-poppins">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[var(--second-color)] hover:text-[var(--main-color)]">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}