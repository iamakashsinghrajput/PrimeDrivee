import React from 'react';
import Image from 'next/image';
import { CarFront, Gauge, Users, IndianRupee } from 'lucide-react';
import Link from 'next/link';

interface TopSellingCar {
    id: number;
    image: string;
    model: string;
    brand: string;
    bodyType?: string;
    transmission?: 'Manual' | 'Automatic';
    seats: number;
    pricePerDay: number;
}

interface CarGridItemProps {
    car: TopSellingCar;
}

const CarGridItem: React.FC<CarGridItemProps> = ({ car }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-full transition-shadow hover:shadow-lg">
            <div className="relative w-full aspect-video bg-gray-100">
                <Image
                    src={car.image}
                    alt={`${car.brand} ${car.model}`}
                    layout="fill"
                    objectFit="cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div>
                    <h3 className="text-sm text-gray-500 leading-tight">{car.model}</h3>
                    <p className="text-lg font-bold text-gray-900 mb-3">{car.brand}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap text-xs text-gray-600 mb-3 min-h-[20px]">
                    {car.bodyType && (
                        <span className="flex items-center gap-1"><CarFront size={14} /> {car.bodyType}</span>
                    )}
                    {car.transmission && (
                        <span className="flex items-center gap-1"><Gauge size={14} /> {car.transmission}</span>
                    )}
                    <span className="flex items-center gap-1"><Users size={14} /> {car.seats} Seats</span>
                </div>
                <div className="flex items-baseline mt-auto pt-2">
                    <IndianRupee className="w-4 h-4 text-gray-900" strokeWidth={2.5}/>
                    <span className="text-xl font-bold text-gray-900 tracking-tight mr-1">{car.pricePerDay.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-gray-500 font-medium">per day</span>
                </div>

                <Link href={`/dashboard/cars/${car.id}`}
                    className="mt-4 block w-full text-center bg-black text-white text-sm py-2 px-4 rounded hover:bg-gray-800 transition-colors font-medium">
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default CarGridItem;