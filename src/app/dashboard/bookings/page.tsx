"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Loader2, Calendar, Tag, Car, Info, PackageCheck, PackageX, Hourglass, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

import { IBookingFromAPI, BookingDisplayItem, CarInfo } from '@/types';
import { allCarsDetailData } from '@/data/carData';

const getCarInfo = (carId: number): CarInfo | null => {
    const carDetail = allCarsDetailData.find(car => car.id === carId);
    if (!carDetail) { console.warn(`Car details not found for carId: ${carId}`); return null; }
    return { id: carDetail.id, brand: carDetail.brand, model: carDetail.model, image: carDetail.image };
};

const getStatusStyle = (status: IBookingFromAPI['status'] | string): { icon: React.ElementType; color: string; bgColor: string; borderColor: string } => {
    switch (status) {
        case 'Confirmed': return { icon: PackageCheck, color: 'text-blue-500', bgColor: 'bg-blue-900/20', borderColor: 'border-blue-500/30' };
        case 'Ongoing': return { icon: Hourglass, color: 'text-green-500', bgColor: 'bg-green-900/20', borderColor: 'border-green-500/30' };
        case 'Completed': return { icon: CheckCircle, color: 'text-gray-500', bgColor: 'bg-gray-700/20', borderColor: 'border-gray-500/30' };
        case 'CancelledByUser': case 'CancelledBySystem': return { icon: PackageX, color: 'text-red-500', bgColor: 'bg-red-900/20', borderColor: 'border-red-500/30' };
        case 'PendingPayment': return { icon: Hourglass, color: 'text-yellow-500', bgColor: 'bg-yellow-900/20', borderColor: 'border-yellow-500/30' };
        case 'PaymentFailed': return { icon: AlertTriangle, color: 'text-orange-500', bgColor: 'bg-orange-900/20', borderColor: 'border-orange-500/30' };
        default: return { icon: Info, color: 'text-purple-500', bgColor: 'bg-purple-900/20', borderColor: 'border-purple-500/30' };
    }
};

export default function BookingsPage() {
    const { data: session, status: sessionStatus } = useSession();
    const [bookings, setBookings] = useState<BookingDisplayItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadBookings = useCallback(async (showFullLoader = true) => {
        if (sessionStatus !== 'authenticated' || !session?.user?.id) {
            if (sessionStatus === 'unauthenticated') setError("Please log in to view your bookings.");
            else if (sessionStatus !== 'loading') setError("Session not available. Please try refreshing.");
            if (showFullLoader) setIsLoading(false); setIsRefreshing(false); return;
        }
        if (showFullLoader) setIsLoading(true); else setIsRefreshing(true);
        setError(null);

        try {
            console.log(`BookingsPage: Fetching bookings from API. Full loader: ${showFullLoader}`);
            const response = await fetch('/dashboard/bookings/my-bookings');

            if (!response.ok) {
                let errorMsg = `Error ${response.status}: Failed to fetch bookings.`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) {
                        errorMsg = errorData.message;
                    } else {
                        errorMsg = `Error ${response.status}: ${response.statusText || 'Could not retrieve error details.'}`;
                    }
                } catch (parseError) {
                    console.error("BookingsPage: API error response was not valid JSON.", parseError);
                    errorMsg = `Failed to fetch bookings. Server responded with status ${response.status}. Please check server logs.`;
                }
                throw new Error(errorMsg);
            }

            const fetchedBookings: IBookingFromAPI[] = await response.json();
            console.log("BookingsPage: API response received count:", fetchedBookings.length);

            const displayData: BookingDisplayItem[] = fetchedBookings.map(booking => ({
                ...booking,
                id: booking._id,
                userId: String(booking.user),
                car: getCarInfo(booking.carId),
            })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setBookings(displayData);

        } catch (err: unknown) {
            console.error("BookingsPage: Error caught in loadBookings:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred while loading bookings.");
        } finally {
            if (showFullLoader) setIsLoading(false);
            setIsRefreshing(false);
        }
    }, [sessionStatus, session]);

    useEffect(() => { if (sessionStatus !== 'loading') loadBookings(true); }, [sessionStatus, loadBookings]);
    useEffect(() => {
        const checkForNewBookingAndReload = () => {
             try { const flag = localStorage.getItem('newBookingMade'); if (flag === 'true') { localStorage.removeItem('newBookingMade'); console.log("BookingsPage: Flag found, reloading silently."); loadBookings(false); } } catch (e) { console.error("LS Error:", e); }
        };
        checkForNewBookingAndReload();
        window.addEventListener('focus', checkForNewBookingAndReload);
        return () => window.removeEventListener('focus', checkForNewBookingAndReload);
    }, [loadBookings]);


    const renderContent = () => {
        if (isLoading && bookings.length === 0) { return ( <div className="flex justify-center items-center py-20 text-center"> <Loader2 className="h-10 w-10 animate-spin text-gray-400" /> <p className="ml-4 text-lg text-gray-400">Loading your bookings...</p> </div> ); }
        if (error) { return ( <div className="text-center py-10 bg-red-900/10 border border-red-500/20 rounded-lg p-6 max-w-xl mx-auto"> <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-3" /> <p className="text-lg font-medium text-red-400">Could not load bookings</p><p className="text-sm text-red-300 mt-1">{error}</p> </div> ); }
        if (!isLoading && bookings.length === 0 && sessionStatus === 'authenticated') { return ( <div className="text-center py-20"> <Car size={48} className="mx-auto text-gray-500 mb-4" /> <p className="text-xl text-gray-400">You have no bookings yet.</p> <p className="text-gray-500 mt-2">Time to plan your next adventure!</p> </div> ); }
        if (sessionStatus === 'unauthenticated' && !isLoading) { return <p className="text-center py-10 text-yellow-400">Please log in to view your bookings.</p>; }

        return (
            <div className="space-y-6">
                {bookings.map((booking) => {
                    const { icon: StatusIcon, color: statusColor, bgColor, borderColor } = getStatusStyle(booking.status);
                    const formattedCreatedDate = booking.createdAt ? format(new Date(booking.createdAt), 'dd MMM yyyy, hh:mm a') : 'N/A';
                    const formattedStartDate = booking.startDate ? format(new Date(booking.startDate), 'dd MMM yyyy, hh:mm a') : 'N/A';
                    const formattedEndDate = booking.endDate ? format(new Date(booking.endDate), 'dd MMM yyyy, hh:mm a') : 'N/A';

                    return (
                        <div key={booking.id} className={`bg-gray-800/60 border ${borderColor} rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-orange-500/20 hover:border-orange-500/50`}>
                            <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0 bg-gray-700">
                                {booking.car?.image ? ( <Image src={booking.car.image} alt={booking.car?.model || 'Car image'} layout="fill" objectFit="cover"/> ) : ( <div className="w-full h-full flex items-center justify-center text-gray-500"> <Car size={48} /> </div> )}
                            </div>
                            <div className="p-5 flex-grow flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2 gap-2">
                                        <h3 className="text-xl font-bold text-gray-50 leading-tight"> {booking.car ? `${booking.car.brand} ${booking.car.model}` : (booking.carBrand && booking.carModel ? `${booking.carBrand} ${booking.carModel}`: 'Car details unavailable')} </h3>
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusColor} ${bgColor}`}> <StatusIcon size={14} /> {booking.status} </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1.5"> <Tag size={13} /> <span className="font-mono">{booking.id}</span> </p>
                                    <p className="text-xs text-gray-500 mb-3"> Booked on: {formattedCreatedDate} </p>
                                    {(booking.startDate || booking.endDate) && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-300 mb-3">
                                            <div className="flex items-center gap-1.5"> <Calendar size={15} className="text-gray-400" /> <strong>Start:</strong> <span>{formattedStartDate}</span> </div>
                                            <div className="flex items-center gap-1.5"> <Calendar size={15} className="text-gray-400" /> <strong>End:</strong> <span>{formattedEndDate}</span> </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row justify-between items-center mt-4 pt-4 border-t border-gray-700/60">
                                    {booking.totalPrice !== undefined && ( <p className="text-sm font-medium text-gray-400 mb-2 sm:mb-0"> Total Price: <span className='font-bold text-lg text-gray-100'>₹{booking.totalPrice.toLocaleString('en-IN')}</span> </p> )}
                                </div>
                            </div>
                        </div>
                    );
                 })}
            </div>
        );
    };

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-gray-900 min-h-full">
            <div className="flex justify-between items-center mb-6 md:mb-8 pb-4 border-b border-gray-700">
                 <h1 className="text-2xl md:text-3xl font-bold text-gray-100"> My Bookings </h1>
                 <button onClick={() => loadBookings(true)} disabled={isLoading || isRefreshing} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-wait transition-colors" title="Refresh Bookings">
                    <RefreshCw size={15} className={(isLoading || isRefreshing) ? 'animate-spin' : ''} />
                    <span>{(isLoading || isRefreshing) ? 'Refreshing...' : 'Refresh'}</span>
                 </button>
            </div>
            {renderContent()}
        </div>
    );
}