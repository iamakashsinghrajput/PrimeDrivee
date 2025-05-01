// src/data/trendingData.ts (Create this new file)

import { StaticImageData } from 'next/image';

// --- Types ---
export interface TrendingCarInfo {
    id: number; // Use the ID from your main car data
    model: string;
    brand: string;
    image: StaticImageData;
    highlight?: string; // Short highlight text
    pricePerDay: number; // For display
}

export interface TrendingOffer {
    id: string;
    title: string;
    description: string;
    promoCode?: string;
    icon?: React.ElementType;
}

export interface RentalTip {
    id: string;
    title: string;
    snippet: string;
    link: string;
}

// import be6Img from '../assets/images/edited/image_007.png';
import scorpioNImg from '@/assets/images/edited/image_048.png';
import nexonImg from '@/assets/images/edited/image_038.png';
import taisorImg from '@/assets/images/edited/image_063.png';
import tharImg from '@/assets/images/edited/image_062.png';
import { Tag, CalendarDays, MapPin } from 'lucide-react';

// --- Sample Data ---

export const trendingCarsData: TrendingCarInfo[] = [
    { id: 2, model: 'Thar', brand: 'Mahindra', image: tharImg, highlight: 'Adventure Ready!', pricePerDay: 5500 },
    { id: 8, model: 'Nexon', brand: 'Tata', image: nexonImg, highlight: 'Top Safety Pick', pricePerDay: 4800 },
    { id: 9, model: 'Scorpio-N', brand: 'Mahindra', image: scorpioNImg, highlight: 'Powerful & Spacious', pricePerDay: 6800 },
    { id: 1, model: 'Urban Cruiser Taisor', brand: 'Toyota', image: taisorImg, highlight: 'Stylish City SUV', pricePerDay: 4250 },
];

export const offersData: TrendingOffer[] = [
    { id: 'offer1', title: 'Weekend Getaway Special', description: 'Flat 15% off on SUV rentals this weekend.', promoCode: 'WKND15', icon: CalendarDays },
    { id: 'offer2', title: 'First Time User Discount', description: 'Get ₹300 off your first PrimeDrive rental.', promoCode: 'NEW300', icon: Tag },
    { id: 'offer3', title: 'Goa Special', description: 'Explore Goa with special rates starting from ₹1500/day.', icon: MapPin },
];

export const tipsData: RentalTip[] = [
    { id: 'tip1', title: 'Mastering Highway Driving', snippet: 'Essential tips for a safe and smooth long-distance journey...', link: '/blog/highway-tips' },
    { id: 'tip2', title: 'Choosing the Right Car Size', snippet: 'Match the car to your trip needs - passengers, luggage...', link: '/blog/choosing-car' },
    { id: 'tip3', title: 'Understanding Rental Insurance', snippet: 'Know your coverage options before you hit the road...', link: '/blog/rental-insurance' },
];