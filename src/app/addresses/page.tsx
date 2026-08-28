'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useApp } from '@/context/AppContext';
import { MapPin, Plus, CheckCircle, Home, Briefcase, Building } from 'lucide-react';

export default function AddressesPage() {
  const { savedAddresses, addAddress, deleteAddress, userPincode, currentUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.houseNo && !newAddr.area) return;
    const streetCombined = [newAddr.houseNo.trim(), newAddr.area.trim()].filter(Boolean).join(', ');
    addAddress({
      type: newAddr.type,
      contactName: newAddr.contactName.trim() || currentUser.name,
      contactPhone: newAddr.contactPhone.trim() || currentUser.phone,
      houseNo: newAddr.houseNo.trim(),
      area: newAddr.area.trim(),
      street: streetCombined,
      landmark: newAddr.landmark.trim(),
      city: newAddr.city.trim() || 'Hyderabad',
      state: newAddr.state.trim() || 'Telangana',
      pincode: newAddr.pincode.trim() || '500072',
      instructions: newAddr.instructions.trim(),
      isDefault: newAddr.isDefault,
    });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCF9F7]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#241A21]">
              Saved Pickup Addresses
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your home, apartment, and office locations for instant 1-click booking.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Address</span>
          </button>
        </div>

        {savedAddresses.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
            <MapPin className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-base text-slate-700">No Saved Addresses</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your doorstep pickup and delivery address to quickly schedule orders.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-[#5B214F] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Address</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#F7F0F2] text-[#5B214F] flex items-center justify-center">
                        {addr.type === 'Home' ? <Home className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                      </div>
                      <span className="font-extrabold text-sm text-[#241A21] uppercase">{addr.type}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-[#F7F0F2] text-[#5B214F] px-2.5 py-0.5 rounded-full border border-indigo-100">
                      Serviceable Zone
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-800 font-bold mb-1">
                    {addr.houseNo ? `${addr.houseNo}, ` : ''}{addr.area || addr.street}
                  </p>
                  {addr.landmark && (
                    <p className="text-xs text-slate-400 mb-1">Landmark: {addr.landmark}</p>
                  )}
                  <p className="text-xs text-slate-500">
                    {addr.city}{addr.state ? `, ${addr.state}` : ''} — <span className="font-bold text-slate-700">{addr.pincode}</span>
                  </p>
                  {(addr.contactName || addr.contactPhone) && (
                    <p className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100 flex gap-2">
                      <span>👤 {addr.contactName || currentUser.name}</span>
                      <span>📞 {addr.contactPhone || currentUser.phone}</span>
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <span className="text-[#5B214F]">Doorstep Service</span>
                  <button
                    type="button"
                    onClick={() => deleteAddress(addr.id)}
                    className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Address Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in">
              <h3 className="text-lg font-black text-[#241A21] mb-4">Add Delivery Address</h3>
              <form onSubmit={handleSave} className="space-y-3.5 text-xs">
                <div className="flex gap-2">
                  {(['Home', 'Office', 'Other'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddr({ ...newAddr, type: t })}
                      className={`flex-1 py-2 rounded-xl font-bold border text-center transition cursor-pointer ${
                        newAddr.type === t
                          ? 'bg-[#5B214F] text-white border-[#5B214F]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={newAddr.contactName}
                    onChange={(e) => setNewAddr({ ...newAddr, contactName: e.target.value })}
                    placeholder="Contact Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#5B214F] focus:outline-none"
                  />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newAddr.contactPhone}
                    onChange={(e) => setNewAddr({ ...newAddr, contactPhone: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-Digit Mobile"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#5B214F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">House / Flat / Building No. *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.houseNo}
                    onChange={(e) => setNewAddr({ ...newAddr, houseNo: e.target.value })}
                    placeholder="e.g. Flat 402, Block B"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#5B214F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Street / Locality / Area *</label>
                  <input
                    type="text"
                    required
                    value={newAddr.area}
                    onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                    placeholder="e.g. KPHB 6th Phase"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#5B214F] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newAddr.landmark}
                    onChange={(e) => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    placeholder="Landmark"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#5B214F] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    placeholder="City"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#5B214F] focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value.replace(/\D/g, '') })}
                    placeholder="Pincode"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#5B214F] focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#5B214F] hover:bg-[#48193F] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
