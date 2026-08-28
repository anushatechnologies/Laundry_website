'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  CheckCircle2,
  FileSpreadsheet,
  ShieldCheck,
  Truck,
  Sparkles,
  Send,
  Hotel,
  Activity,
  Dumbbell,
  GraduationCap,
  Award,
  Clock,
  QrCode,
  ArrowRight,
} from 'lucide-react';

export default function CorporatePage() {
  const { showToast } = useApp();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    industry: 'Hotel / Hospitality',
    contactPerson: '',
    phone: '',
    email: '',
    estimatedDailyKg: '50-100 KG',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    showToast('B2B quotation request submitted! Our corporate account manager will contact you within 2 hours.', 'success');
  };

  const industries = [
    { name: 'Hotels & Resorts', icon: <Hotel className="w-6 h-6 text-[#5B214F]" />, desc: 'Bedsheets, duvet covers, bathrobes & express guest laundry turnaround.' },
    { name: 'Hospitals & Clinics', icon: <Activity className="w-6 h-6 text-emerald-600" />, desc: 'Thermal ozone sanitization and sterile scrub packaging with full audit logs.' },
    { name: 'Gyms & Spas', icon: <Dumbbell className="w-6 h-6 text-amber-600" />, desc: 'High-frequency fresh microfiber towel exchanges and staff uniforms.' },
    { name: 'Colleges & Hostels', icon: <GraduationCap className="w-6 h-6 text-purple-600" />, desc: 'Bulk student laundry bags with individual barcode tracking & bag-level delivery.' },
  ];

  const enterpriseFeatures = [
    { icon: <QrCode className="w-5 h-5 text-[#5B214F]" />, title: 'RFID & Barcode Tagging', desc: 'Zero garment loss with digital piece-by-piece tracking.' },
    { icon: <Clock className="w-5 h-5 text-[#5B214F]" />, title: 'Guaranteed 12hâ€“24h SLAs', desc: 'Strict contractual turnarounds with scheduled daily van visits.' },
    { icon: <FileSpreadsheet className="w-5 h-5 text-[#5B214F]" />, title: 'GST-Compliant Monthly Invoicing', desc: 'Consolidated credit billing with itemized weighment slips.' },
    { icon: <ShieldCheck className="w-5 h-5 text-[#5B214F]" />, title: 'Hospital-Grade Ozone Wash', desc: '99.9% germ disinfection certified for clinical & hospitality standards.' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-14">
        {/* Header Hero */}
        <div className="bg-gradient-to-br from-[#241A21] via-[#1E1B4B] to-[#312E81] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-[#5B214F]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-extrabold uppercase tracking-widest border border-white/15">
              <Building2 className="w-3.5 h-3.5" />
              <span>Corporate &amp; Enterprise Contracts</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight font-poppins leading-tight text-white">
              Commercial Linen &amp; Uniform Care at Industrial Scale
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-2xl leading-relaxed">
              Serving 120+ enterprises across hospitality, healthcare, fitness, and education with RFID barcode tagging, scheduled van pickups, GST billing, and dedicated SLA contracts.
            </p>
          </div>
        </div>

        {/* Enterprise Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {enterpriseFeatures.map((f, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F7F0F2] flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-extrabold text-base text-[#241A21]">{f.title}</h3>
              <p className="text-xs text-[#6F626A] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Industries Grid */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#241A21] font-poppins">
              Tailored by Industry
            </h2>
            <p className="text-xs sm:text-sm text-[#6F626A]">
              Custom washing chemistry, folding standards, and packaging designed for your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl hover:shadow-2xl transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  {ind.icon}
                </div>
                <h3 className="font-black text-base text-[#241A21]">{ind.name}</h3>
                <p className="text-xs text-[#6F626A] leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Proposal Request Form */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-2xl max-w-4xl mx-auto space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold text-[#5B214F] uppercase tracking-widest bg-[#F7F0F2] px-3 py-1 rounded-full border border-indigo-100 inline-block">
              GET A QUOTE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#241A21] font-poppins">
              Request a Customized B2B Proposal
            </h2>
            <p className="text-xs sm:text-sm text-[#6F626A]">
              Get corporate contract pricing tailored to your weekly volume and turnaround needs.
            </p>
          </div>

          {formSubmitted ? (
            <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-black text-[#241A21]">Proposal Request Received!</h3>
              <p className="text-xs sm:text-sm text-[#6F626A] max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{formData.contactPerson}</strong>. Our enterprise specialist will review your requirements ({formData.estimatedDailyKg} for {formData.businessName}) and share tier rates within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#241A21] block">Company / Facility Name</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Grand Vista Hotel & Suites"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B214F] focus:border-transparent focus:outline-none bg-[#FCF9F7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#241A21] block">Industry Sector</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B214F] focus:border-transparent focus:outline-none bg-[#FCF9F7]"
                  >
                    <option>Hotel / Hospitality</option>
                    <option>Hospital / Diagnostic Center</option>
                    <option>Hostel / PG / Student Housing</option>
                    <option>Gym / Fitness Center</option>
                    <option>Salon &amp; Spa</option>
                    <option>Corporate Office / Tech Park</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#241A21] block">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B214F] focus:border-transparent focus:outline-none bg-[#FCF9F7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#241A21] block">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B214F] focus:border-transparent focus:outline-none bg-[#FCF9F7]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#241A21] block">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@hotel.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B214F] focus:border-transparent focus:outline-none bg-[#FCF9F7]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#241A21] block">Estimated Load Volume (Daily / Weekly)</label>
                <select
                  value={formData.estimatedDailyKg}
                  onChange={(e) => setFormData({ ...formData, estimatedDailyKg: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B214F] focus:border-transparent focus:outline-none bg-[#FCF9F7]"
                >
                  <option>20-50 KG / Day (Small Salons &amp; Boutique Stays)</option>
                  <option>50-100 KG / Day (Medium PGs &amp; Gyms)</option>
                  <option>100-300 KG / Day (Hotels &amp; Clinics)</option>
                  <option>300+ KG / Day (Enterprise / Bulk Contracts)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#241A21] block">Specific Requirements / Turnaround Time</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Daily morning pickup by 9 AM, separate packaging for chef coats and bedsheets..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B214F] focus:border-transparent focus:outline-none bg-[#FCF9F7]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Submit Quotation Request</span>
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

