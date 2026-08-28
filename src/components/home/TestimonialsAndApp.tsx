'use client';

import React from 'react';
import { Star, Smartphone, Check, Download, Sparkles, Quote } from 'lucide-react';

export const TestimonialsAndApp: React.FC = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      city: 'Jubilee Hills, Hyd',
      quote:
        'Booking a pickup takes less than a minute. My silk sarees and work shirts came back perfectly clean, fragrant, and meticulously folded.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Rohit Kulkarni',
      city: 'Gachibowli, Hyd',
      quote:
        'Outstanding experience. The quality of Italian steam pressing and suit dry cleaning is top-tier. Rider arrived right on time.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    {
      name: 'Anjali Menon',
      city: 'Madhapur, Hyd',
      quote:
        'The monthly pass is a game-changer for working families. We save hours every week, and the ozone sanitization gives complete peace of mind.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
  ];

  return (
    <section className="py-18 sm:py-24 bg-[#FCF9F7] border-t border-[#E8DDE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Mobile App Feature */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-7 sm:p-9 border border-[#E8DDE1] shadow-[0_16px_48px_rgba(43,19,38,0.08)] space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F]">
                <Smartphone className="w-3.5 h-3.5 text-[#D6B36A]" />
                <span>MOBILE ATELIER APP</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#2B1326] font-poppins leading-tight">
                Luxury Fabric Care at Your Fingertips.
              </h2>
            </div>

            <div className="space-y-2.5 text-xs font-bold text-[#2B1326]">
              {[
                'Book Pickup in Under 30 Seconds',
                'Live Rider GPS & Atelier Status Updates',
                'Detailed Garment Breakdown & Photo Invoicing',
                'Instant Razorpay / UPI / Card Payments',
                'Dedicated Concierge Support on WhatsApp',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-[#5B214F] text-white flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-xs">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#EEE5E8] space-y-3">
              <div className="text-xs font-black text-[#2B1326]">Download the LaundryFresh App</div>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#"
                  className="px-4 py-2.5 bg-[#2B1326] hover:bg-[#5B214F] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
                >
                  <Download className="w-4 h-4 text-[#D6B36A]" />
                  <div className="text-left">
                    <div className="text-[9px] text-[#CDBFC6] font-normal">GET IT ON</div>
                    <div className="text-xs font-extrabold">Google Play</div>
                  </div>
                </a>

                <a
                  href="#"
                  className="px-4 py-2.5 bg-[#2B1326] hover:bg-[#5B214F] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all border border-white/10"
                >
                  <Download className="w-4 h-4 text-[#D6B36A]" />
                  <div className="text-left">
                    <div className="text-[9px] text-[#CDBFC6] font-normal">DOWNLOAD ON THE</div>
                    <div className="text-xs font-extrabold">App Store</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Testimonials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F0F2] border border-[#E8DDE1] text-[10px] font-extrabold uppercase tracking-widest text-[#5B214F]">
                <Sparkles className="w-3 h-3 text-[#D6B36A]" />
                <span>CUSTOMER STORIES</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#2B1326] font-poppins tracking-tight">
                Trusted by Over 15,000+ Homes
              </h2>
            </div>

            {/* 3 Customer Testimonials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-3xl p-5 border border-[#E8DDE1] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(43,19,38,0.08)] hover:-translate-y-1 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden relative shrink-0 border border-[#E8DDE1]">
                        <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-[#2B1326]">{t.name}</div>
                        <div className="text-[10px] text-[#6F626A] font-medium">{t.city}</div>
                      </div>
                    </div>

                    <p className="text-xs text-[#6F626A] leading-relaxed italic font-medium">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-[#D6B36A] text-xs pt-2 border-t border-[#EEE5E8]">
                    <Star className="w-3.5 h-3.5 fill-[#D6B36A]" />
                    <Star className="w-3.5 h-3.5 fill-[#D6B36A]" />
                    <Star className="w-3.5 h-3.5 fill-[#D6B36A]" />
                    <Star className="w-3.5 h-3.5 fill-[#D6B36A]" />
                    <Star className="w-3.5 h-3.5 fill-[#D6B36A]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
