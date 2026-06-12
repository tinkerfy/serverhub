import type { Metadata } from "next";
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import DashboardPreview from './components/DashboardPreview';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: "Home - Premium Used Server Equipment | ServerHub",
  description: "Discover certified pre-owned enterprise server equipment. Dell, HP, Lenovo servers, storage, and networking gear with 2-year warranty. Save up to 70% on quality refurbished hardware.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <Pricing />
      <Footer />
    </main>
  );
}
