import { LandingNavbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SocialSection } from "@/components/landing/SocialSection";
import { DashboardPreviewSection } from "@/components/landing/DashboardPreview";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cash Manager",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <SocialSection />
      <DashboardPreviewSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
