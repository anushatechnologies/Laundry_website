'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Award, Clock, Users, Leaf, Zap, ArrowRight } from 'lucide-react';


function useVisible(threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'story' | 'mission' | 'values'>('story');
  const statsSection = useVisible(0.1);
  const featuresSection = useVisible(0.1);

  const stats = [
    { value: '2020', label: 'Founded', icon: 'ðŸš€', color: 'bg-indigo-50 text-indigo-600' },
    { value: '10K+', label: 'Happy Customers', icon: 'ðŸ˜Š', color: 'bg-emerald-50 text-emerald-600' },
    { value: '50K+', label: 'Orders Completed', icon: 'ðŸ“¦', color: 'bg-amber-50 text-amber-600' },
    { value: '12+', label: 'Cities Served', icon: 'ðŸ™ï¸', color: 'bg-purple-50 text-purple-600' },
    { value: '4.9★', label: 'Customer Rating', icon: 'â­', color: 'bg-rose-50 text-rose-600' },
    { value: '98%', label: 'On-Time Delivery', icon: 'â±ï¸', color: 'bg-sky-50 text-sky-600' },
  ];

  const features = [
    { icon: <ShieldCheck className="w-6 h-6" />, title: 'Ozone Sanitization', desc: '99.9% germ-free deep cleaning using hospital-grade ozone technology.', color: 'bg-indigo-50 text-indigo-500' },
    { icon: <Leaf className="w-6 h-6" />, title: 'Eco-Friendly Process', desc: 'Biodegradable detergents and energy-efficient machines for zero ecological guilt.', color: 'bg-emerald-50 text-emerald-500' },
    { icon: <Zap className="w-6 h-6" />, title: 'Smart Tracking', desc: 'Real-time order tracking ”” from pickup to doorstep delivery.', color: 'bg-amber-50 text-amber-500' },
    { icon: <Award className="w-6 h-6" />, title: '8-Step QC Inspection', desc: 'Every garment inspected by our quality team before it reaches you.', color: 'bg-purple-50 text-purple-500' },
    { icon: <Clock className="w-6 h-6" />, title: '24-Hour Turnaround', desc: 'Fresh clothes back in your hands within 24 hours, guaranteed.', color: 'bg-sky-50 text-sky-500' },
    { icon: <Heart className="w-6 h-6" />, title: 'Fabric Care Promise', desc: 'Garment-specific care with premium detergents for every fabric type.', color: 'bg-rose-50 text-rose-500' },
  ];

  const team = [
    { name: 'Arjun Mehta', role: 'Co-Founder & CEO', emoji: 'ðŸ‘¨”ðŸ’¼', bio: '10 years in logistics & supply chain.' },
    { name: 'Priya Sharma', role: 'Co-Founder & COO', emoji: 'ðŸ‘©”ðŸ’¼', bio: 'Former operations head at Swiggy.' },
    { name: 'Rahul Nair', role: 'Head of Technology', emoji: 'ðŸ‘¨”ðŸ’»', bio: 'Ex-Amazon engineer, 8 years in SaaS.' },
    { name: 'Divya Krishnan', role: 'Head of Quality', emoji: 'ðŸ‘©”ðŸ”¬', bio: 'Textile science expert with 12+ years.' },
  ];

  const tabContent = {
    story: {
      heading: 'How LaundryFresh Was Born',
      body: `It started with a simple frustration. Our founders spent hours every week doing laundry ”” time that could be spent with family, pursuing hobbies, or growing their careers.\n\nIn 2020, we launched LaundryFresh with a mission: to eliminate laundry stress for every Indian household. Starting from a single facility in Hyderabad, we've grown to serve 12+ cities with thousands of happy customers trusting us with their wardrobe every week.`,
    },
    mission: {
      heading: 'Our Mission',
      body: `To make professional fabric care accessible, affordable, and effortless for every Indian household.\n\nWe believe your time is invaluable. By combining cutting-edge ozone sanitization technology, a rigorous 8-step quality inspection, and a seamless digital experience ”” we deliver freshness that you can trust.`,
    },
    values: {
      heading: 'Our Core Values',
      body: `ðŸ¤ Trust ”” We handle your garments with the same care we'd give our own.\n\nðŸŒ± Sustainability ”” Eco-friendly processes, biodegradable detergents, energy-efficient operations.\n\nâš¡ Speed ”” 24-hour turnaround without compromising quality.\n\nðŸ’¯ Transparency ”” Fair weight-based pricing. No hidden charges, ever.\n\nðŸŽ¯ Excellence ”” 8-step QC inspection on every order, every time.`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F6FF]">
      <Navbar />

      {/* â”€â”€ Hero â”€â”€ */}
      <section className="relative overflow-hidden py-16 lg:py-24 page-hero-bg border-b border-slate-100">
        <div className="pointer-events-none absolute right-[5%] top-8 h-80 w-80 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="pointer-events-none absolute left-[8%] bottom-4 h-64 w-64 rounded-full bg-purple-100/30 blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="section-eyebrow mx-auto w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            About LaundryFresh
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#241A21] tracking-tight leading-tight">
            Redefining Fabric Care{' '}
            <span className="gradient-text">with Smart Tech</span>
          </h1>
          <p className="text-lg text-[#6F626A] max-w-2xl mx-auto leading-relaxed">
            Founded in 2020, LaundryFresh combines professional expertise with cutting-edge technology
            to deliver perfectly clean clothes ”” right to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/book"
              className="group flex items-center gap-2 px-8 py-4 bg-[#5B214F] hover:bg-[#48193F] text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95">
              Book Free Pickup <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/contact"
              className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-[#5B214F] border-2 border-indigo-100 font-bold text-sm rounded-2xl transition-all duration-200">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* â”€â”€ Stats Grid â”€â”€ */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div ref={statsSection.ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((s, i) => (
              <div key={i}
                className={`text-center p-5 rounded-2xl border border-slate-100 shadow-sm card-lift transition-all duration-500 ${statsSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: statsSection.visible ? `${i * 80}ms` : '0ms' }}>
                <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-xl mx-auto mb-3`}>{s.icon}</div>
                <div className="text-2xl font-black text-[#241A21]">{s.value}</div>
                <div className="text-xs text-[#6F626A] font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Story / Mission / Values â”€â”€ */}
      <section className="py-16 lg:py-24 bg-[#F5F6FF]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Nav */}
          <div className="flex items-center justify-center gap-1 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm w-fit mx-auto mb-12">
            {(['story', 'mission', 'values'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 capitalize ${activeTab === tab ? 'bg-[#5B214F] text-white shadow-md shadow-indigo-500/20' : 'text-[#6F626A] hover:text-[#241A21]'}`}>
                {tab === 'story' ? 'Our Story' : tab === 'mission' ? 'Mission' : 'Values'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 p-8 lg:p-12 transition-all duration-300">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#241A21] mb-6">{tabContent[activeTab].heading}</h2>
            <div className="space-y-4">
              {tabContent[activeTab].body.split('\n\n').map((para, i) => (
                <p key={i} className="text-[#6F626A] text-base leading-relaxed whitespace-pre-line">{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Features Grid â”€â”€ */}
      <section className="py-16 lg:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <div className="section-eyebrow mx-auto w-fit"><ShieldCheck className="w-3.5 h-3.5" />What Sets Us Apart</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#241A21] tracking-tight">
              Premium Service, <span className="text-[#5B214F]">Every Time</span>
            </h2>
          </div>
          <div ref={featuresSection.ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i}
                className={`group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3 card-lift transition-all duration-500 ${featuresSection.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: featuresSection.visible ? `${i * 100}ms` : '0ms' }}>
                <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>{f.icon}</div>
                <h3 className="font-extrabold text-[#241A21] text-base">{f.title}</h3>
                <p className="text-sm text-[#6F626A] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ Team â”€â”€ */}
      <section className="py-16 lg:py-24" style={{ background: 'linear-gradient(135deg,#241A21 0%,#1E1B4B 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-extrabold uppercase tracking-widest">
              <Users className="w-3.5 h-3.5" />
              Our Team
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              The People Behind <span className="gradient-text">LaundryFresh</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div key={i} className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center space-y-3 transition-all duration-300">
                <div className="text-5xl">{member.emoji}</div>
                <div>
                  <h3 className="font-extrabold text-white text-base">{member.name}</h3>
                  <p className="text-indigo-300 text-xs font-semibold mt-0.5">{member.role}</p>
                </div>
                <p className="text-white/50 text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA â”€â”€ */}
      <section className="py-14 bg-[#F7F0F2] border-t border-indigo-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-[#241A21]">Ready to Try LaundryFresh?</h2>
          <p className="text-[#6F626A]">Join 10,000+ happy customers. Your first order gets â‚¹100 off with code <code className="bg-white border border-indigo-100 px-2 py-0.5 rounded font-mono text-[#5B214F] font-bold text-sm">WELCOME100</code></p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/book"
              className="group flex items-center gap-2 px-8 py-4 bg-[#5B214F] hover:bg-[#48193F] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all duration-200">
              Book Free Pickup <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="px-8 py-4 bg-white border border-slate-200 text-[#5B214F] font-bold rounded-2xl hover:shadow-md transition-all duration-200">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

