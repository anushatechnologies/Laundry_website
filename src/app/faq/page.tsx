'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HelpCircle, ChevronDown, Search, Sparkles, Phone, Mail, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const categories = ['ALL', 'Services & Pricing', 'Pickup & Delivery', 'Quality & Hygiene', 'Subscriptions & Payments'];

  const faqs = [
    {
      category: 'Services & Pricing',
      q: 'How does Per-KG pricing work for everyday laundry?',
      a: 'When booking online, you select your estimated load (e.g. 4-5 KG). When the clothes arrive at our facility, our staff weighs them on certified digital scales and updates the exact weight. You will receive an instant notification with the confirmed total before final processing.',
    },
    {
      category: 'Services & Pricing',
      q: 'What is the minimum order weight or amount?',
      a: 'There is no minimum order! We accept orders from 1 KG onwards. Free doorstep delivery applies automatically on all orders above â‚¹299.',
    },
    {
      category: 'Quality & Hygiene',
      q: 'What is Ozone Sanitization and how does it benefit my clothes?',
      a: 'Ozone wash utilizes activated oxygen in cold water to destroy 99.9% of bacteria, viruses, and body odors while protecting delicate fabric fibers and retaining colors better than hot water or harsh bleach.',
    },
    {
      category: 'Quality & Hygiene',
      q: 'How do you prevent mixing of garments between customers?',
      a: 'Every customer order receives an individual barcoded mesh wash bag. Garments are washed, dried, pressed, and inspected in dedicated isolated batches â€” never mixed with other customers.',
    },
    {
      category: 'Pickup & Delivery',
      q: 'What is the standard turnaround time for delivery?',
      a: 'Standard wash & fold is delivered within 24-36 hours. Dry cleaning takes 48 hours. We also offer 24h Express and Same-Day 12h priority processing for urgent requirements.',
    },
    {
      category: 'Pickup & Delivery',
      q: 'How do Pickup and Delivery verification codes work?',
      a: 'Whenever an agent arrives at your door for pickup or delivery, a 4-digit verification code appears in your order tracking screen. You provide this OTP to the agent to confirm safe collection and drop-off, preventing any misplaced laundry bags.',
    },
    {
      category: 'Subscriptions & Payments',
      q: 'How do Monthly Subscription Passes save me money?',
      a: 'Monthly passes provide bulk weight allowances (e.g. 50 KG for â‚¹1,999) which brings your per-KG cost down to â‚¹40/KG. Plus, subscribers enjoy free priority delivery on every order and unused KG rollovers!',
    },
    {
      category: 'Subscriptions & Payments',
      q: 'What payment methods do you accept?',
      a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, LaundryFresh Wallet balance, and Cash on Delivery / Pay on Delivery.',
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCategory = activeCategory === 'ALL' || f.category === activeCategory;
    const matchesSearch =
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F7F0F2] text-[#5B214F] text-[11px] font-extrabold uppercase tracking-widest border border-indigo-100">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#241A21] font-poppins tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#6F626A] leading-relaxed">
            Everything you need to know about our fabric care, per-KG weighing, pickup slots, and doorstep delivery.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. per-kg, ozone, delivery)..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold text-[#241A21] shadow-md focus:outline-none focus:ring-2 focus:ring-[#5B214F] focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#5B214F] text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-extrabold text-sm sm:text-base text-[#241A21] leading-snug">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-[#F7F0F2] text-[#5B214F] rotate-180' : 'bg-slate-50 text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#6F626A] leading-relaxed border-t border-slate-50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 p-8 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-[#241A21]">No matching questions found</h3>
              <p className="text-xs text-[#6F626A]">
                Have a specific question not covered here? Feel free to reach out to our team directly.
              </p>
            </div>
          )}
        </div>

        {/* Still Have Questions Banner */}
        <div className="bg-gradient-to-r from-[#241A21] to-[#1E1B4B] text-white rounded-3xl p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl font-black font-poppins text-white">Still have questions?</h3>
            <p className="text-xs text-indigo-200">Our customer support team is available 7 days a week from 8 AM to 9 PM.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#5B214F] hover:bg-[#48193F] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

