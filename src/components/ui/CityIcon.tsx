// components/ui/CityIcon.tsx
import React from 'react';

interface CityIconProps {
  label: string; // For accessibility/tooltip later
  children?: React.ReactNode; // Where you'd put your <SvgComponent /> or <Image />
  className?: string;
}

export const CityIcon: React.FC<CityIconProps> = ({ label, children, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center mb-1 bg-gray-100 rounded-full text-gray-400">
        {children || <span className="text-2xl">🏙️</span>}
      </div>
      <span className="text-xs md:text-sm font-medium text-gray-700 truncate w-full px-1">{label}</span>
    </div>
  );
};