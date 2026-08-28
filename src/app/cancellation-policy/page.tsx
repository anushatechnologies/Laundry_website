'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { XCircle, CheckCircle2, Clock, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Transparent Terms
            </span>
            <h1 className="text-3xl font-extrabold text-[#0B3B36] font-poppins mt-2">
              Cancellation & Rescheduling Policy
            </h1>
            <p className="text-xs text-gray-500 mt-1">Last Updated: August 2026</p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-[#0B3B36] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>1. Free Cancellation Before Pickup</span>
              </h2>
              <p>
                You can cancel or reschedule your pickup slot anytime <strong>up to 1 hour before the scheduled pickup window</strong> with <strong>zero cancellation fees</strong>. If prepaid, the entire amount will be refunded immediately to your wallet or original payment mode.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-[#0B3B36] flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>2. Doorstep Rescheduling & Gate Unavailability</span>
              </h2>
              <p>
                If our rider arrives at your doorstep and is unable to reach you or collect the laundry after multiple attempts, you may reschedule the pickup free of charge for the next available slot.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-[#0B3B36] flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-600" />
                <span>3. Cancellation After Garments Are Picked Up</span>
              </h2>
              <p>
                Once garments have been picked up and transferred to the laundry processing facility:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Orders that have not yet entered the washing/chemical processing stage may be cancelled with a nominal ₹50 pickup & return logistics charge.</li>
                <li>Orders that have already completed washing, dry cleaning, or steam pressing cannot be cancelled, as the process is irreversible.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-extrabold text-[#0B3B36] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0F766E]" />
                <span>4. How to Cancel or Reschedule an Order</span>
              </h2>
              <p>
                Simply navigate to <Link href="/dashboard" className="text-[#0F766E] font-bold underline">Customer Dashboard → Orders</Link>, click on your active order, and select <strong>"Cancel Order"</strong> or <strong>"Reschedule Pickup"</strong>. Alternatively, you can message our WhatsApp support desk for instant help.
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
              href="/book"
              className="px-4 py-2 bg-[#0F766E] text-white text-xs font-bold rounded-xl hover:bg-[#0B3B36]"
            >
              Book a Pickup
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
