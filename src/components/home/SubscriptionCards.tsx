'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Check,
  Sparkles,
  ArrowRight,
  Crown,
  Truck,
  RotateCcw,
  Zap,
  ShieldCheck,
  Award,
} from 'lucide-react';

export const SubscriptionCards: React.FC = () => {
  const { subscriptionPlans } = useApp();

  const plans = subscriptionPlans && subscriptionPlans.length > 0
    ? subscriptionPlans
    : [
        {
          id: 'sub-basic-1m',
          name: 'Basic Care Pass',
          slug: 'basic-1m',
          durationMonths: 1,
          price: 999,
          originalPrice: 1299,
          validityDays: 30,
          includedKg: 20,
          features: [
            '20 KG Wash & Fold / Steam Iron',
            'Unlimited Free Doorstep Pickups',
            '24–36 Hour Standard Turnaround',
            'Rollover unused KG (up to 5 KG)',
            'Organic eco-safe detergents',
          ],
          popular: false,
        },
        {
          id: 'sub-premium-1m',
          name: 'Privilege Member Pass',
          slug: 'premium-1m',
          durationMonths: 1,
          price: 1999,
          originalPrice: 2499,
          validityDays: 30,
          includedKg: 50,
          features: [
            '50 KG Wash & Fold / Steam Iron',
            'Priority VIP Doorstep Dispatch',
            'Fast 24-Hour Express Turnaround',
            'Rollover unused KG (up to 15 KG)',
            '1 Free Silk / Blazer Dry Clean voucher',
          ],
          popular: true,
        },
        {
          id: 'sub-family-3m',
          name: 'Quarterly Family Saver',
          slug: 'family-3m',
          durationMonths: 3,
          price: 4999,
          originalPrice: 6999,
          validityDays: 90,
          includedKg: 150,
          features: [
            '150 KG Total (50 KG/Month)',
            'Save ₹2,000 upfront on quarterly pass',
            'VIP Priority Slots & 12h Fast Turnaround',
            '3 Free Dry Clean vouchers included',
            'Multi-member family profile sharing',
          ],
          popular: false,
        },
        {
          id: 'sub-annual-12m',
          name: 'Annual Royale Care',
          slug: 'annual-12m',
          durationMonths: 12,
          price: 14999,
          originalPrice: 23999,
          validityDays: 365,
          includedKg: 600,
          features: [
            '600 KG Annual Fabric Care Allowance',
            'Personal Atelier Account Manager',
            'Unlimited Dry Clean vouchers (12/yr)',
            'Zero rollover expiry within 12 months',
            'Complimentary Shoe & Leather Spa',
          ],
          popular: false,
        },
      ];

  return (
    <section className="py-20 lg:py-28 bg-[#FCF9F7] border-t border-[#E8DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[11px] font-extrabold uppercase tracking-widest text-[#5B214F] mx-auto">
            <Crown className="w-3.5 h-3.5 text-[#D6B36A]" />
            <span>LAUNDRYFRESH MONTHLY PASSES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2B1326] tracking-tight font-poppins">
            Save Up to 40% with Monthly Laundry Passes
          </h2>
          <p className="text-sm sm:text-base text-[#6F626A] max-w-xl mx-auto font-medium">
            Prepaid weight allowances, free unlimited pickups, rollover balance, and priority turnaround.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            const effectivePerKg = Math.round(plan.price / plan.includedKg);
            const savingsPercent = plan.originalPrice
              ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
              : 25;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-200 relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-[#2B1326] via-[#3F1436] to-[#2B1326] text-white shadow-[0_20px_50px_rgba(43,19,38,0.18)] ring-2 ring-[#D6B36A] scale-[1.03]'
                    : 'bg-white text-[#2B1326] border border-[#E8DDE1] shadow-xs hover:shadow-[0_12px_40px_rgba(43,19,38,0.08)]'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5B214F] text-[#D6B36A] text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md border border-[#D6B36A]/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#D6B36A]" />
                    <span>RECOMMENDED</span>
                  </span>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className={`font-black text-lg font-poppins ${plan.popular ? 'text-white' : 'text-[#2B1326]'}`}>
                      {plan.name}
                    </h3>
                    {savingsPercent > 0 && (
                      <span className="bg-[#3F8F6B]/20 border border-[#3F8F6B]/40 text-[#3F8F6B] font-extrabold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                        {savingsPercent}% OFF
                      </span>
                    )}
                  </div>

                  <div className="my-3">
                    <span className={`inline-block px-3 py-1 rounded-xl text-xs font-extrabold ${
                      plan.popular ? 'bg-white/10 text-[#D6B36A] border border-white/15' : 'bg-[#F7F0F2] text-[#5B214F] border border-[#E8DDE1]'
                    }`}>
                      {plan.includedKg} KG (₹{effectivePerKg}/KG)
                    </span>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-black font-poppins ${plan.popular ? 'text-white' : 'text-[#2B1326]'}`}>
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-xs line-through text-[#9A8D94]">
                          ₹{plan.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-medium ${plan.popular ? 'text-[#CDBFC6]' : 'text-[#6F626A]'}`}>
                      / {plan.durationMonths || 1} Month{(plan.durationMonths || 1) > 1 ? 's' : ''} Validity
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-6 text-xs font-bold">
                    {plan.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.popular ? 'text-[#D6B36A]' : 'text-[#3F8F6B]'}`} />
                        <span className={plan.popular ? 'text-[#E8DDE1]' : 'text-[#6F626A]'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href="/subscriptions"
                    className={`w-full py-3.5 rounded-xl font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                      plan.popular
                        ? 'bg-[#5B214F] hover:bg-[#48193F] text-white border border-[#D6B36A]/40'
                        : 'bg-[#5B214F] hover:bg-[#48193F] text-white'
                    }`}
                  >
                    <span>Subscribe to Pass</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D6B36A]" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E8DDE1] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F0F2] flex items-center justify-center text-[#5B214F] shrink-0 border border-[#E8DDE1]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B1326]">Free Pickups</div>
              <div className="text-[10px] text-[#6F626A] font-medium">Unlimited ₹0 doorstep visits</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8DDE1] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F0F2] flex items-center justify-center text-[#5B214F] shrink-0 border border-[#E8DDE1]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B1326]">KG Rollover</div>
              <div className="text-[10px] text-[#6F626A] font-medium">Unused weight carries forward</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8DDE1] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F0F2] flex items-center justify-center text-[#5B214F] shrink-0 border border-[#E8DDE1]">
              <Zap className="w-5 h-5 text-[#D6B36A]" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B1326]">Priority Turnaround</div>
              <div className="text-[10px] text-[#6F626A] font-medium">Guaranteed 24h VIP queue</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8DDE1] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F0F2] flex items-center justify-center text-[#5B214F] shrink-0 border border-[#E8DDE1]">
              <ShieldCheck className="w-5 h-5 text-[#3F8F6B]" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B1326]">Zero Lock-In</div>
              <div className="text-[10px] text-[#6F626A] font-medium">Pause or cancel anytime</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SubscriptionCards;
