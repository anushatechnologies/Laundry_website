'use client';

import React from 'react';
import { ShieldCheck, Zap, Scale, Award } from 'lucide-react';

export const FeatureHighlights: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Ozone Sanitized',
      subtitle: '99.9% germ free cleaning',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-[#16A34A]',
    },
    {
      icon: Zap,
      title: 'Express 24-Hr',
      subtitle: 'Super fast delivery',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Scale,
      title: 'Per-KG Fair Weigh',
      subtitle: 'Transparent & accurate',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-[#16A34A]',
    },
    {
      icon: Award,
      title: 'Fabric Guarantee',
      subtitle: '100% fabric safe',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
  ];

  return (
    <section className="py-6 bg-white border-y border-[#E8DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#E8DDE1] p-4 flex items-center gap-3.5 shadow-2xs hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-full ${f.bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${f.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-[#241A21] leading-tight">
                    {f.title}
                  </h4>
                  <p className="text-[11px] text-[#6F626A] font-medium mt-0.5">
                    {f.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
