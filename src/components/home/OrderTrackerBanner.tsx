'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Truck, Droplets, ShieldCheck, Bike, CheckCircle2 } from 'lucide-react';

export const OrderTrackerBanner: React.FC = () => {
  const router = useRouter();
  const [orderIdInput, setOrderIdInput] = useState('');

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;
    router.push(`/track/${orderIdInput.trim()}`);
  };

  const steps = [
    { label: 'Doorstep Pickup', icon: <Truck className="w-5 h-5 text-[#D6B36A]" /> },
    { label: 'Eco-Wash & Care', icon: <Droplets className="w-5 h-5 text-[#D6B36A]" /> },
    { label: '8-Step Quality QC', icon: <ShieldCheck className="w-5 h-5 text-[#D6B36A]" /> },
    { label: 'Out for Delivery', icon: <Bike className="w-5 h-5 text-[#D6B36A]" /> },
    { label: 'Returned Fresh', icon: <CheckCircle2 className="w-5 h-5 text-[#3F8F6B]" /> },
  ];

  return (
    <section className="py-14 sm:py-18 bg-[#2B1326] text-white border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner Header & Input */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#D6B36A] uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/15">
              <Sparkles className="w-3 h-3 text-[#D6B36A]" />
              <span>LIVE GPS ORDER STATUS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-poppins text-white">
              Where Are Your Garments Right Now?
            </h2>
            <p className="text-xs sm:text-sm text-[#CDBFC6]">
              Enter your tracking or order ID to see real-time atelier progress and rider status.
            </p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-2 max-w-md w-full">
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Enter Order ID (e.g. LF-10245)"
              className="flex-1 px-4 py-3.5 bg-white text-[#2B1326] placeholder-[#9A8D94] text-xs font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D6B36A]"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 cursor-pointer border border-[#D6B36A]/30 active:scale-95"
            >
              <span>Track Order</span>
              <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
            </button>
          </form>
        </div>

        {/* 5 Step Visual Progress Icons */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {steps.map((st, idx) => (
            <div key={st.label} className="flex items-center gap-3">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-13 h-13 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shadow-sm">
                  {st.icon}
                </div>
                <span className="text-[11px] font-bold text-[#E8DDE1]">{st.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden lg:block h-0.5 w-16 bg-white/15 -mt-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
