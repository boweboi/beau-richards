import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import TrustStrip from "@/components/TrustStrip";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
