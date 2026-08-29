'use client';

import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  MapPin, Navigation, Phone, Clock, Zap, CheckCircle2,
  Search, Truck, Star, Building2, AlertCircle, ArrowRight,
  RefreshCw, Package, Shield
} from 'lucide-react';
import Link from 'next/link';
import { getNearestHubs, getBackendHubs, calculateDeliveryFare } from '@/lib/api';

interface HubWithDistance {
  id: string; name: string; code: string; city: string; state: string;
  address: string; latitude: number; longitude: number; contactPhone: string;
  capacityKgPerDay: number; operatingHours: string; maxServiceRadiusKm: number;
  baseDistanceKm: number; baseDeliveryFare: number; perKmFare: number;
  freeDeliveryAbove: number; pincodes: string[]; isActive: boolean;
  distanceKm?: number; estimatedDeliveryFee?: number; isFreeDelivery?: boolean;
  withinRadius?: boolean; isServicingPincode?: boolean; isRecommended?: boolean;
}

const FALLBACK_HUBS: HubWithDistance[] = [
  { id: 'hub-hyd-madhapur', name: 'Hyderabad Cyber Hub & Processing Plant', code: 'HUB-HYD-01',
    city: 'Hyderabad', state: 'Telangana', address: 'Survey 64, Hitech City Main Road, Madhapur, Hyderabad - 500081',
    latitude: 17.4483, longitude: 78.3915, contactPhone: '+91 40 4567 8900',
    capacityKgPerDay: 1200, operatingHours: '06:00 AM - 11:00 PM',
    maxServiceRadiusKm: 40, baseDistanceKm: 3, baseDeliveryFare: 40, perKmFare: 12, freeDeliveryAbove: 499,
    pincodes: ['500081','500032','500084','500072','500085','500033','500034','500089','500075','500049','500050'],
    isActive: true, isRecommended: true },
  { id: 'hub-rjy-central', name: 'Rajahmundry Central Processing Hub', code: 'HUB-RJY-01',
    city: 'Rajahmundry', state: 'Andhra Pradesh', address: 'Plot 18, Industrial Estate, Danavaipeta Main Road, Rajahmundry',
    latitude: 17.0005, longitude: 81.804, contactPhone: '+91 883 245 0000',
    capacityKgPerDay: 800, operatingHours: '06:00 AM - 10:00 PM',
    maxServiceRadiusKm: 35, baseDistanceKm: 3, baseDeliveryFare: 30, perKmFare: 10, freeDeliveryAbove: 399,
    pincodes: ['533101','533102','533103','533104','533105','533106'], isActive: true },
];

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2-lat1)*Math.PI)/180;
  const dLon = ((lon2-lon1)*Math.PI)/180;
  const a = Math.sin(dLat/2)**2 + Math.cos((lat1*Math.PI)/180)*Math.cos((lat2*Math.PI)/180)*Math.sin(dLon/2)**2;
  return Math.round(R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*10)/10;
}

function distanceBadge(km?: number) {
  if (km === undefined) return 'bg-slate-800 text-slate-400';
  if (km <= 5) return 'bg-emerald-900/60 text-emerald-400';
  if (km <= 15) return 'bg-blue-900/60 text-blue-400';
  if (km <= 30) return 'bg-amber-900/60 text-amber-400';
  return 'bg-rose-900/60 text-rose-400';
}

export default function StoresPage() {
  const [hubs, setHubs] = useState<HubWithDistance[]>(FALLBACK_HUBS);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [userPincode, setUserPincode] = useState('');
  const [pincodeInput, setPincodeInput] = useState('');
  const [gpsError, setGpsError] = useState('');
  const [selectedHub, setSelectedHub] = useState<string | null>(null);
  const [fareResult, setFareResult] = useState<any>(null);
  const [fareLoading, setFareLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const loadHubs = useCallback(async (lat?: number, lng?: number, pincode?: string) => {
    setLoading(true);
    try {
      const result = await getNearestHubs({ lat, lng, pincode, limit: 10 });
      if (result && result.length > 0) {
        setHubs(result as HubWithDistance[]);
      } else {
        const base = (await getBackendHubs() || FALLBACK_HUBS) as HubWithDistance[];
        const enriched = base.map(h => ({
          ...h,
          distanceKm: lat && lng ? haversineKm(lat, lng, h.latitude, h.longitude) : undefined,
          isRecommended: pincode ? h.pincodes.includes(pincode) : false,
          estimatedDeliveryFee: h.baseDeliveryFare,
        }));
        enriched.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
        setHubs(enriched);
      }
    } catch {
      setHubs(FALLBACK_HUBS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadHubs(); }, [loadHubs]);

  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) { setGpsError('GPS not supported.'); return; }
    setGpsLoading(true); setGpsError('');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setUserLat(lat); setUserLng(lng);
      setLocationName(lat.toFixed(4) + ', ' + lng.toFixed(4));
      try {
        const geo = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng).then(r => r.json());
        const area = geo?.address?.suburb || geo?.address?.neighbourhood || geo?.address?.city || '';
        const pc = geo?.address?.postcode || '';
        if (area) setLocationName(area + (pc ? ' - ' + pc : ''));
        if (pc && /^\d{6}$/.test(pc)) setUserPincode(pc);
      } catch { /* ignore */ }
      await loadHubs(lat, lng);
      setGpsLoading(false);
    }, (err) => {
      setGpsError(err.code === 1 ? 'Location access denied. Enter pincode instead.' : 'Could not detect location.');
      setGpsLoading(false);
    }, { timeout: 10000 });
  }, [loadHubs]);

  const searchByPincode = useCallback(async () => {
    const pin = pincodeInput.trim();
    if (!/^\d{6}$/.test(pin)) return;
    setUserPincode(pin);
    setLocationName('Pincode ' + pin);
    await loadHubs(undefined, undefined, pin);
  }, [pincodeInput, loadHubs]);

  const calcFare = useCallback(async (hub: HubWithDistance) => {
    setSelectedHub(hub.id); setFareLoading(true); setFareResult(null);
    try {
      const r = await calculateDeliveryFare({
        customerLat: userLat ?? undefined,
        customerLng: userLng ?? undefined,
        customerPincode: userPincode || undefined,
        orderTotal: 499,
      });
      setFareResult(r);
    } catch { setFareResult(null); } finally { setFareLoading(false); }
  }, [userLat, userLng, userPincode]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{background:'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)'}}>
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-10 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
          style={{background:'rgba(214,179,106,0.15)',color:'#D6B36A',border:'1px solid rgba(214,179,106,0.3)'}}>
          <Building2 className="w-3.5 h-3.5" /> Multi-Vendor Laundry Network
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
          Find Your <span style={{color:'#D6B36A'}}>Nearest Store</span>
        </h1>
        <p className="text-white/60 text-lg max-w-xl mx-auto">
          Multiple processing hubs across the city. Auto-assigned to the nearest for fastest turnaround.
        </p>
      </section>

      {/* Location Detect */}
      <section className="px-4 pb-8 max-w-3xl mx-auto w-full">
        <div className="rounded-2xl p-5 border" style={{background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.1)',backdropFilter:'blur(20px)'}}>
          <p className="text-white/60 text-xs font-semibold mb-3">📍 Detect your location for accurate distances and delivery fees</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={detectGPS}
              disabled={gpsLoading}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all"
              style={{background: gpsLoading ? 'rgba(214,179,106,0.3)' : 'linear-gradient(135deg,#D6B36A,#c49a4a)', color:'#1a1a2e'}}>
              {gpsLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              {gpsLoading ? 'Detecting...' : 'Use GPS Location'}
            </button>
            <div className="flex-1 flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter Pincode (e.g. 500081)"
                value={pincodeInput}
                onChange={e => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={e => e.key === 'Enter' && searchByPincode()}
                className="flex-1 px-4 py-3 rounded-xl text-sm font-medium outline-none"
                style={{background:'rgba(255,255,255,0.1)',color:'white',border:'1px solid rgba(255,255,255,0.2)'}}
              />
              <button
                onClick={searchByPincode}
                disabled={pincodeInput.length < 6}
                className="px-4 py-3 rounded-xl text-sm font-bold"
                style={{background: pincodeInput.length === 6 ? '#5B214F' : 'rgba(91,33,79,0.3)', color:'white'}}>
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          {gpsError && (
            <div className="mt-2 flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle className="w-3.5 h-3.5" />{gpsError}
            </div>
          )}
          {locationName && (
            <div className="mt-2 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />Results for: {locationName}
            </div>
          )}
        </div>
      </section>

      {/* Map embed when GPS detected */}
      {userLat && userLng && (
        <section className="px-4 pb-8 max-w-3xl mx-auto w-full">
          <div className="rounded-2xl overflow-hidden border" style={{borderColor:'rgba(255,255,255,0.15)'}}>
            <div className="px-4 py-2 flex items-center gap-2" style={{background:'rgba(255,255,255,0.05)'}}>
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-white/60 text-xs font-semibold">Your Location on Map</span>
            </div>
            <iframe
              title="map"
              width="100%"
              height="200"
              src={'https://www.openstreetmap.org/export/embed.html?bbox=' + (userLng - 0.05) + ',' + (userLat - 0.05) + ',' + (userLng + 0.05) + ',' + (userLat + 0.05) + '&layer=mapnik&marker=' + userLat + ',' + userLng}
              style={{border:'none'}}
            />
          </div>
        </section>
      )}

      {/* Hub Cards */}
      <section className="px-4 pb-16 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">
            {loading ? 'Finding hubs...' : hubs.length + ' Service Hub' + (hubs.length !== 1 ? 's' : '')}
          </h2>
          <button
            onClick={() => loadHubs(userLat ?? undefined, userLng ?? undefined, userPincode || undefined)}
            className="text-white/40 hover:text-white/70 text-xs flex items-center gap-1 transition">
            <RefreshCw className="w-3 h-3" />Refresh
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="rounded-2xl h-44 animate-pulse" style={{background:'rgba(255,255,255,0.05)'}} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {hubs.map((hub, idx) => {
              const isExp = selectedHub === hub.id;
              return (
                <div
                  key={hub.id}
                  className="rounded-2xl border overflow-hidden transition-all"
                  style={{
                    background:'rgba(255,255,255,0.05)',
                    borderColor: hub.isRecommended ? 'rgba(214,179,106,0.4)' : 'rgba(255,255,255,0.1)',
                  }}>

                  {hub.isRecommended && (
                    <div className="px-5 py-1.5 text-xs font-bold flex items-center gap-1.5"
                      style={{background:'rgba(214,179,106,0.12)',color:'#D6B36A'}}>
                      <Star className="w-3 h-3 fill-current" />Recommended for your location
                    </div>
                  )}
                  {idx === 0 && !hub.isRecommended && (
                    <div className="px-5 py-1.5 text-xs font-bold flex items-center gap-1.5"
                      style={{background:'rgba(94,234,212,0.08)',color:'#5eead4'}}>
                      <CheckCircle2 className="w-3 h-3" />Nearest Hub
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <h3 className="text-white font-bold text-base">{hub.name}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{background:'rgba(91,33,79,0.3)',color:'#c084fc'}}>
                            {hub.code}
                          </span>
                        </div>
                        <p className="text-white/40 text-xs">{hub.address}</p>
                      </div>
                      {hub.distanceKm !== undefined && (
                        <span className={'shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold ' + distanceBadge(hub.distanceKm)}>
                          📍 {hub.distanceKm} km
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{hub.operatingHours}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Package className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{hub.capacityKgPerDay} kg/day</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        {hub.estimatedDeliveryFee !== undefined
                          ? hub.estimatedDeliveryFee === 0
                            ? <span className="text-emerald-400 font-bold text-xs">Free Delivery!</span>
                            : <span className="text-white/50 text-xs">Est. Rs.{hub.estimatedDeliveryFee}</span>
                          : <span className="text-white/50 text-xs">Rs.{hub.baseDeliveryFare} base</span>}
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50 text-xs">
                        <Shield className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{hub.maxServiceRadiusKm} km radius</span>
                      </div>
                    </div>

                    {/* Fare Result Panel */}
                    {isExp && (
                      <div className="mt-4 rounded-xl p-4" style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)'}}>
                        {fareLoading ? (
                          <div className="flex items-center gap-2 text-white/40 text-sm">
                            <RefreshCw className="w-4 h-4 animate-spin" />Calculating...
                          </div>
                        ) : fareResult ? (
                          <div className="space-y-2">
                            <p className="text-white/60 text-xs font-bold mb-2">📊 Live Fare Estimate</p>
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div><span className="text-white/30">Hub</span><p className="text-white font-semibold">{fareResult.assignedHub?.name || hub.name}</p></div>
                              <div><span className="text-white/30">Distance</span><p className="text-white font-semibold">{fareResult.distanceKm} km</p></div>
                              <div><span className="text-white/30">Delivery Fee</span><p className={'font-bold ' + (fareResult.isFreeDelivery ? 'text-emerald-400' : 'text-white')}>{fareResult.isFreeDelivery ? 'FREE' : 'Rs.' + fareResult.deliveryFee}</p></div>
                              <div><span className="text-white/30">Turnaround</span><p className="text-white font-semibold">{fareResult.estimatedTurnaroundHours}h</p></div>
                            </div>
                            <p className="text-white/30 text-xs mt-1">{fareResult.calculationNote}</p>
                          </div>
                        ) : (
                          <p className="text-white/30 text-xs">Share your location or pincode above for fare estimate.</p>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Link
                        href="/book"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold min-w-[100px]"
                        style={{background:'linear-gradient(135deg,#5B214F,#7c3a6e)',color:'white'}}>
                        Book Now <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => isExp ? setSelectedHub(null) : calcFare(hub)}
                        className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold"
                        style={{background:'rgba(255,255,255,0.08)',color:'white'}}>
                        <Zap className="w-4 h-4 text-amber-400" />{isExp ? 'Hide' : 'Fare'}
                      </button>
                      <a href={'tel:' + hub.contactPhone}
                        className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold"
                        style={{background:'rgba(255,255,255,0.08)',color:'white'}}>
                        <Phone className="w-4 h-4 text-emerald-400" />Call
                      </a>
                      <a
                        href={'https://www.openstreetmap.org/?mlat=' + hub.latitude + '&mlon=' + hub.longitude + '#map=16/' + hub.latitude + '/' + hub.longitude}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold"
                        style={{background:'rgba(255,255,255,0.08)',color:'white'}}>
                        <MapPin className="w-4 h-4 text-rose-400" />Map
                      </a>
                    </div>

                    {/* Coverage Pincodes */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {hub.pincodes.slice(0, 8).map(pin => (
                        <span key={pin}
                          className="text-xs px-2 py-0.5 rounded-lg font-mono"
                          style={{
                            background: userPincode === pin ? 'rgba(214,179,106,0.25)' : 'rgba(255,255,255,0.06)',
                            color: userPincode === pin ? '#D6B36A' : 'rgba(255,255,255,0.35)',
                            border: userPincode === pin ? '1px solid rgba(214,179,106,0.3)' : '1px solid transparent',
                          }}>
                          {pin}
                        </span>
                      ))}
                      {hub.pincodes.length > 8 && (
                        <span className="text-xs px-2 py-0.5 rounded-lg" style={{color:'rgba(255,255,255,0.25)'}}>
                          +{hub.pincodes.length - 8} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="px-4 pb-20 max-w-3xl mx-auto w-full">
        <div className="rounded-2xl p-5 border" style={{background:'rgba(255,255,255,0.04)',borderColor:'rgba(255,255,255,0.07)'}}>
          <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />How Our Multi-Hub System Works
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              {icon:<Navigation className="w-5 h-5"/>, t:'GPS Detection', d:'We detect your location to find your nearest hub instantly.'},
              {icon:<Truck className="w-5 h-5"/>, t:'Auto Hub Assignment', d:'Pickup and delivery handled by nearest hub for speed.'},
              {icon:<Zap className="w-5 h-5"/>, t:'Distance-Based Fare', d:'Fee calculated from actual GPS distance — no surprises.'},
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-amber-400"
                  style={{background:'rgba(214,179,106,0.12)'}}>
                  {item.icon}
                </div>
                <p className="text-white font-semibold text-xs mb-1">{item.t}</p>
                <p className="text-white/35 text-xs">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
