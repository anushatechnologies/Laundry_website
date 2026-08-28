'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Sparkles,
  Tag,
  ArrowRight,
  Scale,
  Navigation,
  Building,
  Home as HomeIcon,
  Briefcase,
  AlertCircle,
  Percent,
  User,
} from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { GarmentImage } from '@/components/common/GarmentImage';
import { useApp } from '@/context/AppContext';
import {
  markRazorpayPaymentFailed,
  reserveBackendSlot,
  createRazorpayPaymentOrder,
  verifyRazorpayPayment,
  fetchFromBackend,
} from '@/lib/api';
import type { PaymentMethod, ExpressTier, Address } from '@/types';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const steps = [
  { num: 1, title: 'Select Items', desc: 'Garments & Bulk Wash' },
  { num: 2, title: 'Pickup & Address', desc: 'Schedule slot & location' },
  { num: 3, title: 'Review & Pay', desc: 'Confirm & secure checkout' },
];

const formatPickupDate = (dateStr: string) => {
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    }).format(d);
  } catch {
    return dateStr;
  }
};

function parseTimeStringToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === 'PM' && hours < 12) hours += 12;
  if (meridiem === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function isSlotPastOrClosed(dateStr: string, startTimeStr: string, bufferMinutes = 30): boolean {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`;

  if (dateStr < todayStr) return true;
  if (dateStr > todayStr) return false;

  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const slotStartMinutes = parseTimeStringToMinutes(startTimeStr);

  return currentMinutes >= slotStartMinutes - bufferMinutes;
}

function loadRazorpayCheckout() {
  return new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function BookingWizardPage() {
  const router = useRouter();
  const {
    addAddress,
    addClothItemToCart,
    addToCart,
    applyCouponCode,
    cart,
    cartTotals,
    clothTypes,
    createOrder,
    currentZone,
    currentUser,
    priceMatrix,
    pricingSettings,
    removeFromCart,
    removeCouponCode,
    savedAddresses,
    deleteAddress,
    serviceMasters,
    setBookingSlots,
    setExpressTier,
    setOrderNotes,
    setSelectedAddress,
    showToast,
    slotCapacities,
    updateCartQuantity,
    userPincode,
    openAuthModal,
    isLoggedIn,
  } = useApp();

  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasItems = mounted && cart.items.length > 0;
  const [activeCatalogMode, setActiveCatalogMode] = useState<'GARMENTS' | 'PER_KG'>('GARMENTS');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [selectedAddressId, setSelectedAddressId] = useState(savedAddresses[0]?.id || '');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [selectedPickupDate, setSelectedPickupDate] = useState('');
  const [contactName, setContactName] = useState(currentUser.name !== 'Valued Customer' ? currentUser.name : '');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');

  // New Address Form Modal/Inline state
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    type: 'Home' as 'Home' | 'Office' | 'Other',
    contactName: currentUser.name !== 'Valued Customer' ? currentUser.name : '',
    contactPhone: currentUser.phone || '',
    houseNo: '',
    area: '',
    landmark: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: userPincode || '500072',
    instructions: '',
    isDefault: true,
  });

  useEffect(() => {
    if (currentUser.id !== 'anonymous-customer') {
      if (currentUser.name && currentUser.name !== 'Valued Customer') {
        setContactName(currentUser.name);
        setNewAddressForm((prev) => ({ ...prev, contactName: currentUser.name }));
      }
      if (currentUser.phone) {
        setContactPhone(currentUser.phone);
        setNewAddressForm((prev) => ({ ...prev, contactPhone: currentUser.phone }));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(savedAddresses[0].id);
    }
  }, [savedAddresses, selectedAddressId]);

  useEffect(() => {
    const handleAuthChanged = () => {
      if (cart.items.length > 0) {
        setStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('lf-auth-changed', handleAuthChanged);
    return () => window.removeEventListener('lf-auth-changed', handleAuthChanged);
  }, [cart.items.length]);

  const [notes, setNotes] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE_RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [justAddedClothId, setJustAddedClothId] = useState<string | null>(null);

  // Bulk wash weight state
  const [bulkKgWeight, setBulkKgWeight] = useState<number>(4);
  const [selectedBulkServiceId, setSelectedBulkServiceId] = useState<string>(
    serviceMasters.find((s) => s.pricingType === 'PER_KG')?.id || 'srv-m-wash-fold'
  );

  const categories = useMemo(() => {
    const values = new Map<string, string>();
    clothTypes.forEach((cloth) => values.set(cloth.categoryTag, cloth.categoryLabel));
    return [{ key: 'ALL', label: 'All Garments' }, ...Array.from(values, ([key, label]) => ({ key, label }))];
  }, [clothTypes]);

  const catalogItems = useMemo(
    () =>
      clothTypes
        .filter((cloth) => cloth.isActive)
        .filter((cloth) => category === 'ALL' || cloth.categoryTag === category)
        .filter((cloth) => `${cloth.name} ${cloth.categoryLabel}`.toLowerCase().includes(query.trim().toLowerCase()))
        .map((cloth) => ({
          cloth,
          prices: priceMatrix.filter((price) => price.clothTypeId === cloth.id && price.isActive),
        }))
        .filter((item) => item.prices.length > 0),
    [category, clothTypes, priceMatrix, query]
  );

  // Default Standard Slot Template
  const defaultSlotTemplate = [
    { id: 'slot-morning-1', startTime: '08:00 AM', endTime: '10:00 AM', tag: 'Early Morning' },
    { id: 'slot-morning-2', startTime: '10:00 AM', endTime: '12:00 PM', tag: 'Morning' },
    { id: 'slot-afternoon', startTime: '01:00 PM', endTime: '03:00 PM', tag: 'Afternoon' },
    { id: 'slot-evening-1', startTime: '04:00 PM', endTime: '06:00 PM', tag: 'Evening' },
    { id: 'slot-evening-2', startTime: '06:00 PM', endTime: '08:00 PM', tag: 'Late Evening' },
    { id: 'slot-night', startTime: '08:00 PM', endTime: '10:00 PM', tag: 'Night' },
  ];

  // Pickup dates generation (Today + next 6 days) with active slot verification
  const pickupDates = useMemo(() => {
    const dates: { date: string; hasAvailableSlots: boolean; activeSlotCount: number }[] = [];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const rawSlots = slotCapacities.filter(
        (slot) => slot.isActive && slot.date === dateStr && slot.isAvailable
      );

      const slotList = rawSlots.length > 0 ? rawSlots : defaultSlotTemplate;
      const validSlots = slotList.filter((s) => !isSlotPastOrClosed(dateStr, s.startTime, 30));

      dates.push({
        date: dateStr,
        hasAvailableSlots: validSlots.length > 0,
        activeSlotCount: validSlots.length,
      });
    }
    return dates;
  }, [slotCapacities]);

  // Automatically select the first date that has active upcoming slots
  useEffect(() => {
    const firstValidDate = pickupDates.find((p) => p.hasAvailableSlots)?.date || pickupDates[0]?.date;
    if (firstValidDate && (!selectedPickupDate || !pickupDates.some((p) => p.date === selectedPickupDate && p.hasAvailableSlots))) {
      setSelectedPickupDate(firstValidDate);
    }
  }, [pickupDates, selectedPickupDate]);

  const activePickupDate = selectedPickupDate || pickupDates[0]?.date || new Date().toISOString().slice(0, 10);

  // Available slots for the chosen pickup date with past detection
  const availableSlots = useMemo(() => {
    const rawSlots = slotCapacities.filter(
      (slot) => slot.isActive && slot.date === activePickupDate
    );

    const slotSource =
      rawSlots.length > 0
        ? rawSlots
        : defaultSlotTemplate.map((s) => ({
            id: `${activePickupDate}-${s.id}`,
            hubId: 'HUB-HYD-01',
            date: activePickupDate,
            startTime: s.startTime,
            endTime: s.endTime,
            maxOrders: 20,
            bookedOrders: 4,
            maxKg: 100,
            bookedKg: 24,
            isAvailable: true,
            isActive: true,
            tag: s.tag,
          }));

    return slotSource.map((slot) => {
      const isPast = isSlotPastOrClosed(slot.date, slot.startTime, 30);
      return {
        ...slot,
        isPast,
      };
    });
  }, [activePickupDate, slotCapacities]);

  // Select the first valid, non-past slot
  useEffect(() => {
    const activeSlots = availableSlots.filter((s) => !s.isPast);
    if (activeSlots.length > 0) {
      if (!selectedSlotId || availableSlots.find((s) => s.id === selectedSlotId)?.isPast) {
        setSelectedSlotId(activeSlots[0].id);
      }
    }
  }, [availableSlots, selectedSlotId]);

  const selectedSlot = availableSlots.find((slot) => slot.id === selectedSlotId && !slot.isPast) || availableSlots.find((s) => !s.isPast);
  const selectedAddress = savedAddresses.find((address) => address.id === selectedAddressId) || savedAddresses[0];

  const handleAddGarment = (clothId: string, serviceId: string) => {
    const cloth = clothTypes.find((item) => item.id === clothId);
    const price = priceMatrix.find((item) => item.clothTypeId === clothId && item.serviceId === serviceId && item.isActive);
    if (!cloth || !price) return;
    addClothItemToCart(cloth, price, 1);
    setJustAddedClothId(`${clothId}-${serviceId}`);
    setTimeout(() => setJustAddedClothId(null), 1500);
  };

  const handleAddBulkToBag = () => {
    const srv = serviceMasters.find((s) => s.id === selectedBulkServiceId);
    if (!srv) return;
    addToCart(
      {
        id: srv.id,
        categoryId: 'cat-1',
        name: srv.name,
        slug: srv.slug,
        description: srv.description,
        pricingModel: 'PER_KG',
        basePrice: srv.baseKgPrice || 60,
        unit: 'KG',
        minOrderQuantity: srv.minOrderKg || 3,
        turnaroundHours: srv.turnaroundHours,
      },
      bulkKgWeight
    );
    showToast(`Added ${bulkKgWeight} KG bulk laundry to bag!`, 'success');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCouponCode(couponInput.trim().toUpperCase());
    setCouponInput('');
  };

  const handleUseCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const geoData = await fetchFromBackend<any>(`/pincodes/reverse-geocode?lat=${lat}&lng=${lng}`);
          if (geoData && geoData.pincode) {
            setNewAddressForm((prev) => ({
              ...prev,
              area: geoData.areaName || prev.area,
              city: geoData.city || 'Hyderabad',
              pincode: geoData.pincode,
            }));
            showToast(`📍 Location detected: ${geoData.areaName || ''} (${geoData.pincode})`, 'success');
          }
        } catch {
          showToast('Could not reverse-geocode your coordinates. Please enter manually.', 'info');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        showToast(`Location error: ${err.message}`, 'error');
      },
      { timeout: 8000 }
    );
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressForm.houseNo.trim() && !newAddressForm.area.trim()) {
      showToast('Please enter your house/flat number and street area.', 'error');
      return;
    }
    const cleanPin = newAddressForm.pincode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      showToast('Please enter a valid 6-digit pincode.', 'error');
      return;
    }

    const streetCombined = [newAddressForm.houseNo.trim(), newAddressForm.area.trim()]
      .filter(Boolean)
      .join(', ');

    const saved = addAddress({
      type: newAddressForm.type,
      contactName: newAddressForm.contactName.trim() || contactName || currentUser.name,
      contactPhone: newAddressForm.contactPhone.trim() || contactPhone || currentUser.phone,
      houseNo: newAddressForm.houseNo.trim(),
      area: newAddressForm.area.trim(),
      street: streetCombined,
      landmark: newAddressForm.landmark.trim(),
      city: newAddressForm.city.trim() || 'Hyderabad',
      state: newAddressForm.state.trim() || 'Telangana',
      pincode: cleanPin,
      instructions: newAddressForm.instructions.trim(),
      isDefault: newAddressForm.isDefault,
    });

    setSelectedAddressId(saved.id);
    setIsAddingNewAddress(false);
    showToast('Delivery & pickup address saved! 📍', 'success');
  };

  const continueToDetails = () => {
    if (!cart.items.length) {
      showToast('Your cart is empty! Please add at least 1 garment or bulk wash service.', 'error');
      return;
    }
    if (!isLoggedIn) {
      openAuthModal('/book?step=2');
      return;
    }
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const continueToPayment = () => {
    if (!cart.items.length) {
      showToast('Your laundry bag is empty! Please add at least 1 item to proceed.', 'error');
      setStep(0);
      return;
    }
    const cleanPhone = (contactPhone || currentUser.phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please provide a valid 10-digit mobile number for pickup updates.', 'error');
      return;
    }
    if (!selectedAddress) {
      showToast('Please select or add a pickup address.', 'error');
      return;
    }
    if (!selectedSlot) {
      showToast('Please select an available pickup time slot.', 'error');
      return;
    }
    setSelectedAddress(selectedAddress);
    setBookingSlots(selectedSlot.date || activePickupDate, `${selectedSlot.startTime} - ${selectedSlot.endTime}`);
    setOrderNotes(notes);
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completeBooking = async () => {
    if (!cart.items.length) {
      showToast('Your laundry bag is empty! Please add at least 1 item before booking.', 'error');
      setStep(0);
      return;
    }
    const cleanPhone = (contactPhone || currentUser.phone || '9876543210').replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      showToast('Please enter a valid 10-digit mobile number for pickup updates.', 'error');
      setStep(1);
      return;
    }
    if (!selectedAddress || !selectedSlot) {
      showToast('Please choose a valid pickup address and time slot.', 'error');
      setStep(1);
      return;
    }

    setIsProcessing(true);
    const pickupDate = selectedSlot.date || activePickupDate;
    const pickupSlot = `${selectedSlot.startTime} - ${selectedSlot.endTime}`;
    const checkoutDetails = {
      selectedAddress,
      pickupDate,
      pickupSlot,
      notes,
      customerName: contactName.trim() || currentUser.name || 'Valued Customer',
      customerPhone: cleanPhone,
      customerEmail: currentUser.email || '',
    };

    try {
      if (selectedSlot.id) {
        await reserveBackendSlot(selectedSlot.id, Math.max(cartTotals.totalKg, 1)).catch(() => {});
      }
      const order = await createOrder(paymentMethod, checkoutDetails);

      if (paymentMethod !== 'ONLINE_RAZORPAY') {
        showToast(`🎉 Order #${order.id} scheduled successfully!`, 'success');
        router.push(`/track/${order.id}`);
        return;
      }

      const payment = await createRazorpayPaymentOrder(order.id);
      const checkoutAvailable = await loadRazorpayCheckout();

      // If Razorpay JS is loaded and not a mock/sandbox fallback
      if (checkoutAvailable && window.Razorpay && !(payment as any)?.isMock && !payment.key.includes('mock')) {
        const razorpay = new window.Razorpay({
          key: payment.key,
          amount: payment.amount,
          currency: payment.currency,
          name: 'LaundryFresh',
          description: `Order #${order.id}`,
          order_id: payment.orderId,
          prefill: {
            name: checkoutDetails.customerName,
            contact: checkoutDetails.customerPhone,
          },
          theme: { color: '#5B214F' },
          handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
            try {
              await verifyRazorpayPayment({ internalOrderId: order.id, ...response });
              showToast('🎉 Payment verified! Your order is scheduled for pickup.', 'success');
              router.push(`/track/${order.id}`);
            } catch (error) {
              await markRazorpayPaymentFailed(order.id);
              showToast(error instanceof Error ? error.message : 'Payment verification failed.', 'error');
            } finally {
              setIsProcessing(false);
            }
          },
          modal: {
            ondismiss: async () => {
              await markRazorpayPaymentFailed(order.id);
              setIsProcessing(false);
              showToast('Payment window closed. Your order is placed and you can pay on pickup.', 'info');
              router.push(`/track/${order.id}`);
            },
          },
        });
        razorpay.open();
      } else {
        // Mock Sandbox / Instant test payment verification
        await verifyRazorpayPayment({
          internalOrderId: order.id,
          razorpay_order_id: payment.orderId,
          razorpay_payment_id: `pay_sand_${Date.now()}`,
          razorpay_signature: `mock_sig_${Date.now()}`,
        });
        showToast('🎉 Payment verified! Your order is scheduled for pickup.', 'success');
        router.push(`/track/${order.id}`);
      }
    } catch (error) {
      setIsProcessing(false);
      const message = error instanceof Error ? error.message : 'Could not complete order. Please try again.';
      showToast(
        message.toLowerCase().includes('at least 1 element')
          ? 'Your laundry bag is empty. Add a service before scheduling pickup.'
          : message,
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F7] text-[#2B1326] flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 w-full">
        {/* Top Stepper Banner */}
        <section className="overflow-hidden rounded-3xl bg-[#2B1326] px-6 py-7 text-white shadow-xl sm:px-10 sm:py-8 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/20 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-indigo-200">
                <ShieldCheck className="h-3.5 w-3.5 text-[#5B214F]" /> 100% Guaranteed Doorstep Pickup &amp; Care
              </div>
              <h1 className="mt-2.5 text-2xl sm:text-3xl font-black tracking-tight font-poppins">
                Schedule Your Laundry Pickup
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300">
                Select your clothes, choose a convenient pickup window, and let our experts take care of the rest.
              </p>
            </div>

            {/* Stepper Progress */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
              {steps.map((s, idx) => (
                <div
                  key={s.num}
                  onClick={() => idx < step && setStep(idx)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition ${
                    idx === step
                      ? 'bg-[#5B214F] text-white shadow-md shadow-indigo-500/30'
                      : idx < step
                      ? 'bg-slate-800 text-slate-200 cursor-pointer hover:bg-slate-700'
                      : 'text-slate-500'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      idx < step ? 'bg-emerald-500 text-white' : idx === step ? 'bg-white text-[#5B214F]' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {idx < step ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                  </span>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold block leading-none">{s.title}</span>
                    <span className="text-[9px] opacity-70 block">{s.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────
            STEP 1: CHOOSE ITEMS (GARMENTS & BULK WASH)
        ───────────────────────────────────────────────────── */}
        {step === 0 && (
          <section className={`mt-8 grid gap-6 transition-all duration-300 ${hasItems ? 'lg:grid-cols-[1fr_380px]' : 'max-w-4xl mx-auto'}`}>
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs sm:p-7 space-y-6">
              {/* Header & Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#5B214F]">Step 1 of 3</p>
                  <h2 className="text-xl font-black text-[#2B1326]">Choose Garments &amp; Services</h2>
                </div>

                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setActiveCatalogMode('GARMENTS')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeCatalogMode === 'GARMENTS' ? 'bg-white text-[#5B214F] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👔 By Garment
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCatalogMode('PER_KG')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      activeCatalogMode === 'PER_KG' ? 'bg-[#2B1326] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🧺 By Weight (KG)
                  </button>
                </div>
              </div>

              {/* MODE 1: BY GARMENT */}
              {activeCatalogMode === 'GARMENTS' && (
                <div className="space-y-5">
                  {/* Search and Category Filter */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search shirts, jeans, sarees, suits, bedsheets..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#5B214F] text-xs sm:text-sm font-medium transition"
                      />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {categories.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setCategory(item.key)}
                          className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                            category === item.key
                              ? 'bg-[#5B214F] text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-[#F7F0F2] hover:text-[#5B214F]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Garments Grid */}
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {catalogItems.map(({ cloth, prices }) => (
                      <article
                        key={cloth.id}
                        className="rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 transition-all hover:border-[#5B214F]/40 hover:shadow-md bg-white flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2.5 mb-2.5">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <GarmentImage
                                name={cloth.name}
                                icon={cloth.icon}
                                imageUrl={cloth.imageUrl}
                                categoryTag={cloth.categoryTag}
                                size="md"
                                className="w-10 h-10 rounded-xl shadow-2xs shrink-0"
                              />
                              <div className="min-w-0">
                                <h3 className="font-extrabold text-xs sm:text-sm text-[#2B1326] truncate">{cloth.name}</h3>
                                <span className="text-[9px] font-extrabold text-[#B76E79] uppercase block truncate">
                                  {cloth.categoryLabel}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="line-clamp-1 text-[10px] text-slate-500 mb-2">
                            {cloth.description || 'Premium fabric care with doorstep pickup.'}
                          </p>
                        </div>

                        {/* Care Services for this Garment */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          {prices.slice(0, 3).map((price) => {
                            const itemKey = `${cloth.id}-${price.serviceId}`;
                            const cartItem = cart.items.find((i) => i.id === itemKey);
                            const qty = cartItem ? cartItem.quantity : 0;
                            const isAdded = justAddedClothId === itemKey;

                            if (qty > 0) {
                              return (
                                <div
                                  key={price.id}
                                  className="flex w-full items-center justify-between rounded-xl border border-[#5B214F]/40 bg-[#F7F0F2] px-2.5 py-1.5 text-xs transition gap-2"
                                >
                                  <span className="font-bold text-[#2B1326] text-[11px] truncate flex-1">{price.serviceName}</span>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-black text-[#5B214F] text-xs">₹{price.price * qty}</span>
                                    <div className="flex items-center rounded-lg bg-white border border-[#5B214F]/30 p-0.5 shadow-2xs">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateCartQuantity(itemKey, qty - 1);
                                        }}
                                        className="w-5 h-5 rounded flex items-center justify-center text-slate-700 hover:bg-[#5B214F] hover:text-white transition cursor-pointer"
                                        title="Decrease quantity"
                                      >
                                        <Minus className="w-3 h-3 stroke-[2.5]" />
                                      </button>
                                      <span className="w-4 text-center font-black text-xs text-[#2B1326]">{qty}</span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          updateCartQuantity(itemKey, qty + 1);
                                        }}
                                        className="w-5 h-5 rounded flex items-center justify-center text-[#5B214F] hover:bg-[#5B214F] hover:text-white transition cursor-pointer"
                                        title="Increase quantity"
                                      >
                                        <Plus className="w-3 h-3 stroke-[2.5]" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={price.id}
                                className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-1.5 text-xs transition gap-2 ${
                                  isAdded
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                    : 'border-slate-200 bg-slate-50/70 hover:border-[#5B214F] hover:bg-[#F7F0F2]'
                                }`}
                              >
                                <span className="font-bold text-slate-700 text-[11px] truncate flex-1">{price.serviceName}</span>
                                <button
                                  type="button"
                                  onClick={() => handleAddGarment(cloth.id, price.serviceId)}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#5B214F] hover:bg-[#48193F] text-white font-bold text-xs shadow-2xs transition shrink-0 cursor-pointer active:scale-95"
                                >
                                  <span>₹{price.price}</span>
                                  <Plus className="w-3 h-3 text-[#D6B36A] stroke-[2.5]" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    ))}
                  </div>

                  {!catalogItems.length && (
                    <div className="py-12 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No matching garments found for "{query}".
                    </div>
                  )}
                </div>
              )}

              {/* MODE 2: BY BULK WEIGHT (PER-KG) */}
              {activeCatalogMode === 'PER_KG' && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
                  <div>
                    <h3 className="font-extrabold text-base text-[#2B1326]">Everyday Bulk Wash by Weight</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Weighed &amp; sanitized per-KG. Best for daily wear and home linens.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {serviceMasters
                      .filter((s) => s.pricingType === 'PER_KG')
                      .map((srv) => (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedBulkServiceId(srv.id)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition ${
                            selectedBulkServiceId === srv.id
                              ? 'bg-[#F7F0F2] border-[#5B214F] ring-2 ring-[#5B214F]/20'
                              : 'bg-white border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-extrabold text-xs text-[#2B1326]">{srv.name}</span>
                            <span className="font-black text-xs text-[#5B214F]">₹{srv.baseKgPrice}/KG</span>
                          </div>
                          <p className="text-[10px] text-slate-500">{srv.description}</p>
                        </div>
                      ))}
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#2B1326]">
                      <span>Estimated Laundry Weight:</span>
                      <span className="text-[#5B214F] font-black text-sm">{bulkKgWeight} KG (~{bulkKgWeight * 4} clothes)</span>
                    </div>
                    <input
                      type="range"
                      min={3}
                      max={20}
                      value={bulkKgWeight}
                      onChange={(e) => setBulkKgWeight(parseInt(e.target.value))}
                      className="w-full accent-[#5B214F] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>3 KG (Min)</span>
                      <span>10 KG</span>
                      <span>20 KG</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBulkToBag}
                    className="w-full py-3 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 transition cursor-pointer"
                  >
                    + Add {bulkKgWeight} KG to Bag (₹{(serviceMasters.find((s) => s.id === selectedBulkServiceId)?.baseKgPrice || 60) * bulkKgWeight})
                  </button>
                </div>
              )}
            </div>

            {/* RIGHT: Live Bag Summary & Bill Details (Only shown when items exist) */}
            {hasItems && (
              <aside className="h-fit rounded-3xl border border-slate-200/80 bg-white p-5 shadow-2xs lg:sticky lg:top-24 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#5B214F]" />
                    <h2 className="font-black text-sm text-[#2B1326]">Your Bag</h2>
                  </div>
                  <span className="rounded-full bg-[#F7F0F2] px-2.5 py-0.5 text-[11px] font-bold text-[#5B214F]">
                    {cartTotals.itemCount} items
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-slate-50 p-3 border border-slate-100 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-slate-800 leading-tight">{item.serviceName}</span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-[#5B214F] cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-black">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-[#5B214F] cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-extrabold text-[#2B1326]">₹{item.subtotal}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Express Turnaround Option */}
                <div className="p-3 rounded-2xl bg-[#F7F0F2] border border-indigo-100 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold uppercase text-[#5B214F] block">Turnaround Speed</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExpressTier('REGULAR')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer text-center ${
                        cart.expressTier === 'REGULAR' ? 'bg-[#5B214F] text-white' : 'bg-white text-slate-700'
                      }`}
                    >
                      Standard 48h (Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpressTier('EXPRESS_24H')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition cursor-pointer text-center ${
                        cart.expressTier === 'EXPRESS_24H' ? 'bg-[#5B214F] text-white' : 'bg-white text-slate-700'
                      }`}
                    >
                      Express 24h (+₹{pricingSettings.expressDeliveryFee})
                    </button>
                  </div>
                </div>

                {/* Bill Details */}
                <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Item Subtotal:</span>
                    <span className="font-bold text-[#2B1326]">₹{cartTotals.itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Doorstep Delivery:</span>
                    <span className={`font-bold ${cartTotals.deliveryFee === 0 ? 'text-emerald-600' : 'text-[#2B1326]'}`}>
                      {cartTotals.deliveryFee === 0 ? 'FREE' : `₹${cartTotals.deliveryFee}`}
                    </span>
                  </div>
                  {cartTotals.expressFee > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Express Fee:</span>
                      <span className="font-bold text-[#5B214F]">₹{cartTotals.expressFee}</span>
                    </div>
                  )}
                  {cartTotals.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount:</span>
                      <span>-₹{cartTotals.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>GST ({pricingSettings.taxPercentage}%):</span>
                    <span className="font-bold text-[#2B1326]">₹{cartTotals.tax}</span>
                  </div>

                  <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200 text-[#2B1326]">
                    <span>Total Payable:</span>
                    <span className="text-lg text-[#5B214F]">₹{cartTotals.grandTotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={continueToDetails}
                  className="w-full py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                >
                  <span>Continue to Pickup &amp; Address</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </aside>
            )}
          </section>
        )}

        {/* ─────────────────────────────────────────────────────
            STEP 2: SCHEDULE PICKUP & ADDRESS DETAILS
        ───────────────────────────────────────────────────── */}
        {step === 1 && (
          <section className="mx-auto mt-8 max-w-3xl space-y-6">
            {mounted && !isLoggedIn && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl bg-indigo-50/80 border border-indigo-100 p-4 sm:p-5 text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#5B214F] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm shadow-indigo-500/20">
                    ✨
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-[#2B1326]">Already have an account?</p>
                    <p className="text-slate-600 text-xs mt-0.5">Sign in with OTP to autofill your addresses and merge your bag!</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('/book')}
                  className="px-4 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-bold text-xs shadow-sm shadow-indigo-500/20 transition cursor-pointer self-start sm:self-auto shrink-0 active:scale-95"
                >
                  Sign In with OTP
                </button>
              </div>
            )}

            {/* 0. Contact Information */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5B214F]" />
                  <h3 className="font-extrabold text-sm text-[#2B1326]">Contact Details</h3>
                </div>
                <span className="text-[11px] font-bold text-slate-400">For pickup updates &amp; SMS</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:border-[#5B214F]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 mb-1 block">Mobile Number (10 Digits) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold outline-none focus:border-[#5B214F]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Pickup Date Picker */}
            <div className="rounded-3xl border border-indigo-100 bg-[#F7F0F2] p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#5B214F]" />
                  <h3 className="font-extrabold text-sm text-[#2B1326]">1. Select Pickup Date</h3>
                </div>
                <span className="text-[11px] font-bold text-[#5B214F]">7 Days Open</span>
              </div>

              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {pickupDates.map((dateObj, idx) => {
                  const isSelected = activePickupDate === dateObj.date;
                  const label = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : formatPickupDate(dateObj.date);
                  const isClosed = !dateObj.hasAvailableSlots;

                  return (
                    <button
                      key={dateObj.date}
                      type="button"
                      disabled={isClosed}
                      onClick={() => {
                        setSelectedPickupDate(dateObj.date);
                        setSelectedSlotId('');
                      }}
                      className={`min-w-[110px] p-3 rounded-2xl text-left border transition ${
                        isClosed
                          ? 'bg-slate-100/70 border-slate-200 opacity-50 cursor-not-allowed text-slate-400'
                          : isSelected
                          ? 'bg-[#5B214F] text-white border-[#5B214F] shadow-md shadow-indigo-500/20 cursor-pointer'
                          : 'bg-white text-[#2B1326] border-slate-200 hover:border-indigo-200 cursor-pointer'
                      }`}
                    >
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${
                        isClosed ? 'text-slate-400' : isSelected ? 'text-indigo-200' : 'text-slate-400'
                      }`}>
                        {isClosed ? 'Closed' : idx === 0 ? 'Fastest' : 'Available'}
                      </span>
                      <span className="text-xs font-black block mt-0.5">{label}</span>
                      <span className={`text-[9px] block mt-1 ${
                        isClosed ? 'text-slate-400' : isSelected ? 'text-indigo-100' : 'text-slate-500'
                      }`}>
                        {isClosed ? 'Slots ended' : `${dateObj.activeSlotCount} slots`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Pickup Time Slot Selector */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-[#5B214F]" />
                  <h3 className="font-extrabold text-sm text-[#2B1326]">2. Select Pickup Time Slot</h3>
                </div>
                <span className="text-xs text-slate-500 font-medium">30-min window confirmation</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isPast = slot.isPast;

                  if (isPast) {
                    return (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 opacity-50 text-left flex items-center justify-between cursor-not-allowed select-none"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-400 line-through">
                              {slot.startTime} – {slot.endTime}
                            </span>
                            <span className="text-[9px] font-black uppercase text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              Passed
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            Slot ended for today
                          </span>
                        </div>
                        <Clock3 className="w-4 h-4 text-slate-300 shrink-0" />
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-4 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#F7F0F2] border-[#5B214F] ring-2 ring-[#5B214F]/20'
                          : 'bg-white border-slate-200 hover:border-indigo-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-[#2B1326]">
                            {slot.startTime} – {slot.endTime}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          Doorstep rider arrives in this window
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#5B214F] bg-[#5B214F] text-white' : 'border-slate-300'}`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {!availableSlots.some((s) => !s.isPast) && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>All pickup slots for this date have ended. Please select Tomorrow or an upcoming date above.</span>
                </div>
              )}
            </div>

            {/* 3. Delivery & Pickup Address */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#5B214F]" />
                  <h3 className="font-extrabold text-sm text-[#2B1326]">3. Delivery &amp; Pickup Address</h3>
                </div>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                    className="text-xs font-extrabold text-[#5B214F] hover:text-[#48193F] cursor-pointer flex items-center gap-1 bg-[#F7F0F2] px-3 py-1.5 rounded-xl transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingNewAddress ? 'Cancel' : 'Add New Address'}</span>
                  </button>
                )}
              </div>

              {/* Saved Address Cards */}
              {!isAddingNewAddress && savedAddresses.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {savedAddresses.map((address) => {
                    const isSelected = (selectedAddressId || savedAddresses[0]?.id) === address.id;
                    return (
                      <div
                        key={address.id}
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`p-4 rounded-2xl border text-left transition cursor-pointer relative group flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#F7F0F2]/70 border-[#5B214F] ring-2 ring-[#5B214F]/25 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/60'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#5B214F] bg-white px-2.5 py-0.5 rounded-full border border-indigo-100 shadow-2xs flex items-center gap-1">
                                {address.type === 'Home' && <HomeIcon className="w-2.5 h-2.5" />}
                                {address.type === 'Office' && <Briefcase className="w-2.5 h-2.5" />}
                                {address.type === 'Other' && <MapPin className="w-2.5 h-2.5" />}
                                <span>{address.type}</span>
                              </span>
                              {address.isDefault && (
                                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {isSelected && <Check className="w-4 h-4 text-[#5B214F] stroke-[3]" />}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteAddress(address.id);
                                }}
                                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                title="Delete address"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs font-extrabold text-[#2B1326] leading-snug">
                            {address.houseNo ? `${address.houseNo}, ` : ''}{address.area || address.street}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {address.landmark ? `${address.landmark}, ` : ''}{address.city}{address.state ? `, ${address.state}` : ''} - <span className="font-bold text-slate-700">{address.pincode}</span>
                          </p>

                          {(address.contactName || address.contactPhone) && (
                            <p className="text-[10px] font-semibold text-slate-600 mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-2">
                              <span>👤 {address.contactName || currentUser.name}</span>
                              <span>📞 {address.contactPhone || currentUser.phone}</span>
                            </p>
                          )}
                          {address.instructions && (
                            <p className="text-[10px] text-slate-500 italic mt-1 bg-white/80 p-1.5 rounded-lg border border-slate-100">
                              💬 &quot;{address.instructions}&quot;
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No Addresses Prompt / Inline Form */}
              {(isAddingNewAddress || savedAddresses.length === 0) && (
                <form onSubmit={handleSaveNewAddress} className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-indigo-100/80 space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                    <div>
                      <span className="text-xs font-black text-[#2B1326]">
                        {savedAddresses.length === 0 ? '📍 Add Your Doorstep Address' : '📍 New Address Details'}
                      </span>
                      <p className="text-[11px] text-slate-500">For laundry pickup &amp; delivery</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isDetectingLocation}
                      className="text-[11px] font-bold text-[#5B214F] bg-white px-3 py-1.5 rounded-xl border border-indigo-200 hover:bg-[#F7F0F2] flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#5B214F]" />
                      <span>{isDetectingLocation ? 'Detecting…' : 'Use GPS Location'}</span>
                    </button>
                  </div>

                  {/* Address Type Tag Selector */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1.5">Address Label</label>
                    <div className="flex gap-2">
                      {[
                        { type: 'Home', label: 'Home 🏠' },
                        { type: 'Office', label: 'Office / Work 🏢' },
                        { type: 'Other', label: 'Other 📍' },
                      ].map((t) => (
                        <button
                          key={t.type}
                          type="button"
                          onClick={() => setNewAddressForm((prev) => ({ ...prev, type: t.type as any }))}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            newAddressForm.type === t.type
                              ? 'bg-[#5B214F] text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/70'
                          }`}
                        >
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Details Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Contact Person Name</label>
                      <input
                        type="text"
                        required
                        value={newAddressForm.contactName}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, contactName: e.target.value }))}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Contact Mobile Number</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={newAddressForm.contactPhone}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, contactPhone: e.target.value.replace(/\D/g, '') }))}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  {/* House / Flat & Street Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">House / Flat / Building No. *</label>
                      <input
                        type="text"
                        required
                        value={newAddressForm.houseNo}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, houseNo: e.target.value }))}
                        placeholder="e.g. Flat 402, Block B, Rainbow Heights"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Street / Area / Locality *</label>
                      <input
                        type="text"
                        required
                        value={newAddressForm.area}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, area: e.target.value }))}
                        placeholder="e.g. KPHB 6th Phase, Road No. 3"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  {/* Landmark, City & Pincode Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        value={newAddressForm.landmark}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, landmark: e.target.value }))}
                        placeholder="e.g. Near Rythu Bazaar"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">City / Town *</label>
                      <input
                        type="text"
                        required
                        value={newAddressForm.city}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                        placeholder="e.g. Hyderabad"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newAddressForm.pincode}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                        placeholder="6-Digit Pincode"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                  </div>

                  {/* Delivery Instructions */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Delivery Instructions / Gate Code (Optional)</label>
                    <input
                      type="text"
                      value={newAddressForm.instructions}
                      onChange={(e) => setNewAddressForm((prev) => ({ ...prev, instructions: e.target.value }))}
                      placeholder="e.g. Leave with security / Ring doorbell / Call on arrival"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Set as Default Checkbox */}
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={newAddressForm.isDefault}
                      onChange={(e) => setNewAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                      className="rounded text-[#5B214F] focus:ring-[#5B214F]"
                    />
                    <span>Set as my default pickup &amp; delivery address</span>
                  </label>

                  <div className="flex gap-2 pt-1">
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="flex-1 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-2 py-3 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-indigo-500/25 transition cursor-pointer active:scale-95"
                    >
                      Save &amp; Select Address
                    </button>
                  </div>
                </form>
              )}

              {/* Optional Notes */}
              <div className="pt-2">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  placeholder="Special instructions (e.g. Ring doorbell, stain removal for white shirt, leave with security)..."
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs outline-none focus:border-[#5B214F] focus:ring-2 focus:ring-indigo-100 min-h-20"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Back to Bag
              </button>
              <button
                type="button"
                disabled={!cart.items.length}
                onClick={continueToPayment}
                className="px-7 py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-500/25 flex items-center gap-1.5 transition cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                <span>Review Order &amp; Pay</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────
            STEP 3: REVIEW & SECURE PAYMENT
        ───────────────────────────────────────────────────── */}
        {step === 2 && (
          <section className="mx-auto mt-8 max-w-3xl space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 shadow-2xs space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5B214F]">Step 3 of 3</p>
                <h2 className="text-xl font-black text-[#2B1326] mt-0.5">Order Confirmation &amp; Payment</h2>
              </div>

              {!cart.items.length && (
                <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-extrabold">Your laundry bag is empty</p>
                    <p className="mt-1 text-xs leading-5 text-amber-800">Add at least one garment or bulk wash service before payment. Your pickup details will be saved.</p>
                  </div>
                  <button type="button" onClick={() => setStep(0)} className="shrink-0 rounded-lg bg-amber-600 px-3 py-2 text-[11px] font-black text-white transition hover:bg-amber-700">Add items</button>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70 text-xs">
                  <div className="flex items-center gap-1.5 text-[#5B214F] font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Pickup &amp; Delivery Location</span>
                  </div>
                  <p className="font-extrabold text-[#2B1326] text-sm mt-1">{selectedAddress?.street}</p>
                  <p className="text-slate-500 mt-0.5">
                    {selectedAddress?.landmark ? `${selectedAddress.landmark}, ` : ''}{selectedAddress?.city} - {selectedAddress?.pincode}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Scheduled Time:</span>
                    <span className="font-bold text-[#2B1326]">{formatPickupDate(activePickupDate)} ({selectedSlot?.startTime})</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/70 text-xs">
                  <div className="flex items-center gap-1.5 text-[#5B214F] font-bold mb-1">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Care &amp; Garments Summary</span>
                  </div>
                  <p className="font-extrabold text-[#2B1326] text-sm mt-1">{cartTotals.itemCount} Items Selected</p>
                  <p className="text-slate-500 mt-0.5">
                    {cart.expressTier === 'EXPRESS_24H' ? '⚡ 24h Express Delivery' : 'Standard 48h Delivery'}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Service Model:</span>
                    <span className="font-bold text-emerald-600">Doorstep Sanitized Care</span>
                  </div>
                </div>
              </div>

              {/* Coupon Code Entry */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Percent className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. WELCOME100)"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-[#5B214F] uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2B1326] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {/* Payment Methods */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#2B1326] uppercase tracking-wider block">
                  Select Payment Option:
                </span>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE_RAZORPAY')}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                      paymentMethod === 'ONLINE_RAZORPAY'
                        ? 'bg-[#F7F0F2] border-[#5B214F] ring-2 ring-[#5B214F]/20'
                        : 'bg-white border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#5B214F]" />
                    <p className="mt-2 font-extrabold text-sm text-[#2B1326]">Pay Online (Razorpay)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">UPI (GPay/PhonePe), Credit/Debit Cards, NetBanking</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'bg-[#F7F0F2] border-[#5B214F] ring-2 ring-[#5B214F]/20'
                        : 'bg-white border-slate-200 hover:border-indigo-200'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#5B214F]" />
                    <p className="mt-2 font-extrabold text-sm text-[#2B1326]">Pay on Delivery (COD)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Pay via cash or UPI upon delivery after washing</p>
                  </button>
                </div>
              </div>

              {/* Final Price Box */}
              <div className="rounded-2xl border border-indigo-100 bg-[#F7F0F2] p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-600 block">Total Amount Payable</span>
                  <span className="text-2xl font-black text-[#5B214F]">₹{cartTotals.grandTotal}</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  All Taxes &amp; GST Included
                </span>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                disabled={isProcessing || !cart.items.length}
                onClick={completeBooking}
                className="w-full py-4 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-extrabold text-sm shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none cursor-pointer active:scale-95"
              >
                {isProcessing ? (
                  <span>Processing Secure Checkout…</span>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'ONLINE_RAZORPAY'
                        ? `Pay ₹${cartTotals.grandTotal} & Schedule Pickup`
                        : 'Confirm Doorstep Pickup Booking'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mx-auto block text-xs font-bold text-slate-500 hover:text-[#5B214F] cursor-pointer"
            >
              ← Back to pickup &amp; address
            </button>
          </section>
        )}
      </main>

      {/* ── MOBILE STICKY FLOATING CART BAR ── */}
      {hasItems && step === 0 && (
        <div className="fixed bottom-0 inset-x-0 p-3 bg-white/95 backdrop-blur-md border-t border-[#E8DDE1] shadow-[0_-8px_30px_rgba(43,19,38,0.12)] z-40 lg:hidden animate-in slide-in-from-bottom duration-200">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F7F0F2] border border-[#5B214F]/20 flex items-center justify-center text-[#5B214F] font-black shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-extrabold text-[#6F626A]">
                  {cartTotals.totalItems} {cartTotals.totalItems === 1 ? 'Garment' : 'Garments'}
                </div>
                <div className="text-base font-black text-[#5B214F] font-poppins leading-tight">
                  ₹{cartTotals.grandTotal}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={continueToDetails}
              className="px-5 py-3 rounded-xl bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-extrabold shadow-md shadow-[#5B214F]/20 flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
            >
              <span>Schedule Pickup</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D6B36A]" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
