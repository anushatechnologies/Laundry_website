'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  KeyRound,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
  X,
  ShoppingBag,
} from 'lucide-react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from '@/lib/firebase';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

type Step = 'PHONE' | 'REGISTER' | 'OTP' | 'REG_OTP';

export function AuthModal() {
  const router = useRouter();
  const { isAuthModalOpen, closeAuthModal, showToast, authRedirectUrl, mergeCartOnLogin, cart } = useApp();

  const [step, setStep] = useState<Step>('PHONE');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setStep('PHONE');
      setPhone('');
      setName('');
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setConfirmationResult(null);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const triggerFirebasePhoneAuth = async (targetPhone: string, exists: boolean) => {
    if (!auth || typeof window === 'undefined') return false;
    try {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch {}
        (window as any).recaptchaVerifier = null;
      }

      const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
      (window as any).recaptchaVerifier = appVerifier;
      await appVerifier.render();

      const confirmation = await signInWithPhoneNumber(auth, `+91${targetPhone}`, appVerifier);
      setConfirmationResult(confirmation);
      setResendTimer(60);
      showToast(`SMS OTP sent to +91 ${targetPhone}`, 'success');
      setStep(exists ? 'OTP' : 'REG_OTP');
      return true;
    } catch (fbErr: any) {
      console.warn('[Firebase Auth] Phone SMS notice:', fbErr?.message);
      return false;
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      showToast('Enter a valid 10-digit mobile number', 'error');
      return;
    }
    setLoading(true);
    try {
      // 1. Check if existing customer in backend
      let exists = false;
      try {
        const checkRes = await fetch(`${API}/customers/check-phone`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        });
        const checkData = await checkRes.json().catch(() => ({}));
        exists = checkData.exists === true;
      } catch {}

      setIsNewUser(!exists);

      if (!exists) {
        setStep('REGISTER');
        setLoading(false);
        return;
      }

      // 2. Try Firebase Real Phone Auth
      const firebaseSent = await triggerFirebasePhoneAuth(phone, exists);
      if (firebaseSent) {
        setLoading(false);
        return;
      }

      // 3. Backend Direct SMS Fallback
      const res = await fetch(`${API}/customers/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to send OTP.');
      }

      setResendTimer(60);
      setStep('OTP');
      showToast(`OTP sent to +91 ${phone}`, 'success');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Could not send OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter your full name', 'error');
      return;
    }
    setLoading(true);
    try {
      // Try Firebase Real Phone Auth first
      const firebaseSent = await triggerFirebasePhoneAuth(phone, false);
      if (firebaseSent) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API}/customers/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name: name.trim(), email: email.trim() }),
      });
      setResendTimer(60);
      setStep('REG_OTP');
      showToast(`SMS OTP sent to mobile +91 ${phone}`, 'success');
    } catch {
      setStep('REG_OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    const v = val.replace(/\D/g, '').slice(-1);
    const n = [...otp];
    n[i] = v;
    setOtp(n);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const otpCode = otp.join('');

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      showToast('Please enter the 6-digit OTP', 'error');
      return;
    }
    setLoading(true);
    try {
      // 1. Real Firebase Phone Auth confirmation
      if (confirmationResult) {
        try {
          const userCredential = await confirmationResult.confirm(otpCode);
          const idToken = await userCredential.user.getIdToken();
          const endpoint = isNewUser ? `${API}/customers/register` : `${API}/customers/login`;
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: isNewUser ? JSON.stringify({ name: name.trim(), email: email.trim() }) : undefined,
          });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.success) {
            const expiresAt = Date.now() + (data.expiresIn || 900) * 1000;
            localStorage.setItem('lf_access', data.accessToken);
            localStorage.setItem('lf_refresh', data.refreshToken);
            localStorage.setItem('lf_expires_at', String(expiresAt));
            localStorage.setItem('lf_user', JSON.stringify(data.user));

            mergeCartOnLogin();
            window.dispatchEvent(new Event('lf-auth-changed'));

            const userName = data.user?.name ?? name ?? 'Customer';
            showToast(
              isNewUser
                ? `Welcome to LaundryFresh, ${userName.split(' ')[0]}! 🎉`
                : `Signed in as ${userName.split(' ')[0]}! 👋`,
              'success'
            );

            const targetRedirect = authRedirectUrl;
            closeAuthModal();
            if (targetRedirect) {
              router.push(targetRedirect);
            }
            return;
          }
        } catch (fbErr: any) {
          console.warn('[Firebase Auth] confirm error, trying backend verify fallback:', fbErr?.message);
        }
      }

      // 2. Direct Backend OTP Fallback
      const res = await fetch(`${API}/customers/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otp: otpCode,
          name: name.trim(),
          email: email.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid OTP code.');
      }

      // Save tokens
      const expiresAt = Date.now() + (data.expiresIn || 900) * 1000;
      localStorage.setItem('lf_access', data.accessToken);
      localStorage.setItem('lf_refresh', data.refreshToken);
      localStorage.setItem('lf_expires_at', String(expiresAt));
      localStorage.setItem('lf_user', JSON.stringify(data.user));

      // Merge any existing cart items seamlessly
      mergeCartOnLogin();

      window.dispatchEvent(new Event('lf-auth-changed'));

      const userName = data.user?.name ?? name ?? 'Customer';
      showToast(
        isNewUser
          ? `Welcome to LaundryFresh, ${userName.split(' ')[0]}! 🎉`
          : `Signed in as ${userName.split(' ')[0]}! 👋`,
        'success'
      );

      const targetRedirect = authRedirectUrl;
      closeAuthModal();

      if (targetRedirect) {
        router.push(targetRedirect);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Verification failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

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
      if (data.devOtp) setOtp(data.devOtp);

      setResendTimer(60);
      showToast(`OTP resent to +91 ${phone}`, 'success');
    } catch {
      showToast('Resend failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5B214F] text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#241A21] font-poppins">
              {step === 'PHONE' && 'Sign in to continue'}
              {step === 'REGISTER' && 'Create your account'}
              {(step === 'OTP' || step === 'REG_OTP') && 'Verify with OTP'}
            </h2>
            <p className="text-xs text-slate-500">
              {step === 'PHONE' && 'Enter mobile number to save your bag & schedule pickup'}
              {step === 'REGISTER' && 'One-time registration for seamless doorstep service'}
              {(step === 'OTP' || step === 'REG_OTP') && `Enter code sent to +91 ${phone}`}
            </p>
          </div>
        </div>

        {/* Live Cart Merge Indicator */}
        {cart.items.length > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200/80 px-3 py-2 text-xs text-emerald-800 font-bold">
            <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your bag will be saved &amp; merged!</span>
          </div>
        )}

        {/* ── STEP 1: PHONE ── */}
        {step === 'PHONE' && (
          <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                Mobile Number
              </label>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#5B214F]">
                <span className="flex items-center bg-[#F7F0F2] px-3 font-bold text-[#5B214F] border-r border-slate-200 text-xs shrink-0">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full px-3.5 py-3 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 tracking-wider"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              <span>{loading ? 'Sending OTP…' : 'Continue with OTP'}</span>
              {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>

            <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Instant OTP verification · No password needed</span>
            </div>
          </form>
        )}

        {/* ── STEP 2: REGISTER ── */}
        {step === 'REGISTER' && (
          <form onSubmit={handleRegisterContinue} className="mt-6 space-y-4">
            <div className="p-3 bg-[#F7F0F2] rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#5B214F]" />
                <span className="font-extrabold text-slate-800">+91 {phone}</span>
              </div>
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-[11px] font-bold text-[#5B214F] hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name *
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#5B214F]">
                <User className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full text-xs font-medium text-slate-800 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address <span className="text-slate-400 font-normal lowercase">(for invoices &amp; receipts)</span>
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#5B214F]">
                <Mail className="w-4 h-4 text-slate-400 mr-2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full text-xs font-medium text-slate-800 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
              <span>{loading ? 'Sending SMS OTP…' : 'Send SMS OTP to Mobile'}</span>
              {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
            </button>

            <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>SMS OTP will be sent directly to +91 {phone}</span>
            </div>
          </form>
        )}

        {/* ── STEP 3: OTP ── */}
        {(step === 'OTP' || step === 'REG_OTP') && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-2">
                6-Digit OTP Code
              </label>
              <div className="flex gap-2 justify-between">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    onFocus={(e) => e.target.select()}
                    className={`w-11 h-12 text-center text-lg font-black rounded-xl border transition ${
                      d
                        ? 'border-[#5B214F] bg-[#F7F0F2] text-[#5B214F] ring-2 ring-[#5B214F]/20'
                        : 'border-slate-200 text-slate-800 focus:border-[#5B214F]'
                    }`}
                  />
                ))}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => (step === 'REG_OTP' ? setStep('REGISTER') : setStep('PHONE'))}
                  className="flex items-center gap-1 text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
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
              className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{loading ? 'Verifying…' : 'Verify & Continue'}</span>
            </button>
          </form>
        )}

        {/* Invisible Firebase reCAPTCHA container */}
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
