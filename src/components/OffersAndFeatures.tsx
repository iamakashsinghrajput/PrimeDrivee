"use client"

import React, { useRef } from 'react';
import Slider, { Settings } from 'react-slick'; // Import Settings type
import { Percent, Tag, Gift, Home, Clock, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface BaseItem {
  id: number | string;
  icon: React.ElementType;
  title: string;
  description: string;
  bgColorClass?: string;
  iconColorClass?: string;
}

type OfferItem = BaseItem
type FeatureItem = BaseItem


const offersData: OfferItem[] = [
  { id: 'o1', icon: Percent, title: 'Get 10% off up to ₹300', description: 'Use code NEW10 to get 10% off' },
  { id: 'o2', icon: Tag, title: 'Get 5% off up to ₹500', description: 'Use code STMB5 to get 5% off' },
  { id: 'o3', icon: Gift, title: 'Get 10% off up to ₹1000', description: 'Use code STMB10 to get 10% off' },
  { id: 'o4', icon: Percent, title: 'Flat ₹200 Off Weekend', description: 'Use code WKND200 on Sat/Sun' },
];

const featuresData: FeatureItem[] = [
  { id: 'f1', icon: Home, title: 'Home delivery & return', description: 'On-time doorstep service, at your preferred location and time' },
  { id: 'f2', icon: Clock, title: 'Flexible pricing plans', description: 'Choose \'Unlimited kms\' or \'with fuel\' plans' },
  { id: 'f3', icon: Wrench, title: 'Well maintained cars', description: 'Regular service & maintenance; Inspected before each trip' },
  { id: 'f4', icon: Home, title: '24/7 Roadside Assistance', description: 'Help is always available during your trip' },
];


const OffersAndFeatures: React.FC = () => {
  const offersSliderRef = useRef<Slider>(null);
  const featuresSliderRef = useRef<Slider>(null);

  const baseSliderSettings: Settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 768, settings: { slidesToShow: 1.5, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1.1, slidesToScroll: 1 } }
    ]
  };

  const offersSettings: Settings = {
    ...baseSliderSettings,
    infinite: offersData.length > (baseSliderSettings.slidesToShow ?? 0)
  };
  const featuresSettings: Settings = {
    ...baseSliderSettings,
    infinite: featuresData.length > (baseSliderSettings.slidesToShow ?? 0)
  };

  const goToNextOffer = () => offersSliderRef.current?.slickNext();
  const goToPrevOffer = () => offersSliderRef.current?.slickPrev();
  const goToNextFeature = () => featuresSliderRef.current?.slickNext();
  const goToPrevFeature = () => featuresSliderRef.current?.slickPrev();

  // Correct the type for sliderRef to accept RefObject<Slider | null>
  const renderSection = (
      title: string,
      data: (OfferItem | FeatureItem)[],
      settings: Settings,
      sliderRef: React.RefObject<Slider | null>, // Updated type here
      prevHandler: () => void,
      nextHandler: () => void,
      isOfferSection: boolean = false
  ) => {
      const showArrows = data.length > (settings.slidesToShow ?? 0);

      return (
          <div>
              <div className='flex justify-between items-center mb-6 max-w-6xl mx-auto px-2'>
                  <h2 className='text-2xl mt-5 font-semibold text-gray-800'>{title}</h2>
                  {showArrows && (
                      <div className="flex gap-2 mt-5">
                          <button aria-label={`Previous ${title}`} onClick={prevHandler} className="p-1.5 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"> <ChevronLeft className="w-5 h-5" /> </button>
                          <button aria-label={`Next ${title}`} onClick={nextHandler} className="p-1.5 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"> <ChevronRight className="w-5 h-5" /> </button>
                      </div>
                  )}
              </div>
              <div className='max-w-6xl mx-auto'>
                  {/* Passing RefObject<Slider | null> to ref prop is acceptable */}
                  <Slider ref={sliderRef} {...settings}>
                      {data.map((item) => (
                          <div key={item.id} className='px-2 outline-none focus:outline-none h-full'>
                              <div className='relative bg-white rounded-lg p-4 shadow-sm flex items-center gap-4 overflow-hidden h-full min-h-[100px]'>
                                  <div className={`flex-shrink-0 p-3 rounded-full ${item.bgColorClass || 'bg-orange-50'}`}>
                                    <item.icon className={`w-6 h-6 ${item.iconColorClass || 'text-orange-400'}`} strokeWidth={1.5} />
                                  </div>
                                  <div className="flex-grow">
                                      <h3 className='font-semibold text-gray-900 text-sm leading-snug'> {item.title} </h3>
                                      <p className='text-gray-600 text-xs mt-1'> {item.description} </p>
                                  </div>
                                  {isOfferSection && ( <span className="absolute top-2 right-3 text-[10px] text-gray-400">*T&C apply</span> )}
                              </div>
                          </div>
                      ))}
                  </Slider>
              </div>
          </div>
      );
  };

  return (
    <div className='w-full mt-6 rounded-2xl h-fit py-12 px-4 md:px-8 bg-[#F1EFEC]'>
        {renderSection('Offers', offersData, offersSettings, offersSliderRef, goToPrevOffer, goToNextOffer, true)}
        {renderSection('Why PrimeDrive?', featuresData, featuresSettings, featuresSliderRef, goToPrevFeature, goToNextFeature, false)}
    </div>
  );
};

export default OffersAndFeatures;