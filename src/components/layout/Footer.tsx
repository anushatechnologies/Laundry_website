'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowRight, Star, ShieldCheck, Share2, Globe, Sparkles, Smartphone } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  const services = [
    { label: 'Wash & Fold (Per-KG)', href: '/services' },
    { label: 'Wash & Steam Iron', href: '/services' },
    { label: 'Premium Dry Cleaning', href: '/services' },
    { label: 'Steam Pressing Only', href: '/services' },
    { label: 'Saree & Ethnic Couture', href: '/services' },
    { label: 'Bedding & Home Textiles', href: '/services' },
    { label: 'Express Same-Day Care', href: '/services' },
  ];

  const company = [
    { label: 'About Us', href: '/about' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing & Slabs', href: '/pricing' },
    { label: 'Monthly Passes', href: '/subscriptions', highlight: 'text-[#D6B36A] font-bold' },
    { label: 'VIP Loyalty Perks', href: '/loyalty', highlight: 'text-[#D6B36A] font-bold' },
    { label: 'Corporate & B2B Contracts', href: '/corporate' },
    { label: 'Contact Support', href: '/contact' },
  ];

  const legal = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Cancellation Policy', href: '/cancellation-policy' },
    { label: 'Help & FAQ', href: '/faq' },
  ];

  const socials = [
    { icon: <Share2 className="w-4 h-4" />, href: '#', label: 'Instagram' },
    { icon: <Globe className="w-4 h-4" />, href: '#', label: 'Twitter' },
    { icon: <MessageSquare className="w-4 h-4" />, href: 'https://wa.me/919876543210', label: 'WhatsApp' },
  ];

  const trustBadges = [
    { icon: <ShieldCheck className="w-4 h-4 text-[#D6B36A]" />, text: 'Ozone Sanitized & Hygienic' },
    { icon: <Star className="w-4 h-4 fill-[#D6B36A] text-[#D6B36A]" />, text: '4.9★ Rated (10k+ Reviews)' },
    { icon: <Clock className="w-4 h-4 text-[#D6B36A]" />, text: 'Guaranteed On-Time Delivery' },
  ];

  return (
    <footer className="bg-[#2B1326] text-white border-t border-white/10">

      {/* Newsletter Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D6B36A] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LaundryFresh Privilege Club</span>
              </div>
              <h3 className="text-xl font-black text-white font-poppins">Get VIP Offers &amp; Fabric Care Tips</h3>
              <p className="text-[#CDBFC6] text-xs">Join 15,000+ happy households. Zero spam, unsubscribe anytime.</p>
            </div>
            {subscribed ? (
              <div className="flex items-center gap-2 text-[#3F8F6B] font-bold text-sm bg-white/10 px-4 py-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-5 h-5" />
                You&apos;re subscribed! Check your inbox.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 sm:w-72 h-12 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs font-bold outline-none focus:border-[#D6B36A] focus:ring-2 focus:ring-[#D6B36A]/20 transition-all"
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shrink-0 transition-all shadow-md cursor-pointer border border-[#D6B36A]/30 active:scale-95"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3 group w-fit">
              <img
                src="/logo.png"
                alt="LaundryFresh Logo"
                className="w-11 h-11 rounded-2xl object-contain bg-white p-0.5 shadow-lg shadow-black/20 shrink-0 border border-white/20"
              />
              <div>
                <span className="font-black text-2xl tracking-tight text-white leading-none block font-poppins">
                  Laundry<span className="text-[#D6B36A]">Fresh</span>
                </span>
                <span className="text-[9px] text-[#B76E79] uppercase tracking-widest font-extrabold mt-1 block">
                  LUXURY FABRIC CARE
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#CDBFC6] leading-relaxed max-w-xs">
              Professional laundry &amp; dry cleaning with free doorstep pickup and on-time delivery. We care for your clothes like our own.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              {trustBadges.map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] font-semibold text-[#E8DDE1]">
                  <span>{t.icon}</span>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  title={s.label}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#5B214F] border border-white/10 hover:border-[#D6B36A]/50 flex items-center justify-center text-[#E8DDE1] hover:text-white transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black text-[#D6B36A] uppercase tracking-widest">Our Services</h4>
            <ul className="space-y-2.5">
              {services.map((s) => (
                <li key={s.label}>
                  <Link href={s.href} className="text-xs sm:text-sm text-[#E8DDE1] hover:text-[#D6B36A] transition-colors inline-block">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black text-[#D6B36A] uppercase tracking-widest">Company</h4>
            <ul className="space-y-2.5">
              {company.map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className={`text-xs sm:text-sm hover:text-[#D6B36A] transition-colors ${c.highlight || 'text-[#E8DDE1]'}`}>
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black text-[#D6B36A] uppercase tracking-widest">Contact &amp; Support</h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#E8DDE1]">
              <a href="tel:+919876543210" className="flex items-center gap-2.5 hover:text-[#D6B36A] transition-colors">
                <Phone className="w-4 h-4 text-[#D6B36A] shrink-0" />
                <span>+91 98765 43210</span>
              </a>
              <a href="mailto:hello@laundryfresh.com" className="flex items-center gap-2.5 hover:text-[#D6B36A] transition-colors">
                <Mail className="w-4 h-4 text-[#D6B36A] shrink-0" />
                <span>hello@laundryfresh.com</span>
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D6B36A] shrink-0 mt-0.5" />
                <span>Kukatpally, Hitech City<br />Hyderabad - 500072</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#D6B36A] shrink-0" />
                <span>Mon – Sun: 8:00 AM – 9:00 PM</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex flex-wrap gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] font-bold text-[#CDBFC6] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#D6B36A]" />
                  <span>iOS &amp; Android Apps Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-10 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#9A8D94]">
          <div>
            © {new Date().getFullYear()} LaundryFresh Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3F8F6B] animate-pulse" />
            <span className="text-[#E8DDE1] font-bold">100% Guaranteed Fabric Care</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="/cancellation-policy" className="hover:text-white transition-colors">Cancellation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
