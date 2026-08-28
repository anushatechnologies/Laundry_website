'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Leaf, Clock, Truck, Star, Zap, Award, Users, Sparkles, Check } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const bullets = [
    { icon: <ShieldCheck className="w-4 h-4 text-[#D6B36A]" />, text: 'Ozone Sanitized Fabric Care (99.9% Sterile)' },
    { icon: <Truck className="w-4 h-4 text-[#D6B36A]" />, text: 'Free Doorstep Pickup & Delivery at Your Slot' },
    { icon: <Leaf className="w-4 h-4 text-[#D6B36A]" />, text: 'Zero Harsh Chemicals & Eco-Certified Detergents' },
    { icon: <Clock className="w-4 h-4 text-[#D6B36A]" />, text: 'Guaranteed 24-Hr Express Turnaround' },
    { icon: <Award className="w-4 h-4 text-[#D6B36A]" />, text: '8-Step Quality Audit & Button Inspection' },
    { icon: <Zap className="w-4 h-4 text-[#D6B36A]" />, text: 'Live GPS Tracking & Instant Rider Updates' },
  ];

  const stats = [
    { icon: <Users className="w-5 h-5 text-[#D6B36A]" />, value: '15,000+', label: 'Happy Households' },
    { icon: <Award className="w-5 h-5 text-[#D6B36A]" />, value: '100,000+', label: 'Clothes Preserved' },
    { icon: <Clock className="w-5 h-5 text-[#3F8F6B]" />, value: '99.4%', label: 'On-Time Dispatch' },
    { icon: <Star className="w-5 h-5 text-[#D6B36A] fill-[#D6B36A]" />, value: '4.9★', label: 'Customer Rating' },
  ];

  return (
    <section
      ref={ref}
      className="py-20 lg:py-28 overflow-hidden bg-[#2B1326] text-white border-y border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* LEFT: Luxury Atelier Card */}
          <div className={`relative transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3.5] border border-white/15 p-8 flex flex-col justify-between shadow-2xl"
              style={{ background: 'linear-gradient(145deg, #3F1436 0%, #5B214F 60%, #7A356B 100%)' }}
            >
              {/* Studio Glow Radiance */}
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-[#D6B36A]/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#B76E79]/30 blur-3xl" />

              {/* Top Row */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-extrabold text-[#D6B36A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The LaundryFresh Standard</span>
                </div>
                <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-extrabold text-white flex items-center gap-1">
                  <Star className="w-3 h-3 text-[#D6B36A] fill-[#D6B36A]" />
                  <span>4.9★ Rated</span>
                </div>
              </div>

              {/* Center 3D Showcase */}
              <div className="relative z-10 text-center space-y-3 py-4">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-xl">
                  <Award className="w-10 h-10 text-[#D6B36A]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-poppins">
                  Couture-Grade Quality Assurance
                </h3>
                <p className="text-xs sm:text-sm text-[#CDBFC6] max-w-sm mx-auto font-medium">
                  Every stitch, button, and fiber is inspected by fabric experts before doorstep packaging.
                </p>
              </div>

              {/* Bottom Badge */}
              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/15">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3F8F6B] animate-pulse" />
                  <span className="text-xs font-bold text-[#E8DDE1]">100% Ozone Disinfected</span>
                </div>
                <span className="text-[11px] font-extrabold text-[#D6B36A] uppercase tracking-wider">
                  Guaranteed Satisfaction
                </span>
              </div>
            </div>

            {/* Subtle Outer Frames */}
            <div className="absolute -inset-3 rounded-3xl border border-white/5 -z-10" />
          </div>

          {/* RIGHT: Content & Trust Metrics */}
          <div className={`space-y-8 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>

            {/* Header */}
            <div className="space-y-3.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#D6B36A] text-[11px] font-extrabold uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>WHY DISCERNING HOMES CHOOSE US</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-[1.1] font-poppins">
                More Than Just Clean. <br />
                <span className="text-[#D6B36A]">Uncompromising Fabric Care.</span>
              </h2>
              <p className="text-[#CDBFC6] text-sm sm:text-base leading-relaxed">
                We combine Italian steam-finishing technology, German organic detergents, and doorstep precision so you never have to worry about laundry again.
              </p>
            </div>

            {/* Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bullets.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 cursor-default"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    {b.icon}
                  </div>
                  <span className="text-[#E8DDE1] text-xs sm:text-sm font-bold leading-tight">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/10">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex justify-center mb-1.5">{s.icon}</div>
                  <div className="text-white font-black text-lg sm:text-xl font-poppins">{s.value}</div>
                  <div className="text-[#9A8D94] text-[10px] font-bold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
