import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Your Trip",
  description: "Start planning your private Morocco journey. Tell us your dates, interests, and travel style — we'll craft an itinerary around what matters to you.",
  openGraph: {
    title: "Plan Your Trip | Slow Morocco",
    description: "Start planning your private Morocco journey. Tell us your dates, interests, and travel style.",
    url: "https://slowmorocco.com/plan-your-trip",
  },
  alternates: {
    canonical: "https://slowmorocco.com/plan-your-trip",
  },
};

export default function PlanYourTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
