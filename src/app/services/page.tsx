'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { GarmentImage } from '@/components/common/GarmentImage';
import { CartFlyout } from '@/components/common/CartFlyout';
import {
  Search,
  Plus,
  Minus,
  Sparkles,
  Scale,
  Clock,
  ShieldCheck,
  Truck,
  Tag,
  CheckCircle2,
  ChevronRight,
  Check,
  ShoppingBag,
  ArrowRight,
  Shirt,
} from 'lucide-react';
import { ClothType, ServicePriceItem } from '@/types';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
  const router = useRouter();
  const {
    clothTypes,
    serviceMasters,
    priceMatrix,
    pricingSettings,
    addToCart,
    addClothItemToCart,
    cart,
    cartTotals,
    openAuthModal,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'GARMENTS' | 'PER_KG'>('GARMENTS');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Selected Service & Quantity state per cloth item
  const [clothSelections, setClothSelections] = useState<Record<string, { serviceId: string; quantity: number }>>({});

  // Per-KG builder state
  const [selectedKgServiceId, setSelectedKgServiceId] = useState<string>(
    serviceMasters.find((s) => s.pricingType === 'PER_KG')?.id || 'srv-m-wash-fold'
  );
  const [kgWeight, setKgWeight] = useState<number>(4);

  const categories: { tag: string; label: string; icon: string }[] = [
    { tag: 'ALL', label: 'All Garments', icon: '🧺' },
    { tag: 'MENS', label: "Men's Wear", icon: '👔' },
    { tag: 'WOMENS', label: "Women's Wear", icon: '👗' },
    { tag: 'PREMIUM_BRIDAL', label: 'Premium & Bridal', icon: '💍' },
    { tag: 'KIDS', label: 'Kids Clothing', icon: '👶' },
    { tag: 'HOME_TEXTILES', label: 'Home & Bedding', icon: '🛏️' },
    { tag: 'SPECIAL_CLEANING', label: 'Special Cleaning', icon: '🧹' },
    { tag: 'BULK_KG', label: 'Bulk / KG Laundry', icon: '🧺' },
  ];

  // Active cloth types filtered
  const filteredClothTypes = clothTypes.filter((cloth) => {
    if (!cloth.isActive) return false;
    const matchesCategory = selectedCategory === 'ALL' || cloth.categoryTag === selectedCategory;
    const matchesSearch =
      cloth.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cloth.description && cloth.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Get active price options for a specific cloth item
  const getClothPriceOptions = (clothId: string): ServicePriceItem[] => {
    return priceMatrix.filter((p) => p.clothTypeId === clothId && p.isActive);
  };

  // Selection handlers
  const handleSelectClothService = (clothId: string, serviceId: string) => {
    setClothSelections((prev) => ({
      ...prev,
      [clothId]: {
        serviceId,
        quantity: prev[clothId]?.quantity || 1,
      },
    }));
  };

  const handleUpdateClothQty = (clothId: string, delta: number) => {
    setClothSelections((prev) => {
      const current = prev[clothId] || { serviceId: '', quantity: 1 };
      const newQty = Math.max(1, (current.quantity || 1) + delta);
      return {
        ...prev,
        [clothId]: {
          serviceId: current.serviceId,
          quantity: newQty,
        },
      };
    });
  };

  const handleAddClothToBag = (cloth: ClothType) => {
    const priceOptions = getClothPriceOptions(cloth.id);
    if (priceOptions.length === 0) return;

    const currentSelection = clothSelections[cloth.id] || {
      serviceId: priceOptions[0].serviceId,
      quantity: 1,
    };

    const selectedServicePrice =
      priceOptions.find((p) => p.serviceId === currentSelection.serviceId) || priceOptions[0];

    addClothItemToCart(cloth, selectedServicePrice, currentSelection.quantity);
    showToast(`Added ${currentSelection.quantity}x ${cloth.name} (${selectedServicePrice.serviceName}) to bag`, 'success');
    setJustAddedId(cloth.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const handleAddKgToBag = () => {
    const service = serviceMasters.find((s) => s.id === selectedKgServiceId);
    if (!service) return;

    const basePrice = service.baseKgPrice || 80;
    addToCart(
      {
        id: service.id,
        name: service.name,
        slug: service.slug,
        pricingModel: 'PER_KG',
        basePrice: basePrice,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full pb-28">
        {/* Page Hero & Live Policies Banner */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F]">
            <Sparkles className="w-3 h-3 text-[#D6B36A]" />
            <span>LIVE ATELIER PRICING &amp; CATALOG</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#2B1326] tracking-tight font-poppins">
            Doorstep Laundry &amp; Dry Cleaning
          </h1>
          <p className="text-xs sm:text-sm text-[#6F626A] max-w-2xl mx-auto font-medium">
            Choose everyday wash by weight (Per-KG) or select individual garments for couture Italian steam pressing and organic dry cleaning.
          </p>

          {/* Dynamic Policy Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 text-xs font-bold text-[#2B1326]">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDE1] shadow-xs">
              <Truck className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Free Delivery &gt; ₹{pricingSettings.freeDeliveryThreshold}</span>
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
              onClick={() => setActiveTab('GARMENTS')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'GARMENTS'
                  ? 'bg-[#5B214F] text-white shadow-md shadow-[#5B214F]/20'
                  : 'text-[#6F626A] hover:text-[#2B1326] hover:bg-[#F7F0F2]'
              }`}
            >
              <span>👔 Individual Garment Care</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                {clothTypes.filter((c) => c.isActive).length} Items
              </span>
            </button>

            <button
              onClick={() => setActiveTab('PER_KG')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'PER_KG'
                  ? 'bg-[#2B1326] text-white shadow-md'
                  : 'text-[#6F626A] hover:text-[#2B1326] hover:bg-[#F7F0F2]'
              }`}
            >
              <Scale className="w-4 h-4 text-[#D6B36A]" />
              <span>🧺 Bulk Wash by Weight (Per-KG)</span>
            </button>
          </div>
        </div>

        {/* TAB 1: GARMENT ITEM SELECTION */}
        {activeTab === 'GARMENTS' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E8DDE1] space-y-3.5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#9A8D94]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search shirts, sarees, suits, jeans, blazers, bedsheets, lehengas..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#E8DDE1] focus:outline-none focus:border-[#5B214F] bg-[#FCF9F7] text-xs sm:text-sm font-bold text-[#2B1326]"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
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
            </div>

            {/* Garment Cards 3-Column Grid */}
            {filteredClothTypes.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DDE1]">
                <p className="text-sm font-bold text-[#6F626A]">
                  No clothes matching &ldquo;{searchQuery}&rdquo;. Try a different search term.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredClothTypes.map((cloth) => {
                  const priceOptions = getClothPriceOptions(cloth.id);
                  if (priceOptions.length === 0) return null;

                  const currentSelection = clothSelections[cloth.id] || {
                    serviceId: priceOptions[0].serviceId,
                    quantity: 1,
                  };

                  const activeOption =
                    priceOptions.find((p) => p.serviceId === currentSelection.serviceId) ||
                    priceOptions[0];

                  const isJustAdded = justAddedId === cloth.id;

                  return (
                    <div
                      key={cloth.id}
                      className="bg-white rounded-3xl p-6 border border-[#E8DDE1] shadow-xs hover:shadow-[0_12px_40px_rgba(43,19,38,0.08)] hover:border-[#B76E79] transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <GarmentImage
                              name={cloth.name}
                              icon={cloth.icon}
                              categoryTag={cloth.categoryTag}
                              imageUrl={cloth.imageUrl}
                              size="lg"
                            />
                            <div>
                              <h3 className="font-black text-base text-[#2B1326] leading-tight font-poppins">
                                {cloth.name}
                              </h3>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B214F]">
                                {cloth.categoryLabel}
                              </span>
                            </div>
                          </div>
                        </div>

                        {cloth.description && (
                          <p className="text-xs text-[#6F626A] mb-3.5 font-medium">{cloth.description}</p>
                        )}

                        {/* Service Options Selector */}
                        <div className="space-y-2 mb-4">
                          <span className="text-[10px] font-extrabold text-[#9A8D94] uppercase tracking-wider block">
                            Choose Care Service:
                          </span>
                          {priceOptions.map((opt) => {
                            const isSelected = activeOption.serviceId === opt.serviceId;
                            return (
                              <div
                                key={opt.id}
                                onClick={() => handleSelectClothService(cloth.id, opt.serviceId)}
                                className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-[#F7F0F2] border-[#5B214F] text-[#5B214F] font-extrabold ring-1 ring-[#5B214F]'
                                    : 'bg-[#FCF9F7] border-[#E8DDE1] text-[#6F626A] hover:bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[9px] border-[#E8DDE1]">
                                    {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#5B214F]" />}
                                  </span>
                                  <span>{opt.serviceName}</span>
                                </div>
                                <div className="text-right">
                                  <span className="font-black text-[#2B1326]">₹{opt.price}</span>
                                  <span className="text-[9px] text-[#9A8D94] block font-medium">{opt.turnaroundHours}h return</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quantity Stepper & Add to Bag */}
                      <div className="pt-3.5 border-t border-[#EEE5E8] flex items-center justify-between gap-3">
                        <div className="flex items-center border border-[#E8DDE1] rounded-xl bg-white overflow-hidden">
                          <button
                            onClick={() => handleUpdateClothQty(cloth.id, -1)}
                            className="w-8 h-8 flex items-center justify-center text-[#6F626A] hover:bg-[#F7F0F2] font-bold cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-black text-xs text-[#2B1326]">
                            {currentSelection.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateClothQty(cloth.id, 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#6F626A] hover:bg-[#F7F0F2] font-bold cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleAddClothToBag(cloth)}
                          className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer ${
                            isJustAdded
                              ? 'bg-[#3F8F6B] text-white shadow-[#3F8F6B]/20'
                              : 'bg-[#5B214F] hover:bg-[#48193F] text-white shadow-[#5B214F]/20 active:scale-95'
                          }`}
                        >
                          {isJustAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Added to Bag!</span>
                            </>
                          ) : (
                            <span>+ Add (₹{activeOption.price * currentSelection.quantity})</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PER-KG BULK WASH */}
        {activeTab === 'PER_KG' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E8DDE1] shadow-xs space-y-6">
              <div>
                <h3 className="font-black text-xl sm:text-2xl text-[#2B1326] font-poppins">
                  Everyday Bulk Wash by Weight (Per-KG)
                </h3>
                <p className="text-xs text-[#6F626A] mt-1 font-medium">
                  Ideal for t-shirts, daily wear, undergarments, bedsheets, and towels. Zero sorting needed.
                </p>
              </div>

              {/* Service selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {serviceMasters
                  .filter((s) => s.pricingType === 'PER_KG')
                  .map((s) => {
                    const isSelected = selectedKgServiceId === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setSelectedKgServiceId(s.id)}
                        className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#F7F0F2] border-[#5B214F] ring-2 ring-[#5B214F]/15'
                            : 'bg-[#FCF9F7] border-[#E8DDE1] hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-extrabold text-sm text-[#2B1326]">{s.name}</h4>
                          <span className="font-black text-[#5B214F]">₹{s.baseKgPrice}/KG</span>
                        </div>
                        <p className="text-xs text-[#6F626A] font-medium">{s.description}</p>
                      </div>
                    );
                  })}
              </div>

              {/* Weight Slider */}
              <div className="p-6 bg-[#FCF9F7] rounded-3xl border border-[#E8DDE1] space-y-3.5">
                <div className="flex justify-between items-center text-xs font-extrabold text-[#2B1326]">
                  <span>Estimated Weight:</span>
                  <span className="text-base text-[#5B214F] font-black">{kgWeight} KG (~{kgWeight * 4} garments)</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={25}
                  value={kgWeight}
                  onChange={(e) => setKgWeight(parseInt(e.target.value))}
                  className="w-full accent-[#5B214F] cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-bold text-[#9A8D94]">
                  <span>Min. 3 KG</span>
                  <span>10 KG</span>
                  <span>Max. 25 KG</span>
                </div>
              </div>

              {/* Add to Bag CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-[#EEE5E8]">
                <div>
                  <span className="text-xs text-[#6F626A] block font-medium">Estimated Total:</span>
                  <span className="text-2xl font-black text-[#2B1326] font-poppins">
                    ₹{(selectedKgService?.baseKgPrice || 80) * kgWeight}
                  </span>
                </div>

                <button
                  onClick={handleAddKgToBag}
                  className={`px-8 py-3.5 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer active:scale-95 ${
                    justAddedId === 'per-kg'
                      ? 'bg-[#3F8F6B] text-white'
                      : 'bg-[#5B214F] hover:bg-[#48193F] text-white shadow-[#5B214F]/20'
                  }`}
                >
                  {justAddedId === 'per-kg' ? '✓ Added to Bag!' : `+ Add ${kgWeight} KG to Bag`}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
