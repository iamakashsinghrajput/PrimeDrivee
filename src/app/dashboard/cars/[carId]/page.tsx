"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import {
    CarFront, Gauge, Users, IndianRupee, Fuel, Zap,
    ChevronLeft, CheckCircle, Loader2
} from 'lucide-react';

import { allCarsDetailData } from '@/data/carData';
import { CarDetail } from '@/types';
const FeatureDisplay: React.FC<{ icon?: React.ReactNode; label: string }> = ({ icon, label }) => (
    <span className="flex items-center gap-2 text-sm text-gray-700">
        {icon || <CheckCircle size={14} className="text-green-600 flex-shrink-0" />}
        {label}
    </span>
);

const CarDetailPage: React.FC = () => {
  const params = useParams();
  const carId = params.carId as string;

  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const carData = useMemo((): CarDetail | null => {
    if (!carId) return null;
    const id = parseInt(carId, 10);
    if (isNaN(id)) {
        console.error("Invalid car ID parameter:", carId);
        return null;
    }
    const foundCar = allCarsDetailData.find(car => car.id === id);
    return foundCar || null;
  }, [carId]);

  useEffect(() => {
    setIsLoading(true);
    if (carData) {
      setSelectedImage(carData.image);
      setIsNotFound(false);
    } else if (carId) {
        setIsNotFound(true);
    }
    setIsLoading(false);
  }, [carData, carId]);

  const galleryImages = useMemo(() => {
    const images: { label: string; src: StaticImageData }[] = [];
    if (!carData || !carData.imageGallery) {
        return images;
    }

    const gallery = carData.imageGallery;

    if (gallery.front) {
        images.push({ label: 'Front', src: gallery.front });
    }
    if (gallery.back) {
        images.push({ label: 'Back', src: gallery.back });
    }
    if (gallery.left) {
        images.push({ label: 'Left Side', src: gallery.left });
    }
    if (gallery.right) {
        images.push({ label: 'Right Side', src: gallery.right });
    }

    return images;
  }, [carData]);

  if (isNotFound) {
      notFound();
  }

  if (isLoading || (!carData && !isNotFound)) {
     return (
         <div className="container mx-auto px-4 py-8 pt-28 flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
         </div>
     );
   }

   if (!carData || !selectedImage) {
     console.error("Rendering error: carData or selectedImage is null/undefined after loading.");
     return <div className="container mx-auto px-4 py-8 pt-28 text-center text-red-500">Error loading car details. Please try again later.</div>;
   }

  return (
    <div className="container mx-auto px-8 py-8 max-w-7xl bg-gray-50">
        <div className="mb-6">
            <Link href="/dashboard/cars/" className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors">
                <ChevronLeft size={16} />
                Back to Cars
            </Link>
        </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        <div className="w-full lg:w-1/2 xl:w-3/5">
            <div className="relative aspect-video w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg mb-4 border border-gray-200">
                 <Image
                    key={selectedImage.src} // Use src for key change detection
                    src={selectedImage}
                    alt={`Selected view of ${carData.brand} ${carData.model}`}
                    layout="fill"
                    objectFit="contain"
                    className="transition-opacity duration-300 ease-in-out"
                    priority // Prioritize loading the main image
                 />
            </div>
             {galleryImages.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2">
                    {/* Add the main car image to the gallery selection as well */}
                    {[ { label: 'Main', src: carData.image }, ...galleryImages ].map((imgData) => (
                        <button
                            key={imgData.label}
                            onClick={() => setSelectedImage(imgData.src)}
                            className={`relative w-20 h-14 rounded border-2 overflow-hidden cursor-pointer transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                                        ${selectedImage.src === imgData.src.src ? 'border-black scale-105 shadow-md' : 'border-gray-200 hover:border-gray-400 hover:opacity-90'}`}
                            aria-label={`View ${imgData.label}`}
                            aria-pressed={selectedImage.src === imgData.src.src}
                        >
                            <Image
                                src={imgData.src}
                                alt={`${imgData.label} view thumbnail`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-transform duration-200 group-hover:scale-105"
                                sizes="(max-width: 640px) 10vw, 80px" // Provide sizes for optimization
                            />
                        </button>
                    ))}
                </div>
             )}
        </div>

        <div className="w-full lg:w-1/2 xl:w-2/5">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{carData.brand} {carData.model}</h1>

            <div className="flex items-baseline mt-2 mb-6">
                <IndianRupee className="w-6 h-6 text-gray-900" strokeWidth={2.5}/>
                <span className="text-3xl font-bold text-gray-900 tracking-tight mr-1">{carData.pricePerDay.toLocaleString('en-IN')}</span>
                <span className="text-md text-gray-500 font-medium">per day</span>
            </div>

            <div className="flex items-center gap-x-4 gap-y-2 flex-wrap mb-6 pb-6 border-b border-gray-200">
                {carData.bodyType && <FeatureDisplay icon={<CarFront size={16} />} label={carData.bodyType} />}
                {carData.transmission && <FeatureDisplay icon={<Gauge size={16} />} label={carData.transmission} />}
                <FeatureDisplay icon={<Users size={16} />} label={`${carData.seats} Seats`} />
                 {carData.fuelType && (
                    <FeatureDisplay
                        icon={carData.fuelType === 'Electric' ? <Zap size={16} /> : <Fuel size={16} />}
                        label={carData.fuelType}
                    />
                 )}
            </div>

            {carData.description && (
                <div className='mb-6'>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">Overview</h2>
                    <p className='text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none'>{carData.description}</p>
                </div>
            )}

             {(carData.engine || carData.mileage) && (
                 <div className='mb-6 bg-gray-100 p-4 rounded-lg border border-gray-200'>
                    <h2 className="text-lg font-semibold mb-3 text-gray-800">Specifications</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                         {carData.engine && <p><span className='font-medium text-gray-600'>Engine:</span> {carData.engine}</p>}
                         {carData.mileage && <p><span className='font-medium text-gray-600'>Mileage:</span> {carData.mileage}</p>}
                    </div>
                 </div>
             )}

            {carData.featuresList && carData.featuresList.length > 0 && (
                <div className='mb-8'>
                    <h2 className="text-xl font-semibold mb-3 text-gray-800">Key Features</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {carData.featuresList.map((feature, index) => (
                            <FeatureDisplay key={index} label={feature} />
                        ))}
                    </div>
                </div>
            )}

            <Link href={`/rent/${carData.id}`} passHref legacyBehavior={false}>
                <button
                    className="w-full lg:w-auto bg-black text-white font-bold py-3 px-8 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black inline-block text-center"
                    aria-label={`Rent ${carData.brand} ${carData.model}`}
                >
                    Rent This Car
                </button>
            </Link>

        </div>
      </div>
    </div>
  );
};

export default CarDetailPage;