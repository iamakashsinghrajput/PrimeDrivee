"use client";

import React, { useState, useCallback, useMemo } from 'react';
import { MapPinIcon, XIcon as CloseIcon, SearchIcon, ChevronDownIcon } from 'lucide-react';
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

interface City {
    value: string;
    label: string;
    isTop?: boolean;
    icon?: React.ReactNode;
}

const allCities: City[] = [
    { value: 'Bengaluru', label: 'Bengaluru', isTop: true, icon: <BangaloreIcon /> },
    { value: 'Chennai', label: 'Chennai', isTop: true, icon: <ChennaiIcon /> },
    { value: 'Delhi NCR', label: 'Delhi NCR', isTop: true, icon: <DelhiIcon /> },
    { value: 'Jaipur', label: 'Jaipur', isTop: true, icon: <JaipurIcon /> },
    { value: 'Hyderabad', label: 'Hyderabad', isTop: true, icon: <HyderabadIcon /> },
    { value: 'Mumbai', label: 'Mumbai', isTop: true, icon: <MumbaiIcon /> },
    { value: 'Vizag', label: 'Vizag', isTop: true, icon: <VizagIcon /> },
    { value: 'Kolkata', label: 'Kolkata', isTop: true, icon: <KolkataIcon /> },
    { value: 'Goa', label: 'Goa', isTop: true, icon: <GoaIcon /> },
    { value: 'Pune', label: 'Pune', isTop: true, icon: <PuneIcon /> },
    { value: 'Ahmedabad', label: 'Ahmedabad' },
    { value: 'Coimbatore', label: 'Coimbatore' },
    { value: 'Chandigarh', label: 'Chandigarh' },
    { value: 'Indore', label: 'Indore' },
    { value: 'Mangalore', label: 'Mangalore' },
    { value: 'Mysore', label: 'Mysore' },
    { value: 'Udaipur', label: 'Udaipur' },
    { value: 'Nagpur', label: 'Nagpur' },
    { value: 'Kochi', label: 'Kochi' },
    { value: 'Vijayawada', label: 'Vijayawada' },
].sort((a, b) => a.label.localeCompare(b.label));

const topCities = allCities.filter(c => c.isTop);

interface TimeSliderProps {
    label: string; date: Date | undefined; onTimeChange: (newDate: Date) => void;
    minHour?: number; maxHour?: number; stepMinutes?: number; className?: string;
}
const TimeSlider: React.FC<TimeSliderProps> = ({
    label, date, onTimeChange, minHour = 0, maxHour = 23, stepMinutes = 30, className = ''
}) => {
    const currentTimeInMinutes = date ? date.getHours() * 60 + date.getMinutes() : minHour * 60;
    const minSliderValue = minHour * 60;
    const maxSliderValue = maxHour * 60 + (60 - stepMinutes);

    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const totalMinutes = parseInt(event.target.value, 10);
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        const baseDate = date || new Date();
        const newDate = set(baseDate, { hours: newHours, minutes: newMinutes, seconds: 0, milliseconds: 0 });

        if (newDate.getHours() >= minHour && newDate.getHours() <= maxHour) {
            onTimeChange(newDate);
        } else {
             const clampedHours = Math.max(minHour, Math.min(maxHour, newHours));
             const clampedDate = set(baseDate, { hours: clampedHours, minutes: newMinutes, seconds: 0, milliseconds: 0 });
             onTimeChange(clampedDate);
        }
    };
    const displayTime = date ? format(date, 'hh:mm a') : '--:-- --';
    const stepValue = stepMinutes;

    return (
        <div className={`space-y-2 ${className}`}>
             <div className="flex justify-between items-center mb-1">
                <Label htmlFor={`time-slider-${label.replace(/\s+/g, '-')}`} className="text-sm font-semibold text-gray-700">
                    {label}
                </Label>
                 {date && (
                    <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                         {displayTime}
                     </span>
                 )}
            </div>
            <input
                type="range"
                id={`time-slider-${label.replace(/\s+/g, '-')}`}
                min={minSliderValue}
                max={maxSliderValue}
                step={stepValue}
                value={currentTimeInMinutes}
                onChange={handleSliderChange}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!date}
                aria-label={`${label} time selection slider`}
            />
        </div>
    );
};

type ViewState = 'main' | 'location' | 'dateTime';

const formatDateDisplay = (date: Date | undefined): string => {
    if (!date) return "Select Date";
    return format(date, "dd MMM'");
};

type PlanOption = number | string;

interface SegmentedControlProps<T extends PlanOption> {
    label: string;
    options: T[];
    selectedOption: T;
    onSelectOption: (option: T) => void;
    formatLabel?: (option: T) => string;
    className?: string;
}

const SegmentedControl = <T extends PlanOption>({
    label, options, selectedOption, onSelectOption, formatLabel, className = ''
}: SegmentedControlProps<T>) => {
    const defaultFormatter = (option: T) => {
        if (typeof option === 'number') return `${option} kms`;
        return String(option);
    };
    const displayLabel = formatLabel || defaultFormatter;

    return (
        <div className={className}>
            <span className="text-xs font-medium text-gray-600 mb-1.5 block">{label}</span>
            <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                {options.map((option) => (
                    <button
                        key={String(option)}
                        type="button"
                        onClick={() => onSelectOption(option)}
                        className={`
                            flex-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400 whitespace-nowrap
                            ${selectedOption === option
                                ? 'bg-white text-orange-600 shadow-sm border border-orange-300'
                                : 'text-gray-500 hover:bg-gray-200/60'
                            }
                            ${option === 'Without Fuel' && selectedOption === option ? '!text-orange-500 !border-orange-300' : ''}
                        `}
                        aria-pressed={selectedOption === option}
                    >
                        {displayLabel(option)}
                    </button>
                ))}
            </div>
        </div>
    );
};

const SearchBar = () => {
    const [selectedLocation, setSelectedLocation] = useState<City | null>(allCities.find(c => c.value === 'Delhi NCR') || null);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: set(new Date('2025-04-24'), { hours: 23, minutes: 30 }),
        to: set(new Date('2025-04-25'), { hours: 11, minutes: 0 }),
    });
    const [currentView, setCurrentView] = useState<ViewState>('main');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [selectedKmPlan, setSelectedKmPlan] = useState<number>(132);
    const [selectedFuelPlan, setSelectedFuelPlan] = useState<string>('Without Fuel');

    const startDate = dateRange?.from;
    const returnDate = dateRange?.to;

    const handleEditLocation = () => setCurrentView('location');
    const handleEditDateTime = () => setCurrentView('dateTime');
    const handleCloseModal = useCallback(() => setCurrentView('main'), []);

    const handleLocationSelect = useCallback((city: City) => {
        setSelectedLocation(city);
        setErrorMessage(null);
        handleCloseModal();
    }, [handleCloseModal]);

    const handleDateTimeConfirm = useCallback((newRange: DateRange | undefined) => {
        setDateRange(newRange);
        setErrorMessage(null);
        handleCloseModal();
    }, [handleCloseModal]);

     const handleDateTimeReset = useCallback(() => {
        setDateRange(undefined);
    }, []);

    const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        setErrorMessage(null);

        if (!selectedLocation) { setErrorMessage("Please select a location."); setCurrentView('location'); return; }
        if (!startDate || !returnDate) { setErrorMessage("Please select start and return dates/times."); setCurrentView('dateTime'); return; }
        if (isBefore(returnDate, startDate) || isEqual(returnDate, startDate)) { setErrorMessage("Return date & time must be after start date & time."); setCurrentView('dateTime'); return; }

        console.log("Modifying Search:", {
            location: selectedLocation.value,
            start: startDate?.toISOString(),
            end: returnDate?.toISOString(),
            kmPlan: selectedKmPlan,
            fuelPlan: selectedFuelPlan
        });
    };

    const renderModal = () => {
         if (currentView === 'location') {
            return (<LocationSelectionView
                        allCities={allCities}
                        topCities={topCities}
                        selectedCityValue={selectedLocation?.value ?? null}
                        onSelectCity={handleLocationSelect}
                        onClose={handleCloseModal}
                    />);
         }
         if (currentView === 'dateTime') {
             return (<DateTimeSelectionView
                        initialDateRange={dateRange}
                        onConfirm={handleDateTimeConfirm}
                        onReset={handleDateTimeReset}
                        onClose={handleCloseModal}
                    />);
         }
        return null;
    }

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                <div className="flex flex-1 flex-wrap items-center min-w-[300px] sm:min-w-0">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200/80 shadow-sm overflow-hidden min-w-full lg:min-w-0">
                        <button
                            type="button"
                            onClick={handleEditLocation}
                            className="flex items-center gap-2 pl-3 pr-2 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors border-r border-gray-200/80 whitespace-nowrap"
                            aria-label={`Current location: ${selectedLocation?.label || 'Select City'}. Click to change.`}
                        >
                            <MapPinIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            {selectedLocation?.label || 'Select City'}
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                            type="button"
                            onClick={handleEditDateTime}
                            className="flex-1 flex items-center gap-4 pl-3 pr-2 py-1.5 text-sm text-gray-800 hover:bg-gray-100 transition-colors border-r border-gray-200/80 min-w-[180px]"
                            aria-label="Click to change start and end dates/times."
                        >
                            <div className="flex-1 text-left">
                                <span className="text-[10px] text-gray-500 block leading-tight">Start time</span>
                                <span className="font-medium block leading-tight">{formatDateDisplay(startDate)}</span>
                            </div>
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </button>
                         <button
                             type="button"
                            onClick={handleEditDateTime}
                            className="flex-1 flex items-center gap-4 pl-3 pr-2 py-1.5 text-sm text-gray-800 hover:bg-gray-100 transition-colors min-w-[180px]"
                             aria-label="Click to change start and end dates/times."
                         >
                             <div className="flex-1 text-left">
                                <span className="text-[10px] text-gray-500 block leading-tight">End time</span>
                                <span className="font-medium block leading-tight">{formatDateDisplay(returnDate)}</span>
                            </div>
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                        </button>
                    </div>
                     <button
                         type="button"
                         onClick={() => handleSubmit()}
                         className="ml-3 px-5 py-2.5 flex-wrap cursor-pointer bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400 whitespace-nowrap"
                     >
                        Modify Search
                     </button>
                </div>

                <div className="flex items-center gap-x-4 gap-y-2 flex-wrap sm:flex-nowrap">
                    <SegmentedControl
                        label="Km plan"
                        options={[132, 192, 240]}
                        selectedOption={selectedKmPlan}
                        onSelectOption={setSelectedKmPlan}
                        className="min-w-[180px]"
                    />
                    <SegmentedControl
                        label="Fuel plan"
                        options={['With Fuel', 'Without Fuel']}
                        selectedOption={selectedFuelPlan}
                        onSelectOption={setSelectedFuelPlan}
                        className="min-w-[180px]"
                    />
                </div>
            </div>

            {errorMessage && (
                <p className='text-red-600 text-xs mt-2 text-center lg:text-left' role="alert">
                    {errorMessage}
                </p>
            )}

            {currentView !== 'main' && (
                 <div
                     className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
                     onClick={handleCloseModal}
                     role="dialog"
                     aria-modal="true"
                >
                    <div onClick={(e) => e.stopPropagation()} className="max-w-2xl w-full">
                        {renderModal()}
                     </div>
                </div>
            )}
        </>
    );
};

interface LocationSelectionViewProps {
    allCities: City[]; topCities: City[]; selectedCityValue: string | null;
    onSelectCity: (city: City) => void; onClose: () => void;
}
const LocationSelectionView: React.FC<LocationSelectionViewProps> = ({ allCities, selectedCityValue, onSelectCity, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredCities = useMemo(() => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return allCities;
        return allCities.filter(city => city.label.toLowerCase().includes(term));
    }, [searchTerm, allCities]);

    const filteredTopCities = useMemo(() => filteredCities.filter(c => c.isTop), [filteredCities]);
    const filteredOtherCities = useMemo(() => filteredCities.filter(c => !c.isTop), [filteredCities]);

    return (
        <div className="bg-white rounded-xl shadow-xl w-full p-4 md:p-6 text-gray-800 font-sans max-h-[85vh] overflow-y-auto mt-[500px]">
            <div className="flex items-center pb-3 mb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <button onClick={onClose} className="p-1 mr-3 text-gray-500 hover:text-gray-800" aria-label="Close Location Selection">
                    <CloseIcon className="h-5 w-5" />
                </button>
                <h2 className="text-base font-semibold text-gray-800 text-center flex-grow">Choose City</h2>
                <div className="w-8"></div>
            </div>

            <div className="mb-4 sticky top-[49px] bg-white z-10 py-2">
                <div className="relative">
                    <Label htmlFor="city-search" className="sr-only">Search for city</Label>
                    <Input
                        id="city-search"
                        type="text"
                        placeholder="Search for city"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-400 focus:border-orange-400 text-sm"
                        aria-controls="city-results"
                    />
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
            </div>

            <div id="city-results" className="pt-2">
                {filteredTopCities.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top Cities</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-2 gap-y-4">
                            {filteredTopCities.map((city) => (
                                <button
                                    key={city.value}
                                    onClick={() => onSelectCity(city)}
                                    className={`flex flex-col items-center text-center p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-orange-400 ${selectedCityValue === city.value ? 'font-bold ring-2 ring-orange-300 ring-offset-1' : ''}`}
                                    title={city.label}
                                    aria-pressed={selectedCityValue === city.value}
                                >
                                    <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-1 text-gray-600">{city.icon}</div>
                                    <span className="text-xs md:text-sm font-medium text-gray-700 truncate w-full px-1">{city.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                 {filteredOtherCities.length > 0 && (
                     <div className="mb-4">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Other Cities</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-0.5">
                            {filteredOtherCities.map((city) => (
                                <button
                                    key={city.value}
                                    onClick={() => onSelectCity(city)}
                                    className={`w-full text-left text-sm py-1.5 px-1 rounded hover:bg-gray-100 block truncate focus:outline-none focus:ring-1 focus:ring-orange-400 ${selectedCityValue === city.value ? 'font-semibold text-orange-600' : 'text-gray-700'}`}
                                    aria-pressed={selectedCityValue === city.value}
                                >
                                    {city.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {filteredCities.length === 0 && searchTerm && (
                    <p className="text-center text-gray-500 text-sm mt-8">No cities found matching &quot;{searchTerm}&quot;</p>
                )}
                 {filteredCities.length === 0 && !searchTerm && allCities.length === 0 && (
                    <p className="text-center text-gray-500 text-sm mt-8">No cities available.</p>
                )}
            </div>
        </div>
    );
};


interface DateTimeSelectionViewProps {
    initialDateRange: DateRange | undefined; onConfirm: (newRange: DateRange | undefined) => void;
    onReset: () => void; onClose: () => void;
}
const DateTimeSelectionView: React.FC<DateTimeSelectionViewProps> = ({ initialDateRange, onConfirm, onReset, onClose }) => {
    const [tempRange, setTempRange] = useState<DateRange | undefined>(initialDateRange);
    const [localError, setLocalError] = useState<string | null>(null);
    const disabledDays = { before: startOfDay(new Date()) };

    const startDate = tempRange?.from;
    const endDate = tempRange?.to;
    const isRangeValid = useMemo(() => {
        if (!startDate || !endDate) return false;
        return isBefore(startDate, endDate);
    }, [startDate, endDate]);

    const topBarDisplay = useMemo(() => {
        if (!startDate) return "Select start date & time";
        if (!endDate) return `${format(startDate, 'd MMM, h:mma')} - Select end date & time`;
        return `${format(startDate, 'd MMM, h:mma')} - ${format(endDate, 'd MMM, h:mma')}`;
    }, [startDate, endDate]);


    const handleDateSelect = (range: DateRange | undefined) => {
        setLocalError(null);

        const newFromDateRaw = range?.from;
        const newToDateRaw = range?.to;
        const defaultStartTime = { hours: 10, minutes: 0 };
        const defaultReturnTime = { hours: 10, minutes: 0 };
        let finalFrom: Date | undefined = undefined;
        let finalTo: Date | undefined = undefined;

        if (newFromDateRaw) {
            const baseFromDate = startOfDay(newFromDateRaw);
            const fromTime = startDate ? { hours: startDate.getHours(), minutes: startDate.getMinutes() } : defaultStartTime;
            finalFrom = set(baseFromDate, fromTime);
             if (isBefore(finalFrom, new Date())) {
                 if (isEqual(startOfDay(finalFrom), startOfDay(new Date()))) {
                      const now = new Date();
                      if (finalFrom.getHours() < now.getHours() || (finalFrom.getHours() === now.getHours() && finalFrom.getMinutes() < now.getMinutes())) {
                          finalFrom = set(finalFrom, defaultStartTime);
                      }
                 } else {
                      setLocalError("Start date cannot be in the past.");
                      setTempRange({ from: undefined, to: undefined });
                      return;
                 }
             }
        }

        if (newToDateRaw) {
             const baseToDate = startOfDay(newToDateRaw);
             const toTime = endDate ? { hours: endDate.getHours(), minutes: endDate.getMinutes() } : defaultReturnTime;
            finalTo = set(baseToDate, toTime);
        } else if (startDate && !newToDateRaw) {
             finalTo = undefined;
        }

         if (finalFrom && finalTo) {
             if (isEqual(startOfDay(finalFrom), startOfDay(finalTo))) {
                 if (!isBefore(finalFrom, finalTo)) {
                      let newEndHour = finalFrom.getHours() + 1;
                      let newEndMinutes = finalFrom.getMinutes();
                       if (newEndHour > 23) {
                           newEndHour = 23;
                           newEndMinutes = 30;
                       }
                      finalTo = set(finalTo, { hours: newEndHour, minutes: newEndMinutes });
                 }
             }
             else if (isBefore(startOfDay(finalTo), startOfDay(finalFrom))) {
                setLocalError("Return date cannot be before start date.");
                 finalTo = undefined;
             }
         }
         setTempRange({ from: finalFrom, to: finalTo });
    };

    const handleTimeChange = (type: 'start' | 'end', newTimeDate: Date) => {
         setLocalError(null);
         if (type === 'start') {
             const currentEndDate = tempRange?.to;
             if (currentEndDate && !isBefore(newTimeDate, currentEndDate)) {
                 setLocalError("Start time must be before the return time.");
             } else {
                // Ensure the entire DateRange object is returned
                setTempRange(prev => ({ from: newTimeDate, to: prev?.to }));
             }
         } else {
             const currentStartDate = tempRange?.from;
             if (currentStartDate && !isBefore(currentStartDate, newTimeDate)) {
                 setLocalError("Return time must be after the start time.");
             } else {
                // Ensure the entire DateRange object is returned
                setTempRange(prev => ({ from: prev?.from, to: newTimeDate }));
             }
         }
    };

    const handleInternalReset = () => {
        setTempRange(undefined);
        setLocalError(null);
        onReset();
    };

    const handleConfirmClick = () => {
        if (!startDate || !endDate) {
            setLocalError("Please select both start and return dates/times.");
            return;
        }
        if (!isRangeValid) {
            setLocalError("Return date & time must be after start date & time.");
            return;
        }
        setLocalError(null);
        onConfirm(tempRange);
    };

    return (
         <div className="bg-white rounded-xl shadow-xl w-full p-4 md:p-6 text-gray-800 font-sans max-h-[85vh] overflow-y-auto mt-[600px]">
             <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded" aria-label="Close Date/Time Selection">
                    <CloseIcon className="h-5 w-5" />
                </button>
                <div className="text-xs font-semibold text-center text-gray-700 truncate px-2">{topBarDisplay}</div>
                <button onClick={handleInternalReset} className="text-xs font-semibold text-orange-500 hover:text-orange-700 px-2 py-1 rounded focus:outline-none cursor-pointer focus:ring-1 focus:ring-orange-400 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap" aria-label="Reset dates" disabled={!startDate && !endDate}>
                    RESET
                </button>
            </div>

             <div className="pt-2">
                <div className="flex justify-center mb-6">
                    <Calendar
                        mode="range"
                        selected={tempRange}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                        disabled={disabledDays}
                        className="p-0 scale-[0.92] sm:scale-100"
                        defaultMonth={startDate || new Date()}
                        classNames={{
                            caption_label: "text-sm font-medium",
                            nav_button: "h-7 w-7",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            row: "flex w-full mt-2",
                            cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                            day_selected: "bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600 rounded-full",
                            day_today: "bg-accent text-accent-foreground",
                            day_outside: "text-muted-foreground opacity-50",
                            day_disabled: "text-muted-foreground opacity-50",
                            day_range_start: "day-selected rounded-l-full",
                            day_range_end: "day-selected rounded-r-full",
                            day_range_middle: "aria-selected:bg-orange-100 aria-selected:text-orange-700 rounded-none",
                        }}
                    />
                </div>

                <hr className="border-gray-100 my-6"/>

                <div className="space-y-6 mb-6">
                     <p className="text-sm font-semibold text-gray-700 mb-1">Select the start & end time</p>
                     <TimeSlider label="Start Time" date={startDate} onTimeChange={(newDate) => handleTimeChange('start', newDate)}/>
                     <TimeSlider label="End Time" date={endDate} onTimeChange={(newDate) => handleTimeChange('end', newDate)}/>
                </div>

                {localError && (
                    <p className='bg-red-100 border-red-200 text-red-700 text-xs mb-4 p-2 rounded text-center' role="alert">
                        {localError}
                    </p>
                )}

                <div className="mt-6">
                     <button
                         onClick={handleConfirmClick}
                         disabled={!isRangeValid || !!localError}
                         className="w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 cursor-pointer transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                         Continue
                     </button>
                </div>
             </div>
        </div>
    );
};

export default SearchBar;