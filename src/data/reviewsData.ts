import { StaticImageData } from 'next/image';

export interface Review {
    id: string; 
    reviewerName: string;
    reviewerAvatar: StaticImageData;
    rating: number;
    reviewDate: string;
    reviewText: string;
    carId?: number; 
    carModel?: string; 
    carImage?: StaticImageData; 
}

import avatar1 from '@/assets/images/team01.png';
import avatar2 from '@/assets/images/team02.png';
import avatar3 from '@/assets/images/guest.png';
import avatar4 from '@/assets/images/guest.png';

import nexonImg from '@/assets/images/edited/image_038.png';
import tharImg from '@/assets/images/edited/image_062.png';
import dzireImg from '@/assets/images/edited/image_023.png';


export const reviewsData: Review[] = [
    {
        id: 'rev1',
        reviewerName: 'Akash Singh',
        reviewerAvatar: avatar1,
        rating: 5,
        reviewDate: 'November 5, 2023',
        reviewText: 'Absolutely fantastic experience with PrimeDrive! Rented the Mahindra Thar for a weekend trip. The car was spotless, well-maintained, and the pickup/drop-off was incredibly smooth. Highly recommended!',
        carId: 8,
        carModel: 'Mahindra Thar',
        carImage: tharImg
    },
    {
        id: 'rev2',
        reviewerName: 'Asmita Maithil',
        reviewerAvatar: avatar2,
        rating: 4,
        reviewDate: 'October 28, 2023',
        reviewText: 'Good service overall. The Tata Nexon was comfortable and great on mileage for our city tour. Minor delay during pickup, but the customer support was helpful. Would use again.',
        carId: 14,
        carModel: 'Tata Nexon',
        carImage: nexonImg
    },
    {
        id: 'rev3',
        reviewerName: 'Amit Kumar',
        reviewerAvatar: avatar3,
        rating: 5,
        reviewDate: 'October 15, 2023',
        reviewText: 'Rented the Dzire for a family function. Very clean car, easy booking process online, and affordable pricing. Made our travel hassle-free.',
        carId: 13,
        carModel: 'Maruti Suzuki Dzire',
        carImage: dzireImg
    },
     {
        id: 'rev4',
        reviewerName: 'Sunita Mehta',
        reviewerAvatar: avatar4,
        rating: 4,
        reviewDate: 'September 30, 2023',
        reviewText: 'The app is user-friendly and the variety of cars is good. The pricing was transparent. The car itself was decent, maybe could have been slightly cleaner inside, but overall a positive rental.',
    },
];