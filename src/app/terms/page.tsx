import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 text-xs sm:text-sm text-gray-700 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3B36] font-poppins">
          Terms & Conditions of Service
        </h1>
        <p className="text-gray-500">Last updated: August 2026</p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3B36]">1. Service Scope & Pricing</h2>
          <p>
            LaundryFresh provides doorstep collection, washing, drying, steam ironing, and dry-cleaning services. Daily laundry is charged on a calibrated Per-KG basis, with final price confirmed upon physical weighing at our facility.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3B36]">2. OTP Handover Protocol</h2>
          <p>
            To prevent lost or misplaced bags, customers must verify the 4-digit OTP provided on their screen with the pickup and delivery agents.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-[#0B3B36]">3. Garment Care & Liability</h2>
          <p>
            We follow standard international textile care instructions. In the rare event of fabric damage due to machine failure, compensation is covered under our fabric protection policy up to 5x service fee.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
