'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import {
  Award,
  Crown,
  Sparkles,
  Zap,
  Gift,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Star,
  Coins,
  History,
  CreditCard,
  ShoppingBag,
  Users,
} from 'lucide-react';

export default function LoyaltyRewardsPage() {
  const { loyaltyAccount, currentUser, showToast } = useApp();

  const [redeemInput, setRedeemInput] = useState<number>(100);

  const currentPoints = loyaltyAccount?.totalPoints || 450;
  const currentTier = (loyaltyAccount as any)?.tier || 'GOLD';
  const pointsToNextTier = 1500 - currentPoints;
  const progressPercent = Math.min(100, Math.round((currentPoints / 1500) * 100));

  const sampleHistory = [
    {
      id: 'tx-1',
      type: 'EARNED',
      title: 'Earned on Order #LAU10245',
      points: '+48 Pts',
      date: '2026-08-25',
      orderAmount: 'â‚¹480',
    },
    {
      id: 'tx-2',
      type: 'REDEEMED',
      title: 'Redeemed at Checkout for Order #LAU10240',
      points: '-50 Pts',
      date: '2026-08-20',
      discountValue: 'â‚¹5.00 OFF',
    },
    {
      id: 'tx-3',
      type: 'BONUS',
      title: 'Friend Referral Bonus (Rahul V.)',
      points: '+100 Pts',
      date: '2026-08-15',
      discountValue: 'Referral Reward',
    },
    {
      id: 'tx-4',
      type: 'EARNED',
      title: 'Earned on Order #LAU10228',
      points: '+35 Pts',
      date: '2026-08-10',
      orderAmount: 'â‚¹350',
    },
  ];

  const handleConvertPoints = () => {
    if (redeemInput <= 0 || redeemInput > currentPoints) {
      showToast(`Please enter a valid points amount up to ${currentPoints} Pts.`, 'error');
      return;
    }
    const inrValue = Math.floor(redeemInput / 10);
    showToast(`Successfully converted ${redeemInput} Loyalty Points to â‚¹${inrValue} Wallet Balance!`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Hero Loyalty Card */}
        <div className="bg-gradient-to-br from-[#241A21] via-[#1E1B4B] to-[#312E81] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-[#5B214F]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-amber-300 font-extrabold text-xs px-4 py-1.5 rounded-full border border-amber-300/30 shadow-inner">
                <Crown className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>LaundryFresh VIP Club</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black font-poppins text-white tracking-tight leading-tight">
                VIP Loyalty Rewards &amp; Perks
              </h1>

              <p className="text-sm text-indigo-100 font-medium max-w-xl leading-relaxed">
                Earn 1 Loyalty Point for every â‚¹10 spent. Convert points into instant cash discounts at checkout or top up your laundry wallet!
              </p>

              {/* Tier Status Badge */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                  <span>{currentTier} MEMBER</span>
                </div>
                <span className="text-xs text-indigo-200 font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  10 Points = â‚¹1.00 INR Discount
                </span>
              </div>
            </div>

            {/* Points Summary Box */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shrink-0 min-w-[290px] space-y-4 shadow-xl">
              <div>
                <span className="text-xs text-indigo-200 font-bold uppercase tracking-wider block">Available Balance</span>
                <div className="text-4xl font-black text-white font-poppins flex items-baseline gap-2 mt-1">
                  <span>{currentPoints}</span>
                  <span className="text-sm font-extrabold text-amber-300">POINTS</span>
                </div>
                <div className="text-xs text-emerald-300 font-bold mt-1">
                  â‰ˆ â‚¹{Math.floor(currentPoints / 10)} Cash Discount Value
                </div>
              </div>

              {/* Progress to next tier */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <div className="flex justify-between text-[11px] font-bold text-indigo-200">
                  <span>Progress to Platinum Tier</span>
                  <span className="text-amber-300">{progressPercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden p-0.5">
                  <div className="h-full bg-gradient-to-r from-amber-400 via-indigo-400 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                </div>
                <p className="text-[10px] text-indigo-200/80 font-medium">{pointsToNextTier} more points to unlock 2x multiplier!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Convert Points Widget */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#241A21] font-poppins flex items-center gap-2">
                <Coins className="w-5 h-5 text-[#5B214F]" />
                <span>Convert Points to Wallet Credit</span>
              </h2>
              <p className="text-xs text-[#6F626A] font-medium mt-0.5">Instantly convert your reward points into prepaid wallet balance.</p>
            </div>
            <span className="text-xs font-bold text-[#5B214F] bg-[#F7F0F2] px-3.5 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
              10 Pts = â‚¹1 INR
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-xs font-bold text-[#241A21] block">Points to Convert</label>
              <div className="relative">
                <input
                  type="number"
                  min={10}
                  max={currentPoints}
                  step={10}
                  value={redeemInput}
                  onChange={(e) => setRedeemInput(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-bold text-sm text-[#241A21] focus:outline-none focus:ring-2 focus:ring-[#5B214F] focus:border-transparent bg-[#FCF9F7]"
                />
                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400">Points</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 text-center pt-2 sm:pt-6 w-full sm:w-auto">
              <div className="text-sm font-bold text-slate-400 hidden sm:block">=</div>
              <div className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#F7F0F2] border border-indigo-100 rounded-xl text-center">
                <span className="text-[10px] font-bold text-[#6F626A] uppercase block">Wallet Credit</span>
                <span className="text-xl font-black text-[#5B214F]">â‚¹{Math.floor(redeemInput / 10)}</span>
              </div>

              <button
                onClick={handleConvertPoints}
                className="flex-1 sm:flex-initial px-7 py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all cursor-pointer active:scale-95"
              >
                Convert Now
              </button>
            </div>
          </div>
        </div>

        {/* Tier Benefits Comparison Grid */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#241A21] font-poppins flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              <span>Membership Tier Benefits</span>
            </h2>
            <p className="text-xs text-[#6F626A] mt-0.5">Unlock higher point multipliers and exclusive complimentary services as you wash more.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Silver Tier */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 relative shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-[#241A21]">ðŸ¥ˆ Silver Member</h3>
                  <span className="text-[11px] text-slate-500 font-medium">0 ”“ 500 Points</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1x Points Earning Rate (1 Pt / â‚¹10)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Standard Pickup &amp; Delivery</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Birthday Special +50 Pts</span>
                </li>
              </ul>
            </div>

            {/* Gold Tier */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#5B214F] shadow-xl space-y-4 relative ring-4 ring-[#5B214F]/10">
              <div className="absolute -top-3 right-6 bg-[#5B214F] text-white text-[9px] font-black uppercase px-3 py-1 rounded-full shadow-md">
                Your Current Tier
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-[#5B214F]">ðŸ¥‡ Gold Member</h3>
                  <span className="text-[11px] text-[#5B214F] font-bold">501 ”“ 1,500 Points</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2 font-bold text-[#5B214F]">
                  <CheckCircle2 className="w-4 h-4 text-[#5B214F] shrink-0" />
                  <span>1.5x Points Earning Rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1 Free Express Upgrade / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Priority Customer Support</span>
                </li>
              </ul>
            </div>

            {/* Platinum Tier */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xs hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-extrabold text-base text-[#241A21]">ðŸ’Ž Platinum Member</h3>
                  <span className="text-[11px] text-slate-500 font-medium">1,501 ”“ 3,000 Points</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li className="flex items-center gap-2 font-bold text-[#241A21]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>2x Points Earning Rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>1 Free Dry Clean Voucher / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Zero Express Delivery Fees</span>
                </li>
              </ul>
            </div>

            {/* VIP Diamond */}
            <div className="bg-gradient-to-b from-amber-50 to-amber-100/60 p-6 rounded-3xl border border-amber-300/80 space-y-4 shadow-md">
              <div className="flex justify-between items-center pb-3 border-b border-amber-200">
                <div>
                  <h3 className="font-extrabold text-base text-amber-950">ðŸ‘‘ VIP Diamond</h3>
                  <span className="text-[11px] text-amber-800 font-bold">3,000+ Points</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-amber-950 font-medium">
                <li className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>3x Points Earning Rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Dedicated Household Concierge</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Unlimited Free Express &amp; Dry Clean Vouchers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* How to Earn Points Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-black text-[#241A21] font-poppins flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>How to Earn More Reward Points</span>
            </h2>
            <p className="text-xs text-[#6F626A] mt-0.5">Boost your points balance with easy everyday actions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#FCF9F7] border border-slate-200 space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-[#F7F0F2] text-[#5B214F] flex items-center justify-center font-bold text-xl">
                ðŸ§º
              </div>
              <h3 className="font-black text-sm text-[#241A21]">Place Laundry Orders</h3>
              <p className="text-xs text-[#6F626A] leading-relaxed">Earn 1 Point for every â‚¹10 spent on Wash, Iron, or Dry Cleaning automatically.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCF9F7] border border-slate-200 space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
                ðŸŽ
              </div>
              <h3 className="font-black text-sm text-[#241A21]">Refer Friends &amp; Family</h3>
              <p className="text-xs text-[#6F626A] leading-relaxed">Get +100 Bonus Points when your friend completes their first laundry delivery.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FCF9F7] border border-slate-200 space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl">
                â­
              </div>
              <h3 className="font-black text-sm text-[#241A21]">Rate &amp; Review Service</h3>
              <p className="text-xs text-[#6F626A] leading-relaxed">Earn +25 Points every time you rate your delivery driver or wash quality.</p>
            </div>
          </div>
        </div>

        {/* Loyalty Activity History Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-4">
          <h2 className="text-lg font-black text-[#241A21] font-poppins flex items-center gap-2">
            <History className="w-5 h-5 text-[#5B214F]" />
            <span>Recent Points Activity Log</span>
          </h2>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-extrabold">Date</th>
                  <th className="py-3 px-4 font-extrabold">Activity Description</th>
                  <th className="py-3 px-4 font-extrabold">Points</th>
                  <th className="py-3 px-4 font-extrabold text-right">Value Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500 font-mono">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-[#241A21]">{item.title}</td>
                    <td className="py-3.5 px-4 font-extrabold">
                      <span className={item.type === 'REDEEMED' ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full' : 'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full'}>
                        {item.points}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-slate-600">
                      {item.discountValue || item.orderAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

