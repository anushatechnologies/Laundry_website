'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { Clock, MessageSquare, Send, CheckCircle, Sparkles, ChevronRight, Share2, Globe } from 'lucide-react';


export default function ContactPage() {
  const { showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
    showToast("Message sent! We'll reply within 2 hours.", 'success');
  };

  const contactInfo = [
    { icon: 'ðŸ“ž', label: 'Call Us', value: '+91 98765 43210', sub: 'Mon”“Sun, 8 AM ”“ 9 PM', href: 'tel:+919876543210', color: 'bg-indigo-50 text-indigo-600' },
    { icon: 'âœ‰ï¸', label: 'Email Us', value: 'hello@laundryfresh.com', sub: 'We reply within 2 hours', href: 'mailto:hello@laundryfresh.com', color: 'bg-emerald-50 text-emerald-600' },
    { icon: 'ðŸ’¬', label: 'WhatsApp', value: '+91 98765 43210', sub: 'Chat with support', href: 'https://wa.me/919876543210', color: 'bg-green-50 text-green-600' },
    { icon: 'ðŸ“', label: 'Location', value: 'Kukatpally, Hyderabad', sub: '500072, Telangana', href: '#', color: 'bg-amber-50 text-amber-600' },
  ];

  const faqs = [
    { q: 'How do I track my order?', a: 'Visit /track with your order ID or check your dashboard under My Orders.' },
    { q: 'Is there a minimum order value?', a: 'No minimum! We accept orders from 1 kg onwards at â‚¹59/kg.' },
    { q: 'Do you offer same-day service?', a: 'Yes! Express same-day service is available in select areas. Contact us to confirm your pincode.' },
    { q: 'What if my clothes get damaged?', a: 'We have a 100% damage guarantee. Contact us immediately and we will resolve it.' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg,#F5F6FF 0%,#FFFFFF 60%)' }}>
      <Navbar />

      {/* â”€â”€ Hero â”€â”€ */}
      <section className="relative overflow-hidden py-14 lg:py-20 border-b border-slate-100"
        style={{ background: 'radial-gradient(ellipse 60% 45% at 15% 20%,rgba(91,77,245,0.1) 0%,transparent 60%),#F5F6FF' }}>
        <div className="pointer-events-none absolute right-[6%] top-4 h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-[11px] font-extrabold uppercase tracking-widest text-[#5B214F]">
            <Sparkles className="w-3.5 h-3.5" />
            We&apos;re Here to Help
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#241A21] tracking-tight">
            Get in Touch <span className="text-[#5B214F]">With Us</span>
          </h1>
          <p className="text-base text-[#6F626A] max-w-xl mx-auto leading-relaxed">
            Have questions about an order, need bulk pricing, or just want to say hello? We're available 7 days a week.
          </p>
        </div>
      </section>

      {/* â”€â”€ Main Content â”€â”€ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">

          {/* LEFT: Contact Info Panel */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-[#241A21]">Contact Information</h2>
              <p className="text-sm text-[#6F626A] mt-1">Reach us through any of these channels ”” we're fast.</p>
            </div>

            <div className="space-y-3">
              {contactInfo.map((c, i) => (
                <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                  className="group flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className={`w-11 h-11 rounded-xl ${c.color} flex items-center justify-center text-xl shrink-0`}>{c.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold text-[#9A8D94] uppercase tracking-wider">{c.label}</p>
                    <p className="text-sm font-extrabold text-[#241A21] mt-0.5 truncate">{c.value}</p>
                    <p className="text-xs text-[#6F626A]">{c.sub}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#5B214F] transition-colors shrink-0 mt-3.5" />
                </a>
              ))}
            </div>

            {/* Hours Card */}
            <div className="p-5 rounded-2xl bg-[#F7F0F2] border border-indigo-100 space-y-3">
              <div className="flex items-center gap-2 text-[#5B214F] font-bold text-sm">
                <Clock className="w-4 h-4" />
                Business Hours
              </div>
              {[['Mon ”“ Fri', '8 AM ”“ 9 PM'], ['Saturday', '8 AM ”“ 7 PM'], ['Sunday', '9 AM ”“ 6 PM']].map(([d, t]) => (
                <div key={d} className="flex justify-between text-sm">
                  <span className="text-[#6F626A]">{d}</span>
                  <span className="font-bold text-[#241A21]">{t}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#9A8D94] uppercase tracking-wider">Follow Us</p>
              <div className="flex items-center gap-2">
                {[
                  { Icon: Share2, href: '#' },
                  { Icon: Globe, href: '#' },
                  { Icon: MessageSquare, href: 'https://wa.me/919876543210' },
                ].map(({ Icon, href }, i) => (

                  <a key={i} href={href}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-[#5B214F] hover:border-[#5B214F] hover:text-white text-slate-500 flex items-center justify-center transition-all duration-200">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Form + FAQ */}
          <div className="lg:col-span-8 space-y-6">

            {/* Form Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-900/5 p-8 lg:p-10">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-14 space-y-5 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#241A21]">Message Received!</h3>
                  <p className="text-[#6F626A] max-w-sm leading-relaxed">
                    Thank you! Our support team will reply within <strong>2 business hours</strong>.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className="px-7 py-3 bg-[#5B214F] text-white font-bold text-sm rounded-xl hover:bg-[#48193F] transition-colors shadow-md shadow-indigo-500/20">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="text-2xl font-extrabold text-[#241A21]">Send a Message</h2>
                    <p className="text-sm text-[#6F626A] mt-1">Fill in the form and we'll respond within 2 hours.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Rahul Sharma', required: true },
                        { name: 'email', label: 'Email Address', type: 'email', placeholder: 'rahul@example.com', required: true },
                        { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 98765 43210', required: false },
                      ].map(f => (
                        <div key={f.name} className={`space-y-1.5 ${f.name === 'name' ? 'sm:col-span-1' : ''}`}>
                          <label className="text-xs font-bold text-[#6F626A] uppercase tracking-wider">{f.label}{f.required && ' *'}</label>
                          <input
                            type={f.type}
                            name={f.name}
                            value={(form as Record<string, string>)[f.name]}
                            onChange={handleChange}
                            required={f.required}
                            placeholder={f.placeholder}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-[#FCF9F7] text-sm text-[#241A21] placeholder-slate-400 outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100 transition-all"
                          />
                        </div>
                      ))}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#6F626A] uppercase tracking-wider">Subject *</label>
                        <select name="subject" value={form.subject} onChange={handleChange} required
                          className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-[#FCF9F7] text-sm text-[#241A21] outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100 transition-all">
                          <option value="">Select a topic</option>
                          {['Order Enquiry', 'Damage / Missing Item', 'Billing & Refund', 'Corporate / Bulk Order', 'Subscription Plans', 'General Feedback', 'Other'].map(o => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#6F626A] uppercase tracking-wider">Your Message *</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                        placeholder="Describe your query in detail ”” the more info you give, the faster we can help..."
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-[#FCF9F7] text-sm text-[#241A21] placeholder-slate-400 outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100 transition-all resize-none" />
                    </div>

                    <button type="submit" disabled={loading}
                      className="group w-full flex items-center justify-center gap-2.5 h-14 px-8 bg-[#5B214F] hover:bg-[#48193F] text-white font-bold text-base rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                      {loading
                        ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                        : <><Send className="w-5 h-5" />Send Message</>
                      }
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* FAQ Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-[#241A21] uppercase tracking-wider">Quick Answers</h3>
              {faqs.map((f, i) => (
                <details key={i} className="group bg-white border border-slate-100 rounded-xl shadow-sm">
                  <summary className="flex items-center justify-between p-4 cursor-pointer font-semibold text-sm text-[#241A21] select-none list-none">
                    <span>{f.q}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90 shrink-0" />
                  </summary>
                  <div className="px-4 pb-4 text-sm text-[#6F626A] leading-relaxed border-t border-slate-100 pt-3">{f.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

