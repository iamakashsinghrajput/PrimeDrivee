// src/app/rent/confirmation/ConfirmationDetails.tsx

"use client"; // <-- Mark as a Client Component

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // This hook is now safe to use here
import Link from 'next/link';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

// Define expected structure for booking data (if you fetch it)
interface FetchedBookingData {
  id: string;
  carModel?: string;
  carBrand?: string;
  startDate?: string;
  endDate?: string;
  totalPrice?: number;
  status?: string;
  // Add other relevant fields from your API response
}

export default function ConfirmationDetails() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const statusParam = searchParams.get('status'); // e.g., 'success' or 'failed'

  const [isLoading, setIsLoading] = useState(true); // Initially true if fetching data
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<FetchedBookingData | null>(null);

  useEffect(() => {
    // Example: Fetch booking details based on bookingId if necessary
    if (!bookingId) {
      setError("Booking ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // --- Placeholder for API Fetch ---
    // Replace with your actual API call logic
    const fetchDetails = async () => {
      try {
        // const response = await fetch(`/api/bookings/${bookingId}`);
        // if (!response.ok) {
        //   const errData = await response.json().catch(() => ({}));
        //   throw new Error(errData.message || `Error ${response.status}`);
        // }
        // const data: FetchedBookingData = await response.json();
        // setBookingDetails(data);

        // --- Mock Data Example (Remove when using real API) ---
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        if (bookingId === 'error-example') {
            throw new Error("Simulated fetch error.");
        }
        setBookingDetails({ // Mock successful fetch
             id: bookingId,
             carBrand: "Porsche",
             carModel: "Taycan",
             status: statusParam === 'success' ? 'Confirmed' : 'Pending' // Use statusParam
        });
        // --- End Mock Data ---

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load booking details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
    // --- End Placeholder ---

    // If no fetch is needed, just set loading to false
    // setIsLoading(false);

  }, [bookingId, statusParam]);

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500 mx-auto mb-4" />
        <p className="text-gray-600">Loading confirmation...</p>
      </div>
    );
  }

  if (error) {
     return (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-700 font-semibold">Error</p>
            <p className="text-red-600 mt-1">{error}</p>
            <Link href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
                Go back home
            </Link>
        </div>
     );
  }

  // Determine success based on status param or fetched details
  const isSuccess = statusParam === 'success' || bookingDetails?.status?.toLowerCase() === 'confirmed';

  return (
    <div className="text-center p-6 md:p-10 bg-white border border-gray-200 rounded-lg shadow-xl max-w-2xl w-full">
      {isSuccess ? (
         <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-5" />
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for choosing PrimeDrive. Your rental details are below.
            </p>
            {bookingDetails && (
              <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6 text-sm space-y-2">
                 <p><strong>Booking ID:</strong> <span className="font-mono">{bookingDetails.id}</span></p>
                 {bookingDetails.carBrand && bookingDetails.carModel && <p><strong>Car:</strong> {bookingDetails.carBrand} {bookingDetails.carModel}</p>}
                 {/* Add more details like dates, price here */}
              </div>
            )}
            <p className="text-sm text-gray-500 mb-6">A confirmation email has been sent to your address.</p>
         </>
       ) : (
         <>
           <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-5" />
           <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">Booking Status</h1>
           <p className="text-gray-600 mb-6">
              Your booking status is currently: <strong className="lowercase">{bookingDetails?.status || 'Processing'}</strong>.
           </p>
           {bookingDetails && bookingDetails.id && (
              <div className="text-left bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6 text-sm space-y-2">
                 <p><strong>Booking ID:</strong> <span className="font-mono">{bookingDetails.id}</span></p>
                 {/* Add details */}
              </div>
            )}
           <p className="text-sm text-gray-500 mb-6">If this status is unexpected, please contact support.</p>
         </>
       )}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Link href="/account/bookings" className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                View My Bookings
            </Link>
             <Link href="/cars" className="px-6 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400">
                Browse More Cars
            </Link>
        </div>
    </div>
  );
}