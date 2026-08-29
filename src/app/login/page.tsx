'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Loader2,
  Phone,
  RefreshCw,
  ShieldCheck,
  User,
  Mail,
  KeyRound,
  Sparkles,
} from 'lucide-react';

/* ── constants ─────────────────────────────────────────────────────────── */
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';
const INDIA = '+91';

/* ── token helpers ─────────────────────────────────────────────────────── */
function saveSession(data: { accessToken: string; refreshToken: string; expiresIn: number; user: Record<string, string> }) {
  const expiresAt = Date.now() + data.expiresIn * 1000;
  localStorage.setItem('lf_access', data.accessToken);
  localStorage.setItem('lf_refresh', data.refreshToken);
  localStorage.setItem('lf_expires_at', String(expiresAt));
  localStorage.setItem('lf_user', JSON.stringify(data.user));
}

/* ── types ─────────────────────────────────────────────────────────────── */
type Step = 'PHONE' | 'OTP' | 'REGISTER' | 'REG_OTP';

/* ═══════════════════════════════════════════════════════════════════════
   Page
═══════════════════════════════════════════════════════════════════════ */
export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [step, setStep] = useState<Step>('PHONE');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [devOtp, setDevOtp] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* resend countdown */
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const [redirectTarget, setRedirectTarget] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '';
    if (redirect) setRedirectTarget(redirect);
    const prefilledPhone = (params.get('phone') || '').replace(/\D/g, '').slice(-10);
    if (prefilledPhone) setPhone(prefilledPhone);
    if (params.get('name')) setName(params.get('name') || '');
    if (params.get('email')) setEmail(params.get('email') || '');
  }, []);

  /* ── STEP 1: enter phone → send direct backend OTP ── */
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      showToast('Enter a valid 10-digit mobile number', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/customers/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP code.');
      }

      const exists = data.exists === true;
      setIsNewUser(!exists);
      setResendTimer(60);

      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }

      // Always proceed directly to OTP verification screen for seamless sign-in
      setStep('OTP');
      showToast(`Verification OTP sent to +91 ${phone}`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to send OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── STEP 2a (new user only): fill name + email → go to OTP ── */
  const handleRegisterContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    if (!email.trim()) {
      showToast('Please enter your email address', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/customers/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name: name.trim(), email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.devOtp) setDevOtp(data.devOtp);
      setResendTimer(60);
      setStep('REG_OTP');
      showToast(`Verification code sent for +91 ${phone}`, 'success');
    } catch {
      setStep('REG_OTP');
    } finally {
      setLoading(false);
    }
  };

  // ── WebOTP API: Auto-detect incoming SMS OTP on Mobile Browsers ──
  useEffect(() => {
    if (step !== 'OTP' && step !== 'REG_OTP') return;
    if (typeof window === 'undefined' || !('OTPCredential' in window)) return;

    const ac = new AbortController();
    try {
      (navigator.credentials as any)
        .get({
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otpCredential: any) => {
          if (otpCredential && otpCredential.code) {
            const rawCode = otpCredential.code.replace(/\D/g, '').slice(0, 6);
            if (rawCode.length === 6) {
              const digits = rawCode.split('');
              setOtp(digits);
              showToast('✨ OTP Auto-detected from SMS! Verifying...', 'success');
              executeVerifyOtp(rawCode);
            }
          }
        })
        .catch(() => {
          // Ignore abort or timeout
        });
    } catch {}

    return () => {
      try {
        ac.abort();
      } catch {}
    };
  }, [step]);

  const executeVerifyOtp = async (codeToVerify: string) => {
    if (!codeToVerify || codeToVerify.length !== 6) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/customers/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp: codeToVerify,
          name: name.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid OTP. Please check and try again.');
      }

      // Save tokens & user profile in localStorage
      saveSession(data);
      window.dispatchEvent(new Event('lf-auth-changed'));

      const userName = data.user?.name ?? name ?? 'Customer';
      showToast(
        isNewUser
          ? `Welcome to LaundryFresh, ${userName.split(' ')[0]}! 🎉`
          : `Welcome back, ${userName.split(' ')[0]}! 👋`,
        'success'
      );

      const params = new URLSearchParams(window.location.search);
      const redirectTarget = params.get('redirect') || '/book';
      router.push(redirectTarget);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Verification failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP box helpers ── */
  const handleOtpChange = (i: number, val: string) => {
    const digitsOnly = val.replace(/\D/g, '');
    if (digitsOnly.length > 1) {
      const pastedDigits = digitsOnly.slice(0, 6).split('');
      const newOtp = ['', '', '', '', '', ''];
      pastedDigits.forEach((d, idx) => {
        if (idx < 6) newOtp[idx] = d;
      });
      setOtp(newOtp);
      if (pastedDigits.length === 6) {
        executeVerifyOtp(newOtp.join(''));
      } else {
        const nextIdx = Math.min(5, pastedDigits.length);
        otpRefs.current[nextIdx]?.focus();
      }
      return;
    }

    const v = digitsOnly.slice(-1);
    const n = [...otp];
    n[i] = v;
    setOtp(n);

    if (v && i < 5) {
      otpRefs.current[i + 1]?.focus();
    }

    if (v && n.every((d) => d !== '')) {
      executeVerifyOtp(n.join(''));
    }
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    const digits = pastedData.split('');
    const newOtp = ['', '', '', '', '', ''];
    digits.forEach((d, idx) => {
      if (idx < 6) newOtp[idx] = d;
    });
    setOtp(newOtp);
    if (digits.length === 6) {
      executeVerifyOtp(newOtp.join(''));
    } else {
      const nextIdx = Math.min(5, digits.length);
      otpRefs.current[nextIdx]?.focus();
    }
  };

  const fillAutoOtp = (code: string) => {
    if (!code || code.length !== 6) return;
    const digits = code.split('');
    setOtp(digits);
    showToast('OTP auto-filled!', 'success');
    executeVerifyOtp(code);
  };

  const otpCode = otp.join('');

  /* ── STEP 3: verify OTP → call backend direct verify → save tokens ── */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      showToast('Please enter the 6-digit OTP', 'error');
      return;
    }
    await executeVerifyOtp(otpCode);
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (resendTimer > 0 || loading) return;
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    try {
      const res = await fetch(`${API}/customers/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.devOtp) setDevOtp(data.devOtp);
      setResendTimer(60);
      showToast(`OTP resent to +91 ${phone}`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Resend failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ─────────── render ─────────── */
  const stepIdx = { PHONE: 0, REGISTER: 1, OTP: 1, REG_OTP: 2 }[step];

  const Dot = ({ a, d }: { a: boolean; d: boolean }) => (
    <div
      className={`w-2 h-2 rounded-full transition-all duration-300 ${
        d ? 'bg-[#5B214F] scale-100' : a ? 'bg-indigo-300 scale-125' : 'bg-slate-200'
      }`}
    />
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="laundry-page-atmosphere flex-1 flex items-center justify-center px-4 py-10 sm:px-6 lg:py-16">
        <div className="auth-shell grid w-full max-w-5xl rounded-[2rem] lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left panel */}
          <aside className="auth-visual hidden min-h-[620px] flex-col justify-between rounded-l-[2rem] bg-gradient-to-br from-[#16133A] via-[#312E81] to-[#5B214F] p-8 text-white lg:flex xl:p-10">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-200">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-indigo-500/30">✦</span>
                Fresh care, at your doorstep
              </div>
              <h2 className="mt-7 max-w-sm text-4xl font-black leading-[1.08] tracking-tight text-white xl:text-5xl">
                Laundry day,
                <span className="block text-indigo-200">made beautifully simple.</span>
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-6 text-indigo-100">
                Book a pickup, follow every care stage, and get your favourite clothes back fresh, folded and ready to wear.
              </p>

              <div className="mt-7 grid max-w-sm grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                  <p className="text-xs font-extrabold text-white">Doorstep pickup</p>
                  <p className="mt-0.5 text-[10px] text-indigo-200">On your schedule</p>
                </div>
                <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm">
                  <p className="text-xs font-extrabold text-white">Live updates</p>
                  <p className="mt-0.5 text-[10px] text-indigo-200">Every care stage</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-indigo-100">Today’s care promise</span>
                  <span className="rounded-full bg-[#F7F0F2] px-2 py-1 text-[10px] text-[#5B214F] font-black">
                    ON TRACK
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-[#5B214F] to-indigo-200" />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-slate-300">
                  <span>Collected</span>
                  <span>Quality checked</span>
                  <span>Delivered</span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <ShieldCheck className="h-4 w-4 text-indigo-300" /> Secure OTP sign-in · no password to remember
              </div>
            </div>
          </aside>

          {/* Right auth form */}
          <div className="w-full max-w-md self-center justify-self-center space-y-5 p-5 sm:p-9 xl:p-11">
            {/* Brand */}
            <div className="text-center space-y-1.5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5B214F] text-white shadow-lg shadow-indigo-500/25">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-black text-[#241A21] font-poppins">LaundryFresh</h1>
              <p className="text-xs text-slate-500">
                {step === 'PHONE' && 'Sign in or create a new account'}
                {step === 'REGISTER' && 'Create your account — one-time setup'}
                {(step === 'OTP' || step === 'REG_OTP') && `OTP sent to +91 ${phone}`}
              </p>
            </div>

            {/* Step progress */}
            <div
              className="flex items-center justify-center gap-3"
              aria-label={`Authentication step ${stepIdx + 1} of 3`}
            >
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Step {stepIdx + 1} of 3
              </span>
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <Dot a={stepIdx === 0} d={stepIdx > 0} />
                <Dot a={stepIdx === 1} d={stepIdx > 1} />
                <Dot a={stepIdx === 2} d={false} />
              </div>
            </div>

            {/* ═══ Card ═══ */}
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
              {/* ── PHONE step ── */}
              {step === 'PHONE' && (
                <div className="p-7 space-y-5">
                  {redirectTarget.includes('/book') && (
                    <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-amber-950 text-xs shadow-xs animate-in fade-in">
                      <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-sm block text-amber-900">Sign in to Complete Booking</span>
                        <span className="text-xs text-amber-800 leading-tight block mt-0.5">
                          Doorstep pickup &amp; order scheduling requires a verified 10-digit mobile number.
                        </span>
                      </div>
                    </div>
                  )}

                  {redirectTarget.includes('/subscriptions') && (
                    <div className="flex items-start gap-2.5 rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-amber-950 text-xs shadow-xs animate-in fade-in">
                      <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-extrabold text-sm block text-amber-900">Sign in to Activate Subscription Pass</span>
                        <span className="text-xs text-amber-800 leading-tight block mt-0.5">
                          Activating your monthly pass and linking laundry balance requires a verified 10-digit mobile number.
                        </span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h2 className="text-lg font-black text-[#241A21]">Welcome to LaundryFresh</h2>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Enter your mobile number and we’ll send a secure one-time code.
                    </p>
                  </div>
                  <form onSubmit={handlePhoneSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                        Mobile Number
                      </label>
                      <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#5B214F] shadow-xs">
                        <span className="flex items-center gap-1 bg-[#F7F0F2] px-3.5 font-black text-[#5B214F] border-r border-slate-200 shrink-0 text-xs">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          maxLength={10}
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="98765 43210"
                          className="w-full px-4 py-3.5 text-sm font-bold text-slate-800 focus:outline-none placeholder:font-normal placeholder:text-slate-400 tracking-widest"
                        />
                        {phone.length === 10 && (
                          <span className="flex items-center pr-4 text-[#5B214F]">
                            <CheckCircle2 className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 ml-1">
                        Existing account → OTP login &nbsp;·&nbsp; New → Registration
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || phone.length !== 10}
                      className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                      {loading ? 'Sending OTP…' : 'Continue with OTP'}
                      {!loading && <ArrowRight className="w-4 h-4 ml-auto" />}
                    </button>
                  </form>

                  <div className="flex items-center justify-center gap-5 pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5B214F]" />
                      Direct OTP SMS &amp; Email
                    </span>
                    <span>🔒 No password needed</span>
                  </div>
                </div>
              )}

              {/* ── REGISTER step (new user: name + email) ── */}
              {step === 'REGISTER' && (
                <div className="p-7 space-y-5">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#5B214F] bg-[#F7F0F2] border border-indigo-100 rounded-xl px-4 py-3">
                    <span>🆕</span>
                    <span>New account for +91 {phone}</span>
                  </div>

                  <form onSubmit={handleRegisterContinue} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                        Full Name
                      </label>
                      <div className="flex items-center rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#5B214F] overflow-hidden shadow-xs">
                        <span className="pl-4 text-slate-400">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Rahul Sharma"
                          className="w-full px-3 py-3.5 text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#5B214F] overflow-hidden shadow-xs">
                        <span className="pl-4 text-slate-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3 py-3.5 text-sm font-medium text-slate-800 focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-black text-sm rounded-xl shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Continue — Verify with OTP'}
                      {!loading && <ArrowRight className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setStep('PHONE');
                        setOtp(['', '', '', '', '', '']);
                      }}
                      className="w-full flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Change phone number
                    </button>
                  </form>
                </div>
              )}

              {/* ── OTP step (both login & register) ── */}
              {(step === 'OTP' || step === 'REG_OTP') && (
                <div className="p-7 space-y-5">
                  <div
                    className={`flex items-center justify-between gap-2 text-xs font-bold rounded-xl px-4 py-3 bg-[#F7F0F2] border border-indigo-100 text-[#5B214F]`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{isNewUser ? '🆕' : '👋'}</span>
                      <span>
                        {isNewUser ? `Creating account for ${name}` : 'Welcome back!'} · +91 {phone}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-xs font-black text-slate-600 uppercase tracking-wider">
                          6-Digit Verification Code
                        </label>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ⚡ Auto-Detect Active
                        </span>
                      </div>
                      <div className="flex gap-2 justify-between" onPaste={handlePaste}>
                        {otp.map((d, i) => (
                          <input
                            key={i}
                            ref={(el) => {
                              otpRefs.current[i] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            autoComplete={i === 0 ? 'one-time-code' : 'off'}
                            pattern="[0-9]*"
                            maxLength={6}
                            value={d}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKey(i, e)}
                            onFocus={(e) => e.target.select()}
                            className={`w-12 h-14 text-center text-xl font-black rounded-xl border transition-all focus:outline-none ${
                              d
                                ? 'border-[#5B214F] bg-[#F7F0F2] text-[#5B214F] ring-2 ring-[#5B214F]/20'
                                : 'border-slate-200 text-slate-800 focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Demo OTP Helper Banner */}
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-amber-900">
                          <span className="text-sm">🔑</span>
                          <span className="font-medium text-[11px]">
                            Test / Demo OTP: <strong className="font-black text-[#5B214F]">123456</strong>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const demoDigits = ['1', '2', '3', '4', '5', '6'];
                            setOtp(demoDigits);
                            showToast('🔑 Filled Demo OTP: 123456', 'info');
                          }}
                          className="px-2.5 py-1 bg-[#5B214F] hover:bg-[#48193F] text-white font-black text-[10px] rounded-lg cursor-pointer transition shadow-xs"
                        >
                          Auto-Fill
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            step === 'REG_OTP' ? setStep('REGISTER') : setStep('PHONE');
                            setOtp(['', '', '', '', '', '']);
                          }}
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> Back
                        </button>
                        <button
                          type="button"
                          disabled={resendTimer > 0 || loading}
                          onClick={handleResend}
                          className="flex items-center gap-1 text-[#5B214F] hover:text-[#48193F] font-bold disabled:text-slate-400 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length !== 6}
                      className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {loading ? 'Verifying…' : isNewUser ? 'Verify & Create Account' : 'Verify & Sign In'}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {step === 'PHONE' && (
              <div className="bg-gradient-to-r from-[#5B214F] to-[#3B28CC] rounded-2xl p-4 text-white text-center shadow-lg">
                <p className="text-xs font-black uppercase tracking-wider opacity-80">New to LaundryFresh?</p>
                <p className="text-base font-black mt-0.5">Get ₹100 OFF your first order 🎉</p>
                <p className="text-[11px] opacity-70 mt-0.5">Auto-applied · No code needed</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
