'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import {
  Clock,
  MapPin,
  CheckCircle,
  Truck,
  Sparkles,
  QrCode,
  ShieldCheck,
  Scale,
  FileText,
  AlertCircle,
  Check,
  Printer,
  ChevronRight,
  ShieldAlert,
  X,
  Tag,
  ThumbsUp,
} from 'lucide-react';
import { OrderStatus, DisputeType } from '@/types';
import { GarmentImage } from '@/components/common/GarmentImage';
import Link from 'next/link';
import { getBackendTracking } from '@/lib/api';

type PublicTrackingData = {
  id: string;
  currentStatus: OrderStatus;
  statusHistory: { status: OrderStatus; title: string; description: string; timestamp: string }[];
  pickupSlot?: { date: string; slot: string };
  deliverySlot?: { date: string; slot: string };
  paymentStatus?: string;
  updatedAt?: string;
};

function PublicTrackingView({ tracking }: { tracking: PublicTrackingData }) {
  return (
    <div className="laundry-page-atmosphere flex min-h-screen flex-col bg-[#FCF9F7]">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:py-14">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-xl backdrop-blur sm:p-9">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#5B214F]">LaundryFresh live care</p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-[#241A21] sm:text-3xl">Order #{tracking.id}</h1>
              <p className="mt-1 text-sm text-slate-500">Your private timeline is available without exposing handover details.</p>
            </div>
            <span className="inline-flex w-fit items-center rounded-full bg-[#F7F0F2] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#5B214F]">
              {tracking.currentStatus.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="mt-8 space-y-4">
            {[...tracking.statusHistory].reverse().map((event, index) => (
              <div key={`${event.status}-${event.timestamp}`} className="flex gap-3">
                <div className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${index === 0 ? 'bg-[#5B214F] text-white shadow-sm' : 'bg-[#F7F0F2] text-[#5B214F]'}`}>
                  {index === 0 ? '✓' : tracking.statusHistory.length - index}
                </div>
                <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-extrabold text-[#241A21]">{event.title}</p>
                    <time className="text-[11px] font-semibold text-slate-400">{new Date(event.timestamp).toLocaleString()}</time>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{event.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-indigo-100 bg-[#F7F0F2] p-4"><p className="text-xs font-black uppercase tracking-wide text-[#5B214F]">Pickup window</p><p className="mt-1 text-sm font-bold text-slate-700">{tracking.pickupSlot?.date || 'To be confirmed'} · {tracking.pickupSlot?.slot || 'To be confirmed'}</p></div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4"><p className="text-xs font-black uppercase tracking-wide text-amber-800">Next update</p><p className="mt-1 text-sm font-bold text-slate-700">{tracking.updatedAt ? new Date(tracking.updatedAt).toLocaleString() : 'We will notify you soon'}</p></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3"><Link href="/login" className="rounded-xl bg-[#5B214F] hover:bg-[#48193F] px-4 py-2.5 text-xs font-black text-white shadow-md shadow-indigo-500/20">Sign in for full order details</Link><Link href="/track" className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-black text-slate-600 hover:bg-slate-50">Track another order</Link></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function TrackOrderPage() {
  const params = useParams();
  const orderId = (params?.id as string) || '';
  const { getOrderById, approvePriceAdjustment, createDispute } = useApp();

  const order = getOrderById(orderId);
  const [publicTracking, setPublicTracking] = useState<PublicTrackingData | null>(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  // Dispute form
  const [disputeItem, setDisputeItem] = useState('');
  const [disputeType, setDisputeType] = useState<DisputeType>('MISSING_ITEM');
  const [disputeDesc, setDisputeDesc] = useState('');

  useEffect(() => {
    if (!orderId || order) return;
    let active = true;
    setIsLoadingTracking(true);
    getBackendTracking(orderId)
      .then((data) => { if (active && data) setPublicTracking(data as PublicTrackingData); })
      .finally(() => { if (active) setIsLoadingTracking(false); });
    return () => { active = false; };
  }, [order, orderId]);

  const ALL_STATUS_STAGES: { status: OrderStatus; label: string; icon: string }[] = [
    { status: 'ORDER_PLACED', label: 'Order Placed', icon: '📝' },
    { status: 'PICKUP_ASSIGNED', label: 'Pickup Assigned', icon: '🛵' },
    { status: 'PICKED_UP', label: 'Picked Up (OTP)', icon: '🧺' },
    { status: 'RECEIVED_AT_FACILITY', label: 'At Facility Hub', icon: '🏭' },
    { status: 'WEIGHED_VERIFIED', label: 'Weighed & Verified', icon: '⚖️' },
    { status: 'WASHING', label: 'Ozone Washing', icon: '🫧' },
    { status: 'DRYING', label: 'Tumble Drying', icon: '💨' },
    { status: 'IRONING', label: 'Steam Ironing', icon: '👔' },
    { status: 'QUALITY_CHECK', label: 'Quality Check', icon: '✨' },
    { status: 'PACKED', label: 'Packed & Tagged', icon: '📦' },
    { status: 'DELIVERY_ASSIGNED', label: 'Delivery Assigned', icon: '🚚' },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: '🛵' },
    { status: 'DELIVERED', label: 'Delivered (OTP)', icon: '🎉' },
  ];

  if (!order) {
    if (isLoadingTracking) {
      return <div className="laundry-page-atmosphere flex min-h-screen flex-col bg-[#FCF9F7]"><Navbar /><main className="flex flex-1 items-center justify-center px-4"><p className="rounded-full bg-white/90 px-5 py-3 text-sm font-bold text-slate-500 shadow-sm">Loading your secure tracking timeline…</p></main><Footer /></div>;
    }
    if (publicTracking) return <PublicTrackingView tracking={publicTracking} />;
    return (
      <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="w-12 h-12 text-slate-400 mb-3" />
          <h2 className="text-xl font-bold text-[#241A21]">Order #{orderId} Not Found</h2>
          <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
            Please verify your order ID or check your orders history.
          </p>
          <Link href="/orders" className="px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20">
            View All Orders
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentStageIndex = ALL_STATUS_STAGES.findIndex((s) => s.status === order.currentStatus);

  const handleDisputeSubmit = () => {
    if (!disputeDesc.trim()) return;
    createDispute({
      orderId: order.id,
      itemName: disputeItem || order.items[0]?.serviceName || 'Garment',
      issueType: disputeType,
      description: disputeDesc.trim(),
      reportedBy: order.customerName,
    });
    setShowDisputeModal(false);
    setDisputeDesc('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Top Breadcrumb & Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#6F626A] mb-1">
              <Link href="/dashboard" className="hover:text-[#5B214F]">Dashboard</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/orders" className="hover:text-[#5B214F]">Orders</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="font-bold text-[#241A21]">#{order.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241A21] font-poppins flex items-center gap-3">
              <span>Order #{order.id}</span>
              <span className="text-xs font-bold bg-[#F7F0F2] text-[#5B214F] border border-indigo-100 px-3 py-1 rounded-full">
                {order.currentStatus.replace(/_/g, ' ')}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowDisputeModal(true)}
              className="px-4 py-2 bg-white border border-[#E8DDE1] hover:border-red-500 text-red-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Report Issue</span>
            </button>
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="px-4 py-2 bg-white border border-[#E8DDE1] hover:border-[#5B214F] text-[#241A21] text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#5B214F]" />
              <span>Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Action Required Banner: Price Reconciliation Consent */}
        {order.weightVerification?.status === 'PENDING_APPROVAL' && (
          <div className="mb-6 p-5 bg-amber-50 rounded-3xl border border-amber-300 shadow-2xs animate-in fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 text-lg shrink-0">
                  ⚖️
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-amber-950">
                    Action Required: Laundry Weighed &amp; Price Recalculated
                  </h3>
                  <p className="text-xs text-amber-900/90 mt-0.5">
                    Your laundry has been weighed at the facility scale. Please review and approve the exact verified weight to proceed with washing.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-4 text-xs">
                    <span>
                      Estimated: <strong>{order.weightVerification.estimatedWeightKg} KG (₹{order.weightVerification.estimatedAmount})</strong>
                    </span>
                    <span>
                      Actual Weighed: <strong className="text-[#5B214F]">{order.weightVerification.netWeightKg} KG (₹{order.weightVerification.actualAmount})</strong>
                    </span>
                    <span>
                      Difference:{' '}
                      <strong className="text-amber-900">
                        {order.weightVerification.differenceAmount >= 0 ? '+' : ''}₹{order.weightVerification.differenceAmount}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => approvePriceAdjustment(order.id)}
                  className="px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Approve &amp; Proceed (₹{order.weightVerification.differenceAmount})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Column: 13-Stage Progress Timeline & Item Tags */}
          <div className="lg:col-span-8 space-y-6">
            {/* Timeline Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs">
              <h2 className="text-base font-extrabold text-[#241A21] mb-6 flex items-center justify-between">
                <span>Live Order Progress</span>
                <span className="text-xs text-slate-500 font-normal">
                  Updated in real-time by facility IoT scanners
                </span>
              </h2>

              {/* Step Progress Line */}
              <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-slate-100">
                {ALL_STATUS_STAGES.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const historyEntry = order.statusHistory.find((h) => h.status === stage.status);

                  return (
                    <div key={stage.status} className="relative group">
                      {/* Step Circle */}
                      <div
                        className={`absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-[#5B214F] text-white ring-4 ring-indigo-100 shadow-md scale-110'
                            : isCompleted
                            ? 'bg-[#F7F0F2] text-[#5B214F] border border-indigo-100'
                            : 'bg-[#FCF9F7] text-[#6F626A] border border-[#E8DDE1]'
                        }`}
                      >
                        {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stage.icon}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <h4
                            className={`text-sm font-bold ${
                              isCurrent
                                ? 'text-[#5B214F]'
                                : isCompleted
                                ? 'text-[#241A21]'
                                : 'text-[#6F626A]'
                            }`}
                          >
                            {stage.label}
                          </h4>
                          {historyEntry?.timestamp && (
                            <span className="text-[11px] text-[#6F626A] font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {historyEntry.timestamp}
                            </span>
                          )}
                        </div>

                        {historyEntry?.description && (
                          <p className="text-xs text-slate-600 bg-[#FCF9F7] p-2.5 rounded-xl border border-slate-100 mt-1">
                            {historyEntry.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Item-Level Garment Tracking */}
            {order.garmentTags && order.garmentTags.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-[#5B214F]" />
                    <h3 className="font-extrabold text-sm text-[#241A21]">
                      Individual Item-Level Garment Progress ({order.garmentTags.length} Pieces)
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#6F626A]">Scanned at facility stations</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.garmentTags.map((tag) => (
                    <div key={tag.id} className="p-3.5 bg-[#FCF9F7] rounded-2xl border border-[#E8DDE1] space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <GarmentImage
                            name={tag.clothName}
                            icon={tag.clothIcon}
                            size="sm"
                            className="w-8 h-8 rounded-lg shrink-0 shadow-2xs"
                          />
                          <span className="font-bold text-xs text-[#241A21] truncate">{tag.clothName}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#F7F0F2] text-[#5B214F] text-[10px] font-bold rounded-full shrink-0">
                          {tag.currentStatus.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#6F626A] flex justify-between">
                        <span>Tag: <code className="font-mono text-slate-700">{tag.id}</code></span>
                        <span>{tag.serviceName}</span>
                      </div>

                      {tag.qcNotes && (
                        <div className="text-[10px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                          QC Note: {tag.qcNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: OTP, Driver, Order Summary */}
          <div className="lg:col-span-4 space-y-6">
            {/* Secure handover information */}
            <div className="bg-[#241A21] text-white rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-extrabold uppercase">
                <ShieldCheck className="w-4 h-4 text-[#5B214F]" />
                <span>Secure Handover</span>
              </div>

              <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                <p className="text-sm font-semibold text-white">Your handover code stays private.</p>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                  It appears here only when an assigned team member is ready for pickup or delivery.
                  Never share it in chat or over the phone.
                </p>
              </div>

              <div className="text-[11px] text-slate-400 text-center">
                Inspect your garments before confirming handover.
              </div>
            </div>

            {/* Assigned In-House Fleet Driver Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#E8DDE1] shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-xs text-[#241A21] uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#5B214F]" />
                  <span>Company In-House Fleet</span>
                </h3>
                <span className="px-2 py-0.5 bg-[#F7F0F2] text-[#5B214F] text-[10px] font-bold rounded-full">
                  Salaried Driver
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F7F0F2] text-[#5B214F] font-bold flex items-center justify-center text-sm">
                    🚐
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-[#241A21]">
                      {order.assignedDeliveryAgent?.name || order.assignedPickupAgent?.name || 'Driver assignment pending'}
                    </div>
                    <div className="text-[11px] text-[#6F626A]">
                      We will notify you when a verified team member is assigned.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#FCF9F7] rounded-xl border border-slate-100 text-[11px] text-[#6F626A] flex justify-between">
                <span>Assigned Hub:</span>
                <strong className="text-[#241A21]">Assigned after collection</strong>
              </div>
            </div>

            {/* Live WhatsApp Automated Update Preview */}
            <div className="bg-[#075E54] text-white rounded-3xl p-4 shadow-2xs space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold flex items-center gap-1.5">
                  <span>📱 WhatsApp Live Status</span>
                </span>
                <span className="text-[10px] opacity-80 font-mono">Dispatched</span>
              </div>
              <div className="bg-[#DCF8C6] text-[#241A21] p-2.5 rounded-xl text-[11px] leading-relaxed shadow-2xs">
                🧺 <strong>LaundryFresh:</strong> Order <strong>#{order.id}</strong> status is now <strong>{order.currentStatus.replace('_', ' ')}</strong>. Delivery distance: <strong>{order.deliveryDistanceKm || 3.8} KM</strong>.
              </div>
            </div>

            {/* Bill Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-[#E8DDE1] shadow-2xs space-y-3 text-xs">
              <h3 className="font-bold text-[#241A21] uppercase tracking-wider pb-2 border-b border-slate-100">
                Payment &amp; Billing
              </h3>

              <div className="space-y-2 text-[#6F626A]">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-semibold text-[#241A21]">₹{order.itemTotal}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#5B214F] font-bold">
                    <span>Coupon ({order.couponCode})</span>
                    <span>-₹{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Convenience Fee</span>
                  <span className="font-semibold text-[#241A21]">₹{order.pickupDeliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST 5%)</span>
                  <span className="font-semibold text-[#241A21]">₹{order.taxAmount}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#241A21] pt-2 border-t border-slate-200">
                  <span>Grand Total</span>
                  <span className="text-[#5B214F]">₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-[#6F626A] flex justify-between">
                <span>Method: <strong>{order.paymentMethod}</strong></span>
                <span className="text-[#5B214F] font-bold">✓ {order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Report Issue / Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E8DDE1] space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-base text-[#241A21]">Report Issue with Garment</h3>
              </div>
              <button onClick={() => setShowDisputeModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#241A21] block mb-1">Select Garment / Item</label>
                <select
                  value={disputeItem}
                  onChange={(e) => setDisputeItem(e.target.value)}
                  className="w-full h-10 border border-[#E8DDE1] rounded-xl px-3 font-bold text-xs text-[#241A21]"
                >
                  {order.garmentTags && order.garmentTags.length > 0 ? (
                    order.garmentTags.map((t) => (
                      <option key={t.id} value={t.clothName}>
                        {t.clothName} ({t.id})
                      </option>
                    ))
                  ) : (
                    order.items.map((it) => (
                      <option key={it.id} value={it.serviceName}>
                        {it.serviceName}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#241A21] block mb-1">Issue Category</label>
                <select
                  value={disputeType}
                  onChange={(e) => setDisputeType(e.target.value as DisputeType)}
                  className="w-full h-10 border border-[#E8DDE1] rounded-xl px-3 font-bold text-xs text-[#241A21]"
                >
                  <option value="MISSING_ITEM">Missing Item</option>
                  <option value="DAMAGED_GARMENT">Damaged Garment / Torn / Missing Button</option>
                  <option value="COLOR_BLEED">Color Bleeding / Stains</option>
                  <option value="DELAY">Severe Delivery Delay</option>
                  <option value="BILLING_DISPUTE">Billing / Weight Discrepancy</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[#241A21] block mb-1">Details &amp; Description</label>
                <textarea
                  rows={3}
                  value={disputeDesc}
                  onChange={(e) => setDisputeDesc(e.target.value)}
                  placeholder="Please describe what went wrong so our operations team can resolve it immediately..."
                  className="w-full border border-[#E8DDE1] rounded-xl p-3 text-xs text-[#241A21] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowDisputeModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#241A21] font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDisputeSubmit}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
              >
                Submit Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Production Tax Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[#E8DDE1] space-y-6 max-h-[90vh] overflow-y-auto print:p-0 print:shadow-none">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5B214F] flex items-center justify-center text-white text-xl">
                  🧺
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-[#241A21]">TAX INVOICE</h3>
                  <span className="text-xs text-[#6F626A]">LaundryFresh Private Limited</span>
                </div>
              </div>

              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-[#241A21] hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button onClick={() => setShowInvoiceModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Invoice Header Details */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="text-[#6F626A]">Billed To:</div>
                <div className="font-bold text-sm text-[#241A21]">{order.customerName}</div>
                <div className="text-slate-600">{order.address.street}</div>
                <div className="text-slate-600">
                  {order.address.city} - {order.address.pincode}
                </div>
                <div className="text-slate-600">Phone: {order.customerPhone}</div>
              </div>

              <div className="text-right">
                <div>
                  <span className="text-[#6F626A]">Invoice No: </span>
                  <strong className="text-[#241A21]">INV-{order.id}</strong>
                </div>
                <div>
                  <span className="text-[#6F626A]">Invoice Date: </span>
                  <strong>{order.createdAt}</strong>
                </div>
                <div>
                  <span className="text-[#6F626A]">GSTIN: </span>
                  <strong>29AABCU9603R1ZM</strong>
                </div>
                <div>
                  <span className="text-[#6F626A]">SAC Code: </span>
                  <strong>998714 (Laundry &amp; Cleaning)</strong>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FCF9F7] border-b border-[#E8DDE1] text-[#6F626A] font-bold">
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty / KG</th>
                  <th className="py-2.5 px-3 text-right">Unit Rate</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DDE1]">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2.5 px-3 font-semibold text-[#241A21]">{item.serviceName}</td>
                    <td className="py-2.5 px-3 text-center">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="py-2.5 px-3 text-right">₹{item.unitPrice}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#241A21]">₹{item.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* GST Summary & Grand Total */}
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-[#6F626A]">
                  <span>Item Subtotal:</span>
                  <span>₹{order.itemTotal}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-[#5B214F] font-bold">
                    <span>Discount ({order.couponCode || 'PROMO'}):</span>
                    <span>-₹{order.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6F626A]">
                  <span>Delivery Fee:</span>
                  <span>₹{order.pickupDeliveryFee}</span>
                </div>
                <div className="flex justify-between text-[#6F626A]">
                  <span>CGST (2.5%):</span>
                  <span>₹{(order.taxAmount / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6F626A]">
                  <span>SGST (2.5%):</span>
                  <span>₹{(order.taxAmount / 2).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-[#241A21] pt-2 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="text-[#5B214F]">₹{order.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#6F626A] text-center pt-4 border-t border-slate-100">
              Thank you for trusting LaundryFresh. For support, WhatsApp +91 98765 43210.
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

