'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Truck,
  MapPin,
  Phone,
  Scale,
  CheckCircle,
  Clock,
  ShieldCheck,
  Navigation,
  DollarSign,
  QrCode,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Order } from '@/types';

export default function InHouseFleetPortal() {
  const { orders, hubs, advanceOrderStatus, submitWeightVerification, reconcileRiderCOD, codRecords } = useApp();

  const [activeTab, setActiveTab] = useState<'RUNSHEET' | 'DOORSTEP_WEIGH' | 'COD_SETTLE'>('RUNSHEET');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);

  // Doorstep Weigh state
  const [doorstepGross, setDoorstepGross] = useState<number>(5.2);
  const [doorstepTare, setDoorstepTare] = useState<number>(0.3);
  const [enteredOtp, setEnteredOtp] = useState<string>('');

  // COD settlement
  const [depositedAmount, setDepositedAmount] = useState<number>(4200);

  const assignedHub = hubs[0] || { name: 'Rajahmundry Central Hub', id: 'HUB-RJY-01' };
  const vehicle = assignedHub.inHouseVehicles?.[0] || {
    registrationNo: 'AP-05-EV-4120',
    vehicleType: 'ELECTRIC_VAN',
    driverName: 'Vikram Singh',
    capacityKg: 120,
    status: 'ON_ROUTE',
  };

  const pendingPickups = orders.filter((o) => o.currentStatus === 'PICKUP_ASSIGNED' || o.currentStatus === 'ORDER_PLACED');
  const pendingDeliveries = orders.filter((o) => o.currentStatus === 'DELIVERY_ASSIGNED' || o.currentStatus === 'OUT_FOR_DELIVERY');

  const handleVerifyPickup = (order: Order) => {
    if (!enteredOtp) {
      alert('Please enter customer pickup OTP (or use default ' + order.pickupOtp + ')');
      return;
    }
    submitWeightVerification(order.id, doorstepGross, doorstepTare, 60, vehicle.driverName);
    advanceOrderStatus(order.id, 'PICKED_UP');
    advanceOrderStatus(order.id, 'RECEIVED_AT_FACILITY');
    setEnteredOtp('');
  };

  const handleVerifyDelivery = (order: Order) => {
    advanceOrderStatus(order.id, 'DELIVERED');
  };

  return (
    <div className="min-h-screen bg-[#FCF9F7] text-[#241A21] pb-12 font-inter">
      {/* Driver Header */}
      <header className="bg-[#241A21] text-white p-4 sticky top-0 z-40 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#16A34A] flex items-center justify-center font-bold text-white text-lg">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm flex items-center gap-1.5">
                <span>{vehicle.driverName}</span>
                <span className="px-1.5 py-0.2 bg-emerald-500 text-[10px] rounded text-white font-mono">
                  IN-HOUSE FLEET
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {vehicle.registrationNo} • {assignedHub.name}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Vehicle Load</span>
            <span className="font-mono font-bold text-xs text-[#16A34A]">42 / {vehicle.capacityKg} KG</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-md mx-auto px-4 pt-4">
        <div className="bg-white p-1.5 rounded-[14px] border border-[#E8DDE1] shadow-soft flex gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab('RUNSHEET')}
            className={`flex-1 py-2 rounded-[10px] transition-all text-center ${
              activeTab === 'RUNSHEET' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#6F626A] hover:text-[#241A21]'
            }`}
          >
            Run-Sheet ({pendingPickups.length + pendingDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab('DOORSTEP_WEIGH')}
            className={`flex-1 py-2 rounded-[10px] transition-all text-center ${
              activeTab === 'DOORSTEP_WEIGH' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#6F626A] hover:text-[#241A21]'
            }`}
          >
            Digital Scale
          </button>
          <button
            onClick={() => setActiveTab('COD_SETTLE')}
            className={`flex-1 py-2 rounded-[10px] transition-all text-center ${
              activeTab === 'COD_SETTLE' ? 'bg-[#16A34A] text-white shadow-xs' : 'text-[#6F626A] hover:text-[#241A21]'
            }`}
          >
            COD Handover
          </button>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 mt-4 space-y-4">
        {/* Tab 1: Run-Sheet */}
        {activeTab === 'RUNSHEET' && (
          <div className="space-y-4">
            {/* Pickups Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#241A21] px-1">
                <span>ASSIGNED PICKUPS ({pendingPickups.length})</span>
                <span className="text-[10px] text-[#6F626A]">Doorstep Scale Required</span>
              </div>

              {pendingPickups.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-[16px] border border-[#E8DDE1] shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-[#241A21]">#{order.id}</span>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full">
                      PICKUP PENDING
                    </span>
                  </div>

                  <div>
                    <div className="font-extrabold text-sm text-[#241A21]">{order.customerName}</div>
                    <div className="text-xs text-[#6F626A] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{order.address.street}, {order.address.city}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#FCF9F7] rounded-[10px] border border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{order.deliveryDistanceKm || 3.8} KM from Hub</span>
                    </div>
                    <a
                      href={`tel:${order.customerPhone}`}
                      className="px-2.5 py-1 bg-white border border-[#E8DDE1] rounded-[6px] text-[11px] font-bold text-[#241A21] flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-[#16A34A]" />
                      <span>Call</span>
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`OTP (${order.pickupOtp})`}
                      value={selectedOrder?.id === order.id ? enteredOtp : ''}
                      onChange={(e) => {
                        setSelectedOrder(order);
                        setEnteredOtp(e.target.value);
                      }}
                      className="w-24 text-center font-mono font-black text-xs border border-[#E8DDE1] rounded-[8px] px-2 h-9"
                    />
                    <button
                      onClick={() => handleVerifyPickup(order)}
                      className="flex-1 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs rounded-[8px] h-9 transition-all shadow-xs flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Weigh & Confirm Pickup</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Deliveries Section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#241A21] px-1">
                <span>ASSIGNED DELIVERIES ({pendingDeliveries.length})</span>
                <span className="text-[10px] text-[#6F626A]">Collect OTP & Payment</span>
              </div>

              {pendingDeliveries.map((order) => (
                <div
                  key={order.id}
                  className="bg-white p-4 rounded-[16px] border border-[#E8DDE1] shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-[#241A21]">#{order.id}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold rounded-full">
                      OUT FOR DELIVERY
                    </span>
                  </div>

                  <div>
                    <div className="font-extrabold text-sm text-[#241A21]">{order.customerName}</div>
                    <div className="text-xs text-[#6F626A] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{order.address.street}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#FCF9F7] rounded-[10px] border border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-[#241A21]">
                      Collect: <strong className="text-[#16A34A] font-black">₹{order.totalAmount}</strong> ({order.paymentMethod})
                    </span>
                    <span className="text-[11px] font-mono text-[#6F626A]">OTP: {order.deliveryOtp}</span>
                  </div>

                  <button
                    onClick={() => handleVerifyDelivery(order)}
                    className="w-full bg-[#241A21] hover:bg-slate-800 text-white font-extrabold text-xs rounded-[8px] h-9 transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Complete Delivery Handover</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Doorstep Bluetooth Scale */}
        {activeTab === 'DOORSTEP_WEIGH' && (
          <div className="bg-white p-6 rounded-[20px] border border-[#E8DDE1] shadow-soft space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#DCFCE7] text-[#16A34A] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-[#241A21]">Portable Bluetooth Digital Scale</h3>
              <p className="text-xs text-[#6F626A]">Model: OHAUS-BT500 (Paired with Driver App)</p>
            </div>

            <div className="p-6 bg-[#241A21] text-white rounded-[16px] text-center space-y-1">
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono block">
                LIVE STABILIZED NET WEIGHT
              </span>
              <span className="text-4xl font-black font-mono text-emerald-400 block">
                {Math.max(0, +(doorstepGross - doorstepTare).toFixed(2))} KG
              </span>
              <span className="text-[11px] text-slate-400">Zero drift tolerance ±0.05 KG</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-[#241A21] block mb-1">Gross Scale Reading (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={doorstepGross}
                  onChange={(e) => setDoorstepGross(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 border border-[#E8DDE1] rounded-[8px] px-3 font-mono font-bold text-[#241A21]"
                />
              </div>

              <div>
                <label className="font-bold text-[#241A21] block mb-1">Tare / Empty Bag (KG)</label>
                <input
                  type="number"
                  step="0.1"
                  value={doorstepTare}
                  onChange={(e) => setDoorstepTare(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 border border-[#E8DDE1] rounded-[8px] px-3 font-mono font-bold text-[#241A21]"
                />
              </div>
            </div>

            <button
              onClick={() => setActiveTab('RUNSHEET')}
              className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-xs rounded-[10px] shadow-xs"
            >
              Apply Weight to Active Pickup
            </button>
          </div>
        )}

        {/* Tab 3: COD Settle */}
        {activeTab === 'COD_SETTLE' && (
          <div className="bg-white p-6 rounded-[20px] border border-[#E8DDE1] shadow-soft space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#16A34A]" />
              <h3 className="font-extrabold text-base text-[#241A21]">Daily Shift COD Cash Settlement</h3>
            </div>

            <div className="p-4 bg-[#FCF9F7] rounded-[12px] border border-[#E8DDE1] space-y-2 text-xs">
              <div className="flex justify-between text-[#6F626A]">
                <span>Total Cash Collected:</span>
                <strong className="text-[#241A21] font-mono text-sm">₹4,200</strong>
              </div>
              <div className="flex justify-between text-[#6F626A]">
                <span>Hub Cashier Desk:</span>
                <strong className="text-[#241A21]">Rajahmundry Central Hub Desk</strong>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-[#241A21] block">Physical Cash Deposited (₹)</label>
              <input
                type="number"
                value={depositedAmount}
                onChange={(e) => setDepositedAmount(parseFloat(e.target.value) || 0)}
                className="w-full h-10 border border-[#E8DDE1] rounded-[8px] px-3 font-mono font-bold text-[#241A21]"
              />
            </div>

            <button
              onClick={() => {
                reconcileRiderCOD('stf-4', depositedAmount, 'Driver physical cash handed over to cashier');
                alert('Cash deposit recorded and marked for cashier signoff.');
              }}
              className="w-full py-3 bg-[#241A21] hover:bg-slate-800 text-white font-extrabold text-xs rounded-[10px] shadow-xs"
            >
              Submit Cash Handover for Audit
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
