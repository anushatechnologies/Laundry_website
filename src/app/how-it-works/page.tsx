'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Calendar,
  Truck,
  Sparkles,
  CheckCircle2,
  PackageCheck,
  ShieldCheck,
  Clock,
  Scale,
  ArrowRight,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '1',
      title: 'Book Your Pickup',
      subtitle: 'Schedule in 30 seconds',
      icon: Calendar,
      color: 'from-teal-500 to-emerald-600',
      description:
        'Choose everyday Wash & Fold (Per-KG) or select individual garments for premium steam pressing and dry cleaning. Pick your preferred doorstep pickup date and time slot.',
      features: ['Select pickup & delivery time slots', 'Apply instant first-order discount code', 'Add special fabric care instructions'],
    },
    {
      num: '2',
      title: 'Doorstep Pickup & Digital Tagging',
      subtitle: 'Contactless & verified',
      icon: Truck,
      color: 'from-blue-500 to-cyan-600',
      description:
        'Our trained rider arrives at your address with tamper-evident laundry bags. Garments are counted, digitally tagged with barcoded labels, and a pickup receipt is generated.',
      features: ['GPS live tracking of pickup agent', 'Tamper-evident garment seals', 'Real-time bag count confirmation'],
    },
    {
      num: '3',
      title: 'Precision Wash & Eco Treatment',
      subtitle: 'Fabrics sorted by care label',
      icon: Sparkles,
      color: 'from-teal-600 to-teal-800',
      description:
        'At our modern processing facility, your laundry is sorted by fabric type and color. We weigh on digital scales and sanitize using skin-safe, hypoallergenic eco-detergents.',
      features: ['Digital calibrated scale weighing', 'Hydrocarbon solvent dry cleaning', 'Anti-bacterial ozone sanitization'],
    },
    {
      num: '4',
      title: 'Steam Pressing & 6-Point Quality Check',
      subtitle: 'Crisp finish & inspection',
      icon: PackageCheck,
      color: 'from-amber-500 to-orange-600',
      description:
        'Garments are vacuum steam pressed on industrial ironers to restore shape. Every single garment undergoes a 6-point inspection for stain removal, collar stiffness, and missing buttons.',
      features: ['High-pressure Italian steam tables', '6-point thorough quality inspection', 'Anti-wrinkle hanger / fold packaging'],
    },
    {
      num: '5',
      title: 'Delivered Fresh to Your Doorstep',
      subtitle: 'On-time guarantee',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-700',
      description:
        'Your fresh, crisp clothes are delivered right to your doorstep in premium breathable garment bags or compact neat bundles, ready to wear.',
      features: ['24-48h standard turnaround or same-day express', 'Secure OTP verification on delivery', 'UPI / Card / Wallet payment at delivery'],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#0B3B36] to-[#0F766E] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-bold text-teal-200 uppercase tracking-wider bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20">
              5 Simple Steps to Fresh Wardrobe
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-poppins">
              How Laundry Pickup & Care Works
            </h1>
            <p className="text-sm sm:text-base text-teal-100 max-w-2xl mx-auto">
              From online booking to doorstep return in 24 hours — see how our state-of-the-art facility gives your clothes premium care with zero effort from you.
            </p>
          </div>
        </section>

        {/* Steps Flow Container */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isEven = idx % 2 === 1;

            return (
              <div
                key={step.num}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-8 lg:gap-12 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm hover:shadow-md transition-all`}
              >
                {/* Visual Icon Badge Column */}
                <div className="w-full lg:w-1/3 flex flex-col items-center justify-center text-center">
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center text-4xl shadow-xl relative`}
                  >
                    <Icon className="w-12 h-12" />
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#0B3B36] text-white text-xs font-extrabold flex items-center justify-center border-2 border-white">
                      {step.num}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4">
                    Step 0{step.num}
                  </span>
                </div>

                {/* Content Column */}
                <div className="w-full lg:w-2/3 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider">
                      {step.subtitle}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3B36] font-poppins mt-0.5">
                      {step.title}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                    {step.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0F766E] shrink-0" />
                        <span className="font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom CTA Card */}
          <div className="bg-gradient-to-r from-[#0B3B36] to-[#0F766E] rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-poppins">
              Ready to Experience Zero-Effort Laundry?
            </h3>
            <p className="text-xs sm:text-sm text-teal-100 max-w-xl mx-auto">
              Book your first order now and get ₹100 instant discount using code <span className="font-bold text-amber-300">WELCOME100</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Schedule a Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all"
              >
                <span>Explore Garment Pricing</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
