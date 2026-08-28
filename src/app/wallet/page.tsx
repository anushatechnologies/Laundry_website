'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import {
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Coins,
  History,
  Zap,
} from 'lucide-react';

export default function WalletPage() {
  const { wallet, rechargeWallet, showToast } = useApp();
  const [rechargeAmount, setRechargeAmount] = useState<number>(500);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleRecharge = () => {
    if (rechargeAmount <= 0) return;
    rechargeWallet(rechargeAmount);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText('REF-RAHUL100');
    setCopiedRef(true);
    showToast('Referral code REF-RAHUL100 copied!', 'success');
    setTimeout(() => setCopiedRef(false), 3000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] text-[#5B214F] text-[11px] font-extrabold uppercase tracking-widest border border-indigo-100">
            <Coins className="w-3.5 h-3.5" />
            <span>Digital Prepaid &amp; Rewards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#241A21] font-poppins tracking-tight">
            My LaundryFresh Wallet
          </h1>
          <p className="text-xs sm:text-sm text-[#6F626A] leading-relaxed">
            Instant 1-click checkout, instant refund credits, and automated referral reward bonuses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Wallet Balance Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#241A21] via-[#1E1B4B] to-[#312E81] text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden border border-white/10">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-[#5B214F]/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-indigo-300" />
                <span>Prepaid Balance</span>
              </div>
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full text-emerald-300 font-bold border border-white/10 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Safe &amp; Secure
              </span>
            </div>

            <div className="relative z-10">
              <span className="text-xs text-indigo-200 font-medium block">Available Balance</span>
              <span className="text-4xl sm:text-5xl font-black font-poppins text-white tracking-tight mt-1 block">
                â‚¹{wallet.balance.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Quick Recharge Box */}
            <div className="pt-4 border-t border-white/10 space-y-3 relative z-10">
              <span className="text-xs font-bold text-indigo-200 block">Quick Add Money:</span>
              <div className="grid grid-cols-4 gap-2">
                {[200, 500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRechargeAmount(amt)}
                    className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                      rechargeAmount === amt
                        ? 'bg-[#5B214F] text-white border-indigo-400 shadow-md shadow-indigo-500/30'
                        : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                    }`}
                  >
                    +â‚¹{amt}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRecharge}
                className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Recharge â‚¹{rechargeAmount} (Instant UPI / Card)</span>
              </button>
            </div>
          </div>

          {/* Referral & Rewards Card */}
          <div className="lg:col-span-6 space-y-6">
            {/* Reward Points */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#6F626A] uppercase tracking-wider block">
                  Reward Points Earned
                </span>
                <span className="text-3xl font-black text-[#241A21] font-poppins mt-1 block">
                  {wallet.rewardPoints} Points
                </span>
                <p className="text-xs text-[#6F626A] mt-1 font-medium">
                  10 Points = â‚¹1. Auto-redeemable at checkout.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#F7F0F2] text-[#5B214F] flex items-center justify-center shadow-inner">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>

            {/* Referral Sharing */}
            <div className="bg-gradient-to-br from-[#F7F0F2] to-indigo-50/50 rounded-3xl p-6 sm:p-7 border border-indigo-100 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#5B214F] uppercase tracking-wider">
                <Gift className="w-4 h-4 text-[#5B214F]" />
                <span>Refer &amp; Earn Program</span>
              </div>
              <h3 className="font-black text-lg text-[#241A21]">
                Give â‚¹100, Get â‚¹100!
              </h3>
              <p className="text-xs text-[#6F626A] leading-relaxed">
                Your friends get â‚¹100 off on their first laundry order, and you receive â‚¹100 wallet credit when their order is delivered.
              </p>

              <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-indigo-100 shadow-xs">
                <div className="flex-1 px-3 py-1 font-mono font-bold text-sm text-[#241A21]">
                  REF-RAHUL100
                </div>
                <button
                  onClick={handleCopyReferral}
                  className="px-4 py-2 bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRef ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Ledger */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-black text-lg text-[#241A21] font-poppins flex items-center gap-2">
              <History className="w-5 h-5 text-[#5B214F]" />
              <span>Wallet Transaction Ledger</span>
            </h3>
            <span className="text-xs font-bold text-[#6F626A]">
              {wallet.transactions.length} Total Transactions
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {wallet.transactions.map((tx) => (
              <div key={tx.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      tx.type === 'CREDIT'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-[#241A21]">
                      {tx.description}
                    </div>
                    <div className="text-[11px] text-[#6F626A] font-mono mt-0.5">{tx.date}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-sm sm:text-base block ${
                      tx.type === 'CREDIT' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'}â‚¹{tx.amount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                    Bal: â‚¹{tx.balanceAfter}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

