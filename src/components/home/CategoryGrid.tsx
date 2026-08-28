'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GarmentImage } from '@/components/common/GarmentImage';
import { useApp } from '@/context/AppContext';
import { ArrowRight, Sparkles, Plus, Check, ChevronRight, Scale, ShoppingBag } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const { clothTypes, priceMatrix, addClothItemToCart } = useApp();
  const [selectedCategoryTag, setSelectedCategoryTag] = useState<string>('MENS');
  const [addedItemMap, setAddedItemMap] = useState<Record<string, boolean>>({});

  const categories = [
    { tag: 'MENS', label: "Men's Wear", icon: '👔', desc: 'Shirts, trousers, jeans, suits, blazers, kurtas' },
    { tag: 'WOMENS', label: "Women's Wear", icon: '👗', desc: 'Sarees, kurtis, lehengas, blouses, dresses, gowns' },
    { tag: 'PREMIUM_BRIDAL', label: 'Premium & Bridal', icon: '💍', desc: 'Bridal lehengas, silk sarees, heavy sherwanis' },
    { tag: 'KIDS', label: 'Kids Wear', icon: '👶', desc: 'Infant wear, school uniforms, party frocks, blankets' },
    { tag: 'HOME_TEXTILES', label: 'Home & Bedding', icon: '🛏️', desc: 'Bedsheets, comforters, curtains, towels, cushion covers' },
    { tag: 'SPECIAL_CLEANING', label: 'Special Deep Clean', icon: '🧹', desc: 'Mattress, carpet, rug, curtain deep treatment' },
    { tag: 'BULK_KG', label: 'Bulk / KG Laundry', icon: '🧺', desc: 'Everyday clothes, towels weighed per KG' },
  ];

  // Active cloth items for the selected category
  const filteredClothes = clothTypes.filter(
    (c) => c.isActive && c.categoryTag === selectedCategoryTag
  );

  const handleQuickAdd = (cloth: (typeof clothTypes)[0], priceItem: (typeof priceMatrix)[0]) => {
    addClothItemToCart(cloth, priceItem, 1);
    setAddedItemMap((prev) => ({ ...prev, [cloth.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [cloth.id]: false }));
    }, 1800);
  };

  return (
    <section className="py-16 sm:py-20 bg-white border-y border-[#E8DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#5B214F] uppercase tracking-wider bg-[#F7F0F2] px-3 py-1 rounded-full border border-indigo-100">
            Care For Every Garment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#241A21] tracking-tight font-poppins mt-2">
            Our Garment Catalog
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#6F626A]">
            Everything your clothes need, under one roof. Admin-controlled live rates with free doorstep pickup.
          </p>
        </div>

        {/* Category Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 mb-10">
          {categories.map((cat) => {
            const isSelected = selectedCategoryTag === cat.tag;
            return (
              <button
                key={cat.tag}
                onClick={() => setSelectedCategoryTag(cat.tag)}
                className={`p-3 rounded-2xl text-center transition-all border flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#F7F0F2] border-[#5B214F] text-[#5B214F] font-extrabold shadow-2xs'
                    : 'bg-[#FCF9F7] border-[#E8DDE1] text-[#241A21] hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs font-bold leading-tight">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Garment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredClothes.slice(0, 8).map((cloth) => {
            const priceOptions = priceMatrix.filter(
              (p) => p.clothTypeId === cloth.id && p.isActive
            );
            const primaryOption = priceOptions[0];
            const isAdded = addedItemMap[cloth.id];

            return (
              <div
                key={cloth.id}
                className="bg-white rounded-3xl p-5 border border-[#E8DDE1] shadow-2xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <GarmentImage
                      name={cloth.name}
                      icon={cloth.icon}
                      imageUrl={cloth.imageUrl}
                      categoryTag={cloth.categoryTag}
                      size="md"
                      className="w-12 h-12 rounded-2xl shadow-xs"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-[#241A21] leading-tight font-poppins">
                        {cloth.name}
                      </h4>
                      <span className="text-[10px] font-bold text-[#5B214F] uppercase tracking-wider">
                        {cloth.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {cloth.description && (
                    <p className="text-[11px] text-[#6F626A] mb-3 line-clamp-1">
                      {cloth.description}
                    </p>
                  )}

                  {/* Multi-service price list */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                    {priceOptions.slice(0, 3).map((pi) => (
                      <div key={pi.id} className="flex justify-between items-center text-[#6F626A]">
                        <span className="text-[11px]">{pi.serviceName}:</span>
                        <span className="font-extrabold text-[#241A21]">
                          ₹{pi.price} <span className="text-[9px] font-normal text-[#6F626A]">/ pc</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex gap-2">
                  {primaryOption && (
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(cloth, primaryOption)}
                      className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-xs ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#5B214F] hover:bg-[#48193F] text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Add (₹{primaryOption.price})</span>
                        </>
                      )}
                    </button>
                  )}

                  <Link
                    href="/services"
                    className="p-2 bg-[#F7F0F2] hover:bg-[#E0E3FD] text-[#5B214F] rounded-xl font-bold text-xs flex items-center justify-center border border-indigo-100 transition-colors"
                    title="View all care options"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore All Link */}
        <div className="text-center mt-10">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all"
          >
            <span>Explore Full 30+ Garment Catalog &amp; Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
