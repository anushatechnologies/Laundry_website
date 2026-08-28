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
          className="bg-[#2B1326] text-white text-[11px] sm:text-xs py-2 px-4 sm:px-8 flex items-center justify-between font-medium relative z-50 border-b border-white/10"
        >
          <div className="w-6 hidden sm:block"></div>

          <div className="flex items-center justify-center gap-2 sm:gap-3 text-center mx-auto">
            <span>
              ✨ <strong className="text-white font-bold tracking-wide">FIRST ORDER OFFER</strong> — Save{' '}
              <strong className="text-[#D6B36A] font-extrabold">₹100</strong> with code:{' '}
              <code className="bg-white/10 border border-[#D6B36A]/40 px-1.5 py-0.5 rounded font-mono font-bold text-[#D6B36A] text-xs">
                WELCOME100
              </code>
            </span>
            <button
              onClick={handleCopyCode}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-[#D6B36A] hover:text-white px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
            >
              {copiedCode ? <Check className="w-3 h-3 text-[#3F8F6B]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <button
            onClick={() => setIsAnnouncementVisible(false)}
            className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer"
            title="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. MAIN HEADER NAVBAR SPACER */}
      <div
        aria-hidden="true"
        style={{ height: isAnnouncementVisible ? 80 + (announcementHeight || 36) : 80 }}
        className="w-full shrink-0 transition-all duration-200"
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
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5B214F] to-[#2B1326] flex items-center justify-center text-white shadow-md shadow-[#5B214F]/20 group-hover:scale-105 transition-transform shrink-0 border border-white/10">
                <svg className="w-5 h-5 fill-current text-[#D6B36A]" viewBox="0 0 24 24">
                  <path d="M12 2C10.9 2 10 2.9 10 4H6C4.9 4 4 4.9 4 6V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V6C20 4.9 19.1 4 18 4H14C14 2.9 13.1 2 12 2ZM12 4C12.55 4 13 4.45 13 5C13 5.55 12.55 6 12 6C11.45 6 11 5.55 11 5C11 4.45 11.45 4 12 4ZM8 9H16C16.55 9 17 9.45 17 10C17 10.55 16.55 11 16 11H8C7.45 11 7 10.55 7 10C7 9.45 7.45 9 8 9ZM8 13H16C16.55 13 17 13.45 17 14C17 14.55 16.55 15 16 15H8C7.45 15 7 14.55 7 14C7 13.45 7.45 13 8 13Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#2B1326] leading-tight font-poppins">
                  LaundryFresh
                </span>
                <span className="text-[8px] text-[#B76E79] font-extrabold tracking-widest uppercase">
                  LUXURY FABRIC CARE
                </span>
              </div>
            </Link>

            {/* Deliver To Location Selector Pill */}
            <button
              type="button"
              onClick={() => setIsPincodeModalOpen(true)}
              className="hidden lg:inline-flex items-center gap-1.5 bg-[#F7F0F2] hover:bg-[#F3EBF0] border border-[#E8DDE1] rounded-full px-3.5 py-1.5 text-xs transition cursor-pointer group whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5 text-[#5B214F]" />
              <span className="text-[11px] text-[#6F626A] font-medium">Deliver to</span>
              <span className="font-bold text-[#2B1326] text-xs">
                {currentZone ? `${currentZone.pincode}, ${currentZone.areaName.split(' ')[0]}` : `${userPincode || '500072'}, Moosapet`}
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

            {/* Cart Button with Count Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-[#E8DDE1] bg-white hover:bg-[#F7F0F2] text-[#2B1326] hover:text-[#5B214F] transition cursor-pointer"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.items && cart.items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#5B214F] text-white text-[10px] font-black flex items-center justify-center shadow-md">
                  {cart.items.reduce((s: number, i: any) => s + (i.quantity || 1), 0)}
                </span>
              )}
            </button>

            {/* Book Pickup Primary CTA */}
            <Link
              href="/book"
              className="px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-[#5B214F]/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <span>Book Pickup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl text-[#2B1326] hover:bg-[#F7F0F2] transition cursor-pointer"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8DDE1] bg-white px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 duration-150">
            {/* Mobile Pincode Selector */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsPincodeModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F7F0F2] border border-[#E8DDE1] text-xs font-bold text-[#2B1326]"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#5B214F]" />
                <span>Deliver to: {currentZone ? currentZone.areaName : userPincode || '500072'}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#6F626A]" />
            </button>

            <div className="divide-y divide-[#EEE5E8] pt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2.5 text-xs font-bold text-[#2B1326] hover:text-[#5B214F]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-2">
              {isSignedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#F7F0F2] text-[#5B214F] font-bold text-xs flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>My Account</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openAuthModal('LOGIN');
                  }}
                  className="w-full py-2.5 rounded-xl border border-[#E8DDE1] text-[#2B1326] font-bold text-xs flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In / Register</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart Flyout Sidebar */}
      <CartFlyout isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Pincode & Auth Modals */}
      <PincodeModal isOpen={isPincodeModalOpen} onClose={() => setIsPincodeModalOpen(false)} />
      <AuthModal />
    </>
  );
};
