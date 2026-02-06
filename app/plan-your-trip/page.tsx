"use client";

import { useState, useEffect } from "react";
import PlanYourTripForm from "@/components/PlanYourTripForm";
import PageBanner from "@/components/PageBanner";

interface Journey {
  slug: string;
  title: string;
}

export default function PlanYourTripPage() {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch journeys for dropdown
    fetch("/api/journeys")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJourneys(data.journeys || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Immersive Hero Banner */}
      <PageBanner
        slug="plan-your-trip"
        fallback={{
          title: "Plan your journey",
          subtitle: "No obligation, no sales pitch—just a conversation about what you're hoping to find. Every journey begins with a question.",
          label: "Begin the Conversation",
        }}
      />

      {/* Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-2xl">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
            </div>
          ) : (
            <PlanYourTripForm 
              journeys={journeys}
              siteId="slow-morocco"
              darkMode={false}
            />
          )}
        </div>
      </section>
    </div>
  );
}
