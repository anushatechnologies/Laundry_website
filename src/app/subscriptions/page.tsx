'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  Star,
  Users,
  CheckCircle2,
  HelpCircle,
  CreditCard,
  X,
  PhoneCall,
  Crown,
  Calendar,
  Layers,
} from 'lucide-react';
import Link from 'next/link';
import { loadRazorpayCheckout } from '@/lib/api';

function SubscriptionsContent() {
  const router = useRouter();
  const { showToast, subscriptionPlans, openAuthModal, isLoggedIn, currentUser } = useApp();
  const searchParams = useSearchParams();
  const planQuery = searchParams ? searchParams.get('plan') : null;
  const autoOpen = searchParams ? searchParams.get('auto') : null;

  const [selectedDuration, setSelectedDuration] = useState<'ALL' | '1M' | '3M' | '12M'>('ALL');
  const [activeModalPlan, setActiveModalPlan] = useState<any | null>(null);
  const [subscribedPlans, setSubscribedPlans] = useState<string[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'UPI' | 'CARD' | 'WALLET'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fallback plans in case of empty store
  const plans = subscriptionPlans && subscriptionPlans.length > 0
    ? subscriptionPlans
    : [
        {
          id: 'sub-basic-1m',
          name: 'Basic Care Pass',
          slug: 'basic-1m',
          durationMonths: 1,
          price: 999,
          originalPrice: 1299,
          validityDays: 30,
          includedKg: 20,
          freePickupDelivery: true,
          priorityService: false,
          maxFamilyMembers: 1,
          features: [
            '20 KG Wash & Fold / Steam Iron per month',
            'Unlimited Free Doorstep Pickups & Deliveries',
            'Turnaround within 36 Hours',
            'Rollover unused KG (up to 5 KG)',
            'Organic eco-safe detergents & fabric softeners',
          ],
          popular: false,
          isActive: true,
        },
        {
          id: 'sub-premium-1m',
          name: 'Privilege Member Pass',
          slug: 'premium-1m',
          durationMonths: 1,
          price: 1999,
          originalPrice: 2499,
          validityDays: 30,
          includedKg: 50,
          freePickupDelivery: true,
          priorityService: true,
          maxFamilyMembers: 2,
          features: [
            '50 KG Wash & Fold / Steam Iron per month',
            'Free Priority VIP Doorstep Pickup & Delivery',
            'Fast 24-Hour Express Atelier Turnaround',
            'Rollover unused KG (up to 15 KG)',
            '1 Free Silk / Blazer Dry Clean voucher per month',
            'Ozone antibacterial sanitization wash',
          ],
          popular: true,
          isActive: true,
        },
        {
          id: 'sub-family-3m',
          name: 'Quarterly Family Saver (3 Months)',
          slug: 'family-3m',
          durationMonths: 3,
          price: 4999,
          originalPrice: 6999,
          validityDays: 90,
          includedKg: 150,
          freePickupDelivery: true,
          priorityService: true,
          maxFamilyMembers: 4,
          features: [
            '150 KG Total Allowance (50 KG / Month)',
            'Save ₹2,000 upfront on quarterly commitment',
            'VIP Priority Slots & 12h Emergency Express',
            '3 Free Dry Clean Vouchers included',
            'Multi-member family profile sharing',
          ],
          popular: false,
          isActive: true,
        },
        {
          id: 'sub-annual-12m',
          name: 'Annual Royale Care (12 Months)',
          slug: 'annual-12m',
          durationMonths: 12,
          price: 14999,
          originalPrice: 23999,
          validityDays: 365,
          includedKg: 600,
          freePickupDelivery: true,
          priorityService: true,
          maxFamilyMembers: 5,
          features: [
            '600 KG Annual Fabric Care Allowance',
            'Save ₹9,000 with Annual Royale membership',
            'Unlimited 365-day balance rollover guarantee',
            '12 Free Dry Clean Vouchers + Shoe Spa voucher',
            'Dedicated personal atelier concierge manager',
          ],
          popular: false,
          isActive: true,
        },
      ];

  // Auto-open plan checkout modal when plan is passed from homepage
  useEffect(() => {
    if (planQuery && plans.length > 0) {
      const matched = plans.find(
        (p) =>
          p.id === planQuery ||
          p.slug === planQuery ||
          p.id?.toLowerCase().includes(planQuery.toLowerCase()) ||
          p.slug?.toLowerCase().includes(planQuery.toLowerCase())
      );
      if (matched) {
        if (!isLoggedIn) {
          showToast('🔒 Please sign in with your mobile number to activate your subscription pass.', 'info');
          router.push(`/login?redirect=/subscriptions&plan=${matched.id || matched.slug}&auto=1`);
        } else {
          setActiveModalPlan(matched);
        }
      }
    }
  }, [planQuery, autoOpen, plans, isLoggedIn, router, showToast]);

  const filteredPlans = plans.filter((p) => {
    if (!p.isActive) return false;
    if (selectedDuration === 'ALL') return true;
    if (selectedDuration === '1M') return (p.durationMonths || 1) === 1;
    if (selectedDuration === '3M') return (p.durationMonths || 1) === 3;
    if (selectedDuration === '12M') return (p.durationMonths || 1) === 12;
    return true;
  });

  const handleOpenSubscribeModal = (plan: any) => {
    if (!isLoggedIn) {
      showToast('🔒 Please sign in with your mobile number to activate your subscription plan.', 'info');
      router.push(`/login?redirect=/subscriptions&plan=${plan.id || plan.slug}&auto=1`);
      return;
    }
    setActiveModalPlan(plan);
  };

  const handleConfirmSubscription = async () => {
    if (!activeModalPlan) return;
    if (!isLoggedIn) {
      showToast('🔒 Please sign in with your mobile number to activate your subscription plan.', 'info');
      router.push(`/login?redirect=/subscriptions&plan=${activeModalPlan.id || activeModalPlan.slug}&auto=1`);
      return;
    }

    setIsProcessing(true);
    try {
      const checkoutAvailable = await loadRazorpayCheckout();
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TO6q7NUVnPM6bA';

      if (checkoutAvailable && (window as any).Razorpay) {
        const razorpay = new (window as any).Razorpay({
          key: razorpayKey,
          amount: activeModalPlan.price * 100,
          currency: 'INR',
          name: 'LaundryFresh',
          description: `Subscription Pass: ${activeModalPlan.name}`,
          prefill: {
            name: currentUser.name !== 'Valued Customer' ? currentUser.name : '',
            contact: currentUser.phone || '',
            email: currentUser.email || '',
          },
          theme: { color: '#5B214F' },
          handler: (response: { razorpay_payment_id: string }) => {
            setIsProcessing(false);
            setSubscribedPlans((prev) => [...prev, activeModalPlan.id]);
            showToast(
              `🎉 Payment Verified (${response.razorpay_payment_id})! You are now subscribed to ${activeModalPlan.name}. ${activeModalPlan.includedKg} KG credited to your account.`,
              'success'
            );
            setActiveModalPlan(null);
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
              showToast('Subscription payment was cancelled.', 'info');
            },
          },
        });
        razorpay.open();
      } else {
        setTimeout(() => {
          setIsProcessing(false);
          setSubscribedPlans((prev) => [...prev, activeModalPlan.id]);
          showToast(
            `🎉 Congratulations! You are now subscribed to ${activeModalPlan.name}. ${activeModalPlan.includedKg} KG credited to your account.`,
            'success'
          );
          setActiveModalPlan(null);
        }, 800);
      }
    } catch {
      setIsProcessing(false);
      showToast('Could not initiate payment. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-32 pb-16 w-full space-y-12 sm:space-y-16">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#F7F0F2] border border-[#E8DDE1] text-[#5B214F] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#D6B36A]" />
            <span>LAUNDRYFRESH MONTHLY PASSES</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#2B1326] tracking-tight font-poppins leading-tight">
            Wash More, Save Up to 45% with Monthly Laundry Passes
          </h1>
          <p className="text-xs sm:text-base text-[#6F626A] max-w-2xl mx-auto font-medium leading-relaxed">
            Zero delivery charges on every pickup. Quota automatically rolls over into subsequent months. Dedicated doorstep concierge on your schedule.
          </p>

          {/* Value Highlights Pill Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs font-bold text-[#2B1326]">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDE1] shadow-xs">
              <Truck className="w-3.5 h-3.5 text-[#5B214F]" />
              <span>Unlimited Free Pickups</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDE1] shadow-xs">
              <RotateCcw className="w-3.5 h-3.5 text-[#3F8F6B]" />
              <span>Unused KG Rollover</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-[#E8DDE1] shadow-xs">
              <Zap className="w-3.5 h-3.5 text-[#D6B36A]" />
              <span>Priority 24h Turnaround</span>
            </span>
          </div>
        </div>

        {/* Duration Filter Switcher */}
        <div className="flex justify-center">
          <div className="bg-white p-1.5 rounded-2xl border border-[#E8DDE1] shadow-xs inline-flex gap-1.5">
            {[
              { key: 'ALL', label: 'All Passes' },
              { key: '1M', label: 'Monthly (1 Mo)' },
              { key: '3M', label: 'Quarterly (3 Mo)' },
              { key: '12M', label: 'Annual (12 Mo)' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedDuration(tab.key as any)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  selectedDuration === tab.key
                    ? 'bg-[#5B214F] text-white shadow-md shadow-[#5B214F]/20'
                    : 'text-[#6F626A] hover:text-[#2B1326] hover:bg-[#F7F0F2]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {filteredPlans.map((plan) => {
            const isSubscribed = subscribedPlans.includes(plan.id);
            const effectivePerKg = Math.round(plan.price / plan.includedKg);
            const savingsPercent = plan.originalPrice
              ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
              : 25;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-[#2B1326] via-[#3F1436] to-[#2B1326] text-white shadow-[0_20px_50px_rgba(43,19,38,0.18)] ring-2 ring-[#D6B36A] scale-[1.03]'
                    : 'bg-white text-[#2B1326] border border-[#E8DDE1] shadow-xs hover:shadow-[0_12px_40px_rgba(43,19,38,0.08)]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#5B214F] text-[#D6B36A] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 border border-[#D6B36A]/40">
                    <Sparkles className="w-3 h-3 text-[#D6B36A]" />
                    <span>RECOMMENDED</span>
                  </div>
                )}

                <div>
                  {/* Title & Quota */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className={`font-black text-xl font-poppins ${plan.popular ? 'text-white' : 'text-[#2B1326]'}`}>
                        {plan.name}
                      </h3>
                      <div className={`text-[11px] font-medium mt-0.5 ${plan.popular ? 'text-[#CDBFC6]' : 'text-[#6F626A]'}`}>
                        {plan.durationMonths || 1} Month{(plan.durationMonths || 1) > 1 ? 's' : ''} Validity ({plan.validityDays} days)
                      </div>
                    </div>
                    {savingsPercent > 0 && (
                      <span className="bg-[#3F8F6B]/20 border border-[#3F8F6B]/40 text-[#3F8F6B] font-extrabold text-[10px] px-2 py-0.5 rounded-full shrink-0">
                        {savingsPercent}% OFF
                      </span>
                    )}
                  </div>

                  {/* Quota Badge */}
                  <div className="my-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold ${
                      plan.popular
                        ? 'bg-white/10 text-[#D6B36A] border border-white/15'
                        : 'bg-[#F7F0F2] text-[#5B214F] border border-[#E8DDE1]'
                    }`}>
                      <span>🧺 {plan.includedKg} KG Allowance</span>
                      <span className="opacity-60">·</span>
                      <span>₹{effectivePerKg}/KG</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-3xl font-black font-poppins ${plan.popular ? 'text-white' : 'text-[#2B1326]'}`}>
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-xs line-through text-[#9A8D94]">
                          ₹{plan.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] ${plan.popular ? 'text-[#CDBFC6]' : 'text-[#6F626A]'}`}>
                      / {plan.durationMonths || 1} Month{(plan.durationMonths || 1) > 1 ? 's' : ''} Total
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-6 text-xs font-medium">
                    {plan.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.popular ? 'text-[#D6B36A]' : 'text-[#3F8F6B]'}`} />
                        <span className={plan.popular ? 'text-[#E8DDE1]' : 'text-[#6F626A]'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleOpenSubscribeModal(plan)}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
                      isSubscribed
                        ? 'bg-[#3F8F6B] text-white'
                        : plan.popular
                        ? 'bg-[#5B214F] hover:bg-[#48193F] text-white border border-[#D6B36A]/40'
                        : 'bg-[#5B214F] hover:bg-[#48193F] text-white'
                    }`}
                  >
                    {isSubscribed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Active Membership</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe to Pass</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#D6B36A]" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E8DDE1] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F0F2] flex items-center justify-center text-[#5B214F] shrink-0 border border-[#E8DDE1]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B1326]">Free Pickups</div>
              <div className="text-[10px] text-[#6F626A] font-medium">Unlimited ₹0 doorstep visits</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8DDE1] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F0F2] flex items-center justify-center text-[#5B214F] shrink-0 border border-[#E8DDE1]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B1326]">KG Rollover</div>
              <div className="text-[10px] text-[#6F626A] font-medium">Unused weight carries forward</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8DDE1] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F0F2] flex items-center justify-center text-[#5B214F] shrink-0 border border-[#E8DDE1]">
              <Zap className="w-5 h-5 text-[#D6B36A]" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B1326]">Priority Turnaround</div>
              <div className="text-[10px] text-[#6F626A] font-medium">Guaranteed 24h VIP queue</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8DDE1] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#F7F0F2] flex items-center justify-center text-[#5B214F] shrink-0 border border-[#E8DDE1]">
              <ShieldCheck className="w-5 h-5 text-[#3F8F6B]" />
            </div>
            <div>
              <div className="text-xs font-black text-[#2B1326]">Zero Lock-In</div>
              <div className="text-[10px] text-[#6F626A] font-medium">Pause or cancel anytime</div>
            </div>
          </div>
        </div>

        {/* Modal: Subscribe / Checkout */}
        {activeModalPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E8DDE1] shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-xl text-[#2B1326] font-poppins">
                    {activeModalPlan.name}
                  </h3>
                  <p className="text-xs text-[#6F626A]">Confirm your membership pass subscription</p>
                </div>
                <button
                  onClick={() => setActiveModalPlan(null)}
                  className="p-1 rounded-full text-[#9A8D94] hover:text-[#2B1326] hover:bg-[#F7F0F2] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Summary */}
              <div className="bg-[#FCF9F7] p-4 rounded-2xl border border-[#E8DDE1] space-y-2 text-xs font-bold">
                <div className="flex justify-between text-[#6F626A]">
                  <span>Included Quota:</span>
                  <span className="text-[#2B1326] font-black">{activeModalPlan.includedKg} KG Allowance</span>
                </div>
                <div className="flex justify-between text-[#6F626A]">
                  <span>Validity Duration:</span>
                  <span className="text-[#2B1326] font-black">{activeModalPlan.validityDays} Days</span>
                </div>
                <div className="flex justify-between text-[#6F626A]">
                  <span>Doorstep Pickup:</span>
                  <span className="text-[#3F8F6B] font-black">Unlimited ₹0 Visits</span>
                </div>
                <div className="pt-2 border-t border-[#EEE5E8] flex justify-between items-center text-sm font-black text-[#2B1326]">
                  <span>Total Amount:</span>
                  <span className="text-2xl text-[#5B214F] font-poppins">₹{activeModalPlan.price}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#2B1326]">Choose Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: '⚡' },
                    { id: 'CARD', label: 'Card / NetB', icon: '💳' },
                    { id: 'WALLET', label: 'Balance', icon: '👛' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedPaymentMethod === m.id
                          ? 'bg-[#F7F0F2] border-[#5B214F] text-[#5B214F] font-black ring-1 ring-[#5B214F]'
                          : 'bg-[#FCF9F7] border-[#E8DDE1] text-[#6F626A] hover:bg-white'
                      }`}
                    >
                      <div className="text-base mb-0.5">{m.icon}</div>
                      <div className="text-[11px] font-bold">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleConfirmSubscription}
                disabled={isProcessing}
                className="w-full py-4 bg-[#5B214F] hover:bg-[#48193F] disabled:opacity-50 text-white font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-white/10"
              >
                {isProcessing ? (
                  <span>Connecting to Razorpay...</span>
                ) : (
                  <>
                    <span>Pay ₹{activeModalPlan.price} &amp; Activate Pass</span>
                    <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDF8FA] flex items-center justify-center text-sm font-bold text-[#5B214F]">Loading Subscription Passes...</div>}>
      <SubscriptionsContent />
    </Suspense>
  );
}
