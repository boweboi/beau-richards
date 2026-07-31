import Hero from "@/components/Hero";
import TradesCarousel from "@/components/TradesCarousel";
import TrustStrip, { type TrustStripStats } from "@/components/TrustStrip";
import HowItWorks from "@/components/HowItWorks";
import ToolkitFundThermometer from "@/components/ToolkitFundThermometer";
import EnvironmentalFundCard from "@/components/EnvironmentalFundCard";
import { createClient } from "@/lib/supabase/server";
import type { ToolkitDonation } from "@/lib/toolkitFund";

// Without this, the fetched site_stats row can get baked into a cached
// render at build/deploy time (or cached via Next's fetch Data Cache,
// which Supabase's HTTP client goes through same as any other fetch) —
// admin saves would then never show up until the next deploy.
export const dynamic = "force-dynamic";

const FALLBACK_STATS: TrustStripStats = {
  verified_tradies: 0,
  jobs_completed: 0,
};

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_stats")
    .select(
      "verified_tradies, jobs_completed, toolkit_fund_amount, toolkit_donations, environmental_fund_amount"
    )
    .eq("id", 1)
    .single();

  const stats = data ?? FALLBACK_STATS;
  const toolkitFundAmount = Number(data?.toolkit_fund_amount ?? 0);
  const toolkitDonations: ToolkitDonation[] = Array.isArray(data?.toolkit_donations)
    ? data.toolkit_donations
    : [];
  const environmentalFundAmount = Number(data?.environmental_fund_amount ?? 0);

  return (
    <main className="flex-1">
      <Hero />
      <TradesCarousel />
      <TrustStrip stats={stats} />
      <HowItWorks />
      <ToolkitFundThermometer amount={toolkitFundAmount} donations={toolkitDonations} />
      <EnvironmentalFundCard amount={environmentalFundAmount} />
    </main>
  );
}
