"use client";

import React, { Suspense, useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useSearchParams, notFound } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';

import { allCarsDetailData } from '@/data/carData';
import { CarDetail } from '@/types';
import guest from '@/assets/images/guest.png';

const ConfirmationContent: React.FC = () => {
    const searchParams = useSearchParams();
    const { data: session, status: sessionStatus } = useSession();

    const bookingId = searchParams.get('bookingId');
    const carIdParam = searchParams.get('carId');
    const carModelParam = searchParams.get('carModel');

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const carData = useMemo((): CarDetail | null => {
        if (!carIdParam) return null;
        const id = parseInt(carIdParam, 10);
        if (isNaN(id)) return null;
        return allCarsDetailData.find((car: CarDetail) => car.id === id) || null;
    }, [carIdParam]);

    useEffect(() => {
        if (!bookingId || !carIdParam) {
            notFound();
            return;
        }
        if (carIdParam && !carData) {
            setError(`Could not find details for the specified car (ID: ${carIdParam}). Please check your booking details.`);
        }

        if (sessionStatus !== 'loading') {
            setIsLoading(false);
            if (!error) {
                try {
                    console.log("Confirmation Page: Setting newBookingMade flag.");
                    localStorage.setItem('newBookingMade', 'true');
                } catch (e) {
                    console.error("Failed to set localStorage flag:", e);
                }
            }
        }
    }, [bookingId, carIdParam, carData, sessionStatus, error]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
                <span className="ml-4 text-gray-500 font-medium">Loading Confirmation...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Booking Confirmation Error</h1>
                <p className="text-gray-700 mb-6">{error}</p>
                <Link href="/dashboard" className="bg-black text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors">
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-gray-200">
                <div className="text-center mb-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600">
                        Your rental request has been successfully received.
                    </p>
                </div>
                <div className="space-y-6 border-t border-b border-gray-200 py-6">
                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Booking Summary</h2>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Booking ID</p>
                        <p className="text-lg font-semibold text-gray-900 break-words">{bookingId || 'N/A'}</p>
                    </div>
                    {carData && (
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                            <div className="relative w-32 h-20 sm:w-24 sm:h-16 flex-shrink-0 rounded overflow-hidden">
                                <Image src={carData.image} alt={`${carData.brand} ${carData.model}`} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <div className='text-center sm:text-left'>
                                <p className="text-sm font-medium text-gray-500">Vehicle</p>
                                <p className="text-md font-semibold text-gray-800">{carData.brand} {carData.model}</p>
                                <p className="text-md font-bold text-gray-700 mt-1">₹{carData.pricePerDay.toLocaleString('en-IN')} / day</p>
                            </div>
                        </div>
                    )}
                    {!carData && carModelParam && (
                        <div>
                            <p className="text-sm font-medium text-gray-500">Vehicle</p>
                            <p className="text-md font-semibold text-gray-800">{decodeURIComponent(carModelParam)}</p>
                            <p className='text-xs text-gray-500'>(Details unavailable)</p>
                        </div>
                    )}
                    {session?.user && (
                        <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Renter Information</p>
                            <div className="flex items-center gap-3 bg-slate-100 p-3 rounded-md border border-slate-200 w-fit">
                                <Image src={session.user.image || guest} alt="User profile" width={28} height={28} className='rounded-full object-cover' />
                                <div>
                                    <p className="text-gray-800 font-medium text-sm">{session.user.name || 'N/A'}</p>
                                    <p className="text-gray-600 text-xs">{session.user.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <p className="text-sm text-gray-500 mt-4">
                            Further details regarding your booking, including pickup/delivery arrangements and payment confirmation (if applicable), will be sent to your registered email address.
                        </p>
                    </div>
                </div>
                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm text-gray-600">
                        Thank you for choosing PrimeDrive!
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/dashboard" className="bg-black text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                            Go to Dashboard
                        </Link>
                        <Link href="/dashboard/bookings" className="bg-gray-100 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-200 border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                            View My Bookings
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConfirmationPage: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
                <span className="ml-4 text-gray-500 font-medium">Loading Confirmation...</span>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
};

export default ConfirmationPage;
