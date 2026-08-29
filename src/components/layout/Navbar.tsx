'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShoppingBag,
  MapPin,
  Menu,
  X,
  ChevronDown,
  User,
  ArrowRight,
  Sparkles,
  Truck,
  Copy,
  Check,
  LogOut,
  Package,
  Crown,
  LayoutDashboard,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import { PincodeModal } from '@/components/common/PincodeModal';
import { CartFlyout } from '@/components/common/CartFlyout';
import { AuthModal } from '@/components/common/AuthModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { userPincode, currentZone, cart, cartTotals, showToast, openAuthModal, pricingSettings, logout } = useApp();

  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [fullUserData, setFullUserData] = useState<{ name?: string; phone?: string; email?: string } | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const announcementRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [announcementHeight, setAnnouncementHeight] = useState(36);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem('lf_access');
      setIsSignedIn(Boolean(token));
      try {
        const storedUser = localStorage.getItem('lf_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUserName(parsed.name ? parsed.name.split(' ')[0] : 'Account');
          setFullUserData(parsed);
        } else {
          setUserName('Account');
          setFullUserData(null);
        }
      } catch {
        setUserName('Account');
        setFullUserData(null);
      }
    };

    syncAuth();
    window.addEventListener('lf-auth-changed', syncAuth);
    return () => window.removeEventListener('lf-auth-changed', syncAuth);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isAnnouncementVisible) {
      setAnnouncementHeight(0);
      return;
    }
    if (announcementRef.current) {
      setAnnouncementHeight(announcementRef.current.offsetHeight);
    }
  }, [isAnnouncementVisible]);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText('WELCOME100');
    setCopiedCode(true);
    showToast('Promo code WELCOME100 copied!', 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Subscriptions', href: '/subscriptions' },
    { label: 'Loyalty', href: '/loyalty' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      {/* 1. TOP PROMOTIONAL BAR (Plum Black #2B1326 + Champagne Gold #D6B36A) */}
      {isAnnouncementVisible && (
        <div
          ref={announcementRef}
          className="bg-[#2B1326] text-white text-[10px] sm:text-xs py-1.5 px-3 sm:px-8 flex items-center justify-between font-medium relative z-50 border-b border-white/10 w-full overflow-hidden"
        >
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-center mx-auto truncate min-w-0">
            <span className="truncate">
              ✨ <strong className="text-white font-bold tracking-wide">FIRST ORDER</strong> — Save{' '}
              <strong className="text-[#D6B36A] font-extrabold">₹100</strong> with:{' '}
              <code className="bg-white/10 border border-[#D6B36A]/40 px-1 py-0.5 rounded font-mono font-bold text-[#D6B36A] text-[10px] sm:text-xs">
                WELCOME100
              </code>
            </span>
            <button
              onClick={handleCopyCode}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-[#D6B36A] hover:text-white px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              {copiedCode ? <Check className="w-2.5 h-2.5 text-[#3F8F6B]" /> : <Copy className="w-2.5 h-2.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <button
            onClick={() => setIsAnnouncementVisible(false)}
            className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer shrink-0 ml-1"
            title="Dismiss Announcement"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* 2. MAIN HEADER NAVBAR SPACER */}
      <div
        aria-hidden="true"
        className={`w-full shrink-0 transition-all duration-200 ${
          isAnnouncementVisible ? 'h-[164px] lg:h-[116px]' : 'h-[128px] lg:h-[80px]'
        }`}
      />

      <header
        style={{ top: !isScrolled && isAnnouncementVisible ? announcementHeight : 0 }}
        className={`fixed inset-x-0 z-50 border-b transition-all duration-200 ${
          isScrolled
            ? 'bg-white/98 border-[#E8DDE1] shadow-[0_12px_40px_rgba(43,19,38,0.06)]'
            : 'bg-white border-[#E8DDE1]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 lg:gap-6">
          
          {/* LEFT: Logo & Deliver-To Pill */}
          <div className="flex items-center gap-3 lg:gap-4 shrink-0">
            <Link
              href="/"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <img
                src="/logo.png"
                alt="LaundryFresh"
                className="w-10 h-10 rounded-2xl object-contain bg-white p-0.5 shadow-md shadow-[#5B214F]/20 group-hover:scale-105 transition-transform shrink-0 border border-[#E8DDE1]"
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#2B1326] leading-tight font-poppins">
                  LaundryFresh
                </span>
                <span className="text-[8px] text-[#B76E79] font-extrabold tracking-widest uppercase">
                  LUXURY FABRIC CARE
                </span>
              </div>
            </Link>

            {/* Deliver To Location Selector Pill (Desktop) */}
            <button
              type="button"
              onClick={() => setIsPincodeModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 bg-[#F7F0F2] hover:bg-[#F3EBF0] border border-[#E8DDE1] rounded-full px-3.5 py-1.5 text-xs transition cursor-pointer group whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#5B214F]" />
              <span className="text-[11px] text-[#6F626A] font-medium">Deliver to</span>
              <span className="font-bold text-[#2B1326] text-xs">
                {currentZone ? `${currentZone.pincode}, ${currentZone.areaName.split(' ')[0]}` : `${userPincode || '500081'}, Hitec City`}
              </span>
              <ChevronDown className="w-3 h-3 text-[#9A8D94] group-hover:text-[#5B214F] transition-colors shrink-0" />
            </button>
          </div>

          {/* CENTER: Navigation Links with Champagne Indicator */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs xl:text-sm font-bold whitespace-nowrap transition-all flex flex-col items-center relative group ${
                    isActive
                      ? 'text-[#5B214F] bg-[#F7F0F2]'
                      : 'text-[#6F626A] hover:text-[#5B214F] hover:bg-[#FAF5F7]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-1 w-4 h-0.5 bg-[#D6B36A] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: User Menu, Cart, Book Pickup */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Profile / Login */}
            {mounted && isSignedIn ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                  className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#E8DDE1] bg-[#F7F0F2] hover:bg-[#F3EBF0] px-3 py-1.5 text-xs font-bold text-[#2B1326] hover:text-[#5B214F] transition shadow-2xs whitespace-nowrap cursor-pointer active:scale-95 group"
                  aria-expanded={isProfileMenuOpen}
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#5B214F] to-[#2B1326] text-white flex items-center justify-center text-[11px] font-black shrink-0">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{userName || 'Account'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-[#6F626A] group-hover:text-[#5B214F] transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180 text-[#5B214F]' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2 border border-[#E8DDE1] shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 rounded-xl bg-[#F7F0F2] border border-[#E8DDE1] mb-1.5">
                      <p className="font-extrabold text-sm text-[#2B1326] truncate">
                        {fullUserData?.name || userName || 'Valued Customer'}
                      </p>
                      {fullUserData?.phone && (
                        <p className="text-[11px] font-semibold text-[#6F626A] mt-0.5">
                          +91 {fullUserData.phone}
                        </p>
                      )}
                    </div>

                    <div className="space-y-0.5 text-xs font-bold text-[#6F626A]">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F7F0F2] hover:text-[#5B214F] transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#5B214F]" />
                        <span>My Dashboard</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F7F0F2] hover:text-[#5B214F] transition"
                      >
                        <Package className="w-4 h-4 text-[#5B214F]" />
                        <span>Orders &amp; Tracking</span>
                      </Link>

                      <Link
                        href="/loyalty"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F7F0F2] hover:text-[#5B214F] transition"
                      >
                        <Crown className="w-4 h-4 text-[#D6B36A]" />
                        <span>VIP Loyalty Perks</span>
                      </Link>

                      <Link
                        href="/wallet"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F7F0F2] hover:text-[#5B214F] transition"
                      >
                        <Coins className="w-4 h-4 text-[#5B214F]" />
                        <span>Wallet Balance</span>
                      </Link>

                      <div className="pt-1 border-t border-[#E8DDE1] mt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#B94A48] hover:bg-rose-50 font-bold transition text-left cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : mounted ? (
              <button
                type="button"
                onClick={() => openAuthModal('LOGIN')}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E8DDE1] hover:border-[#5B214F] text-[#2B1326] hover:text-[#5B214F] font-bold text-xs bg-white hover:bg-[#F7F0F2] transition cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            ) : null}

            {/* Cart Button with Count Badge (Desktop / Tablet) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="hidden sm:inline-flex relative p-2.5 rounded-xl border border-[#E8DDE1] bg-white hover:bg-[#F7F0F2] text-[#2B1326] hover:text-[#5B214F] transition cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {mounted && cart.items && cart.items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#5B214F] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                  {cart.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0)}
                </span>
              )}
            </button>

            {/* Book Pickup Primary CTA (Desktop / Tablet) */}
            <Link
              href="/book"
              className="hidden sm:inline-flex px-4 sm:px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-[#5B214F]/20 transition-all items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Book Pickup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Menu (Only 3 Horizontal Lines on Mobile) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2.5 rounded-2xl border border-[#E8DDE1] bg-[#F7F0F2] hover:bg-[#EBDDE4] text-[#5B214F] active:scale-95 transition cursor-pointer flex items-center justify-center shrink-0 shadow-2xs"
              aria-label="Open navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[2.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sub-Header: Deliver To Location / Allow Location Strip */}
        <div className="lg:hidden bg-[#FCF9F7] border-t border-[#E8DDE1] px-4 py-2 flex items-center justify-between gap-2 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsPincodeModalOpen(true)}
            className="flex items-center gap-2 min-w-0 text-left cursor-pointer flex-1 group"
          >
            <div className="w-6 h-6 rounded-full bg-[#5B214F]/10 text-[#5B214F] flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-[10px] text-[#6F626A] font-bold uppercase tracking-wider">
                <span>Deliver to</span>
                <ChevronDown className="w-2.5 h-2.5 text-[#5B214F]" />
              </div>
              <p className="text-xs font-black text-[#2B1326] truncate">
                {currentZone
                  ? `${currentZone.areaName.split('/')[0].trim()} (${userPincode || '500081'})`
                  : `${userPincode ? `PIN ${userPincode}` : 'Select Hyderabad Location'}`}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setIsPincodeModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-[11px] shrink-0 shadow-2xs transition active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-[#D6B36A]" />
            <span>{userPincode ? 'Change' : 'Allow Location'}</span>
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8DDE1] bg-white px-4 py-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
            {/* Mobile Pincode Selector */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPincodeModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F7F0F2] border border-[#E8DDE1] text-xs font-bold text-[#2B1326] shadow-2xs cursor-pointer active:scale-98 transition"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#E8DDE1] flex items-center justify-center text-[#5B214F] shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left truncate">
                  <span className="text-[10px] text-[#6F626A] block uppercase font-extrabold leading-none">Delivery Location</span>
                  <span className="text-xs font-black text-[#2B1326] truncate block mt-0.5">
                    {currentZone ? `${currentZone.pincode}, ${currentZone.areaName}` : `${userPincode || '500072'}, Moosapet`}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#5B214F] shrink-0 ml-2" />
            </button>

            {/* User Account / Sign In Hero */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#5B214F] to-[#2B1326] text-white shadow-md">
              {isSignedIn ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 text-white flex items-center justify-center font-black text-sm shrink-0">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm truncate text-white leading-tight">
                        {fullUserData?.name || userName || 'Customer'}
                      </p>
                      <p className="text-[11px] text-white/80 font-medium truncate mt-0.5">
                        {fullUserData?.phone ? `+91 ${fullUserData.phone}` : 'Active Member'}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-white text-[#5B214F] text-xs font-black shadow-sm shrink-0 active:scale-95 transition"
                  >
                    Dashboard
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Welcome to LaundryFresh</h3>
                    <p className="text-[11px] text-white/80">Sign in for saved orders &amp; discounts</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      openAuthModal('LOGIN');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#D6B36A] hover:bg-[#c49d52] text-[#2B1326] text-xs font-black shadow-md shrink-0 cursor-pointer active:scale-95 transition"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>

            {/* Popular Care Services */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6F626A] block mb-2 px-1">
                Popular Services
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Dry Cleaning', icon: '👔', href: '/services?tab=GARMENTS' },
                  { label: 'Wash & Fold (KG)', icon: '🧺', href: '/services?tab=PER_KG' },
                  { label: 'Steam Pressing', icon: '💨', href: '/services?tab=GARMENTS' },
                  { label: 'Shoe Laundry', icon: '👟', href: '/services?tab=GARMENTS' },
                  { label: 'Curtains & Linen', icon: '🏡', href: '/services?tab=GARMENTS' },
                  { label: 'Express 24h Wash', icon: '⚡', href: '/book' },
                ].map((s) => (
                  <Link
                    key={s.label}
                    href={s.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E8DDE1] bg-[#FCF9F7] hover:bg-[#F7F0F2] text-xs font-extrabold text-[#2B1326] transition active:scale-98"
                  >
                    <span className="text-base">{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6F626A] block mb-2 px-1">
                Navigation
              </span>
              <div className="rounded-2xl border border-[#E8DDE1] bg-[#FCF9F7] divide-y divide-[#E8DDE1] overflow-hidden">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-4 py-3 text-xs font-extrabold text-[#2B1326] hover:bg-[#F7F0F2] hover:text-[#5B214F] transition"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#B76E79]" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions (Book & Support) */}
            <div className="space-y-2 pt-1">
              <Link
                href="/book"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3.5 rounded-xl bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#5B214F]/25 transition active:scale-95"
              >
                <span>Schedule Doorstep Pickup</span>
                <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
              </Link>

              <div className="flex gap-2">
                <a
                  href="tel:+919177671888"
                  className="flex-1 py-2.5 rounded-xl border border-[#E8DDE1] text-xs font-bold text-center text-[#2B1326] bg-white hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <span>📞 Call Support</span>
                </a>
                <a
                  href="https://wa.me/919177671888"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center hover:bg-emerald-700 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>💬 WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── MOBILE FLOATING CART BUTTON IN BOTTOM RIGHT ── */}
      {mounted && cart.items && cart.items.length > 0 && pathname !== '/book' && (
        <div className="fixed bottom-5 right-4 z-40 lg:hidden animate-in zoom-in-90 duration-200">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#5B214F] to-[#2B1326] text-white shadow-[0_10px_30px_rgba(91,33,79,0.45)] border-2 border-white/30 active:scale-95 transition cursor-pointer hover:shadow-2xl"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#D6B36A]" />
              <span className="absolute -top-2 -right-2.5 min-w-5 h-5 px-1 rounded-full bg-[#D6B36A] text-[#2B1326] text-[10px] font-black flex items-center justify-center shadow-md">
                {cart.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0)}
              </span>
            </div>
            <div className="text-left leading-tight">
              <span className="text-[9px] uppercase font-extrabold text-white/80 block">View Bag</span>
              <span className="text-xs font-black text-white font-poppins">₹{cartTotals.grandTotal}</span>
            </div>
          </button>
        </div>
      )}

      {/* Cart Flyout Sidebar */}
      <CartFlyout isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Pincode & Auth Modals */}
      <PincodeModal isOpen={isPincodeModalOpen} onClose={() => setIsPincodeModalOpen(false)} />
      <AuthModal />
    </>
  );
};
