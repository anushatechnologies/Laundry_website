const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

function customerAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('lf_access');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshCustomerAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const refreshToken = localStorage.getItem('lf_refresh');
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_BASE}/customers/refresh-token`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });
    const payload = await response.json().catch(() => ({}));
    const accessToken = payload.accessToken || payload.data?.accessToken;
    if (!response.ok || !accessToken) throw new Error('Refresh token rejected');
    localStorage.setItem('lf_access', accessToken);
    return accessToken;
  } catch {
    localStorage.removeItem('lf_access');
    localStorage.removeItem('lf_refresh');
    window.dispatchEvent(new Event('lf-auth-changed'));
    return null;
  }
}

export class BackendRequestError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'BackendRequestError';
  }
}

export async function requestFromBackend<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const performRequest = async (requestOptions?: RequestInit) => {
    const headers = new Headers(requestOptions?.headers);
    headers.set('Accept', 'application/json');
    if (requestOptions?.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    return fetch(`${API_BASE}${endpoint}`, { ...requestOptions, headers, cache: 'no-store' });
  };

  let response: Response;
  try {
    response = await performRequest(options);
    if (response.status === 401 && typeof window !== 'undefined' && localStorage.getItem('lf_refresh')) {
      const accessToken = await refreshCustomerAccessToken();
      if (accessToken) {
        const retryHeaders = new Headers(options?.headers);
        retryHeaders.set('Authorization', `Bearer ${accessToken}`);
        response = await performRequest({ ...options, headers: retryHeaders });
      }
    }
  } catch {
    throw new BackendRequestError('We could not reach the service. Please check your connection and try again.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.success === false) {
    throw new BackendRequestError(payload.message || payload.error || 'The request could not be completed.', response.status);
  }

  return (payload.data !== undefined ? payload.data : payload) as T;
}

export async function fetchFromBackend<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    return await requestFromBackend<T>(endpoint, options);
  } catch {
    return null;
  }
}

export const getBackendCatalog = () => fetchFromBackend<any>('/services/catalog');
export const checkBackendPincode = (pin: string) => fetchFromBackend<any>(`/pincodes/check?pin=${encodeURIComponent(pin)}`);
export const getBackendPincodes = () => fetchFromBackend<any[]>('/pincodes');
export const getBackendCoupons = () => fetchFromBackend<any[]>('/coupons');

export const applyBackendCoupon = (code: string, orderTotal: number) =>
  fetchFromBackend<any>('/coupons/apply', { method: 'POST', body: JSON.stringify({ code, orderTotal }) });

export const createBackendOrder = (orderData: unknown) =>
  requestFromBackend<any>('/orders', { method: 'POST', headers: customerAuthHeaders(), body: JSON.stringify(orderData) });

export const getBackendOrders = (customerId: string) =>
  fetchFromBackend<any[]>(`/orders?customerId=${encodeURIComponent(customerId)}`, { headers: customerAuthHeaders() });

export const getBackendTracking = (orderId: string) =>
  fetchFromBackend<any>(`/orders/${encodeURIComponent(orderId)}/track`);

export const getBackendPricingSettings = () => fetchFromBackend<any>('/services/settings');
export const getBackendBulkPricing = () => fetchFromBackend<any>('/bulk-pricing');
export const getBackendSlots = () => fetchFromBackend<any[]>('/slots');
export const getBackendSubscriptionPlans = () => fetchFromBackend<any[]>('/subscriptions/plans');

export const reserveBackendSlot = (slotId: string, orderKg: number) =>
  requestFromBackend<any>('/slots/reserve', { method: 'POST', headers: customerAuthHeaders(), body: JSON.stringify({ slotId, orderKg }) });

export const createRazorpayPaymentOrder = (internalOrderId: string) =>
  requestFromBackend<{ key: string; orderId: string; amount: number; currency: string; internalOrderId: string }>('/payments/create-order', {
    method: 'POST',
    headers: customerAuthHeaders(),
    body: JSON.stringify({ internalOrderId }),
  });

export const verifyRazorpayPayment = (payload: {
  internalOrderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => requestFromBackend<any>('/payments/verify-signature', { method: 'POST', headers: customerAuthHeaders(), body: JSON.stringify(payload) });

export const markRazorpayPaymentFailed = (internalOrderId: string) =>
  fetchFromBackend<any>('/payments/mark-failed', { method: 'POST', headers: customerAuthHeaders(), body: JSON.stringify({ internalOrderId }) });

export function loadRazorpayCheckout(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(Boolean((window as any).Razorpay)), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.dataset.razorpayCheckout = 'true';
    script.onload = () => resolve(Boolean((window as any).Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// Admin-only mutation helpers are intentionally not exported here. They are proxied through the protected admin console.
