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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col relative z-10 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#E8DDE1] bg-[#241A21] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-slate-800 flex items-center justify-center text-emerald-400 font-bold text-lg">
                🧺
              </div>
              <div>
                <h2 className="font-bold text-lg leading-tight font-poppins">Your Laundry Bag</h2>
                <p className="text-xs text-slate-400">
                  {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in bag
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-[10px] hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Dynamic Progress Bar */}
          {cart.items.length > 0 && (
            <div className="bg-[#F7F0F2] px-5 py-3 border-b border-indigo-100">
              <div className="flex items-center justify-between text-xs font-bold text-[#241A21] mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#5B214F]" />
                  {freeDeliveryShortfall > 0 ? (
                    <span>Add ₹{Math.round(freeDeliveryShortfall)} more for FREE Delivery</span>
                  ) : (
                    <span className="text-[#5B214F]">🎉 You unlocked FREE Delivery!</span>
                  )}
                </span>
                <span className="text-[10px] text-[#6F626A] font-semibold">{Math.round(freeDeliveryProgress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-indigo-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#5B214F] transition-all duration-500 rounded-full"
                  style={{ width: `${freeDeliveryProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-400 space-y-4">
                <div className="w-16 h-16 rounded-[16px] bg-[#FCF9F7] border border-[#E8DDE1] flex items-center justify-center text-3xl">
                  🛒
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#241A21]">Your Bag is Empty</h3>
                  <p className="text-xs text-[#6F626A] mt-1 max-w-xs">
                    Explore our garments, dry cleaning, or per-KG wash services to get started.
                  </p>
                </div>
                <Link
                  href="/services"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-[10px] text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
                >
                  Explore Services &amp; Rates
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div
                    key={item.id || item.serviceId}
                    className="p-3.5 bg-[#FCF9F7] rounded-[12px] border border-[#E8DDE1] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <GarmentImage
                        name={item.serviceName}
                        categoryTag={item.categoryName}
                        size="sm"
                        className="w-9 h-9 rounded-lg shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-[#241A21] truncate">{item.serviceName}</div>
                        <div className="text-[11px] text-[#6F626A] mt-0.5">
                          ₹{item.unitPrice} × {item.quantity} {item.unit}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-[#E8DDE1] rounded-[8px] bg-white overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.serviceId, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6F626A] hover:bg-slate-100 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-extrabold text-xs text-[#241A21]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.serviceId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#6F626A] hover:bg-slate-100 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.serviceId)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-[6px] hover:bg-red-50 cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Express Priority Toggle */}
                <div className="p-3.5 bg-[#F7F0F2] border border-indigo-100 rounded-[12px] flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#241A21] block">Express Same-Day (12h)</span>
                    <span className="text-[10px] text-[#6F626A]">+₹{pricingSettings.expressDeliveryFee} Priority Processing</span>
                  </div>
                  <button
                    onClick={() =>
                      setExpressTier(cart.expressTier === 'SAME_DAY' ? 'REGULAR' : 'SAME_DAY')
                    }
                    className={`px-3 py-1.5 rounded-[8px] font-bold text-xs transition-all cursor-pointer ${
                      cart.expressTier === 'SAME_DAY'
                        ? 'bg-[#5B214F] text-white shadow-md shadow-indigo-500/20'
                        : 'bg-white border border-[#E8DDE1] text-[#241A21]'
                    }`}
                  >
                    {cart.expressTier === 'SAME_DAY' ? '✓ Express Active' : '+ Add Express'}
                  </button>
                </div>

                {/* Coupon Box */}
                <div className="pt-2">
                  {cart.appliedCoupon ? (
                    <div className="p-3 bg-[#F7F0F2] border border-indigo-100 rounded-[10px] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#5B214F]">
                        <Tag className="w-3.5 h-3.5 text-[#5B214F]" />
                        <span>Code {cart.appliedCoupon.code} applied (Save ₹{cartTotals.discount})</span>
                      </div>
                      <button
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
                          placeholder="Enter Promo Code (e.g. WELCOME100)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="flex-1 px-3 py-2 text-xs rounded-[10px] border border-[#E8DDE1] font-mono uppercase focus:border-[#5B214F] focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-[#241A21] hover:bg-slate-800 text-white rounded-[10px] text-xs font-bold cursor-pointer"
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
            <div className="p-5 border-t border-[#E8DDE1] bg-[#FCF9F7] space-y-3">
              <div className="space-y-1.5 text-xs text-[#6F626A]">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-[#241A21]">₹{cartTotals.itemTotal}</span>
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
                  <span className="font-bold text-[#241A21]">₹{cartTotals.tax}</span>
                </div>
                <div className="pt-2 border-t border-[#E8DDE1] flex justify-between text-base font-extrabold text-[#241A21]">
                  <span>Grand Total</span>
                  <span className="text-[#5B214F]">₹{cartTotals.grandTotal}</span>
                </div>
              </div>

              {isBelowMinOrder && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[8px] flex items-center gap-2 text-xs text-amber-900">
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
                    openAuthModal('/book');
                    return;
                  }
                  router.push('/book');
                }}
                className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-[12px] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-95"
              >
                <span>Proceed to Schedule Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

