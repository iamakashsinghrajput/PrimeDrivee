"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface FetchedBookingData {
  id: string;
  carModel?: string;
  carBrand?: string;
  status?: string;
}

interface ConfirmationDetailsProps {
    bookingId: string | null;
    statusParam: string | null;
    initialCarModel?: string | null;
    initialCarBrand?: string | null;
}

export default function ConfirmationDetails({
    bookingId,
    statusParam,
    initialCarModel,
    initialCarBrand
}: ConfirmationDetailsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<FetchedBookingData | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setError("Booking ID is missing. Cannot load details.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchBookingData = async () => {
      try {
        console.log(`ConfirmationDetails: Fetching details for booking ID: ${bookingId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        if (bookingId === 'trigger-error') {
            throw new Error("Simulated error fetching booking details.");
        }
        setBookingDetails({
             id: bookingId,
             carBrand: initialCarBrand || "Vehicle",
             carModel: initialCarModel || "Details",
             status: statusParam === 'success' ? 'Confirmed' : 'Payment Failed'
        });
        // --- End Mock Data ---

      } catch (err: unknown) {
        console.error("ConfirmationDetails: Error fetching booking data:", err);
        setError(err instanceof Error ? err.message : "Failed to load booking details. Please contact support.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingData();

  }, [bookingId, statusParam, initialCarBrand, initialCarModel]);

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500 mx-auto mb-4" />
        <p className="text-gray-700 text-lg">Loading Booking Confirmation...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="text-center p-6 md:p-10 bg-white border-2 border-red-200 rounded-lg shadow-xl max-w-md w-full">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-xl md:text-2xl font-semibold text-red-700 mb-3">Error Loading Details</h1>
            <p className="text-red-600 mt-1 mb-6">{error}</p>
            <Link href="/" className="px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors">
                Go to Homepage
            </Link>
        </div>
     );
  }

  const isSuccess = statusParam === 'success' || bookingDetails?.status?.toLowerCase() === 'confirmed';

  return (
    <div className="text-center p-6 md:p-10 bg-white border border-gray-200 rounded-xl shadow-2xl max-w-lg w-full">
      {isSuccess ? (
         <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-5" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Thank you! Your rental for the <strong>{bookingDetails?.carBrand} {bookingDetails?.carModel}</strong> is confirmed.
            </p>
            {bookingDetails && (
              <div className="text-left bg-gray-50 p-4 my-6 rounded-lg border border-gray-200 text-sm space-y-1">
                 <p><strong>Booking ID:</strong> <span className="font-mono text-gray-700">{bookingDetails.id}</span></p>
              </div>
            )}
            <p className="text-sm text-gray-500 mb-8">A confirmation email with all details has been sent to your address. Please check your inbox (and spam folder).</p>
         </>
       ) : (
         <>
           <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-5" />
           <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking {bookingDetails?.status || "Issue"}</h1>
           <p className="text-gray-600 mb-6 leading-relaxed">
              There was an issue with your booking for the <strong>{bookingDetails?.carBrand} {bookingDetails?.carModel}</strong>.
              Current status: <strong className="lowercase">{bookingDetails?.status || 'Unknown'}</strong>.
           </p>
           {bookingDetails?.id && (
              <div className="text-left bg-yellow-50 p-4 my-6 rounded-lg border border-yellow-200 text-sm space-y-1">
                 <p><strong>Booking ID:</strong> <span className="font-mono text-gray-700">{bookingDetails.id}</span></p>
              </div>
            )}
           <p className="text-sm text-gray-500 mb-8">If you believe this is an error or need assistance, please contact our support team with your booking ID.</p>
         </>
       )}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Link href="/dashboard/bookings" className="w-full sm:w-auto px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                View My Bookings
            </Link>
             <Link href="/dashboard/cars" className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400">
                Browse More Cars
            </Link>
        </div>
    </div>
  );
}