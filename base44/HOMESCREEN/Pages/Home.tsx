import React, { useEffect } from "react";
import HeroSection from "../components/hero/HeroSection";
import AboutSection from "../components/about/AboutSection";
import BloodDonationInfo from "../components/info/BloodDonationInfo";
import PlasmaTherapySection from "../components/info/PlasmaTherapySection";
import FAQSection from "../components/faq/FAQSection";
import Footer from "../components/footer/Footer";

export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full">
      <HeroSection />
      <AboutSection />
      <BloodDonationInfo />
      <PlasmaTherapySection />
      <FAQSection />
      <Footer />
    </div>
  );
}