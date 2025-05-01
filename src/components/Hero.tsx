"use client";

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import home from '@/assets/images/home.png';
import { CalendarDaysIcon, MapPinIcon, X as CloseIcon, Search as SearchIconLucide } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateRange } from 'react-day-picker';
import { startOfDay, isBefore, set, isEqual, format } from 'date-fns';
import BangaloreIcon from '@/assets/icons/Bangalore.svg';
import ChennaiIcon from '@/assets/icons/Chennai.svg';
import DelhiIcon from '@/assets/icons/Delhi.svg';
import GoaIcon from '@/assets/icons/Goa.svg';
import HyderabadIcon from '@/assets/icons/Hyderabad.svg';
import JaipurIcon from '@/assets/icons/Jaipur.svg';
import MumbaiIcon from '@/assets/icons/Mumbai.svg';
import KolkataIcon from '@/assets/icons/Kolkata.svg';
import PuneIcon from '@/assets/icons/Pune.svg';
import VizagIcon from '@/assets/icons/Vizag.svg';

interface City { value: string; label: string; isTop?: boolean; icon?: React.ReactNode; }
const allCities: City[] = [ { value: 'Bengaluru', label: 'Bengaluru', isTop: true, icon: <BangaloreIcon /> }, { value: 'Chennai', label: 'Chennai', isTop: true, icon: <ChennaiIcon /> }, { value: 'Delhi NCR', label: 'Delhi NCR', isTop: true, icon: <DelhiIcon /> }, { value: 'Jaipur', label: 'Jaipur', isTop: true, icon: <JaipurIcon /> }, { value: 'Hyderabad', label: 'Hyderabad', isTop: true, icon: <HyderabadIcon /> }, { value: 'Mumbai', label: 'Mumbai', isTop: true, icon: <MumbaiIcon /> }, { value: 'Vizag', label: 'Vizag', isTop: true, icon: <VizagIcon /> }, { value: 'Kolkata', label: 'Kolkata', isTop: true, icon: <KolkataIcon /> }, { value: 'Goa', label: 'Goa', isTop: true, icon: <GoaIcon /> }, { value: 'Pune', label: 'Pune', isTop: true, icon: <PuneIcon /> }, { value: 'Ahmedabad', label: 'Ahmedabad' }, { value: 'Coimbatore', label: 'Coimbatore' }, { value: 'Chandigarh', label: 'Chandigarh' }, { value: 'Indore', label: 'Indore' }, { value: 'Mangalore', label: 'Mangalore' }, { value: 'Mysore', label: 'Mysore' }, { value: 'Udaipur', label: 'Udaipur' }, { value: 'Nagpur', label: 'Nagpur' }, { value: 'Kochi', label: 'Kochi' }, { value: 'Vijayawada', label: 'Vijayawada' }, ].sort((a, b) => a.label.localeCompare(b.label));
const topCitiesList = allCities.filter(c => c.isTop);

interface TimeSliderProps { label: string; date: Date | undefined; onTimeChange: (newDate: Date) => void; minHour?: number; maxHour?: number; stepMinutes?: number; className?: string; }
const TimeSlider: React.FC<TimeSliderProps> = ({ label, date, onTimeChange, minHour = 0, maxHour = 23, stepMinutes = 30, className = '' }) => {
    const currentTimeInMinutes = date ? date.getHours() * 60 + date.getMinutes() : minHour * 60;
    const minSliderValue = minHour * 60; const maxSliderValue = maxHour * 60 + (60 - stepMinutes);
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const totalMinutes = parseInt(event.target.value, 10);
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        const baseDate = date || new Date();
        const newDate = set(baseDate, { hours: newHours, minutes: newMinutes, seconds: 0, milliseconds: 0 });
        if (newDate.getHours() >= minHour && newDate.getHours() <= maxHour) { onTimeChange(newDate); }
        else { const clampedHours = Math.max(minHour, Math.min(maxHour, newHours)); const clampedDate = set(baseDate, { hours: clampedHours, minutes: newMinutes, seconds: 0, milliseconds: 0 }); onTimeChange(clampedDate); } };
        const displayTime = date ? format(date, 'hh:mm a') : '--:-- --';
        const stepValue = stepMinutes;
        return (
            <div className={`space-y-2 ${className}`}>
                <div className="flex justify-between items-center mb-1">
                    <Label htmlFor={`time-slider-${label.replace(/\s+/g, '-')}`} className="text-sm font-semibold text-gray-700">
                         {label}
                    </Label>
                    {date && ( <span className="text-sm font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded"> {displayTime} </span> )}
                </div>
                <input type="range" id={`time-slider-${label.replace(/\s+/g, '-')}`}
                    min={minSliderValue} max={maxSliderValue} step={stepValue}
                    value={currentTimeInMinutes} onChange={handleSliderChange}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!date} aria-label={`${label} time selection slider`}
                 />
            </div>
        );
};

type ViewState = 'main' | 'location' | 'dateTime';

const Hero = () => {
    const [selectedLocation, setSelectedLocation] = useState<City | null>(null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [currentView, setCurrentView] = useState<ViewState>('main');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const startDate = dateRange?.from;
    const returnDate = dateRange?.to;

    const handleEditLocation = () => setCurrentView('location');
    const handleEditDateTime = () => setCurrentView('dateTime');
    const handleReturnToMain = useCallback(() => setCurrentView('main'), []);
    const handleLocationSelect = useCallback((city: City) => { setSelectedLocation(city); setErrorMessage(null); handleReturnToMain(); }, [handleReturnToMain]);
    const handleDateTimeConfirm = useCallback((newRange: DateRange | undefined) => { if (newRange?.from && newRange?.to && (isBefore(newRange.to, newRange.from) || isEqual(newRange.to, newRange.from))) { setErrorMessage("Return date & time must be after start date & time."); return; } setDateRange(newRange); setErrorMessage(null); handleReturnToMain(); }, [handleReturnToMain]);
    const handleDateTimeReset = useCallback(() => { setDateRange(undefined); }, []);
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setErrorMessage(null); if (!selectedLocation) { setErrorMessage("Please select a location."); setCurrentView('location'); return; } if (!startDate || !returnDate) { setErrorMessage("Please select start and return dates/times."); setCurrentView('dateTime'); return; } if (isBefore(returnDate, startDate) || isEqual(returnDate, startDate)) { setErrorMessage("Return date & time must be after start date & time."); setCurrentView('dateTime'); return; } console.log("Submitting Search:", { location: selectedLocation.value, start: startDate?.toISOString(), end: returnDate?.toISOString() }); alert(`Searching for: ${selectedLocation.label}, ${startDate.toLocaleString()} to ${returnDate.toLocaleString()}`); };

    const renderView = () => {
        switch (currentView) {
            case 'location': return (<LocationSelectionView allCities={allCities} topCities={topCitiesList} selectedCityValue={selectedLocation?.value ?? null} onSelectCity={handleLocationSelect} onClose={handleReturnToMain} />);
            case 'dateTime': return (<DateTimeSelectionView initialDateRange={dateRange} onConfirm={handleDateTimeConfirm} onReset={handleDateTimeReset} onClose={handleReturnToMain} />);
            case 'main': default: return (<MainSearchView selectedLocation={selectedLocation} startDate={startDate} returnDate={returnDate} onEditLocation={handleEditLocation} onEditDateTime={handleEditDateTime} onSubmit={handleSubmit} errorMessage={errorMessage} />);
        }
    };

    return (
         <section className='relative w-full min-h-[calc(100vh-4rem)] bg-gradient-to-r from-orange-600 to-red-300 flex flex-col items-center justify-center text-white px-4 py-12 md:py-16 overflow-hidden'>
            <div className={`relative text-center w-full max-w-4xl lg:max-w-5xl mx-auto mb-10 md:mb-16 transition-opacity duration-300 ${currentView !== 'main' ? 'opacity-0 pointer-events-none h-0' : 'opacity-100'} z-10`}>
                <h1 className='absolute text-[18vw] sm:text-[15vw] md:text-[16rem] font-bold text-white/10 font-Squadaone uppercase tracking-widest top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10 whitespace-nowrap pointer-events-none'>
                    TAYCAN
                </h1>
                <Image
                    src={home}
                    alt='Porsche Taycan driving'
                    className='relative w-full h-auto mx-auto z-20 max-w-[700px] md:max-w-[850px] lg:max-w-[950px]'
                    priority
                />
            </div>

            <div className="relative w-full max-w-3xl lg:max-w-4xl mx-auto z-20">
                {renderView()}
            </div>
        </section>
    );
};

interface MainSearchViewProps { selectedLocation: City | null; startDate: Date | undefined; returnDate: Date | undefined; onEditLocation: () => void; onEditDateTime: () => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; errorMessage: string | null; }
const MainSearchView: React.FC<MainSearchViewProps> = ({ selectedLocation, startDate, returnDate, onEditLocation, onEditDateTime, onSubmit, errorMessage }) => {
    const locationDisplay = selectedLocation?.label || "Select City";
    const locationTextColor = selectedLocation ? 'text-white' : 'text-gray-400';
    const dateDisplay = (date: Date | undefined) => { if (!date) return <span className="text-gray-400">dd/mm/yyyy</span>; return <span className="text-white">{format(date, 'd MMM yyyy')}</span>; };

    return (
        <>
         <form onSubmit={onSubmit} className="bg-[#1f2023]/90 backdrop-blur-sm rounded-xl shadow-lg w-full flex flex-col md:flex-row items-stretch overflow-hidden border border-gray-700/50 font-sans text-sm md:text-base">
            <div onClick={onEditLocation} className="flex-grow-[1.5] min-w-0 flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors border-b md:border-b-0 md:border-r border-gray-700/50" role="button" tabIndex={0} aria-label={`Current location: ${locationDisplay}. Click to change.`}>
                 <MapPinIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                 <div className='flex-grow'>
                     <label className="block text-[10px] text-gray-400 font-medium mb-0.5">Location</label>
                     <span className={`block truncate font-medium ${locationTextColor}`}>{locationDisplay}</span>
                 </div>
            </div>
            <div onClick={onEditDateTime} className="flex-grow-[1] min-w-0 flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors border-b md:border-b-0 md:border-r border-gray-700/50" role="button" tabIndex={0} aria-label="Click to select start date">
                 <CalendarDaysIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                 <div className='flex-grow'>
                     <label className="block text-[10px] text-gray-400 font-medium mb-0.5">Start</label>
                     {dateDisplay(startDate)}
                 </div>
            </div>
            <div onClick={onEditDateTime} className="flex-grow-[1] min-w-0 flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors border-b md:border-b-0 md:border-r border-gray-700/50" role="button" tabIndex={0} aria-label="Click to select return date">
                 <CalendarDaysIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                 <div className='flex-grow'>
                     <label className="block text-[10px] text-gray-400 font-medium mb-0.5">Return</label>
                     {dateDisplay(returnDate)}
                 </div>
            </div>
            <div className="flex-shrink-0 p-1.5 md:p-2">
                <button type="submit" className="w-full h-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm md:text-base px-6 py-2 md:px-8 md:py-2.5 rounded-lg shadow-md hover:shadow-lg hover:from-orange-600 hover:to-red-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed" disabled={!selectedLocation || !startDate || !returnDate} style={{ minHeight: '48px' }} >
                    Search
                </button>
            </div>
         </form>
         {errorMessage && ( <p className='bg-red-700/80 border border-red-500 text-white px-3 py-2 rounded-md text-xs text-center w-full shadow-sm mt-3' role="alert">{errorMessage}</p> )}
        </>
    );
};


interface LocationSelectionViewProps { allCities: City[]; topCities: City[]; selectedCityValue: string | null; onSelectCity: (city: City) => void; onClose: () => void; }
const LocationSelectionView: React.FC<LocationSelectionViewProps> = ({ allCities, selectedCityValue, onSelectCity, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredCities = useMemo(() => { if (!searchTerm) return allCities; if (!allCities) return []; return allCities.filter(city => city.label.toLowerCase().includes(searchTerm.toLowerCase())); }, [searchTerm, allCities]);
    const filteredTopCities = (filteredCities || []).filter(c => c.isTop);
    const filteredOtherCities = (filteredCities || []).filter(c => !c.isTop);
    return (
        <div className="bg-white rounded-xl shadow-xl w-full p-4 md:p-6 text-gray-800 font-sans max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 pt-0 -mt-4 md:-mt-6">
                <div className="flex items-center pb-3 mb-4 border-b border-gray-200 pt-4 md:pt-6">
                    <button onClick={onClose} className="p-1 mr-3 text-gray-500 hover:text-gray-800" aria-label="Close Location Selection"><CloseIcon className="h-5 w-5" /></button>
                    <h2 className="text-base font-semibold text-gray-800 text-center flex-grow">Choose City</h2>
                    <div className="w-8"></div>
                </div>
                <div className="mb-4">
                    <div className="relative">
                        <Label htmlFor="city-search" className="sr-only">Search for city</Label>
                        <Input id="city-search" type="text" placeholder="Search for city" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-md focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-sm" aria-controls="city-results"/>
                        <SearchIconLucide className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                    </div>
                </div>
            </div>
            <div id="city-results">
                {filteredTopCities && filteredTopCities.length > 0 && (
                <div className="mb-6 mt-10">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Cities</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-2 gap-y-4">
                        {filteredTopCities.map((city) => (
                        <button key={city.value} onClick={() => onSelectCity(city)} className={`flex flex-col items-center text-center p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400 ${selectedCityValue === city.value ? 'font-semibold text-orange-600' : ''}`} title={city.label} aria-pressed={selectedCityValue === city.value}>
                            <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-1 text-gray-600">{city.icon}</div>
                            <span className="text-xs md:text-sm font-medium text-gray-700 truncate w-full px-1">{city.label}</span>
                        </button>
                        ))}
                    </div>
                </div>
                )}
                {filteredOtherCities && filteredOtherCities.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Other Cities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-0.5">
                        {filteredOtherCities.map((city) => (
                        <button key={city.value} onClick={() => onSelectCity(city)} className={`w-full text-left text-sm py-1.5 px-1 rounded hover:bg-gray-100 block truncate focus:outline-none focus:ring-1 focus:ring-orange-400 ${selectedCityValue === city.value ? 'font-semibold text-orange-600' : 'text-gray-700'}`} aria-pressed={selectedCityValue === city.value}>
                            {city.label}
                        </button>
                        ))}
                    </div>
                </div>
                )}
                {filteredCities && filteredCities.length === 0 && searchTerm && (<p className="text-center text-gray-500 text-sm mt-8">No cities found matching &quot;{searchTerm}&quot;</p>)}
            </div>
        </div>
    );
};


interface DateTimeSelectionViewProps { initialDateRange: DateRange | undefined; onConfirm: (newRange: DateRange | undefined) => void; onReset: () => void; onClose: () => void; }
const DateTimeSelectionView: React.FC<DateTimeSelectionViewProps> = ({ initialDateRange, onConfirm, onReset, onClose }) => {
    const [tempRange, setTempRange] = useState<DateRange | undefined>(initialDateRange);
    const [localError, setLocalError] = useState<string | null>(null);
    const disabledDays = { before: startOfDay(new Date()) };
    const topBarDisplay = useMemo(() => { if (!tempRange?.from || !tempRange?.to) return "Select start date & end date"; const formattedStart = `${format(tempRange.from, 'd MMM')}, ${format(tempRange.from, 'h:mma').toLocaleLowerCase()}`; const formattedEnd = `${format(tempRange.to, 'd MMM')}, ${format(tempRange.to, 'h:mma').toLocaleLowerCase()}`; return `${formattedStart} - ${formattedEnd}`; }, [tempRange?.from, tempRange?.to]);
    const handleDateSelect = (range: DateRange | undefined) => { setLocalError(null); const newFromDate = range?.from ? startOfDay(range.from) : undefined; const newToDate = range?.to ? startOfDay(range.to) : undefined; let finalFrom: Date | undefined = undefined; let finalTo: Date | undefined = undefined; const defaultStartTime = { hours: 10, minutes: 0 }; const defaultReturnTime = { hours: 10, minutes: 0 }; if (newFromDate) { const fromTime = tempRange?.from ? { hours: tempRange.from.getHours(), minutes: tempRange.from.getMinutes() } : defaultStartTime; finalFrom = set(newFromDate, fromTime); } if (newToDate) { const toTime = tempRange?.to ? { hours: tempRange.to.getHours(), minutes: tempRange.to.getMinutes() } : defaultReturnTime; finalTo = set(newToDate, toTime); if (finalFrom && isEqual(startOfDay(finalTo), startOfDay(finalFrom))) { if (isBefore(finalTo, finalFrom) || isEqual(finalTo, finalFrom)) { finalTo = set(finalFrom, { hours: finalFrom.getHours() + 1 }); } } else if (finalFrom && isBefore(startOfDay(finalTo), startOfDay(finalFrom))) { setLocalError("Return date cannot be before start date."); setTempRange({ from: finalFrom, to: undefined }); return; } } else if (finalFrom && !newToDate && tempRange?.to) { finalTo = undefined; } setTempRange({ from: finalFrom, to: finalTo }); };
    const handleStartTimeChange = (newStartDate: Date) => { setLocalError(null); if (tempRange?.to && (isBefore(tempRange.to, newStartDate) || isEqual(tempRange.to, newStartDate))) { setLocalError("Start time cannot be after or same as return time."); return; } setTempRange(prev => ({ from: newStartDate, to: prev?.to })); }; // Fixed: Ensure object matches DateRange structure
    const handleReturnTimeChange = (newReturnDate: Date) => { setLocalError(null); if (tempRange?.from && (isBefore(newReturnDate, tempRange.from) || isEqual(newReturnDate, tempRange.from))) { setLocalError("Return time cannot be before or same as start time."); return; } setTempRange(prev => ({ from: prev?.from, to: newReturnDate })); }; // Fixed: Ensure object matches DateRange structure
    const handleInternalReset = () => {setTempRange(undefined); setLocalError(null); onReset(); };
    const handleConfirmClick = () => { setLocalError(null); if (!tempRange?.from || !tempRange?.to) { setLocalError("Please select both start and return dates/times."); return; } if (isBefore(tempRange.to, tempRange.from) || isEqual(tempRange.to, tempRange.from)) { setLocalError("Return date & time must be after start date & time."); return; } onConfirm(tempRange); };

    return (
        <div className="bg-white rounded-xl shadow-xl w-full p-4 md:p-6 text-gray-800 font-sans max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 pt-0 -mt-10 md:-mt-6">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 pt-4 md:pt-6">
                    <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded" aria-label="Close Date/Time Selection"><CloseIcon className="h-5 w-5" /></button>
                    <div className="text-xs font-semibold text-center text-gray-700">{topBarDisplay}</div>
                    <button onClick={handleInternalReset} className="text-xs font-semibold text-orange-500 hover:text-orange-700 px-2 py-1 rounded focus:outline-none cursor-pointer focus:ring-1 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Reset dates" disabled={!tempRange?.from && !tempRange?.to}>RESET</button>
                </div>
            </div>
            <div>
                <div className="flex justify-center mb-6 mt-8">
                    <Calendar
                        mode="range" selected={tempRange} onSelect={handleDateSelect} numberOfMonths={2} disabled={disabledDays}
                        className="p-0 scale-[0.95] sm:scale-100 [&>div]:space-x-0 sm:[&>div]:space-x-4"
                        defaultMonth={tempRange?.from || new Date()}
                        classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                            head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.8rem]",
                            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-orange-400/50 first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20",
                            day: "h-8 w-8 p-0 font-normal aria-selected:opacity-400 rounded-full hover:bg-gray-100",
                            day_selected: "bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600",
                            day_today: "bg-gray-300 text-gray-900",
                            day_outside: "text-gray-400 opacity-50",
                            day_disabled: "text-gray-300 opacity-50",
                            day_range_middle: "!bg-orange-400 text-orange-700 rounded-none",
                            day_hidden: "invisible",
                            caption_label: "text-sm font-medium text-gray-900",
                        }}
                    />
                </div>
                <hr className="border-gray-200 my-6"/>
                <div className="space-y-6 mb-6">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Select the start time & end time</p>
                    <TimeSlider label="Start Time" date={tempRange?.from} onTimeChange={handleStartTimeChange}/>
                    <TimeSlider label="End Time" date={tempRange?.to} onTimeChange={handleReturnTimeChange}/>
                </div>
                {localError && (<p className='text-red-600 text-xs mb-4 text-center' role="alert">{localError}</p>)}
                <div className="mt-6">
                    <button onClick={handleConfirmClick} disabled={!tempRange?.from || !tempRange?.to || !!localError} className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 cursor-pointer transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed">Continue</button>
                </div>
             </div>
        </div>
    );
};

export default Hero;