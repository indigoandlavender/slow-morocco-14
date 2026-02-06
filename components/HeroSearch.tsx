"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAllTerms } from "@/lib/glossary-data";

interface SearchResult {
  type: "journey" | "story" | "place" | "glossary";
  title: string;
  slug: string;
  subtitle?: string;
}

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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

    // Limit results and prioritize exact matches
    const sorted = matched.sort((a, b) => {
      const aExact = a.title.toLowerCase().startsWith(q) ? 0 : 1;
      const bExact = b.title.toLowerCase().startsWith(q) ? 0 : 1;
      return aExact - bExact;
    });

    setResults(sorted.slice(0, 8));
  }, [query, journeys, stories, places]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  return (
    <div ref={containerRef} className="relative mt-8 max-w-md">
      {/* Search Input */}
      <div
        className={`
          flex items-center gap-3 px-4 py-3 
          bg-white/10 backdrop-blur-sm border 
          transition-all duration-300
          ${isFocused ? "border-white/40 bg-white/15" : "border-white/20"}
        `}
      >
        <Search className="w-4 h-4 text-white/50" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            setIsFocused(true);
            setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search journeys, stories, places..."
          className="flex-1 bg-transparent text-white text-sm placeholder:text-white/40 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
            className="text-white/40 hover:text-white/70 text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border shadow-xl max-h-80 overflow-y-auto z-50">
          {results.map((result, idx) => (
            <Link
              key={`${result.type}-${result.slug}-${idx}`}
              href={getHref(result)}
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
              className="flex items-center justify-between px-4 py-3 hover:bg-sand transition-colors border-b border-border last:border-b-0"
            >
              <div>
                <p className="text-foreground text-sm font-medium">{result.title}</p>
                {result.subtitle && (
                  <p className="text-foreground/50 text-xs capitalize">{result.subtitle}</p>
                )}
              </div>
              <span className="text-[10px] tracking-[0.1em] uppercase text-foreground/30">
                {getTypeLabel(result.type)}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border shadow-xl p-4 z-50">
          <p className="text-foreground/50 text-sm text-center">
            No results for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
