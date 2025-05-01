// components/ui/TimeSlider.tsx
import React from 'react';
import { Label } from '@/components/ui/label';
import { set, format } from 'date-fns';

interface TimeSliderProps {
    label: string;
    date: Date | undefined;
    onTimeChange: (newDate: Date) => void;
    minHour?: number;
    maxHour?: number;
    stepMinutes?: number;
    className?: string;
}

const formatTimeForDisplay = (date: Date | undefined): string => {
    if (!date) return "--:-- --";
    return format(date, 'hh:mm a');
};

export const TimeSlider: React.FC<TimeSliderProps> = ({
    label,
    date,
    onTimeChange,
    minHour = 0,
    maxHour = 23,
    stepMinutes = 30,
    className = '',
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

    const displayTime = formatTimeForDisplay(date);
    const stepValue = stepMinutes;

    const totalRange = maxSliderValue - minSliderValue;
    const currentValueOffset = currentTimeInMinutes - minSliderValue;
    const percentage = totalRange === 0 ? 0 : (currentValueOffset / totalRange) * 100;

    return (
        <div className={`space-y-3 ${className}`}>
            <Label className="text-sm font-semibold text-gray-700">
                {label}
            </Label>
            <div className="relative h-8">
                <input
                    type="range"
                    min={minSliderValue}
                    max={maxSliderValue}
                    step={stepValue}
                    value={currentTimeInMinutes}
                    onChange={handleSliderChange}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 dark:bg-gray-700"
                    disabled={!date}
                />
                 {date && (
                     <div
                        className="absolute -top-5 px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded-md shadow pointer-events-none transform -translate-x-1/2"
                        style={{ left: `calc(${percentage}% + ${8 - percentage * 0.16}px)` }}
                     >
                        {displayTime}
                    </div>
                 )}
            </div>
        </div>
    );
};