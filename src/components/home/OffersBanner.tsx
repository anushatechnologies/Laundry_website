'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Check, Copy } from 'lucide-react';

export const OffersBanner: React.FC = () => {
  const { applyCouponCode, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('WELCOME100');
    setCopied(true);
    applyCouponCode('WELCOME100');
    showToast('Code WELCOME100 applied to your cart!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-12 bg-white border-b border-[#E8DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-[#DCFCE7] via-[#E6F4EA] to-[#DCFCE7] rounded-3xl p-6 sm:p-10 border border-[#A7F3D0] shadow-sm overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Background confetti overlay */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Left Content */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 max-w-xl">
            {/* Welcome OFFER Starburst Badge */}
            <div className="shrink-0 bg-white/90 border border-emerald-300 rounded-2xl p-3 shadow-sm text-center transform -rotate-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 block">WELCOME</span>
              <span className="text-sm font-black text-[#16A34A] block -mt-0.5">OFFER</span>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#241A21] font-poppins leading-tight">
                Flat <span className="text-[#16A34A]">₹100 OFF</span> on Your First Order!
              </h3>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs text-[#6F626A] font-medium">Use code:</span>
                <button
                  onClick={handleCopy}
                  className="bg-white px-3 py-1 rounded-lg border border-[#A7F3D0] font-mono text-xs font-black text-[#047857] shadow-2xs hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>WELCOME100</span>
                  {copied ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3 text-[#6F626A]" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section: CTA & Gift Box Graphic */}
          <div className="relative z-10 flex items-center gap-6">
            <Link
              href="/book"
              className="px-6 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer active:scale-95 shrink-0"
            >
              <span>Book Now & Save</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* 3D Gift Box Image */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 hidden sm:block">
              <Image
                src="/images/promo_gift_box.jpg"
                alt="Welcome Offer Gift Box"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default OffersBanner;
