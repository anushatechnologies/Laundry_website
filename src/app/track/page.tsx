'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Search, Clock, Sparkles, ShieldCheck, ArrowRight, Zap, Package } from 'lucide-react';

export default function TrackSearchPage() {
  const router = useRouter();
  const [orderInput, setOrderInput] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const orderId = orderInput.trim().toUpperCase();
    if (orderId) router.push(`/track/${encodeURIComponent(orderId)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-[#F7F0F2] text-[#5B214F] shadow-lg shadow-indigo-500/10 ring-8 ring-white">
          <Clock className="h-8 w-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] text-[#5B214F] text-[11px] font-extrabold uppercase tracking-widest border border-indigo-100 mb-3">
          <Zap className="w-3.5 h-3.5" />
          <span>Real-Time Order Tracking</span>
        </div>
        <h1 className="font-poppins text-3xl font-black tracking-tight text-[#241A21] sm:text-5xl">
          Track Your Laundry Journey
        </h1>
        <p className="mb-8 mt-3 max-w-lg text-sm leading-6 text-[#6F626A]">
          Follow every step from doorstep pickup to 8-step quality-checked delivery using the reference in your confirmation SMS or receipt.
        </p>

        <form onSubmit={handleSearch} className="flex w-full gap-2 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-2xl">
          <div className="relative flex min-w-0 flex-1 items-center pl-3">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              required
              value={orderInput}
              onChange={(event) => setOrderInput(event.target.value)}
              placeholder="Enter Order ID (e.g. LAU10245)"
              className="w-full bg-transparent px-3 py-3 text-sm font-bold uppercase tracking-wider text-[#241A21] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#5B214F] hover:bg-[#48193F] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer active:scale-95"
          >
            <span>Track Status</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 grid w-full gap-4 text-left sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#241A21]">
              <ShieldCheck className="h-4 w-4 text-[#5B214F]" />
              <span>Private &amp; Secure</span>
            </div>
            <p className="text-xs leading-5 text-[#6F626A]">
              Only your timeline is shown publicly. Handover QR codes stay safe inside your verified account.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5 shadow-sm space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span>Helpful Tip</span>
            </div>
            <p className="text-xs leading-5 text-amber-900/80">
              Sign in to view all past orders, weight receipts, invoices and saved pickup addresses in one place.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

