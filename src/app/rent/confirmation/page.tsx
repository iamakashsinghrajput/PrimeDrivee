"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ConfirmationDetails from './ConfirmationDetails';
import { Loader2 } from 'lucide-react';

function ConfirmationPageContent() {
    const searchParams = useSearchParams();

    const bookingId = searchParams.get('bookingId');
    const statusParam = searchParams.get('status');
    const carModel = searchParams.get('carModel');    
    const carBrand = searchParams.get('carBrand');

    if (!bookingId) {
        console.error("ConfirmationContent: bookingId is missing from URL.");
    }

    return (
        <ConfirmationDetails
            bookingId={bookingId}
            statusParam={statusParam}
            initialCarModel={carModel ? decodeURIComponent(carModel) : undefined}
            initialCarBrand={carBrand ? decodeURIComponent(carBrand) : undefined}
        />
    );
}

export default function ConfirmationPage() {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <Suspense fallback={
                <div className="text-center p-10">
                    <Loader2 className="h-10 w-10 animate-spin text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-700 text-lg">Loading Confirmation...</p>
                </div>
            }>
                <ConfirmationPageContent />
            </Suspense>
        </div>
    );
}