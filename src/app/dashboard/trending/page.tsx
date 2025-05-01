"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ArrowRight, IndianRupee } from 'lucide-react';
import { trendingCarsData, offersData, tipsData } from '@/data/trendingData';
import { TrendingCarInfo, TrendingOffer, RentalTip } from '@/data/trendingData';

const TrendingCarCard: React.FC<{ car: TrendingCarInfo }> = ({ car }) => (
    <Link href={`/dashboard/cars/${car.id}`} className="group block bg-white rounded-lg shadow-md overflow-hidden border w-full border-gray-100 hover:shadow-xl transition-shadow duration-300">
        <div className="relative w-full aspect-video bg-gray-100">
            <Image
                src={car.image}
                alt={`${car.brand} ${car.model}`}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-300"
            />
             {car.highlight && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                    {car.highlight}
                </span>
             )}
        </div>
        <div className="p-4">
            <h3 className="text-sm text-gray-500">{car.brand}</h3>
            <p className="font-semibold text-lg text-gray-900 mb-1 truncate">{car.model}</p>
            <div className="flex items-baseline text-blue-700">
                <IndianRupee size={14} strokeWidth={2.5} className="mr-0.5"/>
                <span className="font-bold text-xl">{car.pricePerDay.toLocaleString('en-IN')}</span>
                <span className="text-xs text-gray-500 ml-1">/ day</span>
            </div>
        </div>
    </Link>
);

const OfferCard: React.FC<{ offer: TrendingOffer }> = ({ offer }) => (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 p-5 rounded-lg shadow border border-blue-100 flex items-start gap-4">
         {offer.icon && (
            <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-3 rounded-full">
                 <offer.icon size={24} strokeWidth={1.5} />
             </div>
         )}
        <div>
            <h3 className="font-semibold text-gray-800 mb-1">{offer.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
            {offer.promoCode && (
                <div className="text-xs font-medium">
                    Use Code: <span className="bg-blue-200 text-blue-800 px-2 py-0.5 rounded">{offer.promoCode}</span>
                </div>
            )}
        </div>
    </div>
);

const TipItem: React.FC<{ tip: RentalTip }> = ({ tip }) => (
    <Link href={tip.link} className="group block p-4 bg-white rounded-lg border hover:border-gray-300 hover:shadow-sm transition-all duration-200">
         <h3 className="font-semibold text-gray-800 mb-1 group-hover:text-blue-700">{tip.title}</h3>
         <p className="text-sm text-gray-600 mb-2">{tip.snippet}</p>
         <span className="text-xs text-blue-600 font-medium inline-flex items-center gap-1 group-hover:underline">
             Read More <ArrowRight size={12} />
         </span>
    </Link>
);


const TrendingPage = () => {
  return (
    <div className="container mx-auto px-8 py-8 bg-white">

        <div className="mb-6">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors">
                <ChevronLeft size={16} /> Back to Home
            </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b pb-3">What&apos;s Trending</h1>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">Popular Rentals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingCarsData.map(car => (
                    <TrendingCarCard key={car.id} car={car} />
                ))}
            </div>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">Current Offers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {offersData.map(offer => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
        </section>

         <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">Rental Insights</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 {tipsData.map(tip => (
                    <TipItem key={tip.id} tip={tip} />
                ))}
            </div>
         </section>


    </div>
  );
};

export default TrendingPage;