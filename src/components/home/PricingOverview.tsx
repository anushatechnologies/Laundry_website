'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Check } from 'lucide-react';

export const PricingOverview: React.FC = () => {
  const tiers = [
    {
      name: 'Wash & Fold',
      tag: 'DAILY ESSENTIALS',
      price: '₹80/kg',
      sub: 'Zero sorting effort',
      features: ['Ozone sanitization included', 'Neatly folded & vacuum packed', 'Free pickup & delivery above ₹499'],
      isPopular: false,
    },
    {
      name: 'Wash & Steam Iron',
      tag: 'MOST POPULAR',
      price: '₹120/kg',
      sub: 'Office & daily shirts',
      features: ['Italian steam press finish', 'Hanger or crisp box pack', 'Stain check & delicate care'],
      isPopular: true,
    },
    {
      name: 'Premium Dry Cleaning',
      tag: 'COUTURE & SILKS',
      price: '₹150/item',
      sub: 'Suits, sarees & silks',
      features: ['Gentle organic solvent cleaning', 'Fabric master hand-pressing', 'Moth-proof protective cover'],
      isPopular: false,
    },
  ];

  return (
    <section className="py-18 sm:py-24 bg-[#FCF9F7] border-t border-[#E8DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header with Right CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F]">
              <Sparkles className="w-3 h-3 text-[#D6B36A]" />
              <span>TRANSPARENT VALUE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#2B1326] font-poppins tracking-tight">
              Simple, Fair &amp; Transparent Pricing
            </h2>
            <p className="text-xs sm:text-sm text-[#6F626A] font-medium">
              No hidden fees, no surge pricing. Pay by weight or garment type.
            </p>
          </div>

          <Link
            href="/pricing"
            className="px-6 py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs rounded-xl shadow-[0_8px_24px_rgba(91,33,79,0.25)] transition-all inline-flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer border border-white/10"
          >
            <span>View Full Rate Card</span>
            <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
          </Link>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-3xl border p-7 transition-all flex flex-col justify-between relative bg-white ${
                t.isPopular
                  ? 'border-[#5B214F] shadow-[0_16px_48px_rgba(43,19,38,0.12)] ring-2 ring-[#5B214F]/15'
                  : 'border-[#E8DDE1] shadow-xs hover:shadow-[0_12px_40px_rgba(43,19,38,0.08)]'
              }`}
            >
              {t.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5B214F] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md border border-[#D6B36A]/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D6B36A]" />
                  <span>MOST POPULAR</span>
                </span>
              )}

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-[#B76E79] bg-[#F7F0F2] px-2.5 py-0.5 rounded-full border border-[#E8DDE1] uppercase tracking-wider">
                    {t.tag}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-xl text-[#2B1326] font-poppins">
                    {t.name}
                  </h3>
                  <p className="text-xs text-[#6F626A] mt-0.5 font-medium">{t.sub}</p>
                </div>

                <div className="pt-2 border-t border-[#EEE5E8]">
                  <div className="text-[11px] text-[#9A8D94] font-bold">Starting from</div>
                  <div className="text-3xl font-black text-[#5B214F] font-poppins mt-0.5">
                    {t.price}
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-[#EEE5E8]">
                  {t.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-[#2B1326]">
                      <Check className="w-3.5 h-3.5 text-[#3F8F6B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/book"
                  className={`w-full py-3.5 rounded-xl font-extrabold text-xs text-center flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    t.isPopular
                      ? 'bg-[#5B214F] hover:bg-[#48193F] text-white shadow-[0_8px_24px_rgba(91,33,79,0.25)]'
                      : 'bg-[#F7F0F2] hover:bg-[#E8DDE1] text-[#2B1326]'
                  }`}
                >
                  <span>Book This Service</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
