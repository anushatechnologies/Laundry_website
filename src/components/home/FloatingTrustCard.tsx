'use client';

import React from 'react';
import { CheckCircle2, Sparkles, PackageCheck, Clock } from 'lucide-react';

export const FloatingTrustCards: React.FC = () => {
  return (
    <>
      {/* Card 1: Top-Left Floating Glass Card */}
      <div className="absolute top-4 left-2 sm:top-8 sm:left-4 z-20 glass-card rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 animate-float-slow transition-all duration-300 hover:scale-105 pointer-events-none select-none max-w-[200px] sm:max-w-[220px]">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold shrink-0 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#241A21] flex items-center gap-1">
            <span>Pickup Confirmed</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
          </div>
          <div className="text-[11px] font-medium text-[#6F626A] flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-[#16A34A]" />
            <span>Today • 10:00 AM</span>
          </div>
        </div>
      </div>

      {/* Card 2: Middle-Right Floating Glass Card */}
      <div className="absolute top-1/3 -right-2 sm:right-2 z-20 glass-card rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 animate-float-delayed transition-all duration-300 hover:scale-105 pointer-events-none select-none max-w-[190px] sm:max-w-[210px]">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md">
          🧺
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#241A21]">8 Items Cleaned</div>
          <div className="text-[11px] font-semibold text-[#15803D] flex items-center gap-1 mt-0.5">
            <Sparkles className="w-3 h-3 text-[#16A34A]" />
            <span>Quality Checked</span>
          </div>
        </div>
      </div>

      {/* Card 3: Bottom-Left Floating Glass Card */}
      <div className="absolute bottom-6 left-4 sm:left-8 z-20 glass-card rounded-2xl p-3 sm:p-3.5 flex items-center gap-3 animate-float-reverse transition-all duration-300 hover:scale-105 pointer-events-none select-none max-w-[190px] sm:max-w-[210px]">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-[#15803D] flex items-center justify-center font-bold shrink-0 shadow-2xs">
          <PackageCheck className="w-5 h-5 text-[#15803D]" />
        </div>
        <div>
          <div className="text-xs font-extrabold text-[#241A21] flex items-center gap-1">
            <span>Delivered</span>
            <span className="text-[10px] bg-[#DCFCE7] text-[#15803D] font-bold px-1.5 py-0.2 rounded-full">✓</span>
          </div>
          <div className="text-[11px] font-medium text-[#6F626A] mt-0.5">Fresh & Ready</div>
        </div>
      </div>
    </>
  );
};
