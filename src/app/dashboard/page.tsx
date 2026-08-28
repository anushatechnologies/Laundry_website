'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  Sparkles,
  ShoppingBag,
  CreditCard,
  Truck,
  ArrowRight,
  Plus,
  Scale,
  Gift,
  CheckCircle,
  MapPin,
  RotateCcw,
  Star,
  Tag,
  Share2,
  Copy,
  Check,
  Headphones,
  Bell,
  User,
  ShieldCheck,
  AlertCircle,
  X,
  Trash2,
  Home as HomeIcon,
  Briefcase,
} from 'lucide-react';
import { Order } from '@/types';

export default function CustomerDashboardPage() {
  const {
    currentUser,
    orders,
    wallet,
    rechargeWallet,
    savedAddresses,
    addAddress,
    deleteAddress,
    userPincode,
    currentZone,
    addToCart,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'ORDERS' | 'WALLET' | 'SUBSCRIPTIONS' | 'ADDRESSES' | 'SUPPORT' | 'PROFILE'
  >('OVERVIEW');

  const [orderFilter, setOrderFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState(500);

  // Address Form State in Dashboard
  const [isAddingAddressDash, setIsAddingAddressDash] = useState(false);
  const [dashAddressForm, setDashAddressForm] = useState({
    type: 'Home' as 'Home' | 'Office' | 'Other',
    contactName: currentUser.name !== 'Valued Customer' ? currentUser.name : '',
    contactPhone: currentUser.phone || '',
    houseNo: '',
    area: '',
    landmark: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: userPincode || '500072',
    instructions: '',
    isDefault: true,
  });

  const handleSaveDashAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dashAddressForm.houseNo.trim() && !dashAddressForm.area.trim()) {
      showToast('Please enter house/flat and street area.', 'error');
      return;
    }
    const cleanPin = dashAddressForm.pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      showToast('Please enter a valid 6-digit pincode.', 'error');
      return;
    }
    const streetCombined = [dashAddressForm.houseNo.trim(), dashAddressForm.area.trim()].filter(Boolean).join(', ');
    addAddress({
      type: dashAddressForm.type,
      contactName: dashAddressForm.contactName.trim() || currentUser.name,
      contactPhone: dashAddressForm.contactPhone.trim() || currentUser.phone,
      houseNo: dashAddressForm.houseNo.trim(),
      area: dashAddressForm.area.trim(),
      street: streetCombined,
      landmark: dashAddressForm.landmark.trim(),
      city: dashAddressForm.city.trim() || 'Hyderabad',
      state: dashAddressForm.state.trim() || 'Telangana',
      pincode: cleanPin,
      instructions: dashAddressForm.instructions.trim(),
      isDefault: dashAddressForm.isDefault,
    });
    setIsAddingAddressDash(false);
  };

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState<Order | null>(null);
  const [reviewRatings, setReviewRatings] = useState({ quality: 5, pickup: 5, delivery: 5, comment: '' });

  // Support Ticket Form State
  const [supportTicket, setSupportTicket] = useState({
    orderId: orders[0]?.id || '',
    category: 'Laundry Quality',
    description: '',
  });

  const activeOrders = orders.filter((o) => !['DELIVERED', 'COMPLETED', 'CANCELLED'].includes(o.currentStatus));
  const completedOrders = orders.filter((o) => ['DELIVERED', 'COMPLETED'].includes(o.currentStatus));
  const cancelledOrders = orders.filter((o) => o.currentStatus === 'CANCELLED');

  const filteredOrders =
    orderFilter === 'ACTIVE'
      ? activeOrders
      : orderFilter === 'COMPLETED'
      ? completedOrders
      : orderFilter === 'CANCELLED'
      ? cancelledOrders
      : orders;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('LAUNDRY100');
    setCopiedReferral(true);
    showToast('Referral code LAUNDRY100 copied to clipboard!', 'success');
    setTimeout(() => setCopiedReferral(false), 3000);
  };

  const handleRecharge = (e: React.FormEvent) => {
    e.preventDefault();
    rechargeWallet(rechargeAmount);
    setShowRechargeModal(false);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.serviceId,
          categoryId: 'cat-1',
          name: item.serviceName,
          slug: (item.serviceName || 'service').toLowerCase().replace(/\s+/g, '-'),
          description: item.specialInstructions || '',
          pricingModel: item.pricingModel,
          basePrice: item.unitPrice,
          unit: item.unit,
          minOrderQuantity: 1,
          turnaroundHours: 24,
        },
        item.quantity
      );
    });
    showToast(`Items from Order #${order.id} added to your active bag!`, 'success');
  };

  const handleOpenReview = (order: Order) => {
    setSelectedOrderForReview(order);
    setShowReviewModal(true);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Thank you! Your review for Order #${selectedOrderForReview?.id} was submitted. +50 Reward points earned!`, 'success');
    setShowReviewModal(false);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportTicket.description.trim()) {
      showToast('Please describe your query or issue', 'error');
      return;
    }
    showToast(`Support Ticket #TKT-${Date.now().toString().slice(-4)} created! Our customer desk will reach out in 15 mins.`, 'success');
    setSupportTicket({ orderId: orders[0]?.id || '', category: 'Laundry Quality', description: '' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Header (Section 35) */}
        <div className="bg-[#241A21] text-white rounded-[20px] p-6 sm:p-8 mb-8 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Account Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-poppins">
              Hello 👋 Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Serving: {currentZone?.areaName || 'Bengaluru'} ({userPincode}) • {currentUser.phone}
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/book"
              className="px-6 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs sm:text-sm rounded-[10px] shadow-sm transition-all flex items-center gap-2 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Schedule New Pickup</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {[
            { id: 'OVERVIEW', label: '📊 Overview' },
            { id: 'ORDERS', label: `📦 My Orders (${orders.length})` },
            { id: 'WALLET', label: `💳 Wallet & Rewards (₹${wallet.balance})` },
            { id: 'SUBSCRIPTIONS', label: '⭐ Subscriptions' },
            { id: 'ADDRESSES', label: '📍 Saved Addresses' },
            { id: 'SUPPORT', label: '🎧 Help & Support' },
            { id: 'PROFILE', label: '👤 Profile & Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-[10px] font-bold text-xs shrink-0 transition-all border ${
                activeTab === tab.id
                  ? 'bg-[#16A34A] text-white border-[#16A34A] shadow-xs'
                  : 'bg-white text-[#6F626A] border-[#E8DDE1] hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8">
            {/* Top 3 KPI Cards (Section 35) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-[16px] border border-[#E8DDE1] shadow-soft flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#6F626A] uppercase tracking-wider block">
                    Active Orders
                  </span>
                  <span className="text-3xl font-extrabold text-[#241A21] font-poppins mt-1 block">
                    {activeOrders.length}
                  </span>
                  <span className="text-[11px] text-[#15803D] font-semibold">
                    {activeOrders.length > 0 ? 'Live in processing pipeline' : 'No active orders'}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-[10px] bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[16px] border border-[#E8DDE1] shadow-soft flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#6F626A] uppercase tracking-wider block">
                    Wallet Balance
                  </span>
                  <span className="text-3xl font-extrabold text-[#241A21] font-poppins mt-1 block">
                    ₹{wallet.balance}
                  </span>
                  <button
                    onClick={() => setShowRechargeModal(true)}
                    className="text-[11px] text-[#16A34A] font-bold hover:underline"
                  >
                    + Quick Recharge
                  </button>
                </div>
                <div className="w-12 h-12 rounded-[10px] bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-[16px] border border-[#E8DDE1] shadow-soft flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#6F626A] uppercase tracking-wider block">
                    Reward Points
                  </span>
                  <span className="text-3xl font-extrabold text-[#241A21] font-poppins mt-1 block">
                    {wallet.rewardPoints} pts
                  </span>
                  <span className="text-[11px] text-[#6F626A]">Worth ₹{Math.round(wallet.rewardPoints / 10)} discount</span>
                </div>
                <div className="w-12 h-12 rounded-[10px] bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Gift className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Active Order Spotlight */}
            {activeOrders.length > 0 && (
              <div className="bg-white rounded-[20px] p-6 border border-[#E8DDE1] shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-[10px] bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center font-bold text-xl">
                      🧺
                    </span>
                    <div>
                      <h3 className="font-extrabold text-base text-[#241A21]">
                        Live Order #{activeOrders[0].id}
                      </h3>
                      <span className="text-xs text-[#6F626A]">
                        Placed: {new Date(activeOrders[0].createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#F0FDF4] text-[#15803D] border border-emerald-200 rounded-full text-xs font-bold">
                      {activeOrders[0].currentStatus.replace(/_/g, ' ')}
                    </span>
                    <Link
                      href={`/track/${activeOrders[0].id}`}
                      className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-[10px] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Track Live</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#6F626A]">
                  <div className="p-3 bg-[#FCF9F7] rounded-[10px] border border-[#E8DDE1]">
                    <span className="font-bold text-[#241A21] block mb-1">Pickup Slot</span>
                    <span>{activeOrders[0].pickupSlot?.slot || '10:00 AM - 12:00 PM'} ({activeOrders[0].pickupSlot?.date})</span>
                  </div>
                  <div className="p-3 bg-[#FCF9F7] rounded-[10px] border border-[#E8DDE1]">
                    <span className="font-bold text-[#241A21] block mb-1">Items ({activeOrders[0].items.length})</span>
                    <span>{activeOrders[0].items.map((i) => i.serviceName).join(', ')}</span>
                  </div>
                  <div className="p-3 bg-[#FCF9F7] rounded-[10px] border border-[#E8DDE1]">
                    <span className="font-bold text-[#241A21] block mb-1">Grand Total</span>
                    <span className="font-extrabold text-[#16A34A] text-sm">
                      ₹{activeOrders[0].totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'ORDERS' && (
          <div className="space-y-6">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { key: 'ALL', label: 'All Orders' },
                { key: 'ACTIVE', label: `Active (${activeOrders.length})` },
                { key: 'COMPLETED', label: `Completed (${completedOrders.length})` },
                { key: 'CANCELLED', label: `Cancelled (${cancelledOrders.length})` },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setOrderFilter(f.key as any)}
                  className={`px-4 py-2 rounded-[10px] text-xs font-bold border transition-all ${
                    orderFilter === f.key
                      ? 'bg-[#16A34A] text-white border-[#16A34A]'
                      : 'bg-white text-[#6F626A] border-[#E8DDE1] hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Orders List (Section 37) */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-[16px] p-6 border border-[#E8DDE1] shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-extrabold text-base text-[#241A21]">#{order.id}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F0FDF4] text-[#15803D] border border-emerald-200">
                        {order.currentStatus.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-[#6F626A]">
                      {order.items.map((i) => `${i.serviceName} (${i.quantity} ${i.unit})`).join(' • ')}
                    </p>

                    <div className="text-xs text-[#6F626A]">
                      Pickup: {order.pickupSlot?.date} ({order.pickupSlot?.slot}) • Total:{' '}
                      <strong className="text-[#241A21]">₹{order.totalAmount}</strong>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/track/${order.id}`}
                      className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-[10px] transition-all shadow-xs"
                    >
                      Track Order
                    </Link>
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 bg-[#FCF9F7] hover:bg-slate-100 text-[#241A21] border border-[#E8DDE1] text-xs font-bold rounded-[10px] transition-all"
                    >
                      Reorder
                    </button>
                    {['DELIVERED', 'COMPLETED'].includes(order.currentStatus) && (
                      <button
                        onClick={() => handleOpenReview(order)}
                        className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-[10px] transition-all flex items-center gap-1"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Rate</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: WALLET & REWARDS (Section 39 & 40) */}
        {activeTab === 'WALLET' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wallet Card */}
            <div className="bg-white rounded-[20px] p-6 border border-[#E8DDE1] shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-[#241A21]">Wallet Balance</h3>
                <CreditCard className="w-5 h-5 text-[#16A34A]" />
              </div>
              <div className="text-4xl font-extrabold text-[#241A21] font-poppins">
                ₹{wallet.balance}
              </div>
              <button
                onClick={() => setShowRechargeModal(true)}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs rounded-[10px] shadow-xs transition-all"
              >
                + Recharge Wallet
              </button>
            </div>

            {/* Rewards Card (Section 40) */}
            <div className="bg-white rounded-[20px] p-6 border border-[#E8DDE1] shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-[#241A21]">Reward Points</h3>
                <Gift className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-4xl font-extrabold text-[#241A21] font-poppins">
                ⭐ {wallet.rewardPoints} pts
              </div>
              <p className="text-xs text-[#6F626A]">Worth ₹{Math.round(wallet.rewardPoints / 10)} in laundry credits.</p>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#16A34A] h-full rounded-full" style={{ width: '90%' }} />
              </div>
              <p className="text-[11px] text-[#6F626A]">50 points to your next ₹50 laundry discount!</p>
            </div>
          </div>
        )}

        {/* TAB 4: SUBSCRIPTIONS */}
        {activeTab === 'SUBSCRIPTIONS' && (
          <div className="space-y-6">
            {/* Active Subscription Spotlight Card */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-[24px] p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-amber-500/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/40 inline-flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Active Monthly VIP Pass
                  </span>
                  <h2 className="text-2xl font-black font-poppins text-white flex items-center gap-2">
                    <span>Gold Essential Wash Pass</span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1">
                    Includes 50 KG monthly laundry, 4 free doorstep pickups & 1.5x VIP reward multiplier.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-400 block font-medium">Auto-Renews On</span>
                  <span className="text-lg font-black text-amber-400">Sept 15, 2026</span>
                </div>
              </div>

              {/* Weight Allowance Meter & Pickups Count */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 relative z-10">
                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">Monthly Weight Usage</span>
                    <span className="font-black text-emerald-400">18.5 KG / 50.0 KG (37% Used)</span>
                  </div>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style={{ width: '37%' }} />
                  </div>
                  <span className="text-[11px] text-slate-400 block">31.5 KG remaining for this billing cycle</span>
                </div>

                <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Free Pickups Remaining</span>
                    <span className="text-2xl font-black text-amber-400 font-poppins mt-0.5 block">4 of 4 Left</span>
                  </div>
                  <Link
                    href="/subscriptions"
                    className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Upgrade Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SAVED ADDRESSES */}
        {activeTab === 'ADDRESSES' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-[#241A21]">My Saved Addresses</h3>
                <p className="text-xs text-slate-500">Manage pickup &amp; delivery locations</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingAddressDash(!isAddingAddressDash)}
                className="px-4 py-2 bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingAddressDash ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {/* Inline Add Address Form in Dashboard */}
            {isAddingAddressDash && (
              <form onSubmit={handleSaveDashAddress} className="p-5 bg-white rounded-2xl border border-indigo-100 shadow-sm space-y-3.5 animate-in fade-in duration-150">
                <span className="text-xs font-extrabold text-[#241A21] block">Add New Doorstep Address</span>

                {/* Tag */}
                <div className="flex gap-2">
                  {[
                    { type: 'Home', label: 'Home 🏠' },
                    { type: 'Office', label: 'Office 🏢' },
                    { type: 'Other', label: 'Other 📍' },
                  ].map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setDashAddressForm((prev) => ({ ...prev, type: t.type as any }))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        dashAddressForm.type === t.type
                          ? 'bg-[#5B214F] text-white shadow-xs'
                          : 'bg-slate-50 border border-slate-200 text-slate-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={dashAddressForm.contactName}
                    onChange={(e) => setDashAddressForm((prev) => ({ ...prev, contactName: e.target.value }))}
                    placeholder="Contact Person Name"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#5B214F]"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={dashAddressForm.contactPhone}
                    onChange={(e) => setDashAddressForm((prev) => ({ ...prev, contactPhone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="10-Digit Mobile Number"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#5B214F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={dashAddressForm.houseNo}
                    onChange={(e) => setDashAddressForm((prev) => ({ ...prev, houseNo: e.target.value }))}
                    placeholder="Flat / House No., Building Name *"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#5B214F]"
                  />
                  <input
                    type="text"
                    required
                    value={dashAddressForm.area}
                    onChange={(e) => setDashAddressForm((prev) => ({ ...prev, area: e.target.value }))}
                    placeholder="Street / Locality / Area *"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#5B214F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={dashAddressForm.landmark}
                    onChange={(e) => setDashAddressForm((prev) => ({ ...prev, landmark: e.target.value }))}
                    placeholder="Landmark (Optional)"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#5B214F]"
                  />
                  <input
                    type="text"
                    required
                    value={dashAddressForm.city}
                    onChange={(e) => setDashAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#5B214F]"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={dashAddressForm.pincode}
                    onChange={(e) => setDashAddressForm((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                    placeholder="6-Digit Pincode"
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#5B214F]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddressDash(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* Address Cards */}
            {savedAddresses.length === 0 && !isAddingAddressDash && (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No saved addresses yet</p>
                <p className="text-xs text-slate-500">Add an address for quick checkout when scheduling pickups.</p>
                <button
                  type="button"
                  onClick={() => setIsAddingAddressDash(true)}
                  className="mt-2 px-4 py-2 bg-[#5B214F] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  + Add Address Now
                </button>
              </div>
            )}

            {savedAddresses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2 relative group hover:border-indigo-200 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#5B214F] bg-[#F7F0F2] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        {addr.type === 'Home' && <HomeIcon className="w-2.5 h-2.5" />}
                        {addr.type === 'Office' && <Briefcase className="w-2.5 h-2.5" />}
                        {addr.type === 'Other' && <MapPin className="w-2.5 h-2.5" />}
                        <span>{addr.type}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                        title="Delete address"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-bold text-[#241A21]">
                      {addr.houseNo ? `${addr.houseNo}, ` : ''}{addr.area || addr.street}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}{addr.state ? `, ${addr.state}` : ''} - <span className="font-bold text-slate-700">{addr.pincode}</span>
                    </p>
                    {(addr.contactName || addr.contactPhone) && (
                      <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 flex gap-2">
                        <span>👤 {addr.contactName || currentUser.name}</span>
                        <span>📞 {addr.contactPhone || currentUser.phone}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SUPPORT TICKETS */}
        {activeTab === 'SUPPORT' && (
          <div className="max-w-2xl bg-white rounded-[20px] p-6 border border-[#E8DDE1] shadow-soft space-y-4">
            <h3 className="font-extrabold text-base text-[#241A21]">Create a Support Request</h3>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#241A21] block mb-1">Issue Category</label>
                <select
                  value={supportTicket.category}
                  onChange={(e) => setSupportTicket({ ...supportTicket, category: e.target.value })}
                  className="w-full p-2.5 rounded-[10px] border border-[#E8DDE1] text-xs"
                >
                  <option>Laundry Quality</option>
                  <option>Missing / Damaged Garment</option>
                  <option>Pickup / Delivery Delay</option>
                  <option>Billing / Refund</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#241A21] block mb-1">Describe Issue</label>
                <textarea
                  rows={3}
                  value={supportTicket.description}
                  onChange={(e) => setSupportTicket({ ...supportTicket, description: e.target.value })}
                  placeholder="Provide details about your garments or order..."
                  className="w-full p-2.5 rounded-[10px] border border-[#E8DDE1] text-xs"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-[10px] shadow-xs"
              >
                Submit Ticket
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: PROFILE (Section 38) */}
        {activeTab === 'PROFILE' && (
          <div className="max-w-2xl bg-white rounded-[20px] p-6 border border-[#E8DDE1] shadow-soft space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-[16px] bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center text-3xl font-bold">
                👤
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#241A21]">{currentUser.name}</h3>
                <p className="text-xs text-[#6F626A]">{currentUser.phone} • {currentUser.email}</p>
              </div>
            </div>
            <div className="space-y-3 text-xs text-[#6F626A]">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span>Personal Information</span>
                <span className="font-bold text-[#241A21]">{currentUser.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span>Default Pincode</span>
                <span className="font-bold text-[#241A21]">{userPincode}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span>Referral Code</span>
                <span className="font-bold font-mono text-[#16A34A]">LAUNDRY100</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quick Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-sm w-full space-y-4 border border-[#E8DDE1] shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#241A21]">Recharge Laundry Wallet</h3>
              <button onClick={() => setShowRechargeModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs font-bold">
              {[200, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setRechargeAmount(amt)}
                  className={`p-2.5 rounded-[10px] border ${
                    rechargeAmount === amt
                      ? 'bg-[#F0FDF4] border-[#16A34A] text-[#15803D]'
                      : 'bg-[#FCF9F7] border-[#E8DDE1]'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            <button
              onClick={handleRecharge}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-[10px] font-bold text-xs shadow-xs"
            >
              Add ₹{rechargeAmount} to Wallet
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] p-6 max-w-md w-full space-y-4 border border-[#E8DDE1] shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-[#241A21]">Rate Order #{selectedOrderForReview?.id}</h3>
              <button onClick={() => setShowReviewModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#241A21] block mb-1">Quality Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setReviewRatings({ ...reviewRatings, quality: star })}
                      className={`w-6 h-6 cursor-pointer ${
                        star <= reviewRatings.quality ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold text-[#241A21] block mb-1">Review Comments</label>
                <textarea
                  rows={2}
                  placeholder="Share feedback on cleanliness, packaging, or delivery..."
                  value={reviewRatings.comment}
                  onChange={(e) => setReviewRatings({ ...reviewRatings, comment: e.target.value })}
                  className="w-full p-2.5 rounded-[10px] border border-[#E8DDE1] text-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-[10px] font-bold text-xs shadow-xs"
              >
                Submit Review (+50 Points)
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
