'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingBag, X, Plus, Minus, Trash2, Tag, ArrowRight, Sparkles, Truck, AlertCircle } from 'lucide-react';
import { GarmentImage } from '@/components/common/GarmentImage';
import { useRouter } from 'next/navigation';

interface CartFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartFlyout: React.FC<CartFlyoutProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    applyCouponCode,
    removeCouponCode,
    cartTotals,
    setExpressTier,
    pricingSettings,
    openAuthModal,
    showToast,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput.trim());
    if (res.success) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const freeDeliveryShortfall = Math.max(0, pricingSettings.freeDeliveryThreshold - cartTotals.itemTotal);
  const freeDeliveryProgress = Math.min(100, (cartTotals.itemTotal / pricingSettings.freeDeliveryThreshold) * 100);
  const isBelowMinOrder = cartTotals.itemTotal > 0 && cartTotals.itemTotal < pricingSettings.minOrderValue;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 w-full sm:w-auto">
        <div className="w-full sm:w-screen sm:max-w-md bg-white shadow-2xl flex flex-col relative z-10 animate-in slide-in-from-right duration-300 overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-[#5B214F] to-[#2B1326] text-white flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-xl shadow-inner shrink-0">
                🧺
              </div>
              <div>
                <h2 className="font-extrabold text-base sm:text-lg leading-tight text-white font-poppins">Your Laundry Bag</h2>
                <p className="text-xs text-white/80 font-medium">
                  {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
              title="Close Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Dynamic Progress Bar */}
          {cart.items.length > 0 && (
            <div className="bg-[#F7F0F2] px-4 sm:px-5 py-3 border-b border-[#E8DDE1] shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-[#2B1326] mb-1.5 gap-2">
                <span className="flex items-center gap-1.5 truncate">
                  <Truck className="w-3.5 h-3.5 text-[#5B214F] shrink-0" />
                  {freeDeliveryShortfall > 0 ? (
                    <span className="truncate">Add ₹{Math.round(freeDeliveryShortfall)} more for FREE Delivery</span>
                  ) : (
                    <span className="text-[#5B214F]">🎉 You unlocked FREE Delivery!</span>
                  )}
                </span>
                <span className="text-[11px] text-[#5B214F] font-black shrink-0">{Math.round(freeDeliveryProgress)}%</span>
              </div>
              <div className="w-full h-2 bg-indigo-200/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#5B214F] to-[#B76E79] transition-all duration-500 rounded-full"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-400 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FCF9F7] border border-[#E8DDE1] flex items-center justify-center text-3xl shadow-inner">
                  🛒
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-[#2B1326]">Your Bag is Empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Explore our garments, dry cleaning, or per-KG wash services to get started.
                  </p>
                </div>
                <Link
                  href="/services"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl text-xs font-extrabold transition-all shadow-md shadow-[#5B214F]/20 active:scale-95"
                >
                  Explore Services &amp; Rates
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.id || item.serviceId}
                    className="p-3 sm:p-3.5 bg-[#FCF9F7] rounded-xl border border-[#E8DDE1] flex items-center justify-between gap-2.5 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <GarmentImage
                        name={item.serviceName}
                        categoryTag={item.categoryName}
                        size="sm"
                        className="w-9 h-9 rounded-lg shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-[#2B1326] truncate">{item.serviceName}</div>
                        <div className="text-[11px] font-semibold text-[#5B214F] mt-0.5">
                          ₹{item.unitPrice} × {item.quantity} {item.unit}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-[#E8DDE1] rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.serviceId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-[#F7F0F2] hover:text-[#5B214F] cursor-pointer transition"
                        >
                          <Minus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                        <span className="w-6 text-center font-black text-xs text-[#2B1326]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.serviceId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-[#F7F0F2] hover:text-[#5B214F] cursor-pointer transition"
                        >
                          <Plus className="w-3 h-3 stroke-[2.5]" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.serviceId)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer transition"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Express Priority Toggle */}
                <div className="p-3.5 bg-[#F7F0F2] border border-indigo-100 rounded-xl flex items-center justify-between text-xs gap-2">
                  <div className="min-w-0">
                    <span className="font-extrabold text-[#2B1326] block truncate">Express Same-Day (12h)</span>
                    <span className="text-[10px] text-slate-500 font-medium">+₹{pricingSettings.expressDeliveryFee} Priority Processing</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setExpressTier(cart.expressTier === 'SAME_DAY' ? 'REGULAR' : 'SAME_DAY')
                    }
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all shrink-0 cursor-pointer active:scale-95 ${
                      cart.expressTier === 'SAME_DAY'
                        ? 'bg-[#5B214F] text-white shadow-sm shadow-[#5B214F]/20'
                        : 'bg-white border border-[#E8DDE1] text-[#2B1326] hover:bg-slate-50'
                    }`}
                  >
                    {cart.expressTier === 'SAME_DAY' ? '✓ Express Active' : '+ Add Express'}
                  </button>
                </div>

                {/* Coupon Box */}
                <div className="pt-1">
                  {cart.appliedCoupon ? (
                    <div className="p-3 bg-[#F7F0F2] border border-indigo-100 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#5B214F]">
                        <Tag className="w-3.5 h-3.5 text-[#5B214F] shrink-0" />
                        <span>Code {cart.appliedCoupon.code} applied (Save ₹{cartTotals.discount})</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCouponCode}
                        className="font-bold text-red-600 text-xs hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="ENTER PROMO CODE (E.G. WELCOME100)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 min-w-0 px-3 py-2 text-xs rounded-xl border border-[#E8DDE1] font-mono uppercase focus:border-[#5B214F] focus:outline-none bg-slate-50/50 focus:bg-white transition"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#2B1326] hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition active:scale-95"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[11px] text-red-600 font-semibold">{couponError}</p>}
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E8DDE1] bg-[#FCF9F7] space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-[#2B1326]">₹{cartTotals.itemTotal}</span>
                </div>
                {cartTotals.discount > 0 && (
                  <div className="flex justify-between text-[#5B214F] font-bold">
                    <span>Promo Discount</span>
                    <span>-₹{cartTotals.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-[#5B214F]">
                    {cartTotals.deliveryFee === 0 ? 'FREE' : `₹${cartTotals.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({pricingSettings.taxPercentage}%)</span>
                  <span className="font-bold text-[#2B1326]">₹{cartTotals.tax}</span>
                </div>
                <div className="pt-2 border-t border-[#E8DDE1] flex justify-between text-base font-extrabold text-[#2B1326]">
                  <span>Grand Total</span>
                  <span className="text-[#5B214F] font-poppins text-lg">₹{cartTotals.grandTotal}</span>
                </div>
              </div>

              {isBelowMinOrder && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Minimum order value is ₹{pricingSettings.minOrderValue}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  if (cart.items.length === 0) {
                    showToast('Your bag is empty! Please add at least 1 item to proceed.', 'error');
                    return;
                  }
                  onClose();
                  const hasToken = typeof window !== 'undefined' && Boolean(localStorage.getItem('lf_access'));
                  if (!hasToken) {
                    showToast('Please sign in or verify OTP to schedule your pickup.', 'info');
                    openAuthModal('/book');
                    return;
                  }
                  router.push('/book');
                }}
                className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5B214F]/25 transition-all cursor-pointer active:scale-95"
              >
                <span>Proceed to Schedule Pickup</span>
                <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

