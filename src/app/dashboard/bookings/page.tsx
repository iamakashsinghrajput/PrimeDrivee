"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Loader2, Calendar, Tag, Car, Info, PackageCheck, PackageX, Hourglass, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

import { Booking, BookingDisplayItem, CarInfo } from '@/types';
import { mockUserBookings } from '@/data/mockBookings';
import { allCarsDetailData } from '@/data/carData';

const getCarInfo = (carId: number): CarInfo | null => {
    const carDetail = allCarsDetailData.find(car => car.id === carId);
    if (!carDetail) return null;
    return {
        id: carDetail.id,
        brand: carDetail.brand,
        model: carDetail.model,
        image: carDetail.image,
    };
};

const getStatusStyle = (status: Booking['status']) => {
    switch (status) {
        case 'Confirmed': return { icon: PackageCheck, color: 'text-blue-500', bgColor: 'bg-blue-900/20', borderColor: 'border-blue-500/30' };
        case 'Ongoing': return { icon: Hourglass, color: 'text-green-500', bgColor: 'bg-green-900/20', borderColor: 'border-green-500/30' };
        case 'Completed': return { icon: PackageCheck, color: 'text-gray-500', bgColor: 'bg-gray-700/20', borderColor: 'border-gray-500/30' };
        case 'Cancelled': return { icon: PackageX, color: 'text-red-500', bgColor: 'bg-red-900/20', borderColor: 'border-red-500/30' };
        default: return { icon: Info, color: 'text-yellow-500', bgColor: 'bg-yellow-900/20', borderColor: 'border-yellow-500/30' };
    }
};

export default function BookingsPage() {
    const { data: session, status: sessionStatus } = useSession();
    const [bookings, setBookings] = useState<BookingDisplayItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadBookings = useCallback(async (showLoadingIndicator = true) => { // Added parameter
        if (sessionStatus === 'authenticated' && session?.user?.id) {
            if (showLoadingIndicator) {
                setIsLoading(true);
            }
            setError(null);
            const userId = session.user.id;

            try {
                console.log(`Simulating fetch for actual user: ${userId}`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Shorter delay for refresh

                const userBookingsData = mockUserBookings.filter(b => b.userId === userId || b.userId === 'user_123_abc');

                const displayData: BookingDisplayItem[] = userBookingsData.map(booking => ({
                    ...booking,
                    car: getCarInfo(booking.carId)
                }));

                setBookings(displayData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

            } catch (err) {
                console.error("Failed to fetch bookings:", err);
                setError("Could not load your bookings. Please try again later.");
            } finally {
                 if (showLoadingIndicator) {
                    setIsLoading(false);
                }
            }
        } else if (sessionStatus === 'unauthenticated') {
            setError("Please log in to view your bookings.");
             if (showLoadingIndicator) { setIsLoading(false); }
        } else {
             if (showLoadingIndicator) { setIsLoading(true); }
        }
    }, [session, sessionStatus]);

    useEffect(() => {
        loadBookings(true); // Initial load with full indicator
    }, [loadBookings]);

    // --- NEW EFFECT TO CHECK FOR localStorage FLAG ---
    useEffect(() => {
        const checkForNewBooking = () => {
            try {
                const newBookingFlag = localStorage.getItem('newBookingMade');
                if (newBookingFlag === 'true') {
                    console.log("Bookings Page: Found newBookingMade flag, reloading data...");
                    localStorage.removeItem('newBookingMade'); // Clear the flag immediately
                    loadBookings(false); // Reload data without showing the full page loader
                }
            } catch (e) {
                console.error("Failed to access localStorage:", e);
            }
        };

        checkForNewBooking(); // Check on mount

        // Also check when the window gains focus (user switches back to tab)
        window.addEventListener('focus', checkForNewBooking);

        // Cleanup listener
        return () => {
            window.removeEventListener('focus', checkForNewBooking);
        };
    }, [loadBookings]); // Depend on loadBookings so it has the latest session info if needed


    const renderContent = () => {
        if (isLoading && bookings.length === 0) {
            return (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    <span className="ml-3 text-gray-400">Loading bookings...</span>
                </div>
            );
        }
        if (error) { return <p className="text-center py-10 text-red-500">{error}</p>; }
        if (!isLoading && bookings.length === 0) { return <p className="text-center py-10 text-gray-400">You have no bookings yet.</p>; }

        return (
            <div className="space-y-6">
                {bookings.map((booking) => {
                    const { icon: StatusIcon, color: statusColor, bgColor, borderColor } = getStatusStyle(booking.status);
                    return (
                        <div key={booking.id} className="bg-gray-800/50 border border-gray-700 rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
                            <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0 bg-gray-700">
                                {booking.car?.image ? ( <Image src={booking.car.image} alt={booking.car?.model || 'Car image'} layout="fill" objectFit="cover"/>
                                ) : ( <div className="absolute inset-0 flex items-center justify-center text-gray-500"> <Car size={40} /> </div> )}
                            </div>
                            <div className="p-4 md:p-5 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <h3 className="text-lg font-semibold text-gray-100 leading-tight">
                                            {booking.car ? `${booking.car.brand} ${booking.car.model}` : 'Unknown Car'}
                                        </h3>
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor} ${bgColor} border ${borderColor}`}>
                                            <StatusIcon size={12} /> {booking.status}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                                        <Tag size={12} /> Booking ID: {booking.id}
                                    </p>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-gray-300">
                                        <div className="flex items-center gap-1.5"> <Calendar size={14} className="text-gray-400" /> <span>{format(new Date(booking.startDate), 'dd MMM yyyy, hh:mm a')}</span> </div>
                                        <span className='text-gray-500 hidden sm:inline'>to</span>
                                        <div className="flex items-center gap-1.5"> <Calendar size={14} className="text-gray-400" /> <span>{format(new Date(booking.endDate), 'dd MMM yyyy, hh:mm a')}</span> </div>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center mt-4 pt-3 border-t border-gray-700/50">
                                    {booking.totalPrice && ( <p className="text-sm font-medium text-gray-400"> Total: <span className='font-semibold text-base text-gray-200'>₹{booking.totalPrice.toLocaleString('en-IN')}</span> </p> )}
                                </div>
                            </div>
                        </div>
                    );
                 })}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6 md:mb-8">
                 <h1 className="text-2xl md:text-3xl font-semibold text-gray-100"> My Bookings </h1>
                 <button
                    onClick={() => loadBookings(true)} // Refresh calls loadBookings with indicator
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-300 bg-gray-700/50 border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Refresh Bookings"
                 >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                 </button>
            </div>
            {renderContent()}
        </div>
    );
}