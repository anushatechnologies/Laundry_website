'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
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
  Zap,
  CheckCircle2,
  X,
  Layers,
  Shirt,
  Wind,
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
  { num: 1, title: 'Select Items', desc: 'Garments & Care' },
  { num: 2, title: 'Slot & Address', desc: 'Pickup location' },
  { num: 3, title: 'Review & Pay', desc: 'Checkout' },
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

function BookingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stepQuery = searchParams ? searchParams.get('step') : null;
  const serviceQuery = searchParams ? searchParams.get('service') : null;
  const {
    addAddress,
    addClothItemToCart,
    addToCart,
    applyCouponCode,
    cart,
    cartTotals,
    clothTypes,
    createOrder,
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
  const [activeServiceTab, setActiveServiceTab] = useState<string>('ALL');
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
      const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr.id);
    }
  }, [savedAddresses, selectedAddressId]);

  useEffect(() => {
    if (serviceQuery) {
      if (serviceQuery === 'wash-fold') {
        setActiveServiceTab('srv-m-wash-fold');
      } else if (serviceQuery === 'wash-iron') {
        setActiveServiceTab('srv-m-wash-iron');
      } else if (serviceQuery === 'dry-clean') {
        setActiveServiceTab('srv-m-dry-clean');
      } else if (serviceQuery === 'steam-press') {
        setActiveServiceTab('srv-m-steam-press');
      } else if (serviceQuery === 'per-kg' || serviceQuery === 'bulk') {
        setActiveServiceTab('PER_KG');
      }
    }
  }, [serviceQuery]);

  useEffect(() => {
    if (stepQuery === '2' && cart.items.length > 0) {
      setStep(1);
    } else if (stepQuery === '3' && cart.items.length > 0) {
      setStep(2);
    }
  }, [stepQuery, cart.items.length]);

  const [notes, setNotes] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ONLINE_RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);

  // Bulk wash weight state
  const [bulkKgWeight, setBulkKgWeight] = useState<number>(4);
  const [selectedBulkServiceId, setSelectedBulkServiceId] = useState<string>(
    serviceMasters.find((s) => s.pricingType === 'PER_KG')?.id || 'srv-m-wash-fold'
  );

  const categories = useMemo(() => {
    const values = new Map<string, string>();
    clothTypes.forEach((cloth) => values.set(cloth.categoryTag, cloth.categoryLabel));
    return [{ key: 'ALL', label: 'All Garments', icon: '🧺' }, ...Array.from(values, ([key, label]) => ({
      key,
      label,
      icon: key === 'MENS' ? '👔' : key === 'WOMENS' ? '👗' : key === 'PREMIUM_BRIDAL' ? '💍' : key === 'KIDS' ? '👶' : key === 'HOME_TEXTILES' ? '🛏️' : '✨',
    }))];
  }, [clothTypes]);

  const serviceTabs = [
    { id: 'ALL', label: 'All Services', icon: '✨' },
    { id: 'srv-m-steam-press', label: 'Steam Press', icon: '💨', startingPrice: '₹20' },
    { id: 'srv-m-wash-fold', label: 'Wash & Fold', icon: '🧺', startingPrice: '₹30' },
    { id: 'srv-m-wash-iron', label: 'Wash & Iron', icon: '✨', startingPrice: '₹45' },
    { id: 'srv-m-dry-clean', label: 'Dry Cleaning', icon: '👔', startingPrice: '₹80' },
    { id: 'PER_KG', label: 'By Weight (KG)', icon: '⚖️', startingPrice: '₹60/KG' },
  ];

  const catalogItems = useMemo(
    () =>
      clothTypes
        .filter((cloth) => cloth.isActive)
        .filter((cloth) => category === 'ALL' || cloth.categoryTag === category)
        .filter((cloth) => `${cloth.name} ${cloth.categoryLabel}`.toLowerCase().includes(query.trim().toLowerCase()))
        .map((cloth) => {
          let prices = priceMatrix.filter((price) => price.clothTypeId === cloth.id && price.isActive);
          if (activeServiceTab !== 'ALL' && activeServiceTab !== 'PER_KG') {
            prices = prices.filter((p) => p.serviceId === activeServiceTab);
          }
          return {
            cloth,
            prices,
          };
        })
        .filter((item) => item.prices.length > 0),
    [activeServiceTab, category, clothTypes, priceMatrix, query]
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

  useEffect(() => {
    const firstValidDate = pickupDates.find((p) => p.hasAvailableSlots)?.date || pickupDates[0]?.date;
    if (firstValidDate && (!selectedPickupDate || !pickupDates.some((p) => p.date === selectedPickupDate && p.hasAvailableSlots))) {
      setSelectedPickupDate(firstValidDate);
    }
  }, [pickupDates, selectedPickupDate]);

  const activePickupDate = selectedPickupDate || pickupDates[0]?.date || new Date().toISOString().slice(0, 10);

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
            isPast: false,
          }));

    return slotSource.map((s) => {
      const isPast = isSlotPastOrClosed(activePickupDate, s.startTime, 30);
      return {
        ...s,
        isPast,
      };
    });
  }, [activePickupDate, slotCapacities]);

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

  useEffect(() => {
    if (selectedAddress) {
      if (selectedAddress.contactPhone && !contactPhone) {
        setContactPhone(selectedAddress.contactPhone.replace(/\D/g, '').slice(-10));
      }
      if (selectedAddress.contactName && !contactName) {
        setContactName(selectedAddress.contactName);
      }
    }
  }, [selectedAddress, contactPhone, contactName]);

  const handleAddGarment = (clothId: string, serviceId: string) => {
    const cloth = clothTypes.find((item) => item.id === clothId);
    const price = priceMatrix.find((item) => item.clothTypeId === clothId && item.serviceId === serviceId && item.isActive);
    if (!cloth || !price) return;
    addClothItemToCart(cloth, price, 1);
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
      showToast('🔒 Please sign in with your mobile number to schedule doorstep pickup.', 'info');
      router.push('/login?redirect=/book&step=2');
      return;
    }
    setStep(1);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const continueToPayment = () => {
    if (!cart.items.length) {
      showToast('Your laundry bag is empty! Please add at least 1 item to proceed.', 'error');
      setStep(0);
      return;
    }
    if (!isLoggedIn) {
      showToast('🔒 Please sign in with your mobile number to complete your booking.', 'info');
      router.push('/login?redirect=/book&step=2');
      return;
    }
    const cleanPhone = (contactPhone || selectedAddress?.contactPhone || currentUser.phone || '').replace(/\D/g, '');
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const completeBooking = async () => {
    if (!cart.items.length) {
      showToast('Your laundry bag is empty! Please add at least 1 item before booking.', 'error');
      setStep(0);
      return;
    }
    if (!isLoggedIn) {
      showToast('🔒 Please sign in with your mobile number to place order.', 'info');
      router.push('/login?redirect=/book&step=3');
      return;
    }
    const cleanPhone = (contactPhone || selectedAddress?.contactPhone || currentUser.phone || '9876543210').replace(/\D/g, '');
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
          handler: async (res: any) => {
            try {
              await verifyRazorpayPayment({
                internalOrderId: order.id,
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
              });
              showToast('🎉 Payment verified! Your order is scheduled for pickup.', 'success');
              router.push(`/track/${order.id}`);
            } catch {
              showToast('Payment verification pending. Our team will verify.', 'info');
              router.push(`/track/${order.id}`);
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

  const getServiceBadge = (serviceName: string) => {
    const s = serviceName.toLowerCase();
    if (s.includes('dry clean')) return { icon: '👔', label: 'Dry Clean' };
    if (s.includes('steam')) return { icon: '💨', label: 'Steam Press' };
    if (s.includes('fold')) return { icon: '🧺', label: 'Wash & Fold' };
    if (s.includes('iron')) return { icon: '✨', label: 'Wash & Iron' };
    return { icon: '✨', label: serviceName };
  };

  return (
    <div className="min-h-screen bg-[#FCF9F7] text-[#2B1326] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6 pb-32 w-full">
        {/* ── SLEEK STEP INDICATOR ── */}
        <div className="mb-4 bg-white rounded-2xl p-2.5 sm:p-3.5 border border-[#E8DDE1] shadow-2xs">
          <div className="flex items-center justify-between gap-1 sm:gap-2 max-w-2xl mx-auto">
            {steps.map((s, idx) => {
              const isActive = idx === step;
              const isCompleted = idx < step;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => idx <= step && setStep(idx)}
                  className={`flex items-center gap-1.5 sm:gap-3 transition-all ${
                    idx <= step ? 'cursor-pointer' : 'cursor-default opacity-50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#5B214F] text-white shadow-xs scale-105'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#F7F0F2] text-[#9A8D94]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.num}
                  </div>
                  <div className="text-left">
                    <p className={`text-xs font-extrabold leading-tight ${isActive ? 'text-[#5B214F]' : 'text-[#2B1326]'}`}>
                      {s.title}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-4 sm:w-10 h-0.5 bg-[#E8DDE1] ml-1 sm:ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────
            STEP 1: CHOOSE ITEMS & SERVICES
        ───────────────────────────────────────────────────── */}
        {step === 0 && (
          <section className={`grid gap-5 transition-all duration-300 ${hasItems ? 'lg:grid-cols-[1fr_360px]' : 'max-w-5xl mx-auto'}`}>
            <div className="space-y-4">
              
              {/* 1. Service Ribbon & Search Bar */}
              <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-[#E8DDE1] shadow-2xs space-y-3">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#9A8D94]" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search shirts, jeans, sarees, suits, bedsheets..."
                    className="w-full pl-10 pr-9 py-2 rounded-xl border border-[#E8DDE1] bg-[#FCF9F7] focus:bg-white focus:outline-none focus:border-[#5B214F] text-xs font-bold text-[#2B1326] transition"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Primary Service Filter Tabs (Swiggy / Blinkit Style) */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {serviceTabs.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveServiceTab(s.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                        activeServiceTab === s.id
                          ? 'bg-[#5B214F] text-white shadow-md shadow-[#5B214F]/25 ring-2 ring-[#5B214F]/20'
                          : 'bg-[#FCF9F7] text-[#6F626A] border border-[#E8DDE1] hover:bg-[#F7F0F2]'
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span>{s.label}</span>
                      {s.startingPrice && activeServiceTab !== s.id && (
                        <span className="text-[10px] text-[#B76E79] font-bold">({s.startingPrice})</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Category Ribbon (Visible when in Garment mode) */}
                {activeServiceTab !== 'PER_KG' && (
                  <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar border-t border-[#F2EAEF] pt-2.5">
                    {categories.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setCategory(item.key)}
                        className={`whitespace-nowrap rounded-xl px-2.5 py-1 text-[11px] font-extrabold transition cursor-pointer flex items-center gap-1.5 ${
                          category === item.key
                            ? 'bg-[#2B1326] text-[#D6B36A] shadow-xs'
                            : 'bg-[#FCF9F7] text-[#6F626A] border border-[#E8DDE1] hover:bg-[#F7F0F2]'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* MODE 1: GARMENTS CATALOG */}
              {activeServiceTab !== 'PER_KG' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {catalogItems.map(({ cloth, prices }) => {
                    const itemsInBag = cart.items.filter((i) => i.id?.startsWith(`${cloth.id}-`));
                    const totalQtyInBag = itemsInBag.reduce((sum, item) => sum + item.quantity, 0);
                    const minPrice = Math.min(...prices.map((p) => p.price));

                    return (
                      <div
                        key={cloth.id}
                        className="rounded-3xl border border-[#E8DDE1] bg-white p-3.5 sm:p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Garment Header Card */}
                          <div className="flex items-center gap-3 mb-2.5">
                            <GarmentImage
                              name={cloth.name}
                              icon={cloth.icon}
                              imageUrl={cloth.imageUrl}
                              categoryTag={cloth.categoryTag}
                              size="md"
                              className="w-11 h-11 rounded-2xl shadow-2xs shrink-0 border border-[#E8DDE1]"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-extrabold text-sm sm:text-base text-[#2B1326] leading-tight font-poppins truncate">
                                  {cloth.name}
                                </h3>
                                {totalQtyInBag > 0 ? (
                                  <span className="text-[10px] font-black text-[#5B214F] bg-[#F7F0F2] border border-[#5B214F]/30 px-2 py-0.5 rounded-full shrink-0">
                                    ✓ {totalQtyInBag} in Bag
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-extrabold text-[#B76E79] bg-[#FCF9F7] px-2 py-0.5 rounded-full border border-[#E8DDE1] shrink-0">
                                    From ₹{minPrice}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#6F626A] font-medium truncate mt-0.5">
                                {cloth.description || `${cloth.categoryLabel}`}
                              </p>
                            </div>
                          </div>

                          {/* Services List inside Garment Card */}
                          <div className="space-y-1.5 pt-2 border-t border-[#F2EAEF]">
                            {prices.map((price) => {
                              const itemKey = `${cloth.id}-${price.serviceId}`;
                              const cartItem = cart.items.find((i) => i.id === itemKey);
                              const qty = cartItem ? cartItem.quantity : 0;
                              const badge = getServiceBadge(price.serviceName);

                              return (
                                <div
                                  key={price.id}
                                  className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                                    qty > 0
                                      ? 'bg-[#F7F0F2] border-[#5B214F] ring-1 ring-[#5B214F]/20'
                                      : 'bg-[#FCF9F7] border-[#E8DDE1] hover:border-[#5B214F]/40 hover:bg-white'
                                  }`}
                                >
                                  <div className="min-w-0 flex-1 flex items-center gap-1.5">
                                    <span className="text-xs">{badge.icon}</span>
                                    <span className="font-extrabold text-xs text-[#2B1326] truncate">
                                      {badge.label}
                                    </span>
                                    <span className="text-[10px] text-[#9A8D94] font-medium hidden sm:inline">
                                      · {price.turnaroundHours}h
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2.5 shrink-0">
                                    <span className="text-xs font-black text-[#5B214F]">
                                      ₹{price.price}
                                    </span>

                                    {/* Add / Stepper Button */}
                                    {qty > 0 ? (
                                      <div className="flex items-center rounded-lg bg-[#5B214F] text-white p-0.5 shadow-2xs">
                                        <button
                                          type="button"
                                          onClick={() => updateCartQuantity(itemKey, qty - 1)}
                                          className="w-5 h-5 rounded-md flex items-center justify-center text-white hover:bg-black/20 transition cursor-pointer"
                                          title="Decrease"
                                        >
                                          <Minus className="w-3 h-3 stroke-[2.5]" />
                                        </button>
                                        <span className="w-4 text-center font-black text-xs text-white">
                                          {qty}
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => updateCartQuantity(itemKey, qty + 1)}
                                          className="w-5 h-5 rounded-md flex items-center justify-center text-white hover:bg-black/20 transition cursor-pointer"
                                          title="Increase"
                                        >
                                          <Plus className="w-3 h-3 stroke-[2.5]" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleAddGarment(cloth.id, price.serviceId)}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#5B214F] hover:bg-[#48193F] text-white font-black text-[11px] shadow-2xs transition active:scale-95 cursor-pointer"
                                      >
                                        <Plus className="w-2.5 h-2.5 text-[#D6B36A] stroke-[3]" />
                                        <span>ADD</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* MODE 2: BY WEIGHT (PER-KG BULK) */}
              {activeServiceTab === 'PER_KG' && (
                <div className="bg-white rounded-3xl border border-[#E8DDE1] p-5 sm:p-7 space-y-5 shadow-2xs">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] text-[#5B214F] text-[10px] font-extrabold uppercase tracking-widest border border-[#E8DDE1]">
                      <Scale className="w-3 h-3 text-[#D6B36A]" />
                      <span>ECONOMY PER-KG WASHING</span>
                    </div>
                    <h2 className="text-xl font-black text-[#2B1326] font-poppins">
                      Bulk Laundry by Weight
                    </h2>
                    <p className="text-xs text-[#6F626A] font-medium">
                      Ideal for daily casual wear, t-shirts, towels, and bedsheets weighed per KG.
                    </p>
                  </div>

                  {/* Service Tier Selection */}
                  <div className="grid sm:grid-cols-2 gap-3">
                    {serviceMasters
                      .filter((s) => s.pricingType === 'PER_KG')
                      .map((srv) => (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedBulkServiceId(srv.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                            selectedBulkServiceId === srv.id
                              ? 'bg-[#F7F0F2] border-[#5B214F] ring-2 ring-[#5B214F]/20 shadow-xs'
                              : 'bg-[#FCF9F7] border-[#E8DDE1] hover:bg-white hover:border-[#5B214F]/40'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-extrabold text-sm text-[#2B1326]">{srv.name}</span>
                              <span className="font-black text-sm text-[#5B214F]">₹{srv.baseKgPrice}/KG</span>
                            </div>
                            <p className="text-xs text-[#6F626A] mt-1">{srv.description}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#E8DDE1] text-[11px] font-bold text-[#6F626A]">
                            <Clock className="w-3.5 h-3.5 text-[#5B214F]" />
                            <span>{srv.turnaroundHours}h Standard Turnaround</span>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Weight Slider Box */}
                  <div className="p-5 bg-[#FCF9F7] rounded-2xl border border-[#E8DDE1] space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold text-[#2B1326]">
                      <span>Select Laundry Weight:</span>
                      <span className="text-base font-black text-[#5B214F] font-poppins">
                        {bulkKgWeight} KG <span className="text-xs text-[#6F626A] font-medium">(~{bulkKgWeight * 4} items)</span>
                      </span>
                    </div>

                    <input
                      type="range"
                      min={3}
                      max={25}
                      value={bulkKgWeight}
                      onChange={(e) => setBulkKgWeight(parseInt(e.target.value))}
                      className="w-full accent-[#5B214F] h-2 bg-[#E8DDE1] rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between text-[11px] font-bold text-[#9A8D94]">
                      <span>3 KG (Minimum)</span>
                      <span>10 KG</span>
                      <span>25 KG</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddBulkToBag}
                    className="w-full py-4 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-2xl font-extrabold text-sm shadow-md shadow-[#5B214F]/25 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                  >
                    <span>Add {bulkKgWeight} KG to Bag (₹{(serviceMasters.find((s) => s.id === selectedBulkServiceId)?.baseKgPrice || 60) * bulkKgWeight})</span>
                    <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
                  </button>
                </div>
              )}
            </div>

            {/* ── RIGHT: LIVE BAG SUMMARY (Desktop) ── */}
            {hasItems && (
              <aside className="h-fit rounded-3xl border border-[#E8DDE1] bg-white p-5 sm:p-6 shadow-sm lg:sticky lg:top-28 space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DDE1]">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#5B214F]" />
                    <h2 className="font-extrabold text-base text-[#2B1326] font-poppins">Your Bag</h2>
                  </div>
                  <span className="rounded-full bg-[#F7F0F2] px-3 py-1 text-xs font-black text-[#5B214F] border border-[#E8DDE1]">
                    {cartTotals.itemCount} items
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div key={item.id} className="rounded-2xl bg-[#FCF9F7] p-3 border border-[#E8DDE1] text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-[#2B1326] leading-tight">{item.serviceName}</span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center rounded-xl border border-[#E8DDE1] bg-white">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-slate-500 hover:text-[#5B214F] cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center text-xs font-black text-[#2B1326]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-slate-500 hover:text-[#5B214F] cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs font-black text-[#5B214F]">₹{item.subtotal}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Express Turnaround Option */}
                <div className="p-3.5 rounded-2xl bg-[#F7F0F2] border border-[#E8DDE1] text-xs space-y-2">
                  <span className="text-[10px] font-extrabold uppercase text-[#5B214F] tracking-wider block">Turnaround Speed</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setExpressTier('REGULAR')}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition cursor-pointer text-center ${
                        cart.expressTier === 'REGULAR' ? 'bg-[#5B214F] text-white shadow-xs' : 'bg-white text-[#2B1326] border border-[#E8DDE1]'
                      }`}
                    >
                      Standard 48h (Free)
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpressTier('EXPRESS_24H')}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition cursor-pointer text-center ${
                        cart.expressTier === 'EXPRESS_24H' ? 'bg-[#5B214F] text-white shadow-xs' : 'bg-white text-[#2B1326] border border-[#E8DDE1]'
                      }`}
                    >
                      Express 24h (+₹{pricingSettings.expressDeliveryFee})
                    </button>
                  </div>
                </div>

                {/* Bill Details */}
                <div className="border-t border-[#E8DDE1] pt-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-[#6F626A]">
                    <span>Item Total:</span>
                    <span className="font-bold text-[#2B1326]">₹{cartTotals.itemTotal}</span>
                  </div>
                  <div className="flex justify-between text-[#6F626A]">
                    <span>Doorstep Pickup &amp; Delivery:</span>
                    <span className={`font-bold ${cartTotals.deliveryFee === 0 ? 'text-emerald-700' : 'text-[#2B1326]'}`}>
                      {cartTotals.deliveryFee === 0 ? 'FREE' : `₹${cartTotals.deliveryFee}`}
                    </span>
                  </div>
                  {cartTotals.expressFee > 0 && (
                    <div className="flex justify-between text-[#6F626A]">
                      <span>Express 24h Priority:</span>
                      <span className="font-bold text-[#5B214F]">₹{cartTotals.expressFee}</span>
                    </div>
                  )}
                  {cartTotals.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Promo Discount:</span>
                      <span>-₹{cartTotals.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6F626A]">
                    <span>GST ({pricingSettings.taxPercentage}%):</span>
                    <span className="font-bold text-[#2B1326]">₹{cartTotals.tax}</span>
                  </div>

                  <div className="flex justify-between text-sm font-black pt-2.5 border-t border-[#E8DDE1] text-[#2B1326]">
                    <span>Total Amount:</span>
                    <span className="text-xl text-[#5B214F] font-poppins font-black">₹{cartTotals.grandTotal}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={continueToDetails}
                  className="w-full py-4 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-2xl font-extrabold text-sm shadow-md shadow-[#5B214F]/25 flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
                >
                  <span>Select Slot &amp; Address</span>
                  <ChevronRight className="w-4 h-4 text-[#D6B36A]" />
                </button>
              </aside>
            )}
          </section>
        )}

        {/* ─────────────────────────────────────────────────────
            STEP 2: SCHEDULE PICKUP & ADDRESS DETAILS
        ───────────────────────────────────────────────────── */}
        {step === 1 && (
          <section className="mx-auto max-w-3xl space-y-6">
            {mounted && !isLoggedIn && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-3xl bg-[#F7F0F2] border border-[#E8DDE1] p-4 sm:p-5 text-xs shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#5B214F] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
                    ✨
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-[#2B1326]">Already have an account?</p>
                    <p className="text-[#6F626A] text-xs mt-0.5">Sign in with OTP to autofill your saved addresses.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openAuthModal('/book')}
                  className="px-4 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-bold text-xs shadow-sm transition cursor-pointer self-start sm:self-auto shrink-0 active:scale-95"
                >
                  Sign In with OTP
                </button>
              </div>
            )}

            {/* 0. Contact Information */}
            <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5B214F]" />
                  <h3 className="font-extrabold text-sm text-[#2B1326]">Contact Person</h3>
                </div>
                <span className="text-[11px] font-bold text-[#9A8D94]">For pickup updates &amp; live SMS</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-[#6F626A] mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDE1] bg-[#FCF9F7] text-xs font-semibold outline-none focus:border-[#5B214F] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6F626A] mb-1 block">Mobile Number (10 Digits) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-[#5B214F]">🇮🇳 +91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="9876543210"
                      className="w-full pl-16 pr-3.5 py-2.5 rounded-xl border border-[#E8DDE1] bg-[#FCF9F7] text-xs font-semibold outline-none focus:border-[#5B214F] focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Pickup Date Picker */}
            <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 sm:p-6 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[#5B214F]" />
                  <h3 className="font-extrabold text-sm text-[#2B1326]">1. Select Pickup Date</h3>
                </div>
                <span className="text-[11px] font-bold text-[#5B214F]">Open All 7 Days</span>
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
                      className={`min-w-[110px] p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                        isClosed
                          ? 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed text-slate-400'
                          : isSelected
                          ? 'bg-[#5B214F] text-white border-[#5B214F] shadow-md shadow-[#5B214F]/20'
                          : 'bg-[#FCF9F7] text-[#2B1326] border-[#E8DDE1] hover:border-[#5B214F]/40'
                      }`}
                    >
                      <span className={`text-[10px] font-bold block uppercase tracking-wider ${
                        isClosed ? 'text-slate-400' : isSelected ? 'text-[#D6B36A]' : 'text-[#6F626A]'
                      }`}>
                        {isClosed ? 'Closed' : idx === 0 ? 'Fastest' : 'Available'}
                      </span>
                      <span className="text-xs font-black block mt-0.5">{label}</span>
                      <span className={`text-[9px] block mt-1 ${
                        isClosed ? 'text-slate-400' : isSelected ? 'text-white/80' : 'text-[#6F626A]'
                      }`}>
                        {isClosed ? 'Slots ended' : `${dateObj.activeSlotCount} slots`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Pickup Time Slot Selector */}
            <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock3 className="w-4 h-4 text-[#5B214F]" />
                  <h3 className="font-extrabold text-sm text-[#2B1326]">2. Choose Pickup Slot</h3>
                </div>
                <span className="text-xs text-[#6F626A] font-medium">Rider arrives in this window</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {availableSlots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isPast = slot.isPast;

                  if (isPast) {
                    return (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 opacity-50 text-left flex items-center justify-between cursor-not-allowed"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-400 line-through">
                              {slot.startTime} – {slot.endTime}
                            </span>
                            <span className="text-[9px] font-black uppercase text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              Closed
                            </span>
                          </div>
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
                          : 'bg-[#FCF9F7] border-[#E8DDE1] hover:border-[#5B214F]/40'
                      }`}
                    >
                      <div>
                        <span className="font-extrabold text-sm text-[#2B1326]">
                          {slot.startTime} – {slot.endTime}
                        </span>
                        <span className="text-[10px] text-[#6F626A] mt-0.5 block">
                          Standard Doorstep Pickup
                        </span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#5B214F] bg-[#5B214F] text-white' : 'border-slate-300'}`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Delivery & Pickup Address */}
            <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#5B214F]" />
                  <h3 className="font-extrabold text-sm text-[#2B1326]">3. Doorstep Address</h3>
                </div>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                    className="text-xs font-extrabold text-[#5B214F] hover:text-[#48193F] cursor-pointer flex items-center gap-1 bg-[#F7F0F2] px-3 py-1.5 rounded-xl transition active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingNewAddress ? 'Cancel' : 'Add Address'}</span>
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
                            ? 'bg-[#F7F0F2] border-[#5B214F] ring-2 ring-[#5B214F]/25 shadow-xs'
                            : 'bg-[#FCF9F7] border-[#E8DDE1] hover:border-[#5B214F]/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-black uppercase tracking-wider text-[#5B214F] bg-white px-2.5 py-0.5 rounded-full border border-[#E8DDE1] shadow-2xs flex items-center gap-1">
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
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-xs font-extrabold text-[#2B1326] leading-snug">
                            {address.houseNo ? `${address.houseNo}, ` : ''}{address.area || address.street}
                          </p>
                          <p className="text-[11px] text-[#6F626A] mt-1">
                            {address.landmark ? `${address.landmark}, ` : ''}{address.city} - <span className="font-bold text-[#2B1326]">{address.pincode}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* No Addresses Prompt / Inline Form */}
              {(isAddingNewAddress || savedAddresses.length === 0) && (
                <form onSubmit={handleSaveNewAddress} className="p-4 sm:p-5 bg-[#FCF9F7] rounded-2xl border border-[#E8DDE1] space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8DDE1]">
                    <div>
                      <span className="text-xs font-black text-[#2B1326]">
                        {savedAddresses.length === 0 ? '📍 Add Pickup Address' : '📍 New Address'}
                      </span>
                      <p className="text-[11px] text-[#6F626A]">Doorstep pickup &amp; delivery location</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={isDetectingLocation}
                      className="text-[11px] font-bold text-[#5B214F] bg-white px-3 py-1.5 rounded-xl border border-[#E8DDE1] hover:bg-[#F7F0F2] flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#5B214F]" />
                      <span>{isDetectingLocation ? 'Detecting…' : 'GPS Auto-Detect'}</span>
                    </button>
                  </div>

                  {/* Address Type Tag */}
                  <div>
                    <label className="text-[11px] font-bold text-[#6F626A] block mb-1.5">Address Type</label>
                    <div className="flex gap-2">
                      {[
                        { type: 'Home', label: 'Home 🏠' },
                        { type: 'Office', label: 'Office 🏢' },
                        { type: 'Other', label: 'Other 📍' },
                      ].map((t) => (
                        <button
                          key={t.type}
                          type="button"
                          onClick={() => setNewAddressForm((prev) => ({ ...prev, type: t.type as any }))}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                            newAddressForm.type === t.type
                              ? 'bg-[#5B214F] text-white shadow-xs'
                              : 'bg-white border border-[#E8DDE1] text-[#2B1326] hover:bg-[#F7F0F2]'
                          }`}
                        >
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* House / Flat & Street Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#6F626A] block mb-1">House / Flat No. *</label>
                      <input
                        type="text"
                        required
                        value={newAddressForm.houseNo}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, houseNo: e.target.value }))}
                        placeholder="e.g. Flat 402, Rainbow Heights"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDE1] bg-white text-xs outline-none focus:border-[#5B214F]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6F626A] block mb-1">Street / Area *</label>
                      <input
                        type="text"
                        required
                        value={newAddressForm.area}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, area: e.target.value }))}
                        placeholder="e.g. KPHB Phase 6, Road No. 3"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDE1] bg-white text-xs outline-none focus:border-[#5B214F]"
                      />
                    </div>
                  </div>

                  {/* Landmark, City & Pincode Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#6F626A] block mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        value={newAddressForm.landmark}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, landmark: e.target.value }))}
                        placeholder="e.g. Near Metro"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDE1] bg-white text-xs outline-none focus:border-[#5B214F]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6F626A] block mb-1">City *</label>
                      <input
                        type="text"
                        required
                        value={newAddressForm.city}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                        placeholder="Hyderabad"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDE1] bg-white text-xs outline-none focus:border-[#5B214F]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6F626A] block mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={newAddressForm.pincode}
                        onChange={(e) => setNewAddressForm((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                        placeholder="500072"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDE1] bg-white text-xs font-bold outline-none focus:border-[#5B214F]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {savedAddresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setIsAddingNewAddress(false)}
                        className="flex-1 py-3 rounded-xl border border-[#E8DDE1] text-xs font-bold text-[#6F626A] hover:bg-slate-100 transition cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-2 py-3 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl font-black text-xs sm:text-sm shadow-md shadow-[#5B214F]/25 transition cursor-pointer active:scale-95"
                    >
                      Save Address
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
                  placeholder="Special instructions (e.g. Ring doorbell, stain removal for shirt, leave with security)..."
                  className="w-full rounded-2xl border border-[#E8DDE1] bg-[#FCF9F7] p-3 text-xs outline-none focus:border-[#5B214F] focus:bg-white min-h-20"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-5 py-2.5 text-xs font-bold text-[#6F626A] hover:text-[#2B1326] cursor-pointer"
              >
                ← Back to Bag
              </button>
              <button
                type="button"
                disabled={!cart.items.length}
                onClick={continueToPayment}
                className="px-7 py-3.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-2xl font-extrabold text-xs sm:text-sm shadow-md shadow-[#5B214F]/25 flex items-center gap-1.5 transition cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <span>Review Order &amp; Confirm</span>
                <ChevronRight className="w-4 h-4 text-[#D6B36A]" />
              </button>
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────
            STEP 3: REVIEW & SECURE PAYMENT
        ───────────────────────────────────────────────────── */}
        {step === 2 && (
          <section className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-3xl border border-[#E8DDE1] bg-white p-5 sm:p-7 shadow-2xs space-y-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#5B214F]">Step 3 of 3</p>
                <h2 className="text-xl font-black text-[#2B1326] mt-0.5 font-poppins">Order Confirmation &amp; Payment</h2>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#FCF9F7] p-4 border border-[#E8DDE1] text-xs">
                  <div className="flex items-center gap-1.5 text-[#5B214F] font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Pickup Location</span>
                  </div>
                  <p className="font-extrabold text-[#2B1326] text-sm mt-1">{selectedAddress?.street}</p>
                  <p className="text-[#6F626A] mt-0.5">
                    {selectedAddress?.city} - {selectedAddress?.pincode}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#E8DDE1] flex items-center justify-between text-[11px]">
                    <span className="text-[#6F626A]">Pickup Window:</span>
                    <span className="font-bold text-[#2B1326]">{formatPickupDate(activePickupDate)} ({selectedSlot?.startTime})</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-[#FCF9F7] p-4 border border-[#E8DDE1] text-xs">
                  <div className="flex items-center gap-1.5 text-[#5B214F] font-bold mb-1">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Garments Summary</span>
                  </div>
                  <p className="font-extrabold text-[#2B1326] text-sm mt-1">{cartTotals.itemCount} Items Selected</p>
                  <p className="text-[#6F626A] mt-0.5">
                    {cart.expressTier === 'EXPRESS_24H' ? '⚡ 24h Express Delivery' : 'Standard 48h Delivery'}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#E8DDE1] flex items-center justify-between text-[11px]">
                    <span className="text-[#6F626A]">Sanitization:</span>
                    <span className="font-bold text-emerald-700">100% Ozone Sterile Seal</span>
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
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E8DDE1] text-xs font-bold outline-none focus:border-[#5B214F] uppercase bg-[#FCF9F7]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2B1326] hover:bg-[#5B214F] text-white rounded-xl text-xs font-bold transition cursor-pointer"
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
                        : 'bg-[#FCF9F7] border-[#E8DDE1] hover:bg-white'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-[#5B214F]" />
                    <p className="mt-2 font-extrabold text-sm text-[#2B1326]">Pay Online (Razorpay / UPI)</p>
                    <p className="text-[11px] text-[#6F626A] mt-0.5">UPI (GPay/PhonePe), Cards, NetBanking</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'bg-[#F7F0F2] border-[#5B214F] ring-2 ring-[#5B214F]/20'
                        : 'bg-[#FCF9F7] border-[#E8DDE1] hover:bg-white'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#5B214F]" />
                    <p className="mt-2 font-extrabold text-sm text-[#2B1326]">Pay on Delivery (COD / UPI)</p>
                    <p className="text-[11px] text-[#6F626A] mt-0.5">Pay upon delivery after washing</p>
                  </button>
                </div>
              </div>

              {/* Final Price Box */}
              <div className="rounded-2xl border border-[#E8DDE1] bg-[#F7F0F2] p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#6F626A] block">Total Amount Payable</span>
                  <span className="text-2xl font-black text-[#5B214F] font-poppins">₹{cartTotals.grandTotal}</span>
                </div>
                <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  All Taxes &amp; GST Included
                </span>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                disabled={isProcessing || !cart.items.length}
                onClick={completeBooking}
                className="w-full py-4 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-2xl font-extrabold text-sm shadow-xl shadow-[#5B214F]/25 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer active:scale-95"
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
                    <ArrowRight className="w-4 h-4 text-[#D6B36A]" />
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="mx-auto block text-xs font-bold text-[#6F626A] hover:text-[#5B214F] cursor-pointer"
            >
              ← Back to pickup &amp; address
            </button>
          </section>
        )}
      </main>

      {/* ── MOBILE STICKY BOTTOM CHECKOUT BAR ── */}
      {hasItems && step === 0 && (
        <div className="fixed bottom-0 inset-x-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-[#E8DDE1] shadow-[0_-10px_30px_rgba(43,19,38,0.12)] z-40 lg:hidden animate-in slide-in-from-bottom duration-200">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#F7F0F2] border border-[#5B214F]/20 flex items-center justify-center text-[#5B214F] font-black shrink-0">
                <ShoppingBag className="w-5 h-5 text-[#5B214F]" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-extrabold text-[#6F626A]">
                  {cartTotals.itemCount} {cartTotals.itemCount === 1 ? 'Garment' : 'Garments'}
                </div>
                <div className="text-base font-black text-[#5B214F] font-poppins leading-tight">
                  ₹{cartTotals.grandTotal}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={continueToDetails}
              className="px-6 py-3 rounded-2xl bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-extrabold shadow-md shadow-[#5B214F]/20 flex items-center gap-1.5 active:scale-95 transition cursor-pointer"
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

export default function BookingWizardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FCF9F7] flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#5B214F] text-white flex items-center justify-center animate-pulse shadow-lg">
            <ShoppingBag className="w-6 h-6 text-[#D6B36A]" />
          </div>
          <p className="text-xs font-bold text-[#5B214F]">Loading Booking Details…</p>
        </div>
      }
    >
      <BookingWizardContent />
    </Suspense>
  );
}
