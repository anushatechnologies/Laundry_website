'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, ShieldCheck, Clock, Sparkles } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 lg:py-28"
      style={{
        background: 'linear-gradient(135deg, #2B1326 0%, #3F1436 35%, #5B214F 70%, #7A356B 100%)',
      }}
    >
      {/* Decorative dots pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      {/* Champagne Studio Glow Radiance */}
      <div className="absolute -left-20 -top-20 w-96 h-96 bg-[#D6B36A]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#B76E79]/20 rounded-full blur-3xl pointer-events-none" />

      <div className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#D6B36A] text-[11px] font-extrabold uppercase tracking-widest backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>FIRST ORDER ₹100 OFF — CODE: WELCOME100</span>
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] max-w-4xl mx-auto font-poppins">
          Stop Spending Your Weekends{' '}
          <span className="text-[#D6B36A]">
            Doing Laundry.
          </span>
        </h2>

        <p className="text-base sm:text-lg text-[#E8DDE1] max-w-xl mx-auto leading-relaxed font-medium">
          Let our fabric masters handle the washing, steaming, and folding while you reclaim your free time.
        </p>

        {/* Trust Signals */}
        <div className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-[#E8DDE1]">
          {[
            { icon: <ShieldCheck className="w-4 h-4 text-[#D6B36A]" />, text: 'Free Doorstep Pickup & Delivery' },
            { icon: <Clock className="w-4 h-4 text-[#D6B36A]" />, text: 'Guaranteed 24-hr Turnaround' },
            { icon: <Star className="w-4 h-4 text-[#D6B36A] fill-[#D6B36A]" />, text: '4.9★ Rated Service' },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-2 font-bold">
              {t.icon}
              <span>{t.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/book"
            className="group w-full sm:w-auto px-10 py-4 bg-white hover:bg-[#FCF9F7] text-[#5B214F] font-black text-base rounded-2xl shadow-2xl transition-all duration-200 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
          >
            <span>Book Free Pickup Now</span>
            <ArrowRight className="w-5 h-5 text-[#5B214F] transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-base rounded-2xl backdrop-blur-sm transition-all duration-200 flex items-center justify-center active:scale-95 cursor-pointer"
          >
            Talk to Our Atelier
          </Link>
        </div>

        {/* Fine Print */}
        <p className="text-[#9A8D94] text-xs pt-2 font-medium">
          Zero commitment • Pause or cancel passes anytime • Serving prime hubs across Hyderabad
        </p>
      </div>
    </section>
  );
};
