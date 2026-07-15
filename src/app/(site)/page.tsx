import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import HowItWorks from "@/components/HowItWorks";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <TrustStrip />
      <HowItWorks />
    </main>
  );
}
