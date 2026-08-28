'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Bike, Sparkles, Package } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      num: '01',
      title: 'Book Online',
      desc: 'Select your preferred service and choose a convenient 2-hour doorstep pickup window.',
      icon: <Calendar className="w-6 h-6 text-[#5B214F]" />,
      bg: 'bg-[#F7F0F2]',
      tag: '60-Sec Booking',
    },
    {
      num: '02',
      title: 'Doorstep Pickup',
      desc: 'Our trained rider collects your garments in secure, tamper-proof bags at zero extra cost.',
      icon: <Bike className="w-6 h-6 text-[#5B214F]" />,
      bg: 'bg-[#F7F0F2]',
      tag: 'Contactless & Safe',
    },
    {
      num: '03',
      title: 'Master Atelier Care',
      desc: 'Fabric sorting, organic eco-wash, ozone sanitization, and meticulous 8-step quality audit.',
      icon: <Sparkles className="w-6 h-6 text-[#5B214F]" />,
      bg: 'bg-[#F7F0F2]',
      tag: 'Ozone Sanitized',
    },
    {
      num: '04',
      title: 'Crisp Delivery',
      desc: 'Hanger-ready, crisp, fresh clothes delivered back to your home within 24–48 hours.',
      icon: <Package className="w-6 h-6 text-[#5B214F]" />,
      bg: 'bg-[#F7F0F2]',
      tag: 'Guaranteed On-Time',
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-20 lg:py-28 bg-[#FCF9F7] border-y border-[#E8DDE1] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center space-y-4 mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[11px] font-extrabold uppercase tracking-widest text-[#5B214F] mx-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#D6B36A]" />
            <span>SIMPLE &amp; TRANSPARENT PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2B1326] tracking-tight font-poppins">
            Luxury Fabric Care Made <br className="hidden sm:inline" />
            <span className="text-[#5B214F]">Effortlessly Simple.</span>
          </h2>
          <p className="text-base text-[#6F626A] max-w-xl mx-auto leading-relaxed font-medium">
            Four seamless steps to keep your wardrobe spotless, fresh, and pristine without lifting a finger.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">

          {/* Desktop Connector Line */}
          <div className="hidden lg:block absolute top-14 left-[calc(25%-1px)] right-[calc(25%-1px)] h-px z-0">
            <div className="w-full h-px border-t-2 border-dashed border-[#E8DDE1]" />
          </div>

          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`relative group transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: visible ? `${idx * 120}ms` : '0ms' }}
            >
              {/* Card */}
              <div className="bg-white rounded-3xl p-7 border border-[#E8DDE1] shadow-xs hover:shadow-[0_16px_48px_rgba(43,19,38,0.08)] hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center space-y-4 h-full relative z-10">

                {/* Step Number & Tag */}
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-full bg-[#5B214F] text-white text-xs font-black flex items-center justify-center shadow-md">
                    {step.num}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B76E79] bg-[#F7F0F2] px-2.5 py-0.5 rounded-full border border-[#E8DDE1]">
                    {step.tag}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-[#F7F0F2] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 duration-300 border border-[#E8DDE1]">
                  {step.icon}
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-[#2B1326] text-lg leading-tight font-poppins">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#6F626A] leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>

              </div>

              {/* Mobile Connector */}
              {idx < steps.length - 1 && (
                <div className="flex md:hidden justify-center py-2">
                  <div className="w-px h-8 border-l-2 border-dashed border-[#E8DDE1]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-14 transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-[#5B214F] font-extrabold text-sm hover:text-[#48193F] transition-colors group"
          >
            <span>Explore All 15+ Garment Services &amp; Fabrics</span>
            <ArrowRight className="w-4 h-4 text-[#D6B36A] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
