'use client';

import React from 'react';
import { Users, ShoppingBag, Star, Clock } from 'lucide-react';

export const TrustedStats: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Happy Customers',
    },
    {
      icon: ShoppingBag,
      value: '50,000+',
      label: 'Orders Completed',
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'Customer Rating',
    },
    {
      icon: Clock,
      value: '99.9%',
      label: 'On-Time Delivery',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#241A21] tracking-tight font-poppins">
          Trusted by Thousands
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#6F626A] font-medium">
          We are proud to be the most trusted laundry & dry cleaning service.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8FAF9] rounded-2xl border border-[#E8DDE1] p-6 flex flex-col items-center justify-center text-center shadow-2xs hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#241A21] font-poppins">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#6F626A] mt-1">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
