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
import { auth, firebasePhoneErrorMessage, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from '@/lib/firebase';

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

  const triggerFirebasePhoneAuth = async (targetPhone: string, nextStep: Extract<Step, 'OTP' | 'REG_OTP'>) => {
    if (!auth || typeof window === 'undefined') {
      throw new Error('Firebase phone verification is unavailable in this browser. Please try again in a supported browser.');
    }

    setConfirmationResult(null);
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
      setStep(nextStep);
      showToast(`Firebase verification code sent to +91 ${targetPhone}`, 'success');
    } catch (error) {
      console.warn('[Firebase Auth] Phone SMS error:', error);
      throw new Error(firebasePhoneErrorMessage(error));
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

      // Firebase is the only OTP provider. Its errors are shown to the customer.
      await triggerFirebasePhoneAuth(phone, 'OTP');
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
      await triggerFirebasePhoneAuth(phone, 'REG_OTP');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Firebase could not send a verification code.', 'error');
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
  }, [step, confirmationResult]);

  const executeVerifyOtp = async (codeToVerify: string) => {
    if (!codeToVerify || codeToVerify.length !== 6) return;
    setLoading(true);
    try {
      if (!confirmationResult) {
        throw new Error('Your Firebase verification session has expired. Please request a new code.');
      }

      const userCredential = await confirmationResult.confirm(codeToVerify);
      const idToken = await userCredential.user.getIdToken();

      // The backend verifies this Firebase ID token before issuing our app session.
      const verifyRes = await fetch(`${API}/customers/firebase-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });
      const verifyData = await verifyRes.json().catch(() => ({}));

      if (verifyRes.ok && verifyData.success) {
        const expiresAt = Date.now() + (verifyData.expiresIn || 900) * 1000;
        localStorage.setItem('lf_access', verifyData.accessToken);
        localStorage.setItem('lf_refresh', verifyData.refreshToken);
        localStorage.setItem('lf_expires_at', String(expiresAt));
        localStorage.setItem('lf_user', JSON.stringify(verifyData.user));

        mergeCartOnLogin();
        window.dispatchEvent(new Event('lf-auth-changed'));

        const userName = verifyData.user?.name ?? name ?? 'Customer';
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

      // Retry the Firebase-token sign-in only; never use a server-generated OTP.
      const endpoint = `${API}/customers/firebase-login`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
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
        showToast(`Welcome, ${userName.split(' ')[0]}! 🎉`, 'success');

        const targetRedirect = authRedirectUrl;
        closeAuthModal();
        if (targetRedirect) {
          router.push(targetRedirect);
        }
      } else {
        throw new Error(verifyData.message || data.message || 'Firebase verification could not sign you in. Please request a new code.');
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? firebasePhoneErrorMessage(err) : 'Firebase could not verify this code. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i: number, val: string) => {
    // If user pasted multi-digit OTP or mobile auto-filled all 6 digits into first box:
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

    // Auto-verify if all 6 digits are filled!
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

  const otpCode = otp.join('');

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      showToast('Please enter the 6-digit OTP', 'error');
      return;
    }
    await executeVerifyOtp(otpCode);
  };

  const handleResend = async () => {
    if (resendTimer > 0 || loading) return;
    setOtp(['', '', '', '', '', '']);
    setLoading(true);
    try {
      await triggerFirebasePhoneAuth(phone, step === 'REG_OTP' ? 'REG_OTP' : 'OTP');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Firebase could not resend the verification code.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-[#E8DDE1] z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
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
              {(step === 'OTP' || step === 'REG_OTP') && `Auto-detecting SMS sent to +91 ${phone}`}
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
                  className="w-full px-3.5 py-3 text-sm font-bold text-slate-800 outline-none placeholder:font-normal placeholder:text-slate-400 tracking-wider"
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
          </form>
        )}

        {/* ── STEP 2: REGISTER ── */}
        {step === 'REGISTER' && (
          <form onSubmit={handleRegisterContinue} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name <span className="text-red-500">*</span>
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
                Email Address <span className="text-slate-400 font-normal lowercase">(optional)</span>
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
          </form>
        )}

        {/* ── STEP 3: OTP ── */}
        {(step === 'OTP' || step === 'REG_OTP') && (
          <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
                  6-Digit OTP Code
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
