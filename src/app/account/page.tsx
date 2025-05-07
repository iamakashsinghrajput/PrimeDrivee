/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from "framer-motion";
import { FaSpinner, FaSave, FaTimes } from 'react-icons/fa';

interface SessionUser {
    id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    gender?: 'male' | 'female' | 'other' | null | '';
    mobileNumber?: string | null;
    dob?: string | null;
    emailVerified?: string | boolean | Date | null;
}


export default function EditAccountPage() {
    const { data: sessionData, status, update: updateSession } = useSession({
        required: true,
        onUnauthenticated() {
             if (router) router.push('/login?callbackUrl=/account/edit');
             else console.error("Router not available for redirect in onUnauthenticated");
        }
     });
    const router = useRouter();

    const sessionUser = sessionData?.user as SessionUser | undefined;

    const [name, setName] = useState("");
    const [gender, setGender] = useState<string>("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [dob, setDob] = useState("");

    const [isInitializing, setIsInitializing] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        console.log(`EDIT PAGE (Effect): Running. Status: ${status}`);
        if (status === 'loading') {
            console.log("EDIT PAGE (Effect): Status is loading, waiting...");
            setIsInitializing(true);
            return;
        }

        if (status === "authenticated") {
            if (sessionUser) {
                console.log("EDIT PAGE (Effect): Status authenticated, sessionUser found. Populating form...", sessionUser);
                try {
                    setName(sessionUser.name || "");
                    setGender(sessionUser.gender || "");
                    setMobileNumber(sessionUser.mobileNumber || "");
                    if (sessionUser.dob) {
                        const date = new Date(sessionUser.dob);
                        if (!isNaN(date.getTime())) {
                            const year = date.getUTCFullYear();
                            const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
                            const day = date.getUTCDate().toString().padStart(2, '0');
                            setDob(`${year}-${month}-${day}`);
                        } else { setDob(""); }
                    } else { setDob(""); }
                    console.log("EDIT PAGE (Effect): Form population complete.");
                } catch (err) {
                    console.error("EDIT PAGE (Effect): Error during form population:", err);
                    setError("Failed to load profile data correctly.");
                } finally {
                    console.log("EDIT PAGE (Effect): Setting isInitializing to false (authenticated).");
                    setIsInitializing(false);
                }
            } else {
                console.error("EDIT PAGE (Effect): Status authenticated, but sessionUser is missing!");
                setError("Could not load user details from session.");
                setIsInitializing(false);
            }
        } else if (status === 'unauthenticated') {
             console.log("EDIT PAGE (Effect): Status unauthenticated. Setting isInitializing to false.");
             setIsInitializing(false);
        }
    }, [status, sessionUser]);
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null); setSuccessMessage(null); setIsSubmitting(true);

        const dobToSend: string | null = dob.trim() === "" ? null : dob;
        const apiUpdateData = { name: name.trim(), gender, mobileNumber: mobileNumber.trim(), dob: dobToSend };
        console.log("EDIT PAGE (Client): Sending update data to API:", apiUpdateData);

        let apiResponseOk = false;
        let apiResultUser: Partial<SessionUser> | undefined;

        try {
            const response = await fetch('/api/account/update', {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(apiUpdateData),
            });
            const contentType = response.headers.get("content-type");
            const responseText = await response.text();
            apiResponseOk = response.ok;
            console.log(`EDIT PAGE (Client): API Response Status: ${response.status}`);

            if (apiResponseOk && contentType?.includes("application/json")) {
                const result: { message?: string; user?: Partial<SessionUser> } = JSON.parse(responseText);
                console.log("EDIT PAGE (Client): API Success Response:", result);
                setSuccessMessage(result.message || "Profile updated successfully!");
                apiResultUser = result.user;

                if (apiResultUser && Object.keys(apiResultUser).length > 0) {
                    console.log("EDIT PAGE (Client): Preparing data for session update:", apiResultUser);
                    try {
                        await updateSession(apiResultUser);
                        console.log("EDIT PAGE (Client): Session update function called successfully.");
                        console.log("EDIT PAGE (Client): Manually updating local form state.");
                        setName(apiResultUser.name ?? name);
                        setGender(apiResultUser.gender ?? gender);
                        setMobileNumber(apiResultUser.mobileNumber ?? mobileNumber);
                         if (apiResultUser.dob) { try { const d=new Date(apiResultUser.dob); if(!isNaN(d.getTime())) {const y=d.getUTCFullYear(),m=(d.getUTCMonth()+1).toString().padStart(2,'0'),day=d.getUTCDate().toString().padStart(2,'0'); setDob(`${y}-${m}-${day}`);} else setDob("");} catch {setDob("");} } else { setDob(""); }
                    } catch (updateError) {
                         console.error("EDIT PAGE (Client): Error calling updateSession:", updateError);
                         setError("Profile saved, but session update failed. Please refresh.");
                         apiResponseOk = false;
                    }
                } else { console.warn("EDIT PAGE (Client): API success response missing 'user' data."); }

            } else {
                console.error(`EDIT PAGE (Client): API Error - Status ${response.status}. Raw Text: ${responseText.substring(0, 200)}`);
                let errorMessage = `Update failed (Status: ${response.status}).`;
                 if (contentType?.includes("application/json")) { try { const errRes = JSON.parse(responseText); errorMessage = errRes.message || errorMessage; } catch(e) { errorMessage = `Update failed (Status: ${response.status}) - Invalid error format.`;} }
                 else if (response.status === 404) { errorMessage = "Update failed: API endpoint not found (/api/account/update)."; }
                 else if (responseText.toLowerCase().includes("<!doctype html")) { errorMessage = `Update failed (Status: ${response.status}): Server returned HTML. Check logs.`; }
                 else { errorMessage = `Update failed (Status: ${response.status}): ${responseText.substring(0, 100)}...`; }
                setError(errorMessage);
            }
        } catch (err: unknown) {
            console.error("EDIT PAGE (Client): Submit fetch/network error:", err);
            let message = 'An unexpected network or client-side error occurred.';
             if (err instanceof Error) { message += `: ${err.message}`; }
            setError(message);
            apiResponseOk = false;
        } finally {
             if (!apiResponseOk || error) { setIsSubmitting(false); }
        }

        if (apiResponseOk && !error) {
            console.log("EDIT PAGE (Client): API call successful, preparing redirect.");
            setTimeout(() => {
                console.log("EDIT PAGE (Client): Redirecting to /account and refreshing...");
                router.push('/account');
                router.refresh();
            }, 1500);
        } else {
             console.log("EDIT PAGE (Client): API call failed or error occurred, not redirecting.");
             if(!successMessage){ setIsSubmitting(false); }
        }
    };

     if (isInitializing) {
        return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white"><FaSpinner className="animate-spin text-4xl text-[var(--bg-color)]" /><span className="ml-2 font-poppins">Loading Profile...</span></div> );
     }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 pt-24 pb-12 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-[var(--text-color)] p-8 rounded-xl shadow-2xl w-full max-w-2xl border-[1px] border-gray-700">
                <h2 className="text-2xl font-bold text-center mb-6 text-[var(--main-color)] font-Squadaone">Edit Profile</h2>
                {successMessage && !error && ( <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 flex items-center" role="alert"> <span className="block sm:inline font-poppins">{successMessage}</span> </div> )}
                {error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"> <span className="block sm:inline font-poppins">{error}</span> </div> )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div><label htmlFor="email_display" className="block text-sm font-medium text-gray-400 font-poppins"> Email Address (Cannot be changed) </label><input id="email_display" type="email" value={sessionUser?.email || ''} readOnly disabled className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm sm:text-sm text-gray-400 font-poppins cursor-not-allowed" /></div>
                    
                    <div><label htmlFor='name' className='block text-sm font-medium text-gray-400 font-poppins'> Full Name </label><input id="name" type="text" name="name" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins" placeholder="John Doe" disabled={isSubmitting} /></div>

                    <div><label htmlFor="gender" className="block text-sm font-medium text-gray-400 font-poppins"> Gender </label><select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins" disabled={isSubmitting}><option value="" className="text-gray-500">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>

                    <div><label htmlFor='mobileNumber' className='block text-sm font-medium text-gray-400 font-poppins'> Mobile Number </label><input id="mobileNumber" type="tel" name="mobileNumber" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins" placeholder="e.g., +11234567890 or 123-456-7890" disabled={isSubmitting} /></div>

                    <div><label htmlFor='dob' className='block text-sm font-medium text-gray-400 font-poppins'> Date of Birth </label><input id="dob" type="date" name="dob" value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().split("T")[0]} className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-[var(--second-color)] focus:border-[var(--second-color)] sm:text-sm text-white font-poppins [color-scheme:dark]" disabled={isSubmitting} /></div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                        <Link href="/account" className="w-full sm:w-auto"><button type="button" disabled={isSubmitting} className="w-full flex justify-center items-center px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out disabled:opacity-50"><FaTimes className="mr-2" /> Cancel</button></Link>
                        <button type="submit" disabled={isSubmitting || !!successMessage} className={`w-full sm:w-auto flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--main-color)] hover:bg-[var(--second-color)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--second-color)] transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`}>{isSubmitting ? <FaSpinner className="animate-spin mr-2" /> : <FaSave className="mr-2" />}{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}