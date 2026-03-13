"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import LoginModal from "@/components/auth/LoginModal";
import OnboardingModal from "@/components/auth/OnboardingModal";

export default function LandingPage() {
  useScrollReveal();
  const searchParams = useSearchParams();
  const router = useRouter();

  const modalParam = searchParams.get("modal");
  const [loginOpen, setLoginOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  useEffect(() => {
    if (modalParam === "login") {
      setLoginOpen(true);
      setOnboardingOpen(false);
    } else if (modalParam === "onboarding") {
      setOnboardingOpen(true);
      setLoginOpen(false);
    }
  }, [modalParam]);

  const openLogin = useCallback(() => {
    setLoginOpen(true);
    setOnboardingOpen(false);
  }, []);

  const closeLogin = useCallback(() => {
    setLoginOpen(false);
    if (modalParam) router.replace("/", { scroll: false });
  }, [modalParam, router]);

  return (
    <div className="relative min-h-screen z-10 font-sans">
      <BackgroundCanvas />
      <Navbar onLoginClick={openLogin} />
      <HeroSection />
      <TransformSection />
      <FeatureCards />
      <ProductMock />
      <WhyDifferent />
      <CollaborationSection />
      <FinalCTA />
      <Footer />

      <LoginModal open={loginOpen} onClose={closeLogin} />
      <OnboardingModal open={onboardingOpen} />
    </div>
  );
}
