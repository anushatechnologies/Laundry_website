'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import {
  Scale,
  ShieldCheck,
  Truck,
  Zap,
  ArrowRight,
  Crown,
  Sparkles,
  Check,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { GarmentImage } from '@/components/common/GarmentImage';
import Link from 'next/link';

export default function PricingPage() {
  const { clothTypes, serviceMasters, priceMatrix, pricingSettings, subscriptionPlans } = useApp();

  const [activeTab, setActiveTab] = useState<'PER_ITEM' | 'PER_KG' | 'SUBSCRIPTIONS'>('PER_ITEM');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [kgSlider, setKgSlider] = useState<number>(5);
  const [selectedKgServiceId, setSelectedKgServiceId] = useState<string>(
    serviceMasters.find((s) => s.pricingType === 'PER_KG')?.id || 'srv-m-wash-fold'
  );

  const categories = [
    { tag: 'ALL', label: 'All Items', icon: '🧺' },
    { tag: 'MENS', label: "Men's Wear", icon: '👔' },
    { tag: 'WOMENS', label: "Women's Wear", icon: '👗' },
    { tag: 'PREMIUM_BRIDAL', label: 'Premium & Bridal', icon: '💍' },
    { tag: 'KIDS', label: 'Kids Wear', icon: '👶' },
    { tag: 'HOME_TEXTILES', label: 'Home Textiles', icon: '🛏️' },
    { tag: 'SPECIAL_CLEANING', label: 'Special Cleaning', icon: '🧹' },
    { tag: 'BULK_KG', label: 'Bulk / KG Laundry', icon: '🧺' },
    { tag: 'BABY_CARE', label: 'Baby Care', icon: '👶' },
    { tag: 'WEDDING_CARE', label: 'Wedding Care', icon: '💍' },
    { tag: 'CORPORATE', label: 'Corporate', icon: '🏢' },
  ];

  // Per-KG and Per-Item Masters
  const perKgMasters = serviceMasters.filter((s) => s.pricingType === 'PER_KG' && s.isActive);
  const chosenKgService = perKgMasters.find((s) => s.id === selectedKgServiceId) || perKgMasters[0];

  const kgSubtotal = chosenKgService ? (chosenKgService.baseKgPrice || 80) * kgSlider : 400;
  const deliveryFee = kgSubtotal >= pricingSettings.freeDeliveryThreshold ? 0 : pricingSettings.standardDeliveryFee;
  const tax = +( (kgSubtotal + deliveryFee) * (pricingSettings.taxPercentage / 100) ).toFixed(2);
  const grandTotal = +(kgSubtotal + deliveryFee + tax).toFixed(2);

  const filteredClothTypes = clothTypes.filter((c) => {
    if (!c.isActive) return false;
    if (selectedCategory === 'ALL') return true;
    if (c.categoryTag === selectedCategory) return true;

    if (selectedCategory === 'WEDDING_CARE') {
      return (
        c.categoryTag === 'PREMIUM_BRIDAL' ||
        c.categoryTag === 'WEDDING_CARE' ||
        /wedding|gown|brid|lehenga|tuxedo|sherwani|anarkali/i.test(c.name)
      );
    }
    if (selectedCategory === 'BABY_CARE') {
      return (
        c.categoryTag === 'KIDS' ||
        c.categoryTag === 'BABY_CARE' ||
        /baby|kid|child|romper|onesie|infant|bib/i.test(c.name)
      );
    }
    if (selectedCategory === 'CORPORATE') {
      return (
        c.categoryTag === 'CORPORATE' ||
        /uniform|blazer|suit|apron|chef|lab coat|doctor/i.test(c.name)
      );
    }
    if (selectedCategory === 'PREMIUM_BRIDAL') {
      return (
        c.categoryTag === 'PREMIUM_BRIDAL' ||
        c.categoryTag === 'WEDDING_CARE' ||
        /wedding|gown|brid|lehenga|tuxedo|silk|saree/i.test(c.name)
      );
    }
    if (selectedCategory === 'KIDS') {
      return c.categoryTag === 'KIDS' || c.categoryTag === 'BABY_CARE';
    }

    return false;
  });

  const getServicePrice = (clothId: string, srvId: string) => {
    const match = priceMatrix.find(
      (p) => p.clothTypeId === clothId && p.serviceId === srvId && p.isActive
    );
    return match ? `₹${match.price}` : '—';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full pb-28">
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F]">
            <Sparkles className="w-3 h-3 text-[#D6B36A]" />
            <span>TRANSPARENT VALUE MATRIX</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2B1326] tracking-tight font-poppins">
            Fair, Upfront &amp; Transparent Rates
          </h1>
          <p className="text-xs sm:text-sm text-[#6F626A] max-w-2xl mx-auto font-medium">
            Every garment has a clear, fixed rate. No hidden charges or pickup premiums.
          </p>

          {/* Policy Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-xs font-bold text-[#2B1326]">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDE1] shadow-xs">
              <Truck className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Free Delivery above ₹{pricingSettings.freeDeliveryThreshold}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDE1] shadow-xs">
              <Tag className="w-3.5 h-3.5 text-[#C58A3A]" />
              <span>Min. Order ₹{pricingSettings.minOrderValue}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDE1] shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F8F6B]" />
              <span>Ozone Sanitized (GST {pricingSettings.taxPercentage}%)</span>
            </span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1.5 rounded-2xl border border-[#E8DDE1] shadow-xs inline-flex gap-1.5">
            <button
              onClick={() => setActiveTab('PER_ITEM')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'PER_ITEM'
                  ? 'bg-[#5B214F] text-white shadow-md shadow-[#5B214F]/20'
                  : 'text-[#6F626A] hover:text-[#2B1326] hover:bg-[#F7F0F2]'
              }`}
            >
              <span>👔 Per-Piece Garment Rates</span>
            </button>
            <button
              onClick={() => setActiveTab('PER_KG')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'PER_KG'
                  ? 'bg-[#2B1326] text-white shadow-md'
                  : 'text-[#6F626A] hover:text-[#2B1326] hover:bg-[#F7F0F2]'
              }`}
            >
              <Scale className="w-3.5 h-3.5 text-[#D6B36A]" />
              <span>🧺 Bulk Weight Estimator (Per-KG)</span>
            </button>
            <button
              onClick={() => setActiveTab('SUBSCRIPTIONS')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                activeTab === 'SUBSCRIPTIONS'
                  ? 'bg-[#5B214F] text-white shadow-md shadow-[#5B214F]/20'
                  : 'text-[#6F626A] hover:text-[#2B1326] hover:bg-[#F7F0F2]'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-[#D6B36A]" />
              <span>📦 Monthly Passes</span>
              <span className="hidden sm:inline-block ml-1 bg-[#3F8F6B] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Save 40%
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: GARMENT RATE CARD */}
        {activeTab === 'PER_ITEM' && (
          <div className="space-y-6">
            {/* Category Filter Pills */}
            <div className="bg-white rounded-3xl p-3 border border-[#E8DDE1] shadow-xs flex gap-2 overflow-x-auto scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.tag}
                  onClick={() => setSelectedCategory(cat.tag)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    selectedCategory === cat.tag
                      ? 'bg-[#5B214F] text-white shadow-sm'
                      : 'bg-[#F7F0F2] text-[#6F626A] border border-[#E8DDE1] hover:bg-white hover:text-[#2B1326]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Desktop Full Data Table */}
            <div className="hidden md:block bg-white rounded-3xl border border-[#E8DDE1] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F7F0F2] border-b border-[#E8DDE1] text-[#2B1326] font-black uppercase tracking-wider text-[11px]">
                      <th className="py-4 px-6">Garment / Item</th>
                      <th className="py-4 px-4 text-center">Wash &amp; Fold</th>
                      <th className="py-4 px-4 text-center">Wash &amp; Steam Iron</th>
                      <th className="py-4 px-4 text-center">Dry Cleaning</th>
                      <th className="py-4 px-4 text-center">Steam Press Only</th>
                      <th className="py-4 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEE5E8]">
                    {filteredClothTypes.map((cloth) => (
                      <tr key={cloth.id} className="hover:bg-[#F7F0F2]/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <GarmentImage
                              name={cloth.name}
                              icon={cloth.icon}
                              categoryTag={cloth.categoryTag}
                              imageUrl={cloth.imageUrl}
                              size="md"
                            />
                            <div>
                              <span className="font-extrabold text-sm text-[#2B1326] block">
                                {cloth.name}
                              </span>
                              <span className="text-[10px] font-bold text-[#5B214F]">
                                {cloth.categoryLabel}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-[#6F626A]">
                          {getServicePrice(cloth.id, 'srv-m-wash-fold')}
                        </td>
                        <td className="py-4 px-4 text-center font-black text-[#5B214F]">
                          {getServicePrice(cloth.id, 'srv-m-wash-iron')}
                        </td>
                        <td className="py-4 px-4 text-center font-black text-[#2B1326]">
                          {getServicePrice(cloth.id, 'srv-m-dry-clean')}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-[#6F626A]">
                          {getServicePrice(cloth.id, 'srv-m-steam-iron')}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link
                            href="/services"
                            className="px-3.5 py-1.5 bg-[#F7F0F2] hover:bg-[#5B214F] hover:text-white text-[#5B214F] border border-[#E8DDE1] rounded-xl font-extrabold text-xs inline-flex items-center gap-1 transition-colors"
                          >
                            <span>Select</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Responsive Cards */}
            <div className="md:hidden space-y-3">
              {filteredClothTypes.map((cloth) => (
                <div
                  key={cloth.id}
                  className="bg-white rounded-3xl p-5 border border-[#E8DDE1] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GarmentImage
                        name={cloth.name}
                        icon={cloth.icon}
                        categoryTag={cloth.categoryTag}
                        imageUrl={cloth.imageUrl}
                        size="md"
                      />
                      <div>
                        <h4 className="font-black text-sm text-[#2B1326] leading-tight">
                          {cloth.name}
                        </h4>
                        <span className="text-[10px] font-bold text-[#5B214F]">
                          {cloth.categoryLabel}
                        </span>
                      </div>
                    </div>
                    <Link
                      href="/services"
                      className="px-3.5 py-1.5 bg-[#5B214F] text-white rounded-xl font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 shadow-xs"
                    >
                      <span>Select</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* 4 Mini Price Pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#EEE5E8]">
                    <div className="bg-[#FCF9F7] p-2 rounded-xl border border-[#E8DDE1] flex justify-between items-center">
                      <span className="text-[11px] text-[#6F626A]">Wash &amp; Fold</span>
                      <span className="font-bold text-[#2B1326]">{getServicePrice(cloth.id, 'srv-m-wash-fold')}</span>
                    </div>
                    <div className="bg-[#F7F0F2] p-2 rounded-xl border border-[#E8DDE1] flex justify-between items-center">
                      <span className="text-[11px] text-[#5B214F] font-bold">Steam Iron</span>
                      <span className="font-black text-[#5B214F]">{getServicePrice(cloth.id, 'srv-m-wash-iron')}</span>
                    </div>
                    <div className="bg-[#FCF9F7] p-2 rounded-xl border border-[#E8DDE1] flex justify-between items-center">
                      <span className="text-[11px] text-[#2B1326] font-bold">Dry Clean</span>
                      <span className="font-black text-[#2B1326]">{getServicePrice(cloth.id, 'srv-m-dry-clean')}</span>
                    </div>
                    <div className="bg-[#FCF9F7] p-2 rounded-xl border border-[#E8DDE1] flex justify-between items-center">
                      <span className="text-[11px] text-[#6F626A]">Steam Press</span>
                      <span className="font-bold text-[#6F626A]">{getServicePrice(cloth.id, 'srv-m-steam-iron')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: BULK / KG SLAB ESTIMATOR */}
        {activeTab === 'PER_KG' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E8DDE1] shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold text-[#5B214F] uppercase tracking-wider bg-[#F7F0F2] px-2.5 py-0.5 rounded-full border border-[#E8DDE1]">
                    Calculated Scaling
                  </span>
                  <span className="text-xs text-[#6F626A] font-medium">Digital Weight Estimator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#2B1326] font-poppins mt-1">
                  Estimate Your Laundry Weight &amp; Cost
                </h3>
              </div>

              {/* Service Choice */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2B1326]">Select Wash Service</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {perKgMasters.map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedKgServiceId(srv.id)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        selectedKgServiceId === srv.id
                          ? 'bg-[#F7F0F2] border-[#5B214F] text-[#5B214F] font-bold ring-1 ring-[#5B214F]'
                          : 'bg-[#FCF9F7] border-[#E8DDE1] text-[#2B1326] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{srv.icon}</span>
                        <div>
                          <div className="text-xs font-bold leading-tight">{srv.name}</div>
                          <div className="text-[10px] text-[#6F626A]">₹{srv.baseKgPrice || 80} / KG</div>
                        </div>
                      </div>
                      {selectedKgServiceId === srv.id && (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#5B214F]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive Slider */}
              <div className="space-y-3 bg-[#FCF9F7] p-5 sm:p-6 rounded-3xl border border-[#E8DDE1]">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#2B1326]">Estimated Load Weight</span>
                  <span className="text-base font-black text-[#5B214F] bg-white px-3.5 py-1 rounded-xl border border-[#E8DDE1] shadow-xs">
                    {kgSlider} KG
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={25}
                  step={1}
                  value={kgSlider}
                  onChange={(e) => setKgSlider(parseInt(e.target.value))}
                  className="w-full accent-[#5B214F] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-bold text-[#9A8D94]">
                  <span>2 KG (Min)</span>
                  <span>10 KG (Medium)</span>
                  <span>25 KG (Family)</span>
                </div>
              </div>

              {/* Live Cost Breakdown */}
              <div className="bg-[#FCF9F7] rounded-3xl p-5 border border-[#E8DDE1] space-y-2 text-xs font-bold">
                <div className="flex justify-between text-[#6F626A]">
                  <span>Laundry Subtotal ({kgSlider} KG × ₹{chosenKgService?.baseKgPrice || 80}):</span>
                  <span className="font-extrabold text-[#2B1326]">₹{kgSubtotal}</span>
                </div>
                <div className="flex justify-between text-[#6F626A]">
                  <span>Doorstep Pickup &amp; Delivery:</span>
                  <span className="font-extrabold text-[#2B1326]">
                    {deliveryFee === 0 ? <span className="text-[#3F8F6B]">FREE</span> : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#6F626A]">
                  <span>Estimated Tax (GST {pricingSettings.taxPercentage}%):</span>
                  <span className="font-extrabold text-[#2B1326]">₹{tax}</span>
                </div>
                <div className="pt-2 border-t border-[#EEE5E8] flex justify-between items-center text-sm font-black text-[#2B1326]">
                  <span>Estimated Grand Total:</span>
                  <span className="text-xl text-[#5B214F] font-poppins">₹{grandTotal}</span>
                </div>
              </div>

              {/* Action button */}
              <Link
                href="/book"
                className="w-full py-4 bg-[#5B214F] hover:bg-[#48193F] text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-white/10"
              >
                <span>Book This Load ({kgSlider} KG) →</span>
              </Link>
            </div>
          </div>
        )}

        {/* TAB 3: SUBSCRIPTIONS & MONTHLY PASSES */}
        {activeTab === 'SUBSCRIPTIONS' && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F]">
                <Crown className="w-3.5 h-3.5 text-[#D6B36A]" />
                <span>MONTHLY PASSES</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#2B1326] font-poppins">
                Save Big with Recurring Laundry Passes
              </h3>
              <p className="text-xs sm:text-sm text-[#6F626A] font-medium">
                Guaranteed pickup slots, free delivery on every order, and unused weight rollovers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {(subscriptionPlans && subscriptionPlans.length > 0
                ? subscriptionPlans
                : [
                    {
                      id: 'sub-basic-1m',
                      name: 'Basic Care Pass',
                      price: 999,
                      originalPrice: 1299,
                      durationMonths: 1,
                      includedKg: 20,
                      features: ['20 KG Laundry / month', 'Free Doorstep Pickups', '36h Turnaround', 'Rollover up to 5 KG'],
                      popular: false,
                    },
                    {
                      id: 'sub-premium-1m',
                      name: 'Privilege Member Pass',
                      price: 1999,
                      originalPrice: 2499,
                      durationMonths: 1,
                      includedKg: 50,
                      features: ['50 KG Laundry / month', 'Free Priority Pickups', '24h Express Turnaround', '1 Free Dry Clean Voucher'],
                      popular: true,
                    },
                    {
                      id: 'sub-family-3m',
                      name: 'Family Saver (3 Months)',
                      price: 4999,
                      originalPrice: 6999,
                      durationMonths: 3,
                      includedKg: 150,
                      features: ['150 KG Total Allowance', 'Save ₹2,000 upfront', '12h Emergency Priority', '3 Free Dry Clean Vouchers'],
                      popular: false,
                    },
                    {
                      id: 'sub-annual-12m',
                      name: 'Annual Royale (12 Mo)',
                      price: 14999,
                      originalPrice: 23999,
                      durationMonths: 12,
                      includedKg: 600,
                      features: ['600 KG Total Allowance', 'Save ₹9,000 with Annual Plan', 'Unlimited 365-day Rollover', '10 Free Dry Clean Vouchers'],
                      popular: false,
                    },
                  ]
              ).map((plan) => {
                const effectivePerKg = Math.round(plan.price / plan.includedKg);
                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                      plan.popular
                        ? 'bg-[#2B1326] text-white shadow-xl ring-2 ring-[#D6B36A]'
                        : 'bg-white text-[#2B1326] border border-[#E8DDE1] shadow-xs hover:shadow-md'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5B214F] text-[#D6B36A] text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-md border border-[#D6B36A]/50">
                        RECOMMENDED
                      </span>
                    )}

                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className={`font-black text-lg font-poppins ${plan.popular ? 'text-white' : 'text-[#2B1326]'}`}>
                          {plan.name}
                        </h4>
                      </div>

                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${
                          plan.popular ? 'bg-white/10 text-[#D6B36A]' : 'bg-[#F7F0F2] text-[#5B214F]'
                        }`}>
                          🧺 {plan.includedKg} KG (₹{effectivePerKg}/KG)
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
                        <span className={`text-[10px] ${plan.popular ? 'text-[#CDBFC6]' : 'text-[#6F626A]'}`}>
                          / {plan.durationMonths || 1} Month{(plan.durationMonths || 1) > 1 ? 's' : ''}
                        </span>
                      </div>

                      <ul className="space-y-2 mb-6 text-xs font-medium">
                        {plan.features.map((f: string, i: number) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.popular ? 'text-[#D6B36A]' : 'text-[#3F8F6B]'}`} />
                            <span className={plan.popular ? 'text-[#E8DDE1]' : 'text-[#6F626A]'}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href="/subscriptions"
                      className={`w-full py-3.5 rounded-xl font-extrabold text-xs text-center flex items-center justify-center gap-1 transition-all ${
                        plan.popular
                          ? 'bg-[#5B214F] hover:bg-[#48193F] text-white shadow-md'
                          : 'bg-[#F7F0F2] hover:bg-[#5B214F] text-[#5B214F] hover:text-white border border-[#E8DDE1]'
                      }`}
                    >
                      <span>View Pass &amp; Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
