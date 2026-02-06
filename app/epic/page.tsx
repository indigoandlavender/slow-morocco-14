"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ChevronDown } from "lucide-react";

interface EpicJourney {
  slug: string;
  title: string;
  description: string;
  arcDescription: string;
  heroImage: string;
  focus: string;
  epicPrice?: number;
}

export default function EpicPage() {
  const [journeys, setJourneys] = useState<EpicJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeJourney, setActiveJourney] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => {
        const epic = (data.journeys || []).filter(
          (j: any) => j.journeyType === "epic"
        );
        setJourneys(epic);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const scrollToJourneys = () => {
    document.getElementById("epic-journeys")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white">
      {/* Hero - Full Screen */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background video placeholder - can be replaced with actual video */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-[#1a1a1a]">
          {/* Animated grain overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-8">
            Slow Morocco Presents
          </p>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-[0.2em] font-light mb-8">
            E P I C
          </h1>
          
          <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mx-auto mb-12">
            Journeys that cannot be copied. Built over twenty years. 
            Shared only with those ready to receive them.
          </p>

          <button
            onClick={scrollToJourneys}
            className="inline-flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors"
          >
            <span className="text-xs tracking-[0.2em] uppercase">Discover</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-[#8B2635]" />
      </section>

      {/* The Philosophy */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-16 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[#8B2635] mb-6">
                Sacred & Rare
              </p>
              <h2 className="font-serif text-3xl md:text-4xl leading-tight">
                This is not tourism. This is transmission.
              </h2>
            </div>
            <div className="space-y-6 text-white/60 leading-relaxed">
              <p>
                These journeys grant access to knowledge held by a handful of people 
                alive today. A Saharan wayfarer who navigates by stars. A maâlem 
                who carries 400 years of spiritual lineage. A tracker who reads 
                sand like scripture.
              </p>
              <p>
                We spent fifteen years in Morocco earning the trust that makes this 
                possible — not as visitors, but as people who stayed. We do not publish 
                itineraries. We do not reveal our sources. We protect what is rare 
                because that is how it stays rare.
              </p>
              <p>
                A non-refundable deposit of <span className="text-[#8B2635]">€1,000</span> unlocks 
                the full itinerary. This filters for serious inquiries and protects 
                the knowledge itself — once shared, it cannot be unshared.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Journeys */}
      <section id="epic-journeys" className="py-24 md:py-32 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">
              Five Journeys
            </p>
            <h2 className="text-3xl md:text-4xl tracking-[0.15em] font-light">
              The Collection
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-foreground/20 border-t-white rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-0">
              {journeys.map((journey, index) => (
                <div 
                  key={journey.slug}
                  className="border-t border-foreground/10 first:border-t-0"
                >
                  <button
                    onClick={() => setActiveJourney(activeJourney === journey.slug ? null : journey.slug)}
                    className="w-full py-8 md:py-12 flex items-center justify-between group text-left"
                  >
                    <div className="flex items-baseline gap-6 md:gap-12">
                      <span className="text-xs tracking-[0.2em] text-white/20 font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl lg:text-4xl group-hover:text-white/70 transition-colors">
                        {journey.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-white/50 hidden md:block">
                        {journey.epicPrice ? `€${journey.epicPrice.toLocaleString()}` : 'Price on request'}
                      </span>
                      <span className="text-xs tracking-[0.15em] uppercase text-white/30 hidden lg:block">
                        {journey.focus}
                      </span>
                      <div className={`w-8 h-8 rounded-full border border-foreground/20 flex items-center justify-center transition-transform ${activeJourney === journey.slug ? 'rotate-180' : ''}`}>
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {activeJourney === journey.slug && (
                    <div className="pb-12 md:pb-16 animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 pl-0 md:pl-[4.5rem]">
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-foreground/5">
                          {journey.heroImage ? (
                            <Image
                              src={journey.heroImage}
                              alt={journey.title}
                              fill
                              className="object-cover opacity-80"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                          )}
                          
                          {/* Play button placeholder for video */}
                          <button className="absolute inset-0 flex items-center justify-center group/play">
                            <div className="w-16 h-16 rounded-full bg-foreground/10 backdrop-blur-sm flex items-center justify-center group-hover/play:bg-white/20 transition-colors">
                              <Play className="w-6 h-6 text-white ml-1" fill="white" />
                            </div>
                          </button>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center">
                          <p className="text-white/60 leading-relaxed mb-6">
                            {journey.description}
                          </p>
                          
                          {journey.arcDescription && (
                            <p className="text-white/40 leading-relaxed text-sm mb-8 line-clamp-4">
                              {journey.arcDescription}
                            </p>
                          )}

                          {/* Price */}
                          <div className="border-t border-foreground/10 pt-6 mb-8">
                            <div className="flex items-baseline gap-4">
                              <span className="font-serif text-2xl text-white">
                                {journey.epicPrice ? `€${journey.epicPrice.toLocaleString()}` : 'Price on request'}
                              </span>
                              <span className="text-xs tracking-[0.15em] uppercase text-white/40">
                                Private journey for two
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/journeys/${journey.slug}`}
                            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors group/link"
                          >
                            <span>Request This Journey</span>
                            <svg 
                              className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* The Invitation */}
      <section className="py-24 md:py-32 border-t border-white/5 bg-[#0d0d0d]">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#8B2635] mb-8">
            By Invitation Only
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight mb-8">
            These journeys choose their travelers as much as travelers choose them.
          </h2>
          <p className="text-white/50 leading-relaxed mb-6">
            We don't measure success by volume. We measure it by the depth of 
            the exchange — between you and the knowledge keepers, between the 
            ancient and the present.
          </p>
          <p className="text-white/40 leading-relaxed mb-12 text-sm">
            Inquire below. If it's right, we'll know. A €1,000 deposit 
            (applied to your final balance) unlocks the full journey details.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-block border border-foreground/20 px-12 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#0a0a0a] transition-colors"
          >
            Begin The Conversation
          </Link>
        </div>
      </section>

      {/* Sound Bites / Quotes - can be populated from sheet */}
      <section className="py-24 md:py-32 border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <blockquote className="text-center">
              <p className="font-serif text-xl md:text-2xl text-white/70 italic mb-4">
                "The stars don't care about your GPS."
              </p>
              <cite className="text-xs tracking-[0.2em] uppercase text-white/30">
                — Navigation by Stars
              </cite>
            </blockquote>
            <blockquote className="text-center">
              <p className="font-serif text-xl md:text-2xl text-white/70 italic mb-4">
                "The Little Prince wasn't fiction. It was memory."
              </p>
              <cite className="text-xs tracking-[0.2em] uppercase text-white/30">
                — The Little Prince Route
              </cite>
            </blockquote>
            <blockquote className="text-center">
              <p className="font-serif text-xl md:text-2xl text-white/70 italic mb-4">
                "Gnawa is not music. It is medicine."
              </p>
              <cite className="text-xs tracking-[0.2em] uppercase text-white/30">
                — The Gnawa Road
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Footer spacer */}
      <div className="h-24 bg-[#0a0a0a]" />
    </div>
  );
}
