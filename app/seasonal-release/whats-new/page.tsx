import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isFeatureEnabled } from "@/app/lib/featureFlags";
import WhatsNewInFleetflow from "@/app/components/WhatsNewInFleetflow";

export const metadata: Metadata = {
  title: "What's New in Fleetflow | Seasonal Release",
  description:
    "Discover the latest features, stay on top of updates, and see what's coming next in Fleetflow.",
};

export default function WhatsNewPage() {
  if (!isFeatureEnabled("whats_new_landing_page")) {
    notFound();
  }

  return <WhatsNewInFleetflow />;
}
