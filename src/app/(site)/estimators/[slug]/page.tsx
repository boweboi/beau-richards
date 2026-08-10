import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ESTIMATORS } from "@/lib/estimators";
import EstimatorForm from "./EstimatorForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = ESTIMATORS[slug];

  if (!config) {
    return { title: "Cost Estimator | TradieMatch" };
  }

  return {
    title: `${config.name} Cost Estimator | TradieMatch`,
    description: `${config.description} Get a ballpark NZ price range before you post a job on TradieMatch.`,
  };
}

export default async function EstimatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = ESTIMATORS[slug];

  if (!config) {
    notFound();
  }

  return <EstimatorForm slug={slug} />;
}
