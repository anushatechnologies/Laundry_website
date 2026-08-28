'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, RotateCcw, Clock, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Customer Protection & Guarantee
            </span>
            <h1 className="text-3xl font-extrabold text-[#0B3B36] font-poppins mt-2">
              Refund & Quality Guarantee Policy
            </h1>
            <p className="text-xs text-gray-500 mt-1">Last Updated: August 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-[#0B3B36] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0F766E]" />
                <span>1. 100% Quality Assurance & Free Re-wash</span>
              </h2>
              <p>
                At LaundryFresh, our priority is zero defect laundry care. If you are not completely satisfied with the cleanliness, stain removal, or steam pressing of any garment, report it within <strong>24 hours of delivery</strong> through your dashboard or customer support. We will collect the garment and perform a complimentary re-cleaning at zero additional charge.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-[#0B3B36] flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#0F766E]" />
                <span>2. Refund Eligibility & Processing</span>
              </h2>
              <p>Refunds are initiated under the following circumstances:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Pre-paid orders cancelled prior to driver pickup.</li>
                <li>Weight discrepancy adjustments where the verified facility weight is lower than the customer estimate.</li>
                <li>Rare instances where a reported quality issue cannot be resolved through a complimentary re-wash.</li>
                <li>Damaged or missing garments verified by our CCTV and digital tagging audit.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-[#0B3B36] flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>3. Refund Timelines & Mode of Payment</span>
              </h2>
              <p>
                Approved refunds are processed back to the original payment source or your in-app <strong>LaundryFresh Wallet</strong>:
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 font-medium">
                <div className="flex justify-between border-b pb-1">
                  <span>LaundryFresh Wallet:</span>
                  <span className="font-bold text-emerald-700">Instant (Within 5 minutes)</span>
                </div>
                <div className="flex justify-between border-b pb-1">
                  <span>UPI / Net Banking:</span>
                  <span className="font-bold text-gray-800">1 to 3 Business Days</span>
                </div>
                <div className="flex justify-between">
                  <span>Credit / Debit Cards:</span>
                  <span className="font-bold text-gray-800">3 to 5 Business Days</span>
                </div>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-[#0B3B36] flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <span>4. Garment Value Liability</span>
              </h2>
              <p>
                In the rare case of unresolvable damage or loss caused directly by our processing, compensation is provided up to 10× the service charge of the affected item, or as per standard fabric care guidelines. Premium couture items must be declared prior to processing.
              </p>
            </section>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#0F766E] hover:underline"
            >
              ← Back to Customer Dashboard
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 bg-[#0F766E] text-white text-xs font-bold rounded-xl hover:bg-[#0B3B36]"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
