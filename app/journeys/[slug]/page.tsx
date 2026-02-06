"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import { linkGlossaryTermsText } from "@/lib/glossary-linker";
import RelatedStories from "@/components/RelatedStories";
import {
  IconClock,
  IconCamel,
  IconHiking,
  IconSurfing,
  IconCooking,
  IconSpa,
  IconShopping,
  IconCamera,
  IconMeals,
  IconMountains,
  IconDesert,
  IconMedina,
  Icon4x4,
  IconStar,
} from "@/components/icons";
import ShareTools from "@/components/ShareTools";

// Map activity keywords to icons
const getActivityIcon = (activity: string) => {
  const lower = activity.toLowerCase();
  if (lower.includes("camel")) return <IconCamel size={20} />;
  if (lower.includes("hik") || lower.includes("trek")) return <IconHiking size={20} />;
  if (lower.includes("surf")) return <IconSurfing size={20} />;
  if (lower.includes("cook") || lower.includes("tagine")) return <IconCooking size={20} />;
  if (lower.includes("hammam") || lower.includes("spa")) return <IconSpa size={20} />;
  if (lower.includes("souk") || lower.includes("shop")) return <IconShopping size={20} />;
  if (lower.includes("photo")) return <IconCamera size={20} />;
  if (lower.includes("mountain") || lower.includes("atlas")) return <IconMountains size={20} />;
  if (lower.includes("desert") || lower.includes("dune") || lower.includes("sahara")) return <IconDesert size={20} />;
  if (lower.includes("medina") || lower.includes("old town")) return <IconMedina size={20} />;
  if (lower.includes("4x4") || lower.includes("off-road")) return <Icon4x4 size={20} />;
  // Default star for unmatched activities
  return <IconStar size={20} />;
};

const ItineraryMap = dynamic(() => import("@/components/ItineraryMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] md:h-[400px] bg-[#f5f0e8] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  ),
});

interface Journey {
  slug: string;
  title: string;
  duration: string;
  durationDays: number;
  description: string;
  arcDescription: string;
  heroImage: string;
  startCity: string;
  focus: string;
  destinations: string;
  journeyId: string;
  journeyType?: string;
  epicPrice?: number;
  price?: number;
}

interface ItineraryDay {
  dayNumber: number;
  cityName: string;
  fromCity: string;
  toCity: string;
  description: string;
  imageUrl: string;
  travelTime: string;
  difficulty: string;
  activities: string;
  meals: string;
  routeType: string;
}

// Journeys Carousel Component
function JourneysCarousel({ currentSlug }: { currentSlug: string }) {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => {
        // Filter out current journey
        const otherJourneys = (data.journeys || []).filter(
          (j: Journey) => j.slug !== currentSlug
        );
        setJourneys(otherJourneys);
      })
      .catch(console.error);
  }, [currentSlug]);

  const scroll = (direction: "left" | "right") => {
    const container = containerRef.current;
    if (!container) return;
    
    const cardWidth = 280 + 24; // card width + gap
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (containerRef.current) {
      setScrollPosition(containerRef.current.scrollLeft);
    }
  };

  if (journeys.length === 0) return null;

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef.current
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth - 10
    : true;

  return (
    <div className="relative">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center transition-opacity ${
          canScrollLeft ? "opacity-100 hover:bg-muted" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-12"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {journeys.map((journey) => (
          <Link
            key={journey.slug}
            href={`/journeys/${journey.slug}`}
            className="flex-shrink-0 w-[280px] group"
          >
            <div className="relative aspect-[4/5] mb-3 overflow-hidden bg-[#e8e0d4]">
              {journey.heroImage && (
                <Image
                  src={journey.heroImage}
                  alt={journey.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>
            <h3 className="font-serif text-lg mb-1">{journey.title}</h3>
            <div className="flex items-baseline justify-between">
              <p className="text-xs text-muted-foreground tracking-wide">
                {journey.durationDays} Days
              </p>
              {Number((journey as any).price) > 0 && (
                <p className="text-xs text-muted-foreground">
                  From €{Number((journey as any).price).toLocaleString()}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center transition-opacity ${
          canScrollRight ? "opacity-100 hover:bg-muted" : "opacity-0 pointer-events-none"
        }`}
        aria-label="Scroll right"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function JourneyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [journey, setJourney] = useState<Journey | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/journeys/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setJourney(data.journey);
          setItinerary(data.itinerary || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!journey) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="font-serif text-2xl mb-4">Journey not found</h1>
        <Link href="/journeys" className="text-sm underline">
          Back to all journeys
        </Link>
      </div>
    );
  }

  // EPIC Journey Layout - mysterious, no itinerary, enquiry form
  if (journey.journeyType === 'epic') {
    return (
      <div className="bg-[#1a1a1a] min-h-screen text-white">
        {/* Hero Image */}
        <section className="relative h-[70vh] md:h-[80vh]">
          {journey.heroImage ? (
            <Image
              src={journey.heroImage}
              alt={journey.title}
              fill
              className="object-cover opacity-70"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="container mx-auto max-w-4xl">
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">
                Epic Journey
              </p>
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-4">
                {journey.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
            {/* Back Link */}
            <Link
              href="/journeys"
              className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/40 hover:text-white transition-colors mb-16"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Journeys
            </Link>

            {/* The Promise */}
            <div className="mb-20">
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-display italic">
                {linkGlossaryTermsText(journey.description)}
              </p>
            </div>

            {/* The Story */}
            {journey.arcDescription && (
              <div className="mb-20">
                <p className="text-white/60 leading-relaxed text-lg whitespace-pre-line">
                  {linkGlossaryTermsText(journey.arcDescription)}
                </p>
              </div>
            )}

            {/* The Mystery */}
            <div className="border-t border-white/10 pt-16 mb-16">
              <h2 className="text-xs tracking-[0.3em] uppercase text-[#8B2635] mb-8">
                Sacred Knowledge
              </h2>
              <p className="text-white/60 leading-relaxed">
                This is not a tour. This is transmission — access to knowledge held by 
                a handful of people alive today. Knowledge that took lifetimes to acquire 
                and cannot be found in any book, on any website, or through any other operator.
              </p>
              <p className="text-white/60 leading-relaxed mt-4">
                We spent fifteen years earning the trust that makes these journeys possible — 
                not as visitors, but as people who stayed. We do not share itineraries publicly. 
                We do not reveal our sources. We protect what is rare because that is how it stays rare.
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-white/10 pt-16 mb-16">
              <div className="flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8 mb-6">
                <span className="font-serif text-4xl md:text-5xl text-white">
                  {journey.epicPrice ? `€${journey.epicPrice.toLocaleString()}` : 'Price on request'}
                </span>
                <span className="text-sm text-white/40">
                  Private journey for two guests
                </span>
              </div>
              <p className="text-white/40 text-sm">
                Additional guests considered on a case-by-case basis.
              </p>
            </div>

            {/* The Process */}
            <div className="border-t border-white/10 pt-16 mb-20">
              <h2 className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8">
                How This Works
              </h2>
              <div className="space-y-6 text-white/60 leading-relaxed">
                <p>
                  <strong className="text-white">1. You inquire.</strong> Tell us who you are, 
                  why this journey calls to you, and when you'd like to travel.
                </p>
                <p>
                  <strong className="text-white">2. We respond.</strong> If we believe this 
                  journey is right for you, we'll arrange a conversation.
                </p>
                <p>
                  <strong className="text-white">3. You commit.</strong> A non-refundable 
                  deposit of <span className="text-[#8B2635] font-medium">€1,000</span> secures 
                  your place and unlocks the full itinerary, logistics, and preparation details.
                </p>
                <p>
                  <strong className="text-white">4. We build.</strong> Your journey is crafted 
                  specifically for your dates, interests, and pace.
                </p>
              </div>
              <p className="text-white/40 text-sm mt-8 italic">
                The deposit is applied to your final balance. It is non-refundable because 
                the itinerary itself is the value — once shared, it cannot be unshared.
              </p>
            </div>

            {/* Request Form */}
            <div className="bg-white/5 p-8 md:p-12">
              <h2 className="font-serif text-2xl md:text-3xl mb-8">
                Request This Journey
              </h2>
              
              <form 
                action="/api/plan-your-trip" 
                method="POST"
                className="space-y-6"
              >
                <input type="hidden" name="journey" value={journey.title} />
                <input type="hidden" name="journeyType" value="epic" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                      Preferred Dates
                    </label>
                    <input
                      type="text"
                      name="dates"
                      placeholder="e.g., March 2025"
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                      Number of Guests
                    </label>
                    <input
                      type="number"
                      name="guests"
                      min="1"
                      max="8"
                      placeholder="2"
                      className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-[0.15em] uppercase text-white/40 mb-2">
                    Tell us about yourself
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="What draws you to this journey? Any relevant experience?"
                    className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 focus:border-white focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-white text-[#1a1a1a] px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white/90 transition-colors"
                  >
                    Request Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Regular Journey Layout
  return (
    <div className="bg-background min-h-screen">
      {/* Hero Image */}
      <section className="relative h-[60vh] md:h-[70vh] bg-[#e8e0d4]">
        {journey.heroImage && (
          <Image
            src={journey.heroImage}
            alt={journey.title}
            fill
            className="object-cover"
            priority
          />
        )}
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl">
          {/* Back Link & Share */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/journeys"
              className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Journeys
            </Link>
            <ShareTools 
              title={journey.title}
              description={journey.arcDescription || journey.description}
              imageUrl={journey.heroImage}
            />
          </div>

          {/* Duration & Price */}
          <div className="flex items-baseline gap-6 mb-4">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
              {journey.durationDays} Days
            </p>
            {Number(journey.price) > 0 && (
              <p className="text-sm text-muted-foreground">
                From <span className="text-foreground">€{Number(journey.price).toLocaleString()}</span> per person
              </p>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            {journey.title}
          </h1>

          {/* Arc Description */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 font-display italic">
            {journey.arcDescription || journey.description}
          </p>

          {/* Route Map */}
          {itinerary.length > 0 && (
            <div className="mb-16">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Your Route
              </p>
              <ItineraryMap itinerary={itinerary} />
            </div>
          )}

          {/* Itinerary */}
          <div className="space-y-20">
            {itinerary
              .sort((a, b) => a.dayNumber - b.dayNumber)
              .map((day) => (
                <div key={day.dayNumber}>
                  {/* Day Image - Vertical, left-aligned, wider */}
                  {day.imageUrl && (
                    <div className="relative aspect-[3/4] w-full max-w-lg overflow-hidden mb-8">
                      <Image
                        src={day.imageUrl}
                        alt={`Day ${day.dayNumber} - ${day.cityName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Day Label */}
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                    Day {day.dayNumber}
                  </p>

                  {/* Day Title */}
                  <h2 className="font-serif text-2xl md:text-3xl mb-4">
                    {day.fromCity && day.toCity && day.fromCity !== day.toCity 
                      ? `${day.fromCity} → ${day.toCity}`
                      : day.cityName
                    }
                  </h2>

                  {/* Day Metadata */}
                  <div className="flex flex-wrap gap-x-5 gap-y-2 mb-6 text-sm text-muted-foreground">
                    {/* Travel Time */}
                    {day.travelTime && (
                      <div className="flex items-center gap-2">
                        <IconClock size={20} />
                        <span>{day.travelTime}h drive</span>
                      </div>
                    )}
                    
                    {/* Activities */}
                    {day.activities && (
                      <div className="flex items-center gap-2">
                        {getActivityIcon(day.activities)}
                        <span>{day.activities.replace(/_/g, " ").toLowerCase()}</span>
                      </div>
                    )}
                    
                    {/* Meals */}
                    {day.meals && (
                      <div className="flex items-center gap-2">
                        <IconMeals size={20} />
                        <span>{day.meals}</span>
                      </div>
                    )}
                  </div>

                  {/* Day Description */}
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {linkGlossaryTermsText(day.description)}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Related Stories from this Route */}
      {journey.destinations && (
        <RelatedStories 
          destinations={journey.destinations} 
          focus={journey.focus} 
          limit={4} 
        />
      )}

      {/* More Journeys Carousel */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="container mx-auto px-6 lg:px-16">
          <JourneysCarousel currentSlug={slug} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-sand">
        <div className="container mx-auto px-6 lg:px-16 max-w-2xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            This journey is a starting point.
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10">
            These itineraries aren't fixed. They're designed to bend. Add a day in the desert. Skip the city. Stay longer where something pulls you. This is your journey—we shape it around what matters to you.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-block bg-foreground text-background px-10 py-4 text-xs tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
          >
            Start The Conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
