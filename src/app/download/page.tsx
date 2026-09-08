'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Download, Sparkles, CheckCircle, Copy, ShieldCheck, Smartphone } from 'lucide-react';

function DownloadContent() {
  const searchParams = useSearchParams();
  const refCode = (searchParams.get('ref') || searchParams.get('code') || 'LFD7E5EE').toUpperCase().trim();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Attempt auto-copy so mobile app can read clipboard on first launch
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(refCode).catch(() => {});
    }
  }, [refCode]);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(refCode).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {});
    }
  };

  const handleDownloadClick = () => {
    // Ping click tracking endpoint
    try {
      fetch(`https://laundry.anushatechnologies.com/api/referrals/click/${encodeURIComponent(refCode)}`, { mode: 'no-cors' });
    } catch {}
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 px-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500" />
        
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30">
          🧺
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          LaundryFresh Android App
        </h1>
        <p className="text-slate-400 text-xs mb-6">
          Doorstep Laundry, Steam Press & Dry Cleaning in Hyderabad
        </p>

        {/* Invite Box */}
        <div className="bg-slate-950/80 border border-dashed border-orange-500/40 rounded-2xl p-5 mb-6 text-center">
          <div className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Friend's Exclusive Invitation</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl font-black font-mono text-orange-400 tracking-wider">
              {refCode}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
            >
              {copied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[11px] font-bold mt-3">
            <span>✓</span>
            <span>₹50 Welcome Cash will be credited</span>
          </div>
        </div>

        {/* Download Button */}
        <a
          href="/LaundryFresh.apk"
          download="LaundryFresh.apk"
          onClick={handleDownloadClick}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black py-4 px-6 rounded-2xl shadow-lg shadow-orange-500/40 hover:shadow-orange-500/60 transition-all text-base"
        >
          <Download className="w-5 h-5" />
          <span>Download Android App (APK)</span>
        </a>

        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 mt-4">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Verified</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Smartphone className="w-3.5 h-3.5" /> Android 8.0+</span>
        </div>

        {/* Steps */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-left">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Quick 3-Step Setup
          </div>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
              <span>Tap <strong>Download</strong> above to save the LaundryFresh APK.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
              <span>Open the file in your notification bar and tap <strong>Install</strong>.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-orange-400 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
              <span>Register with your phone number — your code <strong>{refCode}</strong> is auto-applied for ₹50 wallet cash!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <Suspense fallback={<div className="text-white text-center p-8">Loading download page...</div>}>
          <DownloadContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
