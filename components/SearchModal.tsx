"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { getAllTerms } from "@/lib/glossary-data";

interface SearchResult {
  type: "journey" | "story" | "place" | "glossary";
  title: string;
  slug: string;
  subtitle?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cache for API data
  const [journeys, setJourneys] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const glossaryTerms = getAllTerms();

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      fetch("/api/journeys").then((r) => r.json()),
      fetch("/api/stories").then((r) => r.json()),
      fetch("/api/places").then((r) => r.json()),
    ]).then(([journeysData, storiesData, placesData]) => {
      setJourneys(journeysData.journeys || []);
      setStories(storiesData.stories || []);
      setPlaces(placesData.places || []);
    });
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const matched: SearchResult[] = [];

    // Search journeys
    journeys.forEach((j) => {
      if (
        j.title?.toLowerCase().includes(q) ||
        j.destinations?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q)
      ) {
        matched.push({
          type: "journey",
          title: j.title,
          slug: j.slug,
          subtitle: `${j.duration || j.durationDays} days`,
        });
      }
    });

    // Search stories
    stories.forEach((s) => {
      if (
        s.title?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q) ||
        s.excerpt?.toLowerCase().includes(q)
      ) {
        matched.push({
          type: "story",
          title: s.title,
          slug: s.slug,
          subtitle: s.category,
        });
      }
    });

    // Search places
    places.forEach((p) => {
      if (
        p.title?.toLowerCase().includes(q) ||
        p.destination?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      ) {
        matched.push({
          type: "place",
          title: p.title,
          slug: p.slug,
          subtitle: p.destination,
        });
      }
    });

    // Search glossary
    glossaryTerms.forEach((term) => {
      if (
        term.term.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q)
      ) {
        matched.push({
          type: "glossary",
          title: term.term,
          slug: term.id,
          subtitle: term.category.replace(/-/g, " "),
        });
      }
    });

    // Sort: prioritize exact matches
    const sorted = matched.sort((a, b) => {
      const aExact = a.title.toLowerCase().startsWith(q) ? 0 : 1;
      const bExact = b.title.toLowerCase().startsWith(q) ? 0 : 1;
      return aExact - bExact;
    });

    setResults(sorted.slice(0, 12));
  }, [query, journeys, stories, places]);

  const getHref = (result: SearchResult) => {
    switch (result.type) {
      case "journey":
        return `/journeys/${result.slug}`;
      case "story":
        return `/story/${result.slug}`;
      case "place":
        return `/places/${result.slug}`;
      case "glossary":
        return `/glossary#${result.slug}`;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "journey":
        return "Journey";
      case "story":
        return "Story";
      case "place":
        return "Place";
      case "glossary":
        return "Glossary";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-auto mt-20 md:mt-32 px-4">
        <div className="bg-background border border-border shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-border">
            <Search className="w-5 h-5 text-foreground/40" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search journeys, stories, places, glossary..."
              className="flex-1 bg-transparent text-foreground text-lg placeholder:text-foreground/30 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1 text-foreground/40 hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.length < 2 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-foreground/40 text-sm">
                  Start typing to search...
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/30 px-2 py-1 border border-border">
                    Journeys
                  </span>
                  <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/30 px-2 py-1 border border-border">
                    Stories
                  </span>
                  <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/30 px-2 py-1 border border-border">
                    Places
                  </span>
                  <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/30 px-2 py-1 border border-border">
                    Glossary
                  </span>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div>
                {results.map((result, idx) => (
                  <Link
                    key={`${result.type}-${result.slug}-${idx}`}
                    href={getHref(result)}
                    onClick={onClose}
                    className="flex items-center justify-between px-6 py-4 hover:bg-sand transition-colors border-b border-border last:border-b-0"
                  >
                    <div>
                      <p className="text-foreground">{result.title}</p>
                      {result.subtitle && (
                        <p className="text-foreground/50 text-sm capitalize">{result.subtitle}</p>
                      )}
                    </div>
                    <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/30">
                      {getTypeLabel(result.type)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-6 py-8 text-center">
                <p className="text-foreground/50">
                  No results for "{query}"
                </p>
                <p className="text-foreground/30 text-sm mt-2">
                  Try searching for a destination, story topic, or term
                </p>
              </div>
            )}
          </div>

          {/* Footer hint */}
          <div className="px-6 py-3 border-t border-border bg-sand/50">
            <p className="text-[10px] tracking-[0.1em] uppercase text-foreground/30 text-center">
              Press ESC to close
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
