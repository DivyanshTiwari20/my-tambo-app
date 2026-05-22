"use client";

import Header from '@/components/Header';
import HeroSandbox from '@/components/HeroSandbox';
import ComparisonSection from '@/components/ComparisonSection';
import HowItWorks from '@/components/HowItWorks';
import FAQs from '@/components/faqs';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-gray-950 overflow-x-hidden antialiased font-sans select-none">

      {/* HEADER SECTION */}
      <Header />

      {/* HERO SECTION */}
      <HeroSandbox />

      {/* SECTION 2 — Traditional Analytics vs Tambo */}
      <HowItWorks />
      <ComparisonSection />

      {/* SECTION 3 — How It Works */}

      {/* FAQs */}
      <FAQs />

      {/* FINAL CTA */}
      <FinalCTA />

      {/* FOOTER SECTION */}
      <Footer />

    </div>
  );
}
