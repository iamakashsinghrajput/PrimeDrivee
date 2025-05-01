"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { FaSpinner, FaSave, FaTimes } from 'react-icons/fa';

interface SessionUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    gender?: string | null;
    mobileNumber?: string | null;
    dob?: string | null;
}

interface CustomSession {
    user?: SessionUser;
    expires: string;
}

export default function EditAccountPage() {
    const { data: session, status, update: updateSession } = useSession({ required: true });
    const router = useRouter();

    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [dob, setDob] = useState("");

    const [isInitializing, setIsInitializing] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const user = session.user as SessionUser;
            setName(user.name || "");
            setGender(user.gender || "");
            setMobileNumber(user.mobileNumber || "");
            if (user.dob) {
                 try {
                    const date = new Date(user.dob);
                    if (!isNaN(date.getTime())) {
                        const year = date.getFullYear();
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const day = date.getDate().toString().padStart(2, '0');
                        setDob(`${year}-${month}-${day}`);
                    } else {
                         console.warn("Invalid date format received for DOB:", user.dob);
                         setDob("");
                    }
                } catch (_error) {
                     console.error("Error parsing DOB:", _error);
                     setDob("");
                 }
            } else { setDob(""); }
            setIsInitializing(false);
        } else if (status === 'loading') {
             setIsInitializing(true);
        }
    }, [session, status]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setIsSubmitting(true);

        const updatedData = { name: name.trim(), gender, mobileNumber: mobileNumber.trim(), dob };
        console.log("EDIT PAGE (Client): Sending update data:", updatedData);

        try {
            const response = await fetch('/account/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            console.log(`EDIT PAGE (Client): API Response Status: ${response.status}`);

            const contentType = response.headers.get("content-type");
            const responseText = await response.text();

            if (response.ok && contentType && contentType.includes("application/json")) {
                const result: { message?: string; user?: SessionUser } = JSON.parse(responseText);
                console.log("EDIT PAGE (Client): API Success Response (Parsed JSON):", result);
                setSuccessMessage(result.message || "Profile updated successfully!");

                if (result.user) {
                     console.log("EDIT PAGE (Client): Triggering session update...");
                     await updateSession({
                        ...session,
                        user: {
                            ...session?.user,
                            ...result.user
                        }
                     });
                     console.log("EDIT PAGE (Client): Session update triggered.");
                } else {
                     console.warn("EDIT PAGE (Client): API success response missing user data for session update.");
                }

                setTimeout(() => router.push('/account'), 1500);

            } else {
                console.error(`EDIT PAGE (Client): API Error - Status ${response.status}. Content-Type: ${contentType}`);
                console.error("EDIT PAGE (Client): Raw API Response Text:", responseText);
                let errorMessage = `Update failed (Status: ${response.status}).`;
                if (contentType && contentType.includes("application/json")) {
                    try {
                        const errorResult: { message?: string } = JSON.parse(responseText);
                        errorMessage = errorResult.message || errorMessage;
                    } catch (parseError) {
                        console.error("EDIT PAGE (Client): Could not parse error JSON response:", parseError);
                        errorMessage = `Update failed (Status: ${response.status}) - Invalid error format from server.`;
                    }
                } else if (response.status === 404) {
                     errorMessage = "Update failed: API endpoint not found (404). Please check configuration.";
                } else if (responseText.toLowerCase().includes("<!doctype html")) {
                     errorMessage = `Update failed (Status: ${response.status}): Server returned an HTML page instead of data. Check server logs.`;
                } else {
                     errorMessage = `Update failed (Status: ${response.status}): ${responseText.substring(0, 100)}...`;
                }
                setError(errorMessage);
            }

        } catch (err: unknown) {
            console.error("EDIT PAGE (Client): Submit fetch/network error:", err);
            let message = 'An unexpected network or client-side error occurred.';
             if (err instanceof Error) {
                 message += `: ${err.message}`;
            } else if (typeof err === 'string') {
                 message += `: ${err}`;
            }
            setError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

     if (status === "loading" || isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white">
                <FaSpinner className="animate-spin text-4xl text-[var(--bg-color)]" />
                <span className="ml-2 font-poppins">Loading Profile...</span>
            </div>
        );
    }

    const typedSession = session as CustomSession | null;


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 pt-24 pb-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[var(--text-color)] p-8 rounded-xl shadow-2xl w-full max-w-2xl border-[1px] border-gray-700"
            >
                <h2 className="text-2xl font-bold text-center mb-6 text-[var(--main-color)] font-Squadaone">
                    Edit Profile
                </h2>

                 {successMessage && ( <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert"> <span className="block sm:inline font-poppins">{successMessage}</span> </div> )}
                 {error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"> <span className="block sm:inline font-poppins">{error}</span> </div> )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                     <div>
                       <label htmlFor="email_display" className="block text-sm font-medium text-gray-400 font-poppins"> Email Address (Cannot be changed) </label>
                       <input id="email_display" type="email" value={typedSession?.user?.email || ''} readOnly disabled className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm sm:text-sm text-gray-400 font-poppins cursor-not-allowed" />
                     </div>
                    <div>
                        <label htmlFor='name' className='block text-sm font-medium text-gray-400 font-poppins'> Full Name </label>
                        <input id="name" type="text" name="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins" placeholder="John Doe" disabled={isSubmitting} />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-400 font-poppins"> Gender </label>
                        <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins" disabled={isSubmitting}>
                            <option value="" className="text-gray-500">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor='mobileNumber' className='block text-sm font-medium text-gray-400 font-poppins'> Mobile Number </label>
                        <input id="mobileNumber" type="tel" name="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins" placeholder="e.g., +11234567890 or 123-456-7890" disabled={isSubmitting} />
                    </div>
                    <div>
                        <label htmlFor='dob' className='block text-sm font-medium text-gray-400 font-poppins'> Date of Birth </label>
                        <input id="dob" type="date" name="dob" value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins [color-scheme:dark]" disabled={isSubmitting} />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                         <Link href="/account"><button type="button" disabled={isSubmitting} className="w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out disabled:opacity-50"> <FaTimes className="mr-2" /> Cancel </button></Link>
                         <button type="submit" disabled={isSubmitting || !!successMessage} className={`w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`}> {isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />} {isSubmitting ? 'Saving...' : 'Save Changes'} </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}