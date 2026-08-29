
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Role,
  Service,
  OrderItem,
  Order,
  Address,
  Coupon,
  PincodeZone,
  ExpressTier,
  OrderStatus,
  Wallet,
  PaymentMethod,
  ClothType,
  ServiceMaster,
  ServicePriceItem,
  PricingSettings,
  SubscriptionPlan,
  DisputeReport,
  DisputeStatus,
  LaundryMachine,
  CODReconciliationRecord,
  GarmentTagStatus,
  InternalNote,
  HubBranch,
  DistanceDeliveryConfig,
  TimeSlotCapacity,
  QCChecklistRecord,
  ConsumableInventory,
  NotificationTemplate,
  AuditLogEntry,
  LoyaltyPointsAccount,
  BulkPricingItem,
  BulkLaundryType,
} from '@/types';
import { db } from '@/lib/db';
import {
  createBackendOrder,
  getBackendOrders,
  getBackendCatalog,
  getBackendPricingSettings,
  getBackendBulkPricing,
  checkBackendPincode,
  fetchFromBackend,
  getBackendSlots,
  getBackendSubscriptionPlans,
} from '@/lib/api';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: Role;
}

interface CheckoutDetails {
  selectedAddress?: Address;
  pickupDate?: string;
  pickupSlot?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  notes?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Auth & Roles
  currentUser: UserProfile;
  userRole: Role;
  setUserRole: (role: Role) => void;
  savedAddresses: Address[];
  addAddress: (addr: Omit<Address, 'id'>) => Address;
  updateAddress: (addr: Address) => void;
  deleteAddress: (id: string) => void;
  isLoggedIn: boolean;
  isAuthModalOpen: boolean;
  authRedirectUrl: string | null;
  openAuthModal: (redirect?: string) => void;
  closeAuthModal: () => void;
  logout: () => void;
  mergeCartOnLogin: (incomingItems?: OrderItem[]) => void;

  // Pincode & Location
  userPincode: string;
  currentZone: PincodeZone | null;
  setPincode: (pincode: string) => { isServiceable: boolean; zone?: PincodeZone; message: string };

  // Cart & Booking
  cart: {
    items: OrderItem[];
    expressTier: ExpressTier;
    appliedCoupon: Coupon | null;
    discountAmount: number;
    pickupDate: string;
    pickupSlot: string;
    deliveryDate: string;
    deliverySlot: string;
    selectedAddress: Address | null;
    notes: string;
  };
  addToCart: (service: Service, quantity?: number, instructions?: string) => void;
  removeFromCart: (serviceId: string) => void;
  updateCartQuantity: (serviceId: string, quantity: number) => void;
  clearCart: () => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCouponCode: () => void;
  setExpressTier: (tier: ExpressTier) => void;
  setBookingSlots: (pickupDate: string, pickupSlot: string, deliveryDate?: string, deliverySlot?: string) => void;
  setSelectedAddress: (address: Address) => void;
  setOrderNotes: (notes: string) => void;
  cartTotals: {
    itemTotal: number;
    discount: number;
    deliveryFee: number;
    expressFee: number;
    tax: number;
    grandTotal: number;
    totalKg: number;
    itemCount: number;
  };

  // Orders
  orders: Order[];
  createOrder: (paymentMethod: PaymentMethod, details?: CheckoutDetails) => Promise<Order>;
  advanceOrderStatus: (orderId: string, status: OrderStatus, notes?: string, updatedBy?: string) => Order | null;
  updateOrderWeight: (orderId: string, weightKg: number) => Order | null;
  getOrderById: (orderId: string) => Order | undefined;
  refreshOrders: () => void;

  // Wallet
  wallet: Wallet;
  rechargeWallet: (amount: number) => void;

  // Dynamic Cloth Types & 2D Pricing Engine
  clothTypes: ClothType[];
  serviceMasters: ServiceMaster[];
  priceMatrix: ServicePriceItem[];
  bulkPricing: BulkPricingItem[];
  pricingSettings: PricingSettings;
  subscriptionPlans: SubscriptionPlan[];
  addClothType: (data: Partial<ClothType>) => ClothType;
  updateClothType: (id: string, data: Partial<ClothType>) => void;
  deleteClothType: (id: string) => void;
  updatePriceItem: (id: string, data: Partial<ServicePriceItem>) => void;
  upsertPriceItem: (data: ServicePriceItem) => void;
  addBulkPrice: (item: BulkPricingItem) => void;
  updateBulkPrice: (id: string, updates: Partial<BulkPricingItem>) => void;
  deleteBulkPrice: (id: string) => void;
  updateBulkSlab: (serviceId: string, laundryType: BulkLaundryType, slabs: { weightKg: number; regularPrice: number; expressPrice: number }[]) => void;
  updatePricingSettings: (settings: Partial<PricingSettings>) => void;
  addClothItemToCart: (cloth: ClothType, priceItem: ServicePriceItem, quantity?: number, instructions?: string) => void;
  // Operational Workflows & Lifecycle
  disputes: DisputeReport[];
  createDispute: (data: Omit<DisputeReport, 'id' | 'reportedAt' | 'status'>) => DisputeReport;
  updateDisputeStatus: (id: string, status: DisputeStatus, notes?: string, compensation?: number) => void;
  machines: LaundryMachine[];
  updateMachineStatus: (id: string, status: LaundryMachine['status'], loadKg?: number) => void;
  codRecords: CODReconciliationRecord[];
  reconcileRiderCOD: (riderId: string, depositedAmount: number, notes?: string) => void;
  submitWeightVerification: (orderId: string, grossKg: number, tareKg: number, ratePerKg?: number, weighedBy?: string) => void;
  approvePriceAdjustment: (orderId: string) => void;
  updateGarmentTagStatus: (orderId: string, tagId: string, status: GarmentTagStatus, qcNotes?: string) => void;
  addInternalNote: (orderId: string, author: string, role: string, content: string) => void;

  // Enterprise Operations: Hubs, Fleet Distance, Slots, QC Rework, Inventory, CMS & Audit
  hubs: HubBranch[];
  createHub: (data: Omit<HubBranch, 'id' | 'activeOrdersCount'>) => HubBranch;
  updateHub: (id: string, data: Partial<HubBranch>) => void;
  distanceConfig: DistanceDeliveryConfig;
  updateDistanceConfig: (data: Partial<DistanceDeliveryConfig>) => void;
  calculateDistanceDeliveryFee: (distanceKm: number, orderSubtotal: number, isExpress?: boolean) => { fee: number; tierLabel: string; isFree: boolean };
  slotCapacities: TimeSlotCapacity[];
  bookSlotCapacity: (slotId: string, orderKg?: number) => void;
  updateSlotCapacity: (slotId: string, data: Partial<TimeSlotCapacity>) => void;
  qcRecords: QCChecklistRecord[];
  submitQCChecklist: (record: Omit<QCChecklistRecord, 'id' | 'inspectedAt'>) => QCChecklistRecord;
  triggerRework: (orderId: string, garmentTagId: string, reason: string, operator?: string) => void;
  inventory: ConsumableInventory[];
  updateInventoryStock: (id: string, newStock: number, reason?: string) => void;
  notificationTemplates: NotificationTemplate[];
  updateNotificationTemplate: (id: string, data: Partial<NotificationTemplate>) => void;
  auditLogs: AuditLogEntry[];
  logAuditEvent: (userId: string, userName: string, userRole: any, action: string, module: string, details: string) => void;
  loyaltyAccount: LoyaltyPointsAccount;
  redeemLoyaltyPoints: (customerId: string, points: number) => { success: boolean; discountAmount: number; remainingPoints: number };

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultUser: UserProfile = {
  id: 'anonymous-customer',
  name: 'LaundryFresh Customer',
  phone: '',
  email: '',
  role: 'CUSTOMER',
};

function getInitialAddresses(): Address[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('lf_addresses');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // Ignore malformed cache
  }
  return [];
}

function getInitialCustomer(): UserProfile {
  if (typeof window === 'undefined') return defaultUser;

  try {
    const stored = JSON.parse(localStorage.getItem('lf_user') || 'null') as Partial<UserProfile> | null;
    if (stored?.id && stored.name && stored.phone) {
      return {
        id: String(stored.id),
        name: String(stored.name),
        phone: String(stored.phone),
        email: String(stored.email || ''),
        role: 'CUSTOMER',
      };
    }
  } catch {
    // Ignore malformed stale browser state and use the anonymous customer shell.
  }

  return defaultUser;
}

const defaultCart = {
  items: [] as OrderItem[],
  expressTier: 'REGULAR' as ExpressTier,
  appliedCoupon: null as Coupon | null,
  discountAmount: 0,
  pickupDate: '',
  pickupSlot: '08:00 AM - 10:00 AM',
  deliveryDate: '',
  deliverySlot: '04:00 PM - 06:00 PM',
  selectedAddress: null as Address | null,
  notes: '',
};

function getInitialCart() {
  if (typeof window === 'undefined') return defaultCart;
  try {
    const raw = localStorage.getItem('lf_cart');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.items)) {
        return {
          ...defaultCart,
          ...parsed,
          selectedAddress: parsed.selectedAddress || null,
        };
      }
    }
  } catch {
    // Ignore malformed cart cache
  }
  return defaultCart;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(defaultUser);
  const [userRole, setUserRoleState] = useState<Role>('CUSTOMER');
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [userPincode, setUserPincode] = useState<string>('500072');
  const [currentZone, setCurrentZone] = useState<PincodeZone | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<Wallet>(db.getWallet());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [clothTypes, setClothTypes] = useState<ClothType[]>([]);
  const [serviceMasters, setServiceMasters] = useState<ServiceMaster[]>([]);
  const [priceMatrix, setPriceMatrix] = useState<ServicePriceItem[]>([]);
  const [bulkPricing, setBulkPricing] = useState<BulkPricingItem[]>([]);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>(db.getPricingSettings());
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(db.getSubscriptionPlans());
  const [disputes, setDisputes] = useState<DisputeReport[]>(db.getDisputes());
  const [machines, setMachines] = useState<LaundryMachine[]>(db.getMachines());
  const [codRecords, setCODRecords] = useState<CODReconciliationRecord[]>(db.getCODRecords());
  const [hubs, setHubs] = useState<HubBranch[]>(db.getHubs());
  const [distanceConfig, setDistanceConfig] = useState<DistanceDeliveryConfig>(db.getDistanceConfig());
  const [slotCapacities, setSlotCapacities] = useState<TimeSlotCapacity[]>(db.getSlotCapacities());
  const [qcRecords, setQCRecords] = useState<QCChecklistRecord[]>(db.getQCRecords());
  const [inventory, setInventory] = useState<ConsumableInventory[]>(db.getInventory());
  const [notificationTemplates, setNotificationTemplates] = useState<NotificationTemplate[]>(db.getNotificationTemplates());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(db.getAuditLogs());
  const [loyaltyAccount, setLoyaltyAccount] = useState<LoyaltyPointsAccount>(db.getLoyaltyAccount());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRedirectUrl, setAuthRedirectUrl] = useState<string | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);

  const isLoggedIn = Boolean(
    currentUser.id && currentUser.id !== 'anonymous-customer'
  );

  const openAuthModal = (redirect?: string) => {
    if (redirect) setAuthRedirectUrl(redirect);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthRedirectUrl(null);
  };

  const logout = () => {
    localStorage.removeItem('lf_access');
    localStorage.removeItem('lf_refresh');
    localStorage.removeItem('lf_user');
    localStorage.removeItem('lf_expires_at');
    setCurrentUser(defaultUser);
    window.dispatchEvent(new Event('lf-auth-changed'));
    showToast('Signed out successfully.', 'info');
  };

  // Cart State (Persisted in localStorage so guest items are never lost)
  const [cart, setCart] = useState<{
    items: OrderItem[];
    expressTier: ExpressTier;
    appliedCoupon: Coupon | null;
    discountAmount: number;
    pickupDate: string;
    pickupSlot: string;
    deliveryDate: string;
    deliverySlot: string;
    selectedAddress: Address | null;
    notes: string;
  }>(defaultCart);

  // Sync cart changes to localStorage only AFTER hydration to avoid wiping existing carts
  useEffect(() => {
    if (hasHydrated && typeof window !== 'undefined') {
      localStorage.setItem('lf_cart', JSON.stringify(cart));
    }
  }, [cart, hasHydrated]);

  // Seamless Cart Merge when customer logs in
  const mergeCartOnLogin = (serverItems: OrderItem[] = []) => {
    setCart((prevCart) => {
      const mergedMap = new Map<string, OrderItem>();

      // 1. Add current guest/browser items
      for (const item of prevCart.items) {
        mergedMap.set(item.id || item.serviceId, { ...item });
      }

      // 2. Merge server/account items
      for (const sItem of serverItems) {
        const key = sItem.id || sItem.serviceId;
        const existing = mergedMap.get(key);
        if (existing) {
          existing.quantity += sItem.quantity;
          existing.subtotal = existing.unitPrice * existing.quantity;
          if (existing.pricingModel === 'PER_KG') {
            existing.estimatedWeightKg = existing.quantity;
          }
        } else {
          mergedMap.set(key, { ...sItem });
        }
      }

      const mergedCart = {
        ...prevCart,
        items: Array.from(mergedMap.values()),
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('lf_cart', JSON.stringify(mergedCart));
      }

      return mergedCart;
    });
  };

  // Client hydration on mount
  useEffect(() => {
    const user = getInitialCustomer();
    setCurrentUser(user);

    const addrs = getInitialAddresses();
    if (addrs.length > 0) {
      setSavedAddresses(addrs);
    }

    const savedCart = getInitialCart();
    if (savedCart && savedCart.items && savedCart.items.length > 0) {
      setCart(savedCart);
    }

    setHasHydrated(true);

    const syncAuth = () => {
      const u = getInitialCustomer();
      setCurrentUser(u);
      mergeCartOnLogin();
    };
    window.addEventListener('lf-auth-changed', syncAuth);
    return () => window.removeEventListener('lf-auth-changed', syncAuth);
  }, []);

  // Initialize data on mount from live Backend Express API (port 5000)
  useEffect(() => {
    // 1. Initial local state fallback. Orders deliberately start empty: order data
    // is scoped by the API instead of exposing a seeded global browser store.
    const zone = db.checkPincode('560034');
    if (zone) setCurrentZone(zone);
    setWallet(db.getWallet());
    setClothTypes(db.getClothTypes());
    setServiceMasters(db.getServiceMasters());
    setPriceMatrix(db.getPriceMatrix());
    setBulkPricing(db.getBulkPricing());
    setPricingSettings(db.getPricingSettings());

    // 2. Fetch live data from Express Backend API (http://localhost:5000/api)
    async function loadLiveBackendData() {
      const [catalogData, settingsData, bulkData, slotsData, plansData] = await Promise.all([
        getBackendCatalog(),
        getBackendPricingSettings(),
        getBackendBulkPricing(),
        getBackendSlots(),
        getBackendSubscriptionPlans(),
      ]);

      if (catalogData) {
        if (catalogData.clothTypes) setClothTypes(catalogData.clothTypes);
        if (catalogData.serviceMasters) setServiceMasters(catalogData.serviceMasters);
        if (catalogData.priceMatrix) setPriceMatrix(catalogData.priceMatrix);
      }

      if (settingsData) {
        setPricingSettings(settingsData);
      }

      if (bulkData && Array.isArray(bulkData.allSlabs)) {
        setBulkPricing(bulkData.allSlabs);
      } else if (Array.isArray(bulkData)) {
        setBulkPricing(bulkData);
      }

      if (slotsData && Array.isArray(slotsData)) {
        setSlotCapacities(
          slotsData.map((s: any) => ({
            id: s.id,
            hubId: s.hubId || 'HUB-HYD-01',
            date: s.date || new Date().toISOString().split('T')[0],
            startTime: s.startTime,
            endTime: s.endTime,
            maxOrders: s.maxOrders,
            bookedOrders: s.bookedOrders,
            maxKg: s.maxKg,
            bookedKg: s.bookedKg,
            isAvailable: s.isAvailable,
            isActive: s.isActive !== false,
            isPast: Boolean(s.isPast),
          }))
        );
      }

      // Subscription plans are customer-facing catalog data. Keep the local
      // plans as an immediate fallback, then replace them with only valid,
      // active plans published by the admin console.
      if (Array.isArray(plansData) && plansData.length > 0) {
        const livePlans = plansData
          .filter((plan: any) => plan && plan.name && Number(plan.price) > 0 && plan.isActive !== false)
          .map((plan: any) => ({
            ...plan,
            price: Number(plan.price),
            originalPrice: plan.originalPrice == null ? undefined : Number(plan.originalPrice),
            includedKg: Number(plan.includedKg) || 20,
            validityDays: Number(plan.validityDays) || (Number(plan.durationMonths) || 1) * 30,
            features: Array.isArray(plan.features) ? plan.features.map(String) : [],
          }));
        if (livePlans.length > 0) setSubscriptionPlans(livePlans);
      }
    }

    loadLiveBackendData().catch((err) => {
      console.warn('Backend API initial load notice:', err);
    });

    // 3. Auto-detect user GPS location on application open
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      const savedPin = localStorage.getItem('laundryfresh_user_pincode');
      if (savedPin) {
        const zone = db.checkPincode(savedPin);
        setUserPincode(savedPin);
        if (zone) setCurrentZone(zone);
      } else {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const lat = pos.coords.latitude;
              const lng = pos.coords.longitude;
              const geoData = await fetchFromBackend<any>(`/pincodes/reverse-geocode?lat=${lat}&lng=${lng}`);
              if (geoData && geoData.pincode) {
                const detectedPin = geoData.pincode;
                setUserPincode(detectedPin);
                localStorage.setItem('laundryfresh_user_pincode', detectedPin);
                const zone = db.checkPincode(detectedPin);
                if (zone && zone.isServiceable) {
                  setCurrentZone(zone);
                  showToast(`📍 Location Detected: ${geoData.areaName || zone.areaName}, ${geoData.city || zone.city} (${detectedPin}) — Service Available!`, 'success');
                } else {
                  showToast(`📍 Location Detected (${detectedPin}). Service not enabled in this area yet.`, 'info');
                }
              }
            } catch (err) {
              console.warn('Auto location detection notice:', err);
            }
          },
          (err) => {
            console.log('GPS Permission notice:', err.message);
          },
          { timeout: 8000 }
        );
      }
    }
  }, []);



  useEffect(() => {
    if (currentUser.id && currentUser.id !== 'anonymous-customer') {
      getBackendOrders(currentUser.id).then((remoteOrders) => {
        if (remoteOrders) setOrders(remoteOrders);
      }).catch(() => {});
    }
  }, [currentUser.id]);

  const setUserRole = (role: Role) => {
    setUserRoleState(role);
    setCurrentUser((prev) => ({ ...prev, role }));
    showToast(`Switched active perspective to: ${role.replace('_', ' ')}`, 'info');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToasts((prev) => {
      if (prev.some((t) => t.message === message)) {
        return prev;
      }
      const id = Math.random().toString(36).substring(2, 9);
      setTimeout(() => {
        removeToast(id);
      }, 3500);
      return [...prev, { id, message, type }];
    });
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setPincode = (pincode: string) => {
    setUserPincode(pincode);
    const zone = db.checkPincode(pincode);
    if (zone && zone.isServiceable) {
      setCurrentZone(zone);
      showToast(`Great! We deliver to ${zone.areaName}, ${zone.city}`, 'success');
      return { isServiceable: true, zone, message: `Delivery available in ${zone.areaName}` };
    } else {
      setCurrentZone(null);
      showToast(`Sorry, pincode ${pincode} is not serviceable currently.`, 'error');
      return { isServiceable: false, message: 'Currently out of service coverage.' };
    }
  };

  // Sync saved addresses to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lf_addresses', JSON.stringify(savedAddresses));
    }
  }, [savedAddresses]);

  // Load customer addresses from backend on login
  useEffect(() => {
    if (currentUser.id && currentUser.id !== 'anonymous-customer') {
      fetch(`${API}/customers/${currentUser.id}/addresses`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.data) && data.data.length > 0) {
            setSavedAddresses((prev) => {
              const combined = [...data.data];
              for (const p of prev) {
                if (!combined.some((c) => c.id === p.id)) combined.push(p);
              }
              return combined;
            });
          }
        })
        .catch(() => {});
    }
  }, [currentUser.id]);

  const addAddress = (addr: Omit<Address, 'id'>): Address => {
    const newAddr: Address = {
      ...addr,
      id: `addr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setSavedAddresses((prev) => {
      if (newAddr.isDefault) {
        return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [newAddr, ...prev];
    });

    if (currentUser.id && currentUser.id !== 'anonymous-customer') {
      fetch(`${API}/customers/${currentUser.id}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr),
      }).catch(() => {});
    }

    showToast('Address saved successfully! 📍', 'success');
    return newAddr;
  };

  const updateAddress = (addr: Address) => {
    setSavedAddresses((prev) =>
      prev.map((a) => (a.id === addr.id ? addr : addr.isDefault ? { ...a, isDefault: false } : a))
    );
    showToast('Address updated! 📍', 'success');
  };

  const deleteAddress = (addressId: string) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== addressId));
    if (currentUser.id && currentUser.id !== 'anonymous-customer') {
      fetch(`${API}/customers/${currentUser.id}/addresses/${addressId}`, {
        method: 'DELETE',
      }).catch(() => {});
    }
    showToast('Address removed.', 'info');
  };

  // Cart Helpers
  const addToCart = (service: Service, quantity = 1, instructions = '') => {
    setCart((prev) => {
      const existingIndex = prev.items.findIndex((item) => item.serviceId === service.id);
      let updatedItems: OrderItem[];

      const isPerKg = service.pricingModel === 'PER_KG';
      const qtyToAdd = isPerKg && quantity === 1 && service.minOrderQuantity ? service.minOrderQuantity : quantity;

      if (existingIndex > -1) {
        updatedItems = [...prev.items];
        const existing = updatedItems[existingIndex];
        const newQty = existing.quantity + qtyToAdd;
        updatedItems[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: existing.unitPrice * newQty,
          estimatedWeightKg: isPerKg ? newQty : undefined,
          specialInstructions: instructions || existing.specialInstructions,
        };
      } else {
        const newItem: OrderItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          serviceId: service.id,
          serviceName: service.name,
          categoryName: service.categoryId,
          pricingModel: service.pricingModel,
          unitPrice: service.basePrice,
          quantity,
          estimatedWeightKg: isPerKg ? qtyToAdd : undefined,
          unit: service.unit,
          subtotal: service.basePrice * qtyToAdd,
          specialInstructions: instructions,
        };
        updatedItems = [...prev.items, newItem];
      }

      return { ...prev, items: updatedItems };
    });
    showToast(`Added "${service.name}" to bag`, 'success');
  };

  const removeFromCart = (serviceId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== serviceId && item.serviceId !== serviceId),
    }));
    showToast('Item removed from bag', 'info');
  };

  const updateCartQuantity = (serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCart((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id === serviceId || item.serviceId === serviceId) {
          return {
            ...item,
            quantity,
            subtotal: item.unitPrice * quantity,
            estimatedWeightKg: item.pricingModel === 'PER_KG' ? quantity : undefined,
          };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      expressTier: 'REGULAR',
      appliedCoupon: null,
      discountAmount: 0,
      pickupDate: '',
      pickupSlot: '08:00 AM - 10:00 AM',
      deliveryDate: '',
      deliverySlot: '04:00 PM - 06:00 PM',
      selectedAddress: savedAddresses[0] || null,
      notes: '',
    });
  };

  const applyCouponCode = (code: string) => {
    const rawTotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    const result = db.validateCoupon(code, rawTotal, true);

    if (result.isValid) {
      const couponObj = db.getCoupons().find((c) => c.code.toUpperCase() === code.toUpperCase());
      setCart((prev) => ({
        ...prev,
        appliedCoupon: couponObj || null,
        discountAmount: result.discount,
      }));
      showToast(result.message, 'success');
      return { success: true, message: result.message };
    } else {
      setCart((prev) => ({ ...prev, appliedCoupon: null, discountAmount: 0 }));
      showToast(result.message, 'error');
      return { success: false, message: result.message };
    }
  };

  const removeCouponCode = () => {
    setCart((prev) => ({ ...prev, appliedCoupon: null, discountAmount: 0 }));
    showToast('Coupon removed', 'info');
  };

  const setExpressTier = (tier: ExpressTier) => {
    setCart((prev) => ({ ...prev, expressTier: tier }));
  };

  const setBookingSlots = (pickupDate: string, pickupSlot: string, deliveryDate?: string, deliverySlot?: string) => {
    setCart((prev) => ({
      ...prev,
      pickupDate,
      pickupSlot,
      deliveryDate: deliveryDate || '',
      deliverySlot: deliverySlot || prev.deliverySlot,
    }));
  };

  const setSelectedAddress = (address: Address) => {
    setCart((prev) => ({ ...prev, selectedAddress: address }));
  };

  const setOrderNotes = (notes: string) => {
    setCart((prev) => ({ ...prev, notes }));
  };

  // Dynamic Pricing Handlers
  const addClothType = (data: Partial<ClothType>): ClothType => {
    const created = db.createClothType(data);
    setClothTypes([...db.getClothTypes()]);
    showToast(`Cloth item "${created.name}" added to catalog`, 'success');
    return created;
  };

  const updateClothType = (id: string, data: Partial<ClothType>) => {
    db.updateClothType(id, data);
    setClothTypes([...db.getClothTypes()]);
    showToast('Cloth type updated', 'success');
  };

  const deleteClothType = (id: string) => {
    db.deleteClothType(id);
    setClothTypes([...db.getClothTypes()]);
    setPriceMatrix([...db.getPriceMatrix()]);
    showToast('Cloth type deleted', 'info');
  };

  const updatePriceItem = (id: string, data: Partial<ServicePriceItem>) => {
    db.updatePriceItem(id, data);
    setPriceMatrix([...db.getPriceMatrix()]);
    showToast('Price updated successfully', 'success');
  };

  const upsertPriceItem = (data: ServicePriceItem) => {
    db.upsertPriceItem(data);
    setPriceMatrix([...db.getPriceMatrix()]);
    showToast('Price rule saved', 'success');
  };

  const updatePricingSettings = (settings: Partial<PricingSettings>) => {
    const updated = db.updatePricingSettings(settings);
    setPricingSettings({ ...updated });
    showToast('Pricing & Tax settings updated', 'success');
  };

  const addClothItemToCart = (cloth: ClothType, priceItem: ServicePriceItem, quantity = 1, instructions = '') => {
    setCart((prev) => {
      const itemKey = `${cloth.id}-${priceItem.serviceId}`;
      const existingIndex = prev.items.findIndex((item) => item.id === itemKey);
      let updatedItems: OrderItem[];

      if (existingIndex > -1) {
        updatedItems = [...prev.items];
        const existing = updatedItems[existingIndex];
        const newQty = existing.quantity + quantity;
        updatedItems[existingIndex] = {
          ...existing,
          quantity: newQty,
          subtotal: existing.unitPrice * newQty,
          specialInstructions: instructions || existing.specialInstructions,
        };
      } else {
        const newItem: OrderItem = {
          id: itemKey,
          serviceId: priceItem.serviceId,
          serviceName: `${cloth.name} (${priceItem.serviceName})`,
          categoryName: cloth.categoryLabel,
          pricingModel: 'PER_ITEM',
          unitPrice: priceItem.price,
          quantity,
          unit: 'Piece',
          subtotal: priceItem.price * quantity,
          specialInstructions: instructions,
        };
        updatedItems = [...prev.items, newItem];
      }

      return { ...prev, items: updatedItems };
    });
    showToast(`Added ${quantity}x ${cloth.name} (${priceItem.serviceName}) to bag`, 'success');
  };

  // Cart Totals calculation (Dynamically powered by admin pricingSettings)
  const itemTotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  const totalKg = cart.items.filter((i) => i.pricingModel === 'PER_KG').reduce((sum, i) => sum + i.quantity, 0);
  const itemCount = cart.items.reduce((sum, i) => sum + (i.pricingModel === 'PER_ITEM' ? i.quantity : 1), 0);

  let deliveryFee = 0;
  let expressFee = 0;
  let tax = 0;
  let grandTotal = 0;

  if (itemTotal > 0) {
    if (currentZone) {
      deliveryFee = itemTotal >= currentZone.minFreeOrderValue ? 0 : currentZone.standardFee;
    } else if (itemTotal >= pricingSettings.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else {
      deliveryFee = pricingSettings.standardDeliveryFee;
    }

    if (cart.expressTier === 'EXPRESS_24H') expressFee = pricingSettings.expressDeliveryFee;
    if (cart.expressTier === 'SAME_DAY') expressFee = pricingSettings.expressDeliveryFee * 2;

    const discountedSubtotal = Math.max(0, itemTotal - cart.discountAmount);
    const taxableAmount = discountedSubtotal + deliveryFee + expressFee;
    tax = +(taxableAmount * (pricingSettings.taxPercentage / 100)).toFixed(2);
    grandTotal = +(taxableAmount + tax).toFixed(2);
  }

  const cartTotals = {
    itemTotal,
    discount: cart.discountAmount,
    deliveryFee,
    expressFee,
    tax,
    grandTotal,
    totalKg,
    itemCount,
  };

  // Orders Actions
  const createOrder = async (paymentMethod: PaymentMethod, details?: CheckoutDetails): Promise<Order> => {
    const isPerKg = cart.items.some((i) => i.pricingModel === 'PER_KG');
    const orderAddress = details?.selectedAddress || cart.selectedAddress || savedAddresses[0];

    const customerPhone = details?.customerPhone || currentUser.phone || '9876543210';
    const customerName = details?.customerName || currentUser.name || 'Laundry Customer';
    const customerEmail = details?.customerEmail || currentUser.email || '';
    const customerId = currentUser.id && currentUser.id !== 'anonymous-customer'
      ? currentUser.id
      : `guest-${customerPhone.replace(/\D/g, '').slice(-10) || Date.now()}`;

    const newOrder = await createBackendOrder({
      customerId,
      customerName,
      customerPhone,
      customerEmail,
      address: orderAddress,
      items: [...cart.items],
      pricingModelSummary: isPerKg ? 'PER_KG' : 'PER_ITEM',
      expressTier: cart.expressTier,
      pickupSlot: {
        date: details?.pickupDate || cart.pickupDate || new Date().toISOString().split('T')[0],
        slot: details?.pickupSlot || cart.pickupSlot || '08:00 AM - 10:00 AM',
      },
      deliverySlot: {
        date: details?.deliveryDate || cart.deliveryDate || '',
        slot: details?.deliverySlot || cart.deliverySlot || '04:00 PM - 06:00 PM',
      },
      couponCode: cart.appliedCoupon?.code,
      paymentMethod,
      notes: details?.notes ?? cart.notes,
    });

    setOrders((current) => [newOrder, ...current.filter((order) => order.id !== newOrder.id)]);
    clearCart();
    showToast(`Order #${newOrder.id} placed successfully!`, 'success');
    return newOrder;
  };

  const advanceOrderStatus = (orderId: string, status: OrderStatus, notes?: string, updatedBy?: string) => {
    const updated = db.updateOrderStatus(orderId, status, notes, updatedBy);
    if (updated) {
      refreshOrders();
      showToast(`Order #${orderId} status updated to: ${status.replace('_', ' ')}`, 'success');
    }
    return updated;
  };

  const updateOrderWeight = (orderId: string, weightKg: number) => {
    const updated = db.updateOrderWeight(orderId, weightKg);
    if (updated) {
      refreshOrders();
      showToast(`Order #${orderId} verified weight: ${weightKg} KG`, 'success');
    }
    return updated;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id.toUpperCase() === orderId.toUpperCase());
  };

  const refreshOrders = () => {
    getBackendOrders(currentUser.id).then((remoteOrders) => {
      if (remoteOrders) setOrders(remoteOrders);
    });
  };

  const rechargeWallet = (amount: number) => {
    const updated = db.rechargeWallet(amount);
    setWallet({ ...updated });
    showToast(`₹${amount} added to wallet balance successfully!`, 'success');
  };

  const createDispute = (data: Omit<DisputeReport, 'id' | 'reportedAt' | 'status'>) => {
    const dispute = db.createDispute(data);
    setDisputes([...db.getDisputes()]);
    showToast(`Dispute ticket #${dispute.id} created successfully.`, 'info');
    return dispute;
  };

  const updateDisputeStatus = (id: string, status: DisputeStatus, notes?: string, compensation?: number) => {
    const updated = db.updateDisputeStatus(id, status, notes, compensation);
    if (updated) {
      setDisputes([...db.getDisputes()]);
      if (status === 'RESOLVED_CREDIT' && compensation) {
        db.rechargeWallet(compensation);
        setWallet(db.getWallet());
      }
      showToast(`Dispute #${id} marked as ${status.replace('_', ' ')}`, 'success');
    }
  };

  const updateMachineStatus = (id: string, status: LaundryMachine['status'], loadKg?: number) => {
    const updated = db.updateMachineStatus(id, status, loadKg);
    if (updated) {
      setMachines([...db.getMachines()]);
      showToast(`Machine ${id} status updated to ${status}`, 'success');
    }
  };

  const reconcileRiderCOD = (riderId: string, depositedAmount: number, notes?: string) => {
    const updated = db.reconcileRiderCOD(riderId, depositedAmount, notes);
    if (updated) {
      setCODRecords([...db.getCODRecords()]);
      showToast(`COD reconciliation recorded for ${updated.riderName}: ${updated.status}`, 'success');
    }
  };

  const submitWeightVerification = (
    orderId: string,
    grossKg: number,
    tareKg: number,
    ratePerKg: number = 60,
    weighedBy: string = 'Facility Scale Operator'
  ) => {
    const updated = db.submitWeightVerification(orderId, grossKg, tareKg, ratePerKg, weighedBy);
    if (updated) {
      refreshOrders();
      const diff = updated.weightVerification?.differenceAmount || 0;
      showToast(
        `Weighed Order #${orderId}: Net ${updated.weightVerification?.netWeightKg} KG (${diff >= 0 ? '+' : ''}₹${diff})`,
        'success'
      );
    }
  };

  const approvePriceAdjustment = (orderId: string) => {
    const updated = db.approvePriceAdjustment(orderId);
    if (updated) {
      refreshOrders();
      showToast(`Price adjustment approved for Order #${orderId}. Total: ₹${updated.totalAmount}`, 'success');
    }
  };

  const updateGarmentTagStatus = (orderId: string, tagId: string, status: GarmentTagStatus, qcNotes?: string) => {
    const updated = db.updateGarmentTagStatus(orderId, tagId, status, qcNotes);
    if (updated) {
      refreshOrders();
      showToast(`Tag ${tagId} marked as ${status}`, 'success');
    }
  };

  const addInternalNote = (orderId: string, author: string, role: string, content: string) => {
    const note = db.addInternalNote(orderId, author, role, content);
    if (note) {
      refreshOrders();
      showToast('Internal note saved (confidential to staff).', 'info');
    }
  };

  const createHub = (data: Omit<HubBranch, 'id' | 'activeOrdersCount'>) => {
    const hub = db.createHub(data);
    setHubs([...db.getHubs()]);
    showToast(`Branch Hub "${hub.name}" created successfully.`, 'success');
    return hub;
  };

  const updateHub = (id: string, data: Partial<HubBranch>) => {
    const updated = db.updateHub(id, data);
    if (updated) {
      setHubs([...db.getHubs()]);
      showToast(`Branch Hub #${id} updated.`, 'success');
    }
  };

  const updateDistanceConfig = (data: Partial<DistanceDeliveryConfig>) => {
    const updated = db.updateDistanceConfig(data);
    setDistanceConfig({ ...updated });
    showToast('Distance delivery tiers & pricing updated.', 'success');
  };

  const calculateDistanceDeliveryFee = (distanceKm: number, orderSubtotal: number, isExpress = false) => {
    return db.calculateDistanceDeliveryFee(distanceKm, orderSubtotal, isExpress);
  };

  const bookSlotCapacity = (slotId: string, orderKg = 4.5) => {
    const updated = db.bookSlotCapacity(slotId, orderKg);
    if (updated) {
      setSlotCapacities([...db.getSlotCapacities()]);
    }
  };

  const updateSlotCapacity = (slotId: string, data: Partial<TimeSlotCapacity>) => {
    const updated = db.updateSlotCapacity(slotId, data);
    if (updated) {
      setSlotCapacities([...db.getSlotCapacities()]);
      showToast('Slot capacity limit updated.', 'success');
    }
  };

  const submitQCChecklist = (record: Omit<QCChecklistRecord, 'id' | 'inspectedAt'>) => {
    const result = db.submitQCChecklist(record);
    setQCRecords([...db.getQCRecords()]);
    refreshOrders();
    showToast(`QC ${result.status === 'QC_PASSED' ? 'Passed' : 'Failed (Rework Triggered)'} for ${record.clothName}`, result.status === 'QC_PASSED' ? 'success' : 'info');
    return result;
  };

  const triggerRework = (orderId: string, garmentTagId: string, reason: string, operator = 'QC Lead') => {
    const updated = db.triggerRework(orderId, garmentTagId, reason, operator);
    if (updated) {
      refreshOrders();
      setQCRecords([...db.getQCRecords()]);
      showToast(`Rework cycle dispatched for ${garmentTagId} (no extra charge).`, 'info');
    }
  };

  const updateInventoryStock = (id: string, newStock: number, reason?: string) => {
    const updated = db.updateInventoryStock(id, newStock, reason);
    if (updated) {
      setInventory([...db.getInventory()]);
      showToast(`Inventory updated: ${updated.itemName} (${newStock} ${updated.unit})`, 'success');
    }
  };

  const updateNotificationTemplate = (id: string, data: Partial<NotificationTemplate>) => {
    const updated = db.updateNotificationTemplate(id, data);
    if (updated) {
      setNotificationTemplates([...db.getNotificationTemplates()]);
      showToast('Notification template updated successfully.', 'success');
    }
  };

  const logAuditEvent = (userId: string, userName: string, userRole: any, action: string, module: string, details: string) => {
    const entry = db.logAuditEvent(userId, userName, userRole, action, module, details);
    setAuditLogs([...db.getAuditLogs()]);
    return entry;
  };

  const redeemLoyaltyPoints = (customerId: string, points: number) => {
    const result = db.redeemLoyaltyPoints(customerId, points);
    if (result.success) {
      setLoyaltyAccount({ ...db.getLoyaltyAccount(customerId) });
      showToast(`Redeemed ${points} points for ₹${result.discountAmount} discount!`, 'success');
    } else {
      showToast('Insufficient loyalty points.', 'error');
    }
    return result;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userRole,
        setUserRole,
        savedAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        isLoggedIn,
        isAuthModalOpen,
        authRedirectUrl,
        openAuthModal,
        closeAuthModal,
        logout,
        mergeCartOnLogin,
        userPincode,
        currentZone,
        setPincode,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCouponCode,
        removeCouponCode,
        setExpressTier,
        setBookingSlots,
        setSelectedAddress,
        setOrderNotes,
        cartTotals,
        orders,
        createOrder,
        advanceOrderStatus,
        updateOrderWeight,
        getOrderById,
        refreshOrders,
        wallet,
        rechargeWallet,
        clothTypes,
        serviceMasters,
        priceMatrix,
        bulkPricing,
        pricingSettings,
        subscriptionPlans,
        addClothType,
        updateClothType,
        deleteClothType,
        updatePriceItem,
        upsertPriceItem,
        addBulkPrice: (item: BulkPricingItem) => {
          db.addBulkPrice(item);
          setBulkPricing([...db.getBulkPricing()]);
        },
        updateBulkPrice: (id: string, updates: Partial<BulkPricingItem>) => {
          db.updateBulkPrice(id, updates);
          setBulkPricing([...db.getBulkPricing()]);
        },
        deleteBulkPrice: (id: string) => {
          db.deleteBulkPrice(id);
          setBulkPricing([...db.getBulkPricing()]);
        },
        updateBulkSlab: (serviceId: string, laundryType: BulkLaundryType, slabs: { weightKg: number; regularPrice: number; expressPrice: number }[]) => {
          db.updateBulkSlab(serviceId, laundryType, slabs);
          setBulkPricing([...db.getBulkPricing()]);
        },
        updatePricingSettings,
        addClothItemToCart,
        disputes,
        createDispute,
        updateDisputeStatus,
        machines,
        updateMachineStatus,
        codRecords,
        reconcileRiderCOD,
        submitWeightVerification,
        approvePriceAdjustment,
        updateGarmentTagStatus,
        addInternalNote,
        hubs,
        createHub,
        updateHub,
        distanceConfig,
        updateDistanceConfig,
        calculateDistanceDeliveryFee,
        slotCapacities,
        bookSlotCapacity,
        updateSlotCapacity,
        qcRecords,
        submitQCChecklist,
        triggerRework,
        inventory,
        updateInventoryStock,
        notificationTemplates,
        updateNotificationTemplate,
        auditLogs,
        logAuditEvent,
        loyaltyAccount,
        redeemLoyaltyPoints,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3.5 rounded-2xl shadow-xl flex items-center justify-between border transition-all text-xs font-bold animate-in fade-in slide-in-from-bottom-2 ${toast.type === 'success'
                ? 'bg-[#241A21] text-white border-indigo-500/30 shadow-indigo-950/20'
                : toast.type === 'error'
                  ? 'bg-rose-600 text-white border-rose-700'
                  : 'bg-[#1E1B4B] text-white border-indigo-700'
              }`}
          >
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full shrink-0 ${toast.type === 'success' ? 'bg-[#5B214F]' : toast.type === 'error' ? 'bg-white' : 'bg-indigo-400'}`}></span>
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-white/60 hover:text-white text-base font-bold cursor-pointer shrink-0"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
