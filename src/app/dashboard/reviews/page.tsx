"use client";
import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, MessageSquareText} from 'lucide-react';

import { reviewsData, Review } from '@/data/reviewsData';
import StarRating from '@/components/StarRating';

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 p-5 flex flex-col sm:flex-row gap-4 items-start hover:shadow-lg transition-shadow duration-200">
        <div className="flex-shrink-0">
            <Image
                src={review.reviewerAvatar}
                alt={`Avatar of ${review.reviewerName}`}
                width={48}
                height={48}
                className="rounded-full border-2 border-gray-200"
            />
        </div>

        <div className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                <div>
                    <h3 className="font-semibold text-gray-900">{review.reviewerName}</h3>
                    <p className="text-xs text-gray-500">{review.reviewDate}</p>
                </div>
                <StarRating rating={review.rating} size={18} className="mt-1 sm:mt-0" />
            </div>

            <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-200 pl-3 py-1">
                &quot;{review.reviewText}&quot;
            </p>

            {review.carModel && review.carImage && review.carId && (
                <Link href={`/cars/${review.carId}`}>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 group cursor-pointer">
                        <div className="relative w-12 h-8 rounded overflow-hidden flex-shrink-0">
                             <Image src={review.carImage} alt={review.carModel} layout="fill" objectFit="cover" />
                         </div>
                         <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                             Rented: <span className="font-medium text-gray-700 group-hover:text-blue-600">{review.carModel}</span>
                         </span>
                    </div>
                </Link>
            )}
        </div>
    </div>
);

const ReviewsPage = () => {

    const averageRating = useMemo(() => {
        if (reviewsData.length === 0) return 0;
        const total = reviewsData.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviewsData.length);
    }, []);

  return (
    <div className="container mx-auto px-8 py-8 min-h-screen bg-gray-100">

        <div className="mb-6">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 transition-colors">
                <ChevronLeft size={16} /> Back to Home
            </Link>
        </div>

        <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-3 text-gray-900">Customer Reviews</h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">Hear directly from our valued customers about their PrimeDrive experience.</p>
        </div>

        <div className="mb-10 bg-white p-4 rounded-lg shadow-sm border max-w-md mx-auto flex items-center justify-center gap-4">
             <div className='flex items-center gap-2'>
                <span className='text-3xl font-bold text-gray-800'>{averageRating.toFixed(1)}</span>
                <StarRating rating={averageRating} size={20} />
             </div>
             <span className='text-gray-500'>|</span>
             <span className="text-sm text-gray-600 font-medium">{reviewsData.length} Reviews</span>
        </div>

        <div className="space-y-6 max-w-3xl mx-auto">
            {reviewsData.map(review => (
                <ReviewCard key={review.id} review={review} />
            ))}

            {reviewsData.length === 0 && (
                <p className="text-center text-gray-500 py-10">No reviews yet. Be the first!</p>
            )}
        </div>

         <div className="mt-12 text-center">
             <Link href="/leave-review"
                 className="inline-flex items-center gap-2 bg-black text-white font-medium py-2.5 px-6 rounded-lg hover:bg-gray-800 transition-colors text-sm shadow-md"
             >
                 <MessageSquareText size={18} /> Leave Your Review
             </Link>
         </div>

    </div>
  );
};

export default ReviewsPage;