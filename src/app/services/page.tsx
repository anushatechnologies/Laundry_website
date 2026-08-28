'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GarmentImage } from '@/components/common/GarmentImage';
import {
  Search,
  Plus,
  Minus,
  Check,
  Truck,
  Tag,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Scale,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { ClothType, ServicePriceItem } from '@/types';

export default function ServicesPage() {
  const {
    clothTypes,
    serviceMasters,
    priceMatrix,
    pricingSettings,
    cart,
    cartTotals,
    addClothItemToCart,
    addToCart,
    updateCartQuantity,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'GARMENTS' | 'PER_KG'>('GARMENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Per-KG state
  const [kgWeight, setKgWeight] = useState<number>(5);
  const [selectedKgServiceId, setSelectedKgServiceId] = useState<string>(
    serviceMasters.find((s) => s.pricingType === 'PER_KG')?.id || 'srv-m-wash-fold'
  );
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Available categories
  const categories = useMemo(() => {
    const map = new Map<string, { label: string; icon: string }>();
    clothTypes.forEach((c) => {
      if (c.categoryTag && !map.has(c.categoryTag)) {
        map.set(c.categoryTag, { label: c.categoryLabel, icon: c.icon });
      }
    });
    return [
      { tag: 'ALL', label: 'All Garments', icon: '✨' },
      ...Array.from(map.entries()).map(([tag, val]) => ({
        tag,
        label: val.label,
        icon: val.icon,
      })),
    ];
  }, [clothTypes]);

  // Filtered Garment List
  const filteredClothTypes = useMemo(() => {
    return clothTypes.filter((cloth) => {
      if (!cloth.isActive) return false;
      const matchesCategory =
        selectedCategory === 'ALL' || cloth.categoryTag === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        cloth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cloth.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cloth.description && cloth.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [clothTypes, selectedCategory, searchQuery]);

  // Get active price options for a specific cloth type
  const getClothPriceOptions = (clothTypeId: string): ServicePriceItem[] => {
    return priceMatrix.filter((p) => p.clothTypeId === clothTypeId && p.isActive);
  };

  // Direct 1-Tap Add/Update
  const handleAddGarmentService = (cloth: ClothType, priceItem: ServicePriceItem) => {
    addClothItemToCart(cloth, priceItem, 1);
    const itemKey = `${cloth.id}-${priceItem.serviceId}`;
    setJustAddedId(itemKey);
    setTimeout(() => setJustAddedId(null), 1200);
    showToast(`Added ${cloth.name} (${priceItem.serviceName}) to bag`, 'success');
  };

  // Add Per-KG to Bag
  const handleAddPerKgToBag = () => {
    const service = serviceMasters.find((s) => s.id === selectedKgServiceId);
    if (!service) return;

    addToCart(
      {
        id: `custom-pkg-${service.id}`,
        serviceMasterId: service.id,
        name: `${service.name} (Bulk Wash by Weight)`,
        price: service.baseKgPrice || 79,
        description: service.description || '',
        icon: service.icon || '🧺',
        turnaroundTime: `${service.turnaroundHours || 24} hours`,
        minOrderQuantity: 1,
        unit: 'KG',
        category: 'wash-fold',
        popular: false,
      } as any,
      kgWeight
    );

    showToast(`Added ${kgWeight} KG ${service.name} to bag!`, 'success');
    setJustAddedId('per-kg');
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const selectedKgService = serviceMasters.find((s) => s.id === selectedKgServiceId);

  const getServiceBadgeIcon = (serviceName: string) => {
    const lower = serviceName.toLowerCase();
    if (lower.includes('dry clean')) return '👔';
    if (lower.includes('steam')) return '💨';
    if (lower.includes('iron')) return '✨';
    if (lower.includes('fold')) return '🧺';
    if (lower.includes('stain') || lower.includes('bleach')) return '🧼';
    return '✨';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full pb-32">
        {/* Page Hero & Live Policies Banner */}
        <div className="text-center max-w-3xl mx-auto mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F]">
            <Sparkles className="w-3 h-3 text-[#D6B36A]" />
            <span>DIRECT GARMENT &amp; SERVICE SELECTOR</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#2B1326] tracking-tight font-poppins">
            Choose Garments &amp; Services
          </h1>
          <p className="text-xs sm:text-sm text-[#6F626A] max-w-2xl mx-auto font-medium">
            Tap <strong>+ ADD</strong> on any care service below to build your custom laundry bag. Free doorstep pickup across 50+ Hyderabad areas.
          </p>

          {/* Dynamic Policy Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] font-bold text-[#2B1326]">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E8DDE1] shadow-2xs">
              <Truck className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Free Delivery &gt; ₹{pricingSettings.freeDeliveryThreshold}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E8DDE1] shadow-2xs">
              <Tag className="w-3.5 h-3.5 text-[#C58A3A]" />
              <span>Min. Order ₹{pricingSettings.minOrderValue}</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-[#E8DDE1] shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#3F8F6B]" />
              <span>Ozone Sanitized (GST {pricingSettings.taxPercentage}%)</span>
            </span>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-1.5 rounded-2xl border border-[#E8DDE1] shadow-xs inline-flex gap-1.5">
            <button
              onClick={() => setActiveTab('GARMENTS')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'GARMENTS'
                  ? 'bg-[#5B214F] text-white shadow-md shadow-[#5B214F]/20'
                  : 'text-[#6F626A] hover:text-[#2B1326] hover:bg-[#F7F0F2]'
              }`}
            >
              <span>👔 By Garment</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                {clothTypes.filter((c) => c.isActive).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('PER_KG')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'PER_KG'
                  ? 'bg-[#2B1326] text-white shadow-md'
                  : 'text-[#6F626A] hover:text-[#2B1326] hover:bg-[#F7F0F2]'
              }`}
            >
              <Scale className="w-4 h-4 text-[#D6B36A]" />
              <span>🧺 By Weight (KG)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: GARMENT ITEM SELECTION */}
        {activeTab === 'GARMENTS' && (
          <div className="space-y-5">
            {/* Filter Bar */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#E8DDE1] space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#9A8D94]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shirts, jeans, sarees, suits, blazers, bedsheets, curtains..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DDE1] focus:outline-none focus:border-[#5B214F] bg-[#FCF9F7] text-xs sm:text-sm font-bold text-[#2B1326]"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat.tag}
                    onClick={() => setSelectedCategory(cat.tag)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
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
            </div>

            {/* Garment Cards Grid */}
            {filteredClothTypes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DDE1]">
                <p className="text-sm font-bold text-[#6F626A]">
                  No clothes matching &ldquo;{searchQuery}&rdquo;. Try another search term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {filteredClothTypes.map((cloth) => {
                  const priceOptions = getClothPriceOptions(cloth.id);
                  if (priceOptions.length === 0) return null;

                  return (
                    <div
                      key={cloth.id}
                      className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E8DDE1] shadow-2xs hover:shadow-md hover:border-[#B76E79] transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Garment Header */}
                        <div className="flex items-center gap-3 mb-2.5">
                          <GarmentImage
                            name={cloth.name}
                            icon={cloth.icon}
                            categoryTag={cloth.categoryTag}
                            imageUrl={cloth.imageUrl}
                            size="md"
                            className="w-12 h-12 rounded-2xl shadow-2xs shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-black text-sm sm:text-base text-[#2B1326] leading-tight font-poppins truncate">
                                {cloth.name}
                              </h3>
                              <span className="text-[9px] font-black uppercase tracking-wider text-[#5B214F] bg-[#F7F0F2] px-2 py-0.5 rounded-full shrink-0 border border-[#E8DDE1]">
                                {cloth.categoryLabel}
                              </span>
                            </div>
                            {cloth.description && (
                              <p className="text-[11px] text-[#6F626A] font-medium truncate mt-0.5">
                                {cloth.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Individual Care Service Rows */}
                        <div className="space-y-2 pt-2.5 border-t border-[#F2EAEF]">
                          {priceOptions.map((opt) => {
                            const itemKey = `${cloth.id}-${opt.serviceId}`;
                            const cartItem = cart.items.find((i) => i.id === itemKey);
                            const qty = cartItem ? cartItem.quantity : 0;

                            return (
                              <div
                                key={opt.id}
                                className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                                  qty > 0
                                    ? 'bg-[#F7F0F2] border-[#5B214F] ring-1 ring-[#5B214F]/20'
                                    : 'bg-[#FCF9F7] border-[#E8DDE1] hover:bg-white hover:border-[#5B214F]/40'
                                }`}
                              >
                                {/* Service Info & Price */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs">{getServiceBadgeIcon(opt.serviceName)}</span>
                                    <span className="font-extrabold text-xs text-[#2B1326] truncate">
                                      {opt.serviceName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs font-black text-[#5B214F]">
                                      ₹{opt.price}
                                      <span className="text-[10px] font-normal text-slate-500"> /pc</span>
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                                      <Clock className="w-2.5 h-2.5" />
                                      {opt.turnaroundHours}h
                                    </span>
                                  </div>
                                </div>

                                {/* Direct Action: + ADD or [-] {qty} [+] */}
                                <div className="shrink-0">
                                  {qty > 0 ? (
                                    <div className="flex items-center rounded-xl bg-[#5B214F] text-white p-0.5 shadow-xs">
                                      <button
                                        type="button"
                                        onClick={() => updateCartQuantity(itemKey, qty - 1)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:bg-black/20 transition cursor-pointer"
                                        title="Decrease"
                                      >
                                        <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                                      </button>
                                      <span className="w-6 text-center font-black text-xs text-white">
                                        {qty}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => updateCartQuantity(itemKey, qty + 1)}
                                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white hover:bg-black/20 transition cursor-pointer"
                                        title="Increase"
                                      >
                                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleAddGarmentService(cloth, opt)}
                                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs shadow-2xs transition active:scale-95 cursor-pointer"
                                    >
                                      <Plus className="w-3.5 h-3.5 text-[#D6B36A] stroke-[3]" />
                                      <span>ADD</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: BULK WASH BY WEIGHT (PER-KG) */}
        {activeTab === 'PER_KG' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E8DDE1] shadow-xs space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-[#F7F0F2] text-[#5B214F] flex items-center justify-center mx-auto mb-2 text-2xl">
                🧺
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2B1326] font-poppins">
                Bulk Laundry by Weight (Per-KG)
              </h2>
              <p className="text-xs text-[#6F626A]">
                Perfect for your weekly household laundry load, bedsheets, towels, and mixed daily wear.
              </p>
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-wider text-[#2B1326]">
                Select Bulk Service:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceMasters
                  .filter((s) => s.pricingType === 'PER_KG' && s.isActive)
                  .map((srv) => (
                    <button
                      key={srv.id}
                      onClick={() => setSelectedKgServiceId(srv.id)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedKgServiceId === srv.id
                          ? 'bg-[#F7F0F2] border-[#5B214F] ring-1 ring-[#5B214F]'
                          : 'bg-[#FCF9F7] border-[#E8DDE1] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm text-[#2B1326]">{srv.name}</span>
                        <span className="font-black text-[#5B214F] text-sm">₹{srv.baseKgPrice || 79}/KG</span>
                      </div>
                      <p className="text-xs text-[#6F626A] line-clamp-2">{srv.description}</p>
                      <span className="text-[10px] text-[#9A8D94] mt-2 block font-medium">
                        ⏱️ {srv.turnaroundHours}h turnaround
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Weight Stepper */}
            <div className="space-y-2 bg-[#FCF9F7] p-5 rounded-2xl border border-[#E8DDE1]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#2B1326]">
                  Select Weight (Estimated KG):
                </span>
                <span className="text-sm font-black text-[#5B214F]">{kgWeight} KG</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setKgWeight((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E8DDE1] flex items-center justify-center text-[#2B1326] font-bold hover:bg-[#F7F0F2] cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={kgWeight}
                  onChange={(e) => setKgWeight(parseInt(e.target.value, 10))}
                  className="flex-1 accent-[#5B214F] cursor-pointer"
                />
                <button
                  onClick={() => setKgWeight((prev) => Math.min(30, prev + 1))}
                  className="w-10 h-10 rounded-xl bg-white border border-[#E8DDE1] flex items-center justify-center text-[#2B1326] font-bold hover:bg-[#F7F0F2] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-[#9A8D94] text-center">
                *Final weight is accurately calibrated on doorstep pickup scale by our concierge.
              </p>
            </div>

            {/* Add Bulk Button */}
            {selectedKgService && (
              <button
                onClick={handleAddPerKgToBag}
                className="w-full py-4 rounded-2xl bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-sm shadow-md shadow-[#5B214F]/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                {justAddedId === 'per-kg' ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added {kgWeight} KG to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-[#D6B36A]" />
                    <span>
                      Add {kgWeight} KG {selectedKgService.name} (₹
                      {(selectedKgService.baseKgPrice || 79) * kgWeight})
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar when items exist in bag */}
      {cartTotals.itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-lg mx-auto animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#2B1326] text-white rounded-2xl p-3.5 shadow-2xl border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#5B214F] flex items-center justify-center text-white font-black text-sm shrink-0">
                {cartTotals.itemCount}
              </div>
              <div>
                <p className="text-xs font-bold text-white/80">
                  {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'item' : 'items'} in Bag
                </p>
                <p className="text-sm font-black text-[#D6B36A]">
                  ₹{cartTotals.itemTotal.toFixed(0)}{' '}
                  <span className="text-[10px] font-normal text-white/60">
                    (+ GST {pricingSettings.taxPercentage}%)
                  </span>
                </p>
              </div>
            </div>

            <Link
              href="/book"
              className="px-4 py-2.5 rounded-xl bg-[#5B214F] hover:bg-[#48193F] text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-[#5B214F]/40 transition cursor-pointer"
            >
              <span>Proceed to Book</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
