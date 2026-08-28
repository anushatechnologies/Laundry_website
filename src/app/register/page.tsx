'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { ArrowRight, CheckCircle2, Mail, MapPin, ShieldCheck, Sparkles, User } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { showToast, userPincode } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pincode: userPincode || '560034',
    city: 'Bengaluru',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.phone.length !== 10) {
      showToast('Enter your full name and a valid 10-digit mobile number', 'error');
      return;
    }
    if (!formData.email.trim()) {
      showToast('Please enter your email address', 'error');
      return;
    }
    if (formData.pincode.length !== 6) {
      showToast('Please enter a valid 6-digit pincode', 'error');
      return;
    }

    showToast('We will verify your number with a secure OTP before creating the account.', 'info');
    const query = new URLSearchParams({
      phone: formData.phone,
      name: formData.name.trim(),
      email: formData.email.trim(),
    });
    router.push(`/login?${query.toString()}`);
  };

  const isFormValid = Boolean(
    formData.name.trim() &&
    formData.phone.length === 10 &&
    formData.email.trim() &&
    formData.city.trim() &&
    formData.pincode.length === 6
  );

  return (
    <div className="laundry-page-atmosphere flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
        <div className="auth-shell grid w-full max-w-5xl overflow-hidden rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="auth-visual hidden min-h-[620px] flex-col justify-between rounded-l-[2rem] bg-gradient-to-br from-[#16133A] via-[#312E81] to-[#5B214F] p-8 text-white lg:flex xl:p-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-100">
                <Sparkles className="h-3.5 w-3.5" />
                Fresh care, at your doorstep
              </div>
              <h2 className="mt-7 max-w-sm text-4xl font-black leading-[1.08] tracking-tight text-white xl:text-5xl">
                Your laundry,
                <span className="block text-indigo-200">handled beautifully.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-indigo-100">
                Join a simpler laundry routine with doorstep pickup, careful cleaning and real-time updates from our team.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  ['Easy scheduling', 'Choose a pickup time that works for you.'],
                  ['Care you can track', 'Follow your order from pickup to delivery.'],
                  ['Freshness guaranteed', 'Quality checks before every handoff.'],
                ].map(([title, description]) => (
                  <div key={title} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-200" />
                    <div>
                      <p className="text-xs font-extrabold text-white">{title}</p>
                      <p className="mt-0.5 text-[11px] text-indigo-200">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15">
                  <ShieldCheck className="h-5 w-5 text-indigo-100" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white">Secure by design</p>
                  <p className="mt-0.5 text-[11px] text-indigo-200">OTP sign-in means no password to remember.</p>
                </div>
              </div>
            </div>
          </aside>

          <section className="w-full max-w-md self-center justify-self-center p-5 sm:p-9 xl:p-11">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5B214F] text-white shadow-lg shadow-indigo-500/25">
                <svg className="h-7 w-7 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C10.9 2 10 2.9 10 4H6C4.9 4 4 4.9 4 6V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V6C20 4.9 19.1 4 18 4H14C14 2.9 13.1 2 12 2ZM12 4C12.55 4 13 4.45 13 5C13 5.55 12.55 6 12 6C11.45 6 11 5.55 11 5C11 4.45 11.45 4 12 4ZM8 9H16C16.55 9 17 9.45 17 10C17 10.55 16.55 11 16 11H8C7.45 11 7 10.55 7 10C7 9.45 7.45 9 8 9ZM8 13H16C16.55 13 17 13.45 17 14C17 14.55 16.55 15 16 15H8C7.45 15 7 14.55 7 14C7 13.45 7.45 13 8 13Z" />
                </svg>
              </div>
              <h1 className="mt-3 font-poppins text-2xl font-black text-[#241A21]">Create your account</h1>
              <p className="mt-1 text-xs leading-5 text-slate-500">Save your addresses, track every order and get ₹100 off your first pickup.</p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3" aria-label="Registration step 1 of 2">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Step 1 of 2</span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2 w-6 rounded-full bg-[#5B214F]" />
                <span className="h-2 w-2 rounded-full bg-slate-200" />
              </div>
            </div>

            <form onSubmit={handleRegister} className="mt-5 space-y-4 rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-7">
              <div>
                <label htmlFor="register-name" className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-600">Full name</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="register-name" type="text" required autoComplete="name" placeholder="e.g. Rahul Verma" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#5B214F] focus:bg-white focus:ring-4 focus:ring-indigo-100 placeholder:font-normal placeholder:text-slate-400" />
                </div>
              </div>

              <div>
                <label htmlFor="register-phone" className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-600">Mobile number</label>
                <div className="flex h-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-50/60 transition focus-within:border-[#5B214F] focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100">
                  <span className="flex shrink-0 items-center border-r border-slate-200 bg-[#F7F0F2] px-3 text-xs font-black tracking-wide text-[#5B214F]">IN&nbsp; +91</span>
                  <input id="register-phone" type="tel" inputMode="numeric" maxLength={10} required autoComplete="tel" placeholder="98765 43210" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} className="w-full bg-transparent px-3 text-sm font-semibold tracking-wider text-slate-800 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400" />
                  {formData.phone.length === 10 && <CheckCircle2 className="mr-3 h-4 w-4 self-center text-emerald-500" />}
                </div>
                <p className="mt-1.5 text-[11px] text-slate-400">We’ll send a one-time verification code to this number.</p>
              </div>

              <div>
                <label htmlFor="register-email" className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-600">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input id="register-email" type="email" required autoComplete="email" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#5B214F] focus:bg-white focus:ring-4 focus:ring-indigo-100 placeholder:font-normal placeholder:text-slate-400" />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="register-city" className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-600">City</label>
                  <input id="register-city" type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#5B214F] focus:bg-white focus:ring-4 focus:ring-indigo-100" />
                </div>
                <div>
                  <label htmlFor="register-pincode" className="mb-2 block text-[11px] font-black uppercase tracking-wider text-slate-600">Pincode</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input id="register-pincode" type="text" inputMode="numeric" maxLength={6} required value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#5B214F] focus:bg-white focus:ring-4 focus:ring-indigo-100" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={!isFormValid} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#5B214F] text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition hover:bg-[#48193F] hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none">
                Continue to secure verification
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-[10px] leading-4 text-slate-400">By continuing, you agree to our <Link href="/terms" className="font-bold text-slate-600 hover:text-[#5B214F]">Terms</Link> and <Link href="/privacy" className="font-bold text-slate-600 hover:text-[#5B214F]">Privacy Policy</Link>.</p>
            </form>

            <p className="mt-5 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-black text-[#5B214F] hover:text-[#48193F]">Sign in</Link>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
