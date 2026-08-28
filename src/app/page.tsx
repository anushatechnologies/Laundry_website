'use client';

import React from 'react';
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

export default function HomePage() {
  return (
    <div className="laundry-home min-h-screen flex flex-col">
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
  );
}
