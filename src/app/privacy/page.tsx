import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 text-xs sm:text-sm text-gray-700 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B36] font-poppins">
          Privacy Policy
        </h1>
        <p className="text-gray-500">Last updated: August 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3B36]">1. Data Collection</h2>
          <p>
            We collect your name, phone number, delivery address, and payment transactions to provide accurate pickup, OTP verification, and order status updates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3B36]">2. Security & Payments</h2>
          <p>
            Payment processing is secured via Razorpay with 256-bit SSL encryption. We never store credit card or UPI credentials on our servers.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
