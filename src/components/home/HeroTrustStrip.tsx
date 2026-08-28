'use client';

import React from 'react';
import { Users, ShoppingBag, Star, Truck } from 'lucide-react';

export const HeroTrustStrip: React.FC = () => {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Happy Customers',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: ShoppingBag,
      value: '50,000+',
      label: 'Orders Completed',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Star,
      value: '4.8/5',
      label: 'Customer Rating',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Truck,
      value: 'Doorstep',
      label: 'Pickup & Delivery',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
  ];

  return (
    <div className="relative z-20 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl border border-[#E8DDE1] shadow-soft p-4 sm:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-3.5 ${
                idx > 0 ? 'pt-3 sm:pt-0 sm:pl-4 md:pl-6' : ''
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0 shadow-2xs`}
              >
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <div className="text-base sm:text-lg font-extrabold text-[#241A21] tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-[#6F626A]">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
