'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Sparkles,
  ChevronDown,
  Zap,
  Shirt,
} from 'lucide-react';

export const SchedulePickupForm: React.FC = () => {
  const router = useRouter();
  const { userPincode, currentZone } = useApp();

  const [locationInput, setLocationInput] = useState(
    currentZone ? `${currentZone.pincode}, ${currentZone.areaName}` : `${userPincode || '500072'}, Hyderabad`
  );
  const [selectedService, setSelectedService] = useState('wash-fold');
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('08:00 AM - 10:00 AM');

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/book?service=${selectedService}&date=${pickupDate}&slot=${encodeURIComponent(pickupTime)}`);
  };

  return (
    <section className="relative -mt-10 sm:-mt-14 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDE1] shadow-[0_16px_48px_rgba(43,19,38,0.08)] space-y-6">
        
        {/* Title & Subtitle */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F] mb-1.5 border border-[#E8DDE1]">
            <Sparkles className="w-3 h-3 text-[#D6B36A]" />
            <span>Instant Doorstep Dispatch</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2B1326] font-poppins">
            Schedule Your Laundry Pickup
          </h2>
          <p className="text-xs text-[#6F626A] mt-1 font-medium">
            Professional door-to-door fabric care in less than 30 seconds
          </p>
        </div>

        {/* 4 Form Fields + Submit Button */}
        <form onSubmit={handleScheduleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end">
          
          {/* 1. Pickup Location */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="block text-[11px] font-extrabold text-[#2B1326] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Pickup Location</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="500072, Hyderabad"
                className="w-full px-3.5 py-3 bg-[#F7F0F2] border border-[#E8DDE1] rounded-xl text-xs font-bold text-[#2B1326] focus:outline-none focus:border-[#5B214F] focus:bg-white transition-all pr-8"
              />
              <ChevronDown className="w-4 h-4 text-[#9A8D94] absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* 2. Select Service */}
          <div className="lg:col-span-3 space-y-1.5">
            <label className="block text-[11px] font-extrabold text-[#2B1326] flex items-center gap-1">
              <Shirt className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Select Service</span>
            </label>
            <div className="relative">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#F7F0F2] border border-[#E8DDE1] rounded-xl text-xs font-bold text-[#2B1326] focus:outline-none focus:border-[#5B214F] focus:bg-white transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="wash-fold">Wash &amp; Fold (Per-KG)</option>
                <option value="wash-iron">Wash &amp; Steam Iron</option>
                <option value="dry-clean">Premium Dry Cleaning</option>
                <option value="steam-iron">Steam Pressing Only</option>
                <option value="shoes">Deep Shoe &amp; Leather Spa</option>
                <option value="bedding">Home &amp; Bedding Textiles</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#9A8D94] absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* 3. Pickup Date */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="block text-[11px] font-extrabold text-[#2B1326] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Pickup Date</span>
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-3.5 py-3 bg-[#F7F0F2] border border-[#E8DDE1] rounded-xl text-xs font-bold text-[#2B1326] focus:outline-none focus:border-[#5B214F] focus:bg-white transition-all cursor-pointer"
            />
          </div>

          {/* 4. Preferred Time */}
          <div className="lg:col-span-2 space-y-1.5">
            <label className="block text-[11px] font-extrabold text-[#2B1326] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Preferred Slot</span>
            </label>
            <div className="relative">
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#F7F0F2] border border-[#E8DDE1] rounded-xl text-xs font-bold text-[#2B1326] focus:outline-none focus:border-[#5B214F] focus:bg-white transition-all appearance-none cursor-pointer pr-8"
              >
                <option value="08:00 AM - 10:00 AM">08:00 AM – 10:00 AM</option>
                <option value="10:00 AM - 12:00 PM">10:00 AM – 12:00 PM</option>
                <option value="04:00 PM - 06:00 PM">04:00 PM – 06:00 PM</option>
                <option value="06:00 PM - 08:00 PM">06:00 PM – 08:00 PM</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#9A8D94] absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* 5. Schedule Pickup CTA */}
          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-[0_8px_24px_rgba(91,33,79,0.25)] transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 border border-white/10"
            >
              <span>Schedule</span>
              <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
            </button>
          </div>

        </form>

        {/* Micro-Features Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2 border-t border-[#EEE5E8] text-[11px] font-bold text-[#6F626A]">
          <div className="flex items-center gap-1.5">
            <span className="text-[#D6B36A]">✦</span>
            <span>No Minimum Order Value</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5B214F]" />
            <span>Ozone Sterile Seal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-[#5B214F]" />
            <span>24/7 Dedicated Support</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#D6B36A]" />
            <span>Live Rider GPS Tracking</span>
          </div>
        </div>

      </div>
    </section>
  );
};
