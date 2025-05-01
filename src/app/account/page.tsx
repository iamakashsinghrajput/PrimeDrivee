"use client";

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaEdit, FaSignOutAlt, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import guest from "@/assets/images/guest.png";
import React from 'react';

const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
        return "Not provided";
    }
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.warn(`formatDate: Received invalid date string: ${dateString}`);
            return "Invalid Date"; 
        }
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC'
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Error formatting date";
    }
};


interface DetailItemProps {
    label: string;
    value: string | number | null | undefined;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
    let displayValue: React.ReactNode;

    if (value === null || value === undefined || value === "") {
        displayValue = <span className="text-gray-500 italic">Not provided</span>;
    } else {
        displayValue = String(value);
    }

    return (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-400 font-poppins">{label}</dt>
            <dd className={`mt-1 text-sm text-gray-100 sm:mt-0 sm:col-span-2 font-poppins ${typeof value === 'string' && value !== "" ? 'capitalize' : ''}`}>
                {displayValue}
            </dd>
        </div>
    );
};


export default function AccountPage() {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            if (router) { router.push('/login?callbackUrl=/account'); }
        },
    });

    if (status === "loading") {
        return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white"><FaSpinner className="animate-spin text-4xl text-[var(--bg-color)]" /><span className="ml-3 text-xl font-poppins">Loading Account...</span></div> );
    }

     if (!session?.user) {
         return ( <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 text-white p-6"><FaExclamationCircle className="text-5xl text-red-500 mb-4" /><p className="text-xl font-poppins mb-4">Authentication Error</p><p className='text-center text-gray-400 mb-6'>Could not load session details. Please log in again.</p><Link href="/login"><button className="px-6 py-2 bg-[var(--main-color)] hover:bg-[var(--second-color)] text-white font-poppins rounded-md transition duration-150 ease-in-out">Go to Login</button></Link></div> );
     }

    const user = session.user;
    const displayDob = formatDate(user.dob);

    const handleGoHome = () => router.push('/');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-600 pt-24 pb-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[var(--text-color)] rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden border border-gray-700/50"
            >
                <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-black p-6 sm:p-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Image
                        src={user.image || guest}
                        alt="Profile Picture"
                        width={100}
                        height={100}
                        className="rounded-full border-4 border-[var(--second-color)] shadow-lg object-cover bg-gray-700"
                        priority
                    />
                    <div className='text-center sm:text-left flex-grow'>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white font-poppins leading-tight">{user.name || 'User Account'}</h2>
                        {user.email && ( <p className="text-sm text-gray-400 font-poppins mt-1 break-words">{user.email}</p> )}
                        {user.emailVerified ? ( <span className="inline-block mt-2 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-full">Verified</span> ) : ( <span className="inline-block mt-2 px-2 py-0.5 bg-yellow-600 text-white text-xs font-semibold rounded-full">Not Verified</span> )}
                    </div>
                    <div className="ml-auto hidden sm:block flex-shrink-0"><Link href="/account/edit"><button className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-md transition duration-150 ease-in-out shadow"><FaEdit className="mr-2" /> Edit Profile</button></Link></div>
                </div>

                <div className="p-6 sm:p-8">
                    <h3 className="text-lg font-semibold text-[var(--main-color)] border-b border-gray-700 pb-2 mb-4 font-poppins">Personal Information</h3>
                    <dl className="divide-y divide-gray-700">
                        <DetailItem label="Full Name" value={user.name} />
                        <DetailItem label="Email Address" value={user.email} />
                        <DetailItem label="Gender" value={user.gender} />
                        <DetailItem label="Mobile Number" value={user.mobileNumber} />
                        <DetailItem label="Date of Birth" value={displayDob} />
                    </dl>
                </div>

                <div className="px-6 pb-6 sm:hidden"><Link href="/account/edit"><button className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium rounded-md transition duration-150 ease-in-out shadow"><FaEdit className="mr-2" /> Edit Profile</button></Link></div>

                <div className="bg-gray-800/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <button onClick={handleGoHome} className="w-full sm:w-auto flex items-center justify-center px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition duration-150 ease-in-out shadow-md"><FaSignOutAlt className="mr-2 rotate-180" /> Home</button>
                    <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full sm:w-auto flex items-center justify-center px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition duration-150 ease-in-out shadow-md"><FaSignOutAlt className="mr-2" /> Logout</button>
                </div>
            </motion.div>
        </div>
    );
}