"use client"

import React, { useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import Slider from 'react-slick';
import { CarFront, Gauge, Users, IndianRupee, ChevronLeft, ChevronRight } from 'lucide-react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import be6Img from '../assets/images/edited/image_007.png';
import altoK10Img from '../assets/images/edited/image_001.png';
import brezzaImg from '../assets/images/edited/image_013.png';
import TaisorImg from '../assets/images/edited/image_063.png';
import tharImg from '../assets/images/edited/image_062.png';
import curvvImg from '../assets/images/edited/image_018.png';

interface TopSellingCar {
  id: number;
  image: StaticImageData;
  model: string;
  brand: string;
  bodyType?: string;
  transmission?: 'Manual' | 'Automatic';
  seats: number;
  pricePerDay: number;
}

const topSellingCars: TopSellingCar[] = [
  { id: 0, image: TaisorImg, model: 'Taisor', brand: 'Toyota', bodyType: 'Hatchback', transmission: 'Automatic', seats: 5, pricePerDay: 3864 },
  { id: 1, image: tharImg, model: 'Thar', brand: 'Mahindra', bodyType: 'SUV', transmission: 'Manual', seats: 5, pricePerDay: 5064 },
  { id: 2, image: altoK10Img, model: 'Alto K10', brand: 'Maruti', bodyType: 'Hatchback', transmission: 'Manual', seats: 5, pricePerDay: 1872 },
  { id: 3, image: brezzaImg, model: 'Brezza', brand: 'Maruti', bodyType: 'SUV', transmission: 'Manual', seats: 5, pricePerDay: 5784 },
  { id: 4, image: curvvImg, model: 'Curvv', brand: 'Tata', bodyType:'Coupe', transmission: 'Automatic', seats: 4, pricePerDay: 9500 },
  { id: 5, image: be6Img, model: 'BE6', brand: 'Mahindra', bodyType:'Coupe', transmission: 'Automatic', seats: 4, pricePerDay: 4500 },
];

interface FeatureProps {
  icon: React.ElementType;
  label: string | number;
}
const FeatureItem: React.FC<FeatureProps> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-1.5 text-gray-600">
    <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
    <span className="text-sm">{label}</span>
  </div>
);

const CarCard: React.FC = () => {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: false,
    infinite: topSellingCars.length > 3,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: topSellingCars.length > 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          infinite: topSellingCars.length > 1,
        }
      }
    ]
  };

  const goToNext = () => sliderRef.current?.slickNext();
  const goToPrev = () => sliderRef.current?.slickPrev();

  const showArrows = topSellingCars.length > settings.slidesToShow;

  return (
    <div className='w-full mt-6 rounded-2xl h-fit py-12 px-4 md:px-8 bg-[#F1EFEC]'>
      <div className='flex justify-between items-center mb-6 max-w-6xl mx-auto px-2'>
        <h2 className='text-2xl font-semibold text-gray-800'>
           Top Selling Cars
        </h2>
        {showArrows && (
          <div className="flex gap-2">
            <button aria-label="Previous car" onClick={goToPrev} className="p-1.5 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"> <ChevronLeft className="w-5 h-5" /> </button>
            <button aria-label="Next car" onClick={goToNext} className="p-1.5 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"> <ChevronRight className="w-5 h-5" /> </button>
          </div>
        )}
      </div>
      <div className='max-w-6xl mx-auto'>
        <Slider ref={sliderRef} {...settings}>
          {topSellingCars.map((car) => (
            <div key={car.id} className='px-2 outline-none focus:outline-none h-full'>
              <div className='bg-white rounded-lg shadow-sm flex flex-col overflow-hidden h-full'>
                <div className="relative w-full aspect-[16/10] bg-gray-50">
                  <Image
                    src={car.image} alt={`${car.brand} ${car.model}`} layout="fill"
                    objectFit="contain" className="drop-shadow-sm"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                   <h3 className='text-base text-gray-500 leading-tight'> {car.model} </h3>
                   <p className='text-md font-bold text-gray-900 mt-0.5 mb-3'> {car.brand} </p>
                   <div className="flex items-center gap-3 flex-wrap mb-3 min-h-[24px]">
                     {car.bodyType && <FeatureItem icon={CarFront} label={car.bodyType} />}
                     {car.transmission && <FeatureItem icon={Gauge} label={car.transmission} />}
                     <FeatureItem icon={Users} label={`${car.seats} seats`} />
                   </div>
                   <div className="flex items-baseline mt-auto pt-2">
                     <IndianRupee className="w-4 h-4 text-gray-900" strokeWidth={2.5}/>
                     <span className="text-xl font-bold text-gray-900 tracking-tight mr-1">{car.pricePerDay.toLocaleString('en-IN')}</span>
                     <span className="text-xs text-gray-500 font-medium">per day</span>
                   </div>
                 </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CarCard;