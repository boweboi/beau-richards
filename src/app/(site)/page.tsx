import Hero from "@/components/Hero";
import TradesCarousel from "@/components/TradesCarousel";
import TrustStrip from "@/components/TrustStrip";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <TradesCarousel />
      <TrustStrip />
      <HowItWorks />
    </main>
  );
}
