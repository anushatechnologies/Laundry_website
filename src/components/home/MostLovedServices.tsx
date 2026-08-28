'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, Shirt, Wind, Layers, Footprints, BedDouble } from 'lucide-react';

export const MostLovedServices: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -300 : 300;
      carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const services = [
    {
      title: 'Wash & Fold',
      price: 'From ₹80 / KG',
      icon: <Layers className="w-5 h-5 text-[#5B214F]" />,
      iconBg: 'bg-[#F7F0F2]',
      link: '/pricing',
    },
    {
      title: 'Wash & Iron',
      price: 'From ₹120',
      icon: <Shirt className="w-5 h-5 text-[#5B214F]" />,
      iconBg: 'bg-[#F7F0F2]',
      link: '/services?cat=MENS',
    },
    {
      title: 'Dry Cleaning',
      price: 'From ₹150',
      icon: <Sparkles className="w-5 h-5 text-[#5B214F]" />,
      iconBg: 'bg-[#F7F0F2]',
      link: '/services?cat=PREMIUM_BRIDAL',
    },
    {
      title: 'Steam Pressing',
      price: 'From ₹60',
      icon: <Wind className="w-5 h-5 text-[#5B214F]" />,
      iconBg: 'bg-[#F7F0F2]',
      link: '/services?cat=MENS',
    },
    {
      title: 'Shoe Spa',
      price: 'From ₹150',
      icon: <Footprints className="w-5 h-5 text-[#5B214F]" />,
      iconBg: 'bg-[#F7F0F2]',
      link: '/services?cat=SPECIAL_CLEANING',
    },
    {
      title: 'Home Textiles',
      price: 'From ₹100',
      icon: <BedDouble className="w-5 h-5 text-[#5B214F]" />,
      iconBg: 'bg-[#F7F0F2]',
      link: '/services?cat=HOME_TEXTILES',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-[#FCF9F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F]">
            <Sparkles className="w-3 h-3 text-[#D6B36A]" />
            <span>CURATED SERVICE MENU</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2B1326] font-poppins">
            Premium Laundry &amp; Dry Cleaning Services
          </h2>
          <p className="text-xs sm:text-sm text-[#6F626A] font-medium max-w-xl mx-auto">
            Choose specialized care designed for everyday essentials, formal wear, and delicate textiles.
          </p>
        </div>

        {/* Carousel Container with Arrows */}
        <div className="relative">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#E8DDE1] shadow-md items-center justify-center text-[#2B1326] hover:text-[#5B214F] hover:border-[#5B214F] hover:scale-105 transition-all cursor-pointer"
            aria-label="Previous Services"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* 6 Horizontal Cards Grid / Scrollable */}
          <div
            ref={carouselRef}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 overflow-x-auto no-scrollbar pb-2"
          >
            {services.map((srv) => (
              <Link
                key={srv.title}
                href={srv.link}
                className="bg-white rounded-3xl p-5 border border-[#E8DDE1] shadow-xs hover:shadow-[0_12px_40px_rgba(43,19,38,0.08)] hover:border-[#B76E79] hover:-translate-y-1 transition-all flex flex-col items-center text-center gap-3 group cursor-pointer"
              >
                <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ${srv.iconBg} border border-[#E8DDE1] group-hover:scale-110 transition-transform`}>
                  {srv.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-xs sm:text-sm text-[#2B1326] group-hover:text-[#5B214F] transition-colors leading-tight truncate font-poppins">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-[#5B214F] mt-1 font-extrabold whitespace-nowrap">
                    {srv.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#E8DDE1] shadow-md items-center justify-center text-[#2B1326] hover:text-[#5B214F] hover:border-[#5B214F] hover:scale-105 transition-all cursor-pointer"
            aria-label="Next Services"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
};
