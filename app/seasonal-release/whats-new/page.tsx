import { isFeatureEnabled, FeatureFlags } from "@/app/lib/featureFlags";
import { notFound } from "next/navigation";
import WhatsNewPage from "@/app/components/WhatsNew/WhatsNewPage";

export const metadata = {
  title: "What's New in Fleetflow",
  description:
    "Discover the latest features, stay on top of updates, and see what's coming next.",
};

export default function WhatsNewInFleetflowPage() {
  if (!isFeatureEnabled(FeatureFlags.WHATS_NEW_LANDING_PAGE)) {
    notFound();
  }

  return <WhatsNewPage />;
}
