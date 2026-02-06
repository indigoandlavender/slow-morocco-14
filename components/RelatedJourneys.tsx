"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface RelatedJourney {
  slug: string;
  title: string;
  heroImage?: string;
  duration?: number;
  price?: number;
  score: number;
}

interface RelatedJourneysProps {
  region: string;
  tags?: string;
  category?: string;
  limit?: number;
}

export default function RelatedJourneys({ region, tags, category, limit = 3 }: RelatedJourneysProps) {
  const [journeys, setJourneys] = useState<RelatedJourney[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!region && !tags) {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({
      ...(region && { region }),
      ...(tags && { tags }),
      ...(category && { category }),
      limit: limit.toString(),
    });

    fetch(`/api/related-journeys?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setJourneys(data.journeys || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading related journeys:", err);
        setLoading(false);
      });
  }, [region, tags, category, limit]);

  if (loading) {
    return null;
  }

  if (journeys.length === 0) {
    return null;
  }

  // Format price
  const formatPrice = (price: number) => {
    if (!price || price === 0) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="py-16 md:py-20 bg-sand">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-3">
            Continue the Journey
          </p>
          <h2 className="font-serif text-2xl md:text-3xl">
            Travel through this region
          </h2>
        </div>

        {/* Journeys Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {journeys.map((journey) => (
            <Link
              key={journey.slug}
              href={`/journeys/${journey.slug}`}
              className="group"
            >
              <article>
                <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-foreground/5">
                  {journey.heroImage ? (
                    <Image
                      src={journey.heroImage}
                      alt={journey.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-foreground/10" />
                  )}
                </div>
                <div className="flex items-baseline justify-between mb-2">
                  {journey.duration && journey.duration > 0 && (
                    <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/40">
                      {journey.duration} Days
                    </p>
                  )}
                  {journey.price && journey.price > 0 && (
                    <p className="text-xs text-foreground/40">
                      From <span className="text-foreground/70">{formatPrice(journey.price)}</span>
                    </p>
                  )}
                </div>
                <h3 className="font-serif text-lg leading-tight group-hover:text-foreground/70 transition-colors">
                  {journey.title}
                </h3>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/journeys"
            className="inline-block text-xs tracking-[0.15em] uppercase border border-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-colors"
          >
            View All Journeys
          </Link>
        </div>
      </div>
    </section>
  );
}
