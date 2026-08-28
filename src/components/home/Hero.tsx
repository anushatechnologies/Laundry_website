'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Check, Star, Truck, Clock, ShieldCheck, Leaf, Zap, Award, Shirt, Package, Droplets } from 'lucide-react';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

export const Hero: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const orders = useCountUp(15000, 2200, visible);
  const rating = 4.9;
  const cities = useCountUp(12, 1800, visible);
  const saved = useCountUp(98, 2000, visible);

  const trustBadges = [
    { icon: <Truck className="w-4 h-4 text-[#5B214F]" />, label: 'Doorstep Pickup', sub: 'At your chosen slot' },
    { icon: <ShieldCheck className="w-4 h-4 text-[#5B214F]" />, label: 'Professional Cleaning', sub: 'Ozone sanitized 99.9%' },
    { icon: <Award className="w-4 h-4 text-[#5B214F]" />, label: 'Quality Checked', sub: '8-step fabric inspect' },
    { icon: <Clock className="w-4 h-4 text-[#5B214F]" />, label: 'On-Time Delivery', sub: '24-hr standard turnaround' },
  ];

  const floatingCards = [
    {
      icon: <Truck className="w-4 h-4 text-[#5B214F]" />,
      bg: 'bg-[#F7F0F2]',
      title: 'Pickup Scheduled',
      sub: 'Today, 3 – 5 PM slot confirmed',
      pos: 'top-6 -left-3 sm:-left-6',
      delay: 'delay-200',
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-[#3F8F6B]" />,
      bg: 'bg-emerald-50',
      title: '8-Step Quality Checked',
      sub: 'Inspected & sterile sealed',
      pos: 'top-40 -right-2 sm:-right-6',
      delay: 'delay-400',
    },
    {
      icon: <Zap className="w-4 h-4 text-[#D6B36A]" />,
      bg: 'bg-amber-50',
      title: 'Out for Delivery',
      sub: 'Arriving in 20 minutes',
      pos: 'bottom-8 left-4',
      delay: 'delay-600',
    },
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-22"
      style={{
        background:
          'radial-gradient(ellipse 70% 50% at 15% 10%, rgba(91,33,79,0.06) 0%, transparent 60%), radial-gradient(ellipse 55% 40% at 85% 20%, rgba(183,110,121,0.08) 0%, transparent 55%), #FCF9F7',
      }}
    >
      {/* Warm Ambient Blobs */}
      <div className="pointer-events-none absolute right-[10%] top-12 h-96 w-96 rounded-full bg-[#F3C7B8]/20 blur-3xl" />
      <div className="pointer-events-none absolute left-[5%] top-32 h-80 w-80 rounded-full bg-[#F7F0F2] blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ── LEFT COLUMN: HEADLINE & TRUST ── */}
          <div
            className={`lg:col-span-6 space-y-6 text-left transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Section Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[11px] font-extrabold uppercase tracking-widest text-[#5B214F]">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
              <span>PREMIUM DOORSTEP LAUNDRY &amp; DRY CLEANING</span>
            </div>

            {/* Emotional Main Heading */}
            <h1 className="font-poppins text-4xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-[#2B1326] leading-[1.05]">
              Your Clothes Deserve <br />
              <span className="text-[#5B214F]">Better Care.</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#6F626A] font-medium leading-relaxed max-w-xl">
              Professional laundry, dry cleaning and ironing, picked up from your doorstep and returned fresh.
            </p>

            {/* Micro Feature Checkmarks */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[
                'Free Doorstep Pickup & Delivery',
                'Ozone Sanitized (99.9% Germ-Free)',
                '24-Hour Express Turnaround',
                'Certified Fabric Master Care',
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2B1326]">
                  <span className="w-4 h-4 rounded-full bg-[#5B214F] text-white flex items-center justify-center text-[10px] shrink-0 font-extrabold shadow-xs">
                    ✓
                  </span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/book"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-sm rounded-2xl shadow-[0_8px_30px_rgba(91,33,79,0.25)] transition-all duration-200 active:scale-95 hover:shadow-[0_12px_36px_rgba(91,33,79,0.35)]"
              >
                <span>Book Free Pickup</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-[#F7F0F2] text-[#5B214F] border-2 border-[#E8DDE1] hover:border-[#5B214F] font-extrabold text-sm rounded-2xl transition-all duration-200 active:scale-95 shadow-xs"
              >
                View Full Pricing
              </Link>
            </div>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
              {trustBadges.map((b, i) => (
                <div
                  key={i}
                  className="p-3 bg-white rounded-2xl border border-[#E8DDE1] shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2.5"
                >
                  <span className="shrink-0 p-2 bg-[#F7F0F2] rounded-xl">{b.icon}</span>
                  <div className="min-w-0">
                    <div className="text-[11px] font-extrabold text-[#2B1326] leading-tight truncate">{b.label}</div>
                    <div className="text-[9px] text-[#6F626A] mt-0.5 truncate">{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN: LUXURY 3D LAUNDRY SCENE ── */}
          <div
            className={`lg:col-span-6 relative flex items-center justify-center transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative w-full max-w-[560px]">

              {/* Main Luxury Stage Card */}
              <div
                className="relative aspect-[4/3.3] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(43,19,38,0.12)] border border-[#E8DDE1] flex flex-col justify-between"
                style={{
                  background: 'linear-gradient(145deg, #2B1326 0%, #3F1436 50%, #5B214F 85%, #7A356B 100%)',
                }}
              >
                {/* Champagne Studio Glow Radiance */}
                <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#D6B36A]/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#B76E79]/20 blur-3xl pointer-events-none" />

                {/* 3D Composition Elements */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 space-y-4">
                  {/* Modern Front-Load Washing Machine Visual with Rotating Drum */}
                  <div className="relative w-44 h-44 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/25 shadow-2xl flex items-center justify-center animate-parallax">
                    {/* Top Machine Console */}
                    <div className="absolute top-2.5 inset-x-3 flex items-center justify-between px-1">
                      <div className="w-3 h-1.5 rounded-full bg-[#D6B36A]" />
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                      </div>
                    </div>

                    {/* Outer Drum Rim */}
                    <div className="w-32 h-32 rounded-full border-4 border-white/40 flex items-center justify-center shadow-inner relative overflow-hidden bg-black/20">
                      {/* Rotating Glass Reflection Drum */}
                      <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#D6B36A]/60 animate-drum flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5B214F] to-[#B76E79] opacity-80 flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-white/90" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Folded Fresh Towels & Fabric Movement */}
                  <div className="flex items-center gap-3 animate-float">
                    <div className="px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <Shirt className="w-3.5 h-3.5 text-[#D6B36A]" />
                      <span>Pure Egyptian Cotton Care</span>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
                      <span>Ozone Purified</span>
                    </div>
                  </div>
                </div>

                {/* Studio Bottom Bar */}
                <div className="relative z-10 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent border-t border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-white font-extrabold text-base leading-tight font-poppins">LaundryFresh Atelier</p>
                    <p className="text-[#CDBFC6] text-[11px]">Luxury Fabric &amp; Couture Preservation</p>
                  </div>
                  <div className="flex items-center gap-1 bg-white/15 backdrop-blur-md border border-[#D6B36A]/40 px-3 py-1 rounded-full text-white text-xs font-black shadow-sm">
                    <Star className="w-3.5 h-3.5 text-[#D6B36A] fill-[#D6B36A]" />
                    <span>4.9 / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Floating Order Status Cards */}
              {floatingCards.map((card, i) => (
                <div
                  key={i}
                  className={`absolute ${card.pos} flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-[0_12px_40px_rgba(43,19,38,0.12)] border border-[#E8DDE1] animate-fade-up ${card.delay} max-w-[230px] z-20`}
                >
                  <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center shrink-0`}>
                    {card.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-[#2B1326] leading-tight truncate">{card.title}</div>
                    <div className="text-[10px] text-[#6F626A] mt-0.5 truncate font-medium">{card.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div
          className={`mt-14 lg:mt-18 transition-all duration-700 delay-500 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: `${orders.toLocaleString()}+`, label: 'Garments Cleaned', icon: <Package className="w-5 h-5" />, color: 'text-[#5B214F] bg-[#F7F0F2]' },
              { value: `${rating}★`, label: 'Customer Satisfaction', icon: <Star className="w-5 h-5" />, color: 'text-[#C58A3A] bg-amber-50' },
              { value: `${cities}+`, label: 'Delivery Hubs Active', icon: <Truck className="w-5 h-5" />, color: 'text-[#3F8F6B] bg-emerald-50' },
              { value: `${saved}%`, label: 'On-Time Doorstep Delivery', icon: <Award className="w-5 h-5" />, color: 'text-[#B76E79] bg-[#F7F0F2]' },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl border border-[#E8DDE1] shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 p-5 flex items-center gap-4"
              >
                <div className={`w-11 h-11 rounded-2xl ${stat.color} flex items-center justify-center shrink-0`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-black text-[#2B1326] leading-tight tabular-nums font-poppins">{stat.value}</div>
                  <div className="text-xs text-[#6F626A] font-bold mt-0.5">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
