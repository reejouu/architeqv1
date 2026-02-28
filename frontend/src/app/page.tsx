"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import BackgroundCanvas from "@/components/landing/BackgroundCanvas";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TransformSection from "@/components/landing/TransformSection";
import FeatureCards from "@/components/landing/FeatureCards";
import ProductMock from "@/components/landing/ProductMock";
import WhyDifferent from "@/components/landing/WhyDifferent";
import CollaborationSection from "@/components/landing/CollaborationSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  useScrollReveal();

  return (
    <div className="relative min-h-screen z-10 font-sans">
      <BackgroundCanvas />
      <Navbar />
      <HeroSection />
      <TransformSection />
      <FeatureCards />
      <ProductMock />
      <WhyDifferent />
      <CollaborationSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
