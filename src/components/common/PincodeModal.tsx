'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, CheckCircle, AlertCircle, X, Navigation, Loader2 } from 'lucide-react';
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

export const PincodeModal: React.FC<PincodeModalProps> = ({ isOpen, onClose }) => {
  const { setPincode } = useApp();
  const [statusResult, setStatusResult] = useState<LocationStatus | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const hasRequestedLocation = useRef(false);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    setStatusResult(null);

    if (!navigator.geolocation) {
      setIsDetecting(false);
      setStatusResult({
        isServiceable: false,
        message: 'Geolocation is not supported by this browser. Please enable location access and try again.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const backendData = await fetchFromBackend<any>(
            `/pincodes/reverse-geocode?lat=${coords.latitude}&lng=${coords.longitude}`
          );

          if (!backendData?.pincode) {
            setStatusResult({
              isServiceable: false,
              message: 'We could not identify this location. Please try detecting again.',
            });
            return;
          }

          const detectedPin = String(backendData.pincode);
          const localResult = setPincode(detectedPin);
          const isServiceable = typeof backendData.isServiceable === 'boolean'
            ? backendData.isServiceable
            : localResult.isServiceable;

          setStatusResult({
            isServiceable,
            pincode: detectedPin,
            areaName: backendData.areaName || localResult.zone?.areaName,
            city: backendData.city || localResult.zone?.city,
            detectedAddress: backendData.formattedAddress || 'Current device location',
            message: isServiceable
              ? 'Pickup and delivery are available at your detected location.'
              : 'We do not service this location yet. We will notify you when coverage expands.',
          });
        } catch {
          setStatusResult({
            isServiceable: false,
            message: 'Location verification is temporarily unavailable. Please try again.',
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
            ? 'Location permission was blocked. Allow access in your browser and try again.'
            : 'Unable to retrieve your location. Please try again.',
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (!isOpen) {
      hasRequestedLocation.current = false;
      return;
    }
    if (!hasRequestedLocation.current) {
      hasRequestedLocation.current = true;
      handleDetectLocation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const locationName = [statusResult?.areaName, statusResult?.city].filter(Boolean).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-dialog-title"
        className="relative w-full max-w-sm space-y-5 rounded-3xl border border-indigo-100 bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          aria-label="Close location dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 pr-8">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-indigo-100 bg-[#F7F0F2] text-[#5B214F]">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 id="location-dialog-title" className="font-poppins text-base font-extrabold text-[#241A21]">Your location</h3>
            <p className="text-xs text-slate-500">Checking pickup coverage nearby</p>
          </div>
        </div>

        {isDetecting ? (
          <div className="rounded-2xl border border-indigo-100 bg-[#FCF9F7] px-5 py-10 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#5B214F]" />
            <p className="mt-4 text-sm font-extrabold text-[#241A21]">Finding your location…</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">Allow location access so we can show the nearest service coverage.</p>
          </div>
        ) : statusResult ? (
          <div className={`rounded-2xl border p-5 ${statusResult.isServiceable ? 'border-indigo-100 bg-[#F7F0F2]' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex items-start gap-3">
              {statusResult.isServiceable ? <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#5B214F]" /> : <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />}
              <div className="min-w-0">
                <p className={`text-sm font-black ${statusResult.isServiceable ? 'text-[#5B214F]' : 'text-amber-800'}`}>
                  {statusResult.isServiceable ? 'Service available here' : 'Service not available here'}
                </p>
                {locationName && <p className="mt-1 text-sm font-bold text-slate-700">{locationName}</p>}
                {statusResult.pincode && <p className="mt-1 text-xs font-black tracking-wider text-slate-500">PIN {statusResult.pincode}</p>}
                {statusResult.detectedAddress && <p className="mt-3 border-t border-black/10 pt-3 text-xs leading-5 text-slate-600">{statusResult.detectedAddress}</p>}
                <p className="mt-3 text-xs leading-5 text-slate-600">{statusResult.message}</p>
              </div>
            </div>
          </div>
        ) : null}

        {!isDetecting && (
          <button
            type="button"
            onClick={handleDetectLocation}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-[#F7F0F2] py-3 text-xs font-black text-[#5B214F] transition hover:bg-indigo-100 cursor-pointer"
          >
            <Navigation className="h-4 w-4" /> Detect again
          </button>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-xl bg-[#5B214F] hover:bg-[#48193F] py-3 text-xs font-black text-white shadow-md shadow-indigo-500/20 transition cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
