'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, CheckCircle2, XCircle, X, Navigation, Loader2, Search, Sparkles } from 'lucide-react';
import { fetchFromBackend } from '@/lib/api';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LocationStatus = {
  isServiceable: boolean;
  message: string;
  pincode?: string;
  areaName?: string;
  city?: string;
  detectedAddress?: string;
};

const POPULAR_HUBS = [
  { pin: '500081', label: 'Hitec City / Madhapur' },
  { pin: '500032', label: 'Gachibowli / Financial Dist' },
  { pin: '500072', label: 'Kukatpally / KPHB' },
  { pin: '500033', label: 'Jubilee Hills' },
  { pin: '500034', label: 'Banjara Hills' },
  { pin: '500089', label: 'Manikonda / Puppalguda' },
  { pin: '500049', label: 'Miyapur / Chandanagar' },
  { pin: '500003', label: 'Secunderabad / Paradise' },
];

export const PincodeModal: React.FC<PincodeModalProps> = ({ isOpen, onClose }) => {
  const { setPincode, userPincode, currentZone } = useApp();
  const [manualPin, setManualPin] = useState('');
  const [statusResult, setStatusResult] = useState<LocationStatus | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const hasInitialized = useRef(false);

  const evaluatePincode = async (pinToCheck: string) => {
    const cleanPin = pinToCheck.replace(/\D/g, '').slice(0, 6);
    if (cleanPin.length !== 6) return;
    setIsChecking(true);

    try {
      // 1. Check with Backend API
      const res = await fetchFromBackend<any>(`/pincodes/check?pin=${cleanPin}`);
      const isServ = res?.data?.isServiceable === true || res?.isServiceable === true;
      const zoneData = res?.data?.zone || res?.data;

      // 2. Sync with AppContext local state
      const localResult = setPincode(cleanPin);

      setStatusResult({
        isServiceable: isServ,
        pincode: cleanPin,
        areaName: zoneData?.areaName || localResult.zone?.areaName || 'Local Area',
        city: zoneData?.city || localResult.zone?.city || 'Hyderabad',
        message: isServ
          ? `✅ Great news! Doorstep pickup & 24h delivery are available in ${zoneData?.areaName || localResult.zone?.areaName || 'this area'}, ${zoneData?.city || localResult.zone?.city || 'Hyderabad'}.`
          : `❌ Service is currently not available in PIN ${cleanPin}. We operate across 50+ areas in Hyderabad & Secunderabad and are expanding to your location soon!`,
      });
    } catch {
      const localResult = setPincode(cleanPin);
      setStatusResult({
        isServiceable: localResult.isServiceable,
        pincode: cleanPin,
        areaName: localResult.zone?.areaName,
        city: localResult.zone?.city,
        message: localResult.isServiceable
          ? `✅ Service available in ${localResult.zone?.areaName || 'your area'}`
          : `❌ Service is currently not available in PIN ${cleanPin}. We operate across 50+ areas in Hyderabad & Secunderabad.`,
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualPin.trim().length === 6) {
      evaluatePincode(manualPin.trim());
    }
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    setStatusResult(null);

    if (!navigator.geolocation) {
      setIsDetecting(false);
      setStatusResult({
        isServiceable: false,
        message: 'Geolocation is not supported by this browser. Please enter your 6-digit pincode manually.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const backendData = await fetchFromBackend<any>(
            `/pincodes/reverse-geocode?lat=${coords.latitude}&lng=${coords.longitude}`
          );

          const detectedPin = String(backendData?.data?.pincode || backendData?.pincode || '500081');
          setManualPin(detectedPin);
          await evaluatePincode(detectedPin);
        } catch {
          setStatusResult({
            isServiceable: false,
            message: 'Could not resolve location GPS coordinates. Please enter your 6-digit pincode manually.',
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        setIsDetecting(false);
        setStatusResult({
          isServiceable: false,
          message: error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. Please enter your 6-digit pincode below.'
            : 'Unable to retrieve your location. Please enter pincode manually.',
        });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (!isOpen) {
      hasInitialized.current = false;
      return;
    }
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (userPincode) {
        setManualPin(userPincode);
        if (currentZone) {
          setStatusResult({
            isServiceable: currentZone.isServiceable,
            pincode: userPincode,
            areaName: currentZone.areaName,
            city: currentZone.city,
            message: currentZone.isServiceable
              ? `✅ Doorstep pickup & express care available in ${currentZone.areaName}, ${currentZone.city}`
              : `❌ Service not available in PIN ${userPincode}`,
          });
        }
      }
    }
  }, [isOpen, userPincode, currentZone]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md space-y-5 rounded-3xl border border-[#E8DDE1] bg-white p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          aria-label="Close location dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#5B214F] text-white shadow-md shadow-[#5B214F]/20">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-poppins text-lg font-black text-[#2B1326]">
              Check Delivery Coverage
            </h3>
            <p className="text-xs text-slate-500">
              Operating across 50+ areas in Hyderabad &amp; Secunderabad
            </p>
          </div>
        </div>

        {/* Manual Pincode Search Form */}
        <form onSubmit={handleManualSubmit} className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-600">
            Enter 6-Digit Pincode
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="tel"
                inputMode="numeric"
                maxLength={6}
                value={manualPin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setManualPin(val);
                  if (val.length === 6) {
                    evaluatePincode(val);
                  }
                }}
                placeholder="e.g. 500081, 500032"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-400 focus:border-[#5B214F] focus:ring-2 focus:ring-[#5B214F]/20 outline-none tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={manualPin.length !== 6 || isChecking}
              className="px-5 py-3 bg-[#5B214F] hover:bg-[#48193F] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Check</span>
            </button>
          </div>
        </form>

        {/* GPS Auto-Detect Button */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E8DDE1] bg-[#F7F0F2] hover:bg-[#EBDDE4] py-2.5 text-xs font-bold text-[#5B214F] transition cursor-pointer"
        >
          {isDetecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="h-4 w-4" />
          )}
          <span>{isDetecting ? 'Detecting device GPS…' : 'Use Current Location (GPS)'}</span>
        </button>

        {/* Live Service Availability Feedback Box */}
        {statusResult && (
          <div
            className={`rounded-2xl border p-4 transition-all animate-in fade-in ${
              statusResult.isServiceable
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-rose-200 bg-rose-50 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-3">
              {statusResult.isServiceable ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              ) : (
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              )}
              <div className="min-w-0 text-xs">
                <div className="flex items-center gap-2 font-black text-sm">
                  <span>
                    {statusResult.isServiceable
                      ? 'Service Available!'
                      : 'Service Not Available'}
                  </span>
                  {statusResult.pincode && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 border font-mono">
                      PIN {statusResult.pincode}
                    </span>
                  )}
                </div>
                {statusResult.areaName && (
                  <p className="mt-1 font-bold text-slate-700">
                    {statusResult.areaName}, {statusResult.city || 'Hyderabad'}
                  </p>
                )}
                <p className="mt-1 leading-relaxed text-slate-600">
                  {statusResult.message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Popular Hyderabad Hubs Shortcuts */}
        <div>
          <label className="block text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#5B214F]" />
            Popular Serviceable Hubs
          </label>
          <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto pr-1">
            {POPULAR_HUBS.map((hub) => (
              <button
                key={hub.pin}
                type="button"
                onClick={() => {
                  setManualPin(hub.pin);
                  evaluatePincode(hub.pin);
                }}
                className={`text-left px-2.5 py-2 rounded-xl text-[11px] font-bold border transition truncate cursor-pointer ${
                  manualPin === hub.pin
                    ? 'border-[#5B214F] bg-[#F7F0F2] text-[#5B214F]'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="truncate font-semibold">{hub.label}</div>
                <div className="text-[10px] text-slate-400 font-mono font-normal">PIN {hub.pin}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#5B214F] hover:bg-[#48193F] py-3 text-xs font-black text-white shadow-md shadow-[#5B214F]/20 transition cursor-pointer"
        >
          {statusResult?.isServiceable ? 'Confirm & Browse Services' : 'Done'}
        </button>
      </div>
    </div>
  );
};
