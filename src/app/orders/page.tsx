'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { Clock, Search, ArrowRight, FileText, Filter, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/common/Badge';
import { GarmentImage } from '@/components/common/GarmentImage';

export default function OrdersListPage() {
  const { orders } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DELIVERED'>('ALL');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((o) => {
    const isDelivered = ['DELIVERED', 'COMPLETED'].includes(o.currentStatus);
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'ACTIVE' && !isDelivered && o.currentStatus !== 'CANCELLED') ||
      (filter === 'DELIVERED' && isDelivered);

    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some((i) => i.serviceName.toLowerCase().includes(search.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241A21] font-poppins">
              My Laundry Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              View past bookings, track in-progress washes, and download official invoices.
            </p>
          </div>

          <Link
            href="/book"
            className="px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all"
          >
            + Schedule New Pickup
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs mb-6 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-[#241A21] text-white border-[#241A21]'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setFilter('ACTIVE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                filter === 'ACTIVE'
                  ? 'bg-[#5B214F] text-white border-[#5B214F]'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('DELIVERED')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                filter === 'DELIVERED'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              Completed &amp; Delivered
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID or item..."
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B214F]"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-extrabold text-base text-[#241A21] font-poppins">
                    #{ord.id}
                  </span>
                  <Badge status={ord.currentStatus} size="md" />
                  <span className="text-xs text-slate-400 font-medium">{ord.createdAt}</span>
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <div className="flex -space-x-2 overflow-hidden shrink-0">
                    {ord.items.slice(0, 4).map((i, idx) => (
                      <GarmentImage
                        key={idx}
                        name={i.serviceName}
                        categoryTag={i.categoryName}
                        size="sm"
                        className="w-7 h-7 rounded-full border-2 border-white shadow-2xs"
                      />
                    ))}
                  </div>
                  <div className="text-xs text-slate-700 font-medium line-clamp-1">
                    {ord.items.map((i) => `${i.serviceName} (${i.quantity} ${i.unit})`).join(' • ')}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-4">
                  <span>Pickup Slot: {ord.pickupSlot.date} ({ord.pickupSlot.slot})</span>
                  <span>•</span>
                  <span>Handover code appears after a pickup agent is assigned.</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
                <div className="text-left md:text-right">
                  <span className="text-lg font-black text-[#241A21] font-poppins block">
                    ₹{ord.totalAmount}
                  </span>
                  <span className="text-[10px] text-[#5B214F] font-bold uppercase">
                    {ord.paymentMethod} • {ord.paymentStatus}
                  </span>
                </div>

                <Link
                  href={`/track/${ord.id}`}
                  className="px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Track Status</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

