'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { INITIAL_COUPONS, INITIAL_OFFERS } from '@/lib/db';
import { useApp } from '@/context/AppContext';
import { Tag, Sparkles, Copy, Check, ArrowRight, Gift, Percent } from 'lucide-react';
import Link from 'next/link';

export default function OffersPage() {
  const { applyCouponCode, showToast } = useApp();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCouponCode(code);
    showToast(`Coupon ${code} copied & applied to your active bag!`, 'success');
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Coupons & Discounts
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B3B36] tracking-tight font-poppins mt-2">
            Active Laundry Deals & Promo Codes
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Click "Copy & Apply" to apply any discount code directly to your booking at checkout.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
          {INITIAL_COUPONS.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-2xl p-6 border border-gray-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-[#0F766E]" />

              <div className="pl-2">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                    {coupon.discountType === 'FLAT'
                      ? `FLAT ₹${coupon.discountValue} OFF`
                      : `${coupon.discountValue}% OFF`}
                  </span>
                  {coupon.firstOrderOnly && (
                    <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded-full border border-teal-100">
                      1st Order Only
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base text-[#0B3B36] mb-1.5">{coupon.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">{coupon.description}</p>

                <div className="text-[11px] text-gray-400 space-y-1 mb-4">
                  <div>Min. order value: ₹{coupon.minOrderValue}</div>
                  <div>Valid till: {coupon.expiryDate}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 pl-2 flex items-center justify-between">
                <div className="font-mono font-bold text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>{coupon.code}</span>
                </div>

                <button
                  onClick={() => handleCopyCoupon(coupon.code)}
                  className="px-3.5 py-1.5 bg-[#0F766E] hover:bg-[#0B3B36] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                >
                  {copiedCode === coupon.code ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Referral Box */}
        <div className="bg-gradient-to-r from-[#0F564F] to-[#0F766E] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-poppins">Refer Friends & Earn ₹100 Each!</h3>
              <p className="text-xs sm:text-sm text-teal-100/90 mt-1 max-w-xl">
                Share your referral code. Your friend gets ₹100 off their first booking, and you get ₹100 directly credited to your wallet.
              </p>
            </div>
          </div>
          <Link
            href="/wallet"
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm rounded-xl shrink-0 transition-all shadow-md"
          >
            Get My Referral Code →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
