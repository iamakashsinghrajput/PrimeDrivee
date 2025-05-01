"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Check, RotateCcw, Car, AlertTriangle } from 'lucide-react';
import { StaticImageData } from 'next/image';

import { allCarsDetailData } from '@/data/carData';
import { CarDetail } from '@/types'; // Assuming TopSellingCar is also defined in '@/types' or imported

import CarGridItem from '@/components/CarGridItem'; // Assuming CarGridItem expects a prop 'car' of type TopSellingCar
import SearchBar from '@/components/SearchBar';

// Assuming TopSellingCar type (or the actual type CarGridItem expects) looks like this:
// import { TopSellingCar } from '@/types';
interface TopSellingCarForGrid {
    id: number;
    brand: string;
    model: string;
    pricePerDay: number;
    image: string; // Expecting URL string
    seats: number; // Added missing property
    // Add any other properties CarGridItem expects
}


const FilterSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 border-b border-gray-100 pb-4 last:mb-0 last:border-b-0 last:pb-0">
        <h3 className="font-semibold mb-3 text-gray-800 text-sm uppercase tracking-wider">{title}</h3>
        {children}
    </div>
);

const FilterButton: React.FC<{ label: string; isSelected: boolean; onClick: () => void; }> = ({ label, isSelected, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={isSelected}
        className={`
            px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150 ease-in-out
            flex items-center gap-1 group whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black
            ${isSelected
                ? 'bg-black text-white border-black shadow-sm hover:bg-gray-800'
                : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-50'
            }
        `}
    >
        {isSelected && <Check size={14} className="-ml-1 flex-shrink-0" />}
        {label}
    </button>
);

// Modified adapter function to include 'seats' and match the expected type
const adaptCarForGridItem = (carDetail: CarDetail): TopSellingCarForGrid => {
    return {
        id: carDetail.id,
        brand: carDetail.brand,
        model: carDetail.model,
        pricePerDay: carDetail.pricePerDay,
        image: typeof carDetail.image === 'string' ? carDetail.image : (carDetail.image as StaticImageData).src,
        seats: carDetail.seats, // Add the missing seats property
        // Add other properties if needed by CarGridItem
    };
};


const CarsPage = () => {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
    const [selectedTransmission, setSelectedTransmission] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<number>(0);
    const [isPriceInitialized, setIsPriceInitialized] = useState(false);

    const uniqueBrands = useMemo(() => [...new Set(allCarsDetailData.map(car => car.brand).filter(Boolean))], []);
    const uniqueBodyTypes = useMemo(() => [...new Set(allCarsDetailData.map(car => car.bodyType).filter(Boolean))] as string[], []);

    const carsMatchingNonPriceFilters = useMemo(() => {
        return allCarsDetailData.filter(car => {
            if (selectedBrands.length > 0 && !selectedBrands.includes(car.brand)) return false;
            if (selectedBodyTypes.length > 0 && (!car.bodyType || !selectedBodyTypes.includes(car.bodyType))) return false;
            if (selectedTransmission && car.transmission !== selectedTransmission) return false;
            return true;
        });
    }, [selectedBrands, selectedBodyTypes, selectedTransmission]);

    const priceRange = useMemo(() => {
        const prices = carsMatchingNonPriceFilters
            .map(car => car.pricePerDay)
            .filter((price): price is number => typeof price === 'number' && !isNaN(price));

        const FALLBACK_MIN = 1000;
        const FALLBACK_MAX = 15000;
        const MIN_PRICE_STEP = 100;
        const PRICE_CEILING_BUFFER = 500;

        if (prices.length === 0) {
             const allPrices = allCarsDetailData.map(c => c.pricePerDay).filter((p): p is number => typeof p === 'number');
             if (allPrices.length === 0) return { min: FALLBACK_MIN, max: FALLBACK_MAX };
             const overallMin = Math.max(100, Math.min(...allPrices));
             const overallMax = Math.max(overallMin + MIN_PRICE_STEP, Math.max(...allPrices) + PRICE_CEILING_BUFFER);
            return { min: overallMin, max: overallMax };
        }

        let min = Math.min(...prices);
        let max = Math.max(...prices);

        min = Math.max(100, min);
        max = Math.max(min + MIN_PRICE_STEP, max + PRICE_CEILING_BUFFER);

        return { min, max };
    }, [carsMatchingNonPriceFilters]);

     useEffect(() => {
        const FALLBACK_MAX = 15000;
         if (priceRange.max > 0) {
             if (!isPriceInitialized) {
                 setMaxPrice(priceRange.max);
                 setIsPriceInitialized(true);
             } else {
                 if (maxPrice > priceRange.max || maxPrice < priceRange.min) {
                      setMaxPrice(priceRange.max);
                 }
             }
         } else if (!isPriceInitialized) {
             setMaxPrice(FALLBACK_MAX);
             setIsPriceInitialized(true);
         }
     }, [priceRange, isPriceInitialized, maxPrice]);

    const filteredCars = useMemo(() => {
        if (!isPriceInitialized) return [];
        const results = carsMatchingNonPriceFilters.filter(car => {
            const price = car.pricePerDay;
            if (typeof price !== 'number' || isNaN(price)) {
                 return false;
            }
            return price >= priceRange.min && price <= maxPrice;
        });
        return results;
    }, [isPriceInitialized, carsMatchingNonPriceFilters, maxPrice, priceRange.min]);


    const handleBrandChange = (brand: string) => {
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
    };
    const handleBodyTypeChange = (bodyType: string) => {
        setSelectedBodyTypes(prev => prev.includes(bodyType) ? prev.filter(bt => bt !== bodyType) : [...prev, bodyType]);
    };
    const handleTransmissionChange = (transmission: string) => {
        setSelectedTransmission(transmission);
    }

    const resetFilters = () => {
        setSelectedBrands([]);
        setSelectedBodyTypes([]);
        setSelectedTransmission('');
        setMaxPrice(priceRange.max);
    };

    const SEARCH_BAR_AREA_HEIGHT_PX = 90;
    const CONTENT_TOP_PADDING_PX = SEARCH_BAR_AREA_HEIGHT_PX - 80;
    const FILTER_STICKY_TOP_PX = SEARCH_BAR_AREA_HEIGHT_PX;

    return (
        <div className="relative min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <span className='font-poppins text-xs pl-1'>Modify Search</span>
                <SearchBar />
            </div>

            <div
                className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16 flex flex-col lg:flex-row gap-8 lg:gap-10"
                style={{ paddingTop: `${CONTENT_TOP_PADDING_PX}px` }}
            >

                <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
                     <div className={`lg:sticky`} style={{ top: `${FILTER_STICKY_TOP_PX}px` }}>
                       <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100">
                         <div className="flex justify-between items-center mb-5 border-b border-gray-200 pb-3">
                            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                             <button
                                 onClick={resetFilters}
                                 title="Reset Filters"
                                 className="text-xs font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer flex items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed"
                                 disabled={selectedBrands.length === 0 && selectedBodyTypes.length === 0 && selectedTransmission === '' && maxPrice === priceRange.max}
                             >
                                Reset
                                <RotateCcw size={14} className='transition-transform group-hover:rotate-[-90deg]' />
                             </button>
                        </div>

                        <FilterSection title="Brand">
                            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                {uniqueBrands.map(brand => (
                                    <FilterButton key={brand} label={brand} isSelected={selectedBrands.includes(brand)} onClick={() => handleBrandChange(brand)} />
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Body Type">
                             <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                {uniqueBodyTypes.map(bodyType => (
                                    <FilterButton key={bodyType} label={bodyType} isSelected={selectedBodyTypes.includes(bodyType)} onClick={() => handleBodyTypeChange(bodyType)} />
                                ))}
                            </div>
                        </FilterSection>

                        <FilterSection title="Transmission">
                            <div className="flex flex-wrap gap-2">
                                <FilterButton label="All" isSelected={selectedTransmission === ''} onClick={() => handleTransmissionChange('')}/>
                                <FilterButton label="Automatic" isSelected={selectedTransmission === 'Automatic'} onClick={() => handleTransmissionChange('Automatic')}/>
                                <FilterButton label="Manual" isSelected={selectedTransmission === 'Manual'} onClick={() => handleTransmissionChange('Manual')}/>
                            </div>
                        </FilterSection>

                        <FilterSection title="Max Price / Day">
                            <div className="flex justify-between items-center mb-2 px-1">
                                <span className="text-xs text-gray-500">₹{priceRange.min.toLocaleString('en-IN')}</span>
                                <span className="text-lg font-semibold text-black">₹{maxPrice.toLocaleString('en-IN')}</span>
                                <span className="text-xs text-gray-500">₹{priceRange.max.toLocaleString('en-IN')}</span>
                            </div>
                            <input
                                id="maxPrice"
                                type="range"
                                min={priceRange.min}
                                max={priceRange.max}
                                step="100"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                disabled={!isPriceInitialized || priceRange.min >= priceRange.max}
                                className={`
                                    w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black range-lg dark:bg-gray-700
                                    ${(!isPriceInitialized || priceRange.min >= priceRange.max) ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                aria-label="Maximum price per day slider"
                            />
                        </FilterSection>
                    </div>
                   </div>
                </aside>

                <main className="flex-1 min-w-0">
                    <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-6'>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Available Cars</h1>
                         <span className='text-sm text-gray-500 flex-shrink-0'>
                             {!isPriceInitialized ? 'Loading cars...' : `${filteredCars.length} result${filteredCars.length !== 1 ? 's' : ''}`}
                        </span>
                    </div>

                     {!isPriceInitialized ? (
                         <div className="text-center text-gray-400 py-20 flex flex-col items-center">
                            <Car size={48} className="animate-pulse mb-4 text-gray-300"/>
                            Loading available cars...
                        </div>
                     ) : filteredCars.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredCars.map(car => (
                                <CarGridItem key={car.id} car={adaptCarForGridItem(car)} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-16 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-white mt-4">
                            <AlertTriangle size={40} className="mx-auto mb-4 text-yellow-500"/>
                            <h3 className='text-lg font-semibold mb-2 text-gray-700'>No Cars Found</h3>
                            <p className='text-sm mb-4'>Try adjusting your filters or resetting them to see more options.</p>
                            <p className='text-xs text-gray-400 mb-4'>(Current price range: ₹{priceRange.min.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')})</p>
                            <button onClick={resetFilters} className="text-sm bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium inline-flex cursor-pointer items-center gap-1.5 shadow-sm">
                                <RotateCcw size={14} /> Reset Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CarsPage;