'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { SchedulePickupForm } from '@/components/home/SchedulePickupForm';
import { HowItWorks } from '@/components/home/HowItWorks';
import { MostLovedServices } from '@/components/home/MostLovedServices';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { PricingOverview } from '@/components/home/PricingOverview';
import { SubscriptionCards } from '@/components/home/SubscriptionCards';
import { OrderTrackerBanner } from '@/components/home/OrderTrackerBanner';
import { TestimonialsAndApp } from '@/components/home/TestimonialsAndApp';
import { CtaBanner } from '@/components/home/CtaBanner';
import { SplashScreen } from '@/components/common/SplashScreen';

export default function HomePage() {
  const [splashFinished, setSplashFinished] = useState(false);

  return (
    <div className="laundry-home min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Animated Opening Splash Curtain */}
      <SplashScreen onComplete={() => setSplashFinished(true)} />

      {/* Main App Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-700 ${
          splashFinished ? 'opacity-100 scale-100 filter-none' : 'opacity-95 scale-[0.99]'
        }`}
      >
        <Navbar />
        <main className="flex-1 space-y-0">
          <Hero />
          <SchedulePickupForm />
          <HowItWorks />
          <MostLovedServices />
          <WhyChooseUs />
          <PricingOverview />
          <SubscriptionCards />
          <OrderTrackerBanner />
          <TestimonialsAndApp />
          <CtaBanner />
        </main>
        <Footer />
      </div>
    </div>
  );
}
