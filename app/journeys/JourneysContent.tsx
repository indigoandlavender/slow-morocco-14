"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import PageBanner from "@/components/PageBanner";

interface SearchableItem {
  type: 'journey' | 'daytrip' | 'overnight';
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  price: number;
  durationDays?: number;
  durationHours?: number;
  focus?: string;
  category?: string;
  destinations?: string;
  startCity?: string;
  hidden?: boolean;
}

interface JourneysContentProps {
  initialJourneys: SearchableItem[];
  visibleJourneys: SearchableItem[];
  dayTrips: SearchableItem[];
  overnightTrips: SearchableItem[];
}

const ITEMS_PER_PAGE = 10;

export default function JourneysContent({
  initialJourneys,
  visibleJourneys: initialVisibleJourneys,
  dayTrips: initialDayTrips,
  overnightTrips: initialOvernightTrips,
}: JourneysContentProps) {
  const [allJourneys] = useState<SearchableItem[]>(initialJourneys);
  const [visibleJourneys] = useState<SearchableItem[]>(initialVisibleJourneys);
  const [dayTrips] = useState<SearchableItem[]>(initialDayTrips);
  const [overnightTrips] = useState<SearchableItem[]>(initialOvernightTrips);
  const [filteredResults, setFilteredResults] = useState<SearchableItem[]>(initialVisibleJourneys);
  const { format } = useCurrency();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedFocus, setSelectedFocus] = useState("all");

  // Get unique values for filters
  const durations = [
    { slug: "all", label: "All" },
    { slug: "short", label: "1-5 Days" },
    { slug: "medium", label: "6-10 Days" },
    { slug: "long", label: "11+ Days" },
  ];

  const focuses = [
    { slug: "all", label: "All" },
    { slug: "desert", label: "Desert" },
    { slug: "mountains", label: "Mountains" },
    { slug: "culture", label: "Culture" },
    { slug: "coast", label: "Coast" },
    { slug: "food", label: "Food" },
  ];

  // Map filter slugs to actual data values
  const focusMapping: Record<string, string[]> = {
    desert: ["desert", "sahara"],
    mountains: ["mountains", "trekking", "hiking", "adventure", "nature"],
    culture: ["culture", "craft", "architecture", "heritage", "literature", "art"],
    coast: ["coastal", "coast", "sea", "surf"],
    food: ["food", "culinary"],
  };

  // Apply search and filters

  // Apply search and filters
  useEffect(() => {
    const isSearching = searchQuery.trim().length > 0;
    
    let sourceItems: SearchableItem[] = [];
    
    if (isSearching) {
      sourceItems = [...allJourneys, ...dayTrips, ...overnightTrips];
    } else {
      sourceItems = visibleJourneys;
    }
    
    let filtered = [...sourceItems];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.destinations?.toLowerCase().includes(query) ||
        item.startCity?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    }

    if (selectedDuration !== "all") {
      filtered = filtered.filter((item) => {
        if (item.type === 'daytrip') return selectedDuration === 'short';
        const days = item.durationDays || 0;
        if (selectedDuration === "short") return days >= 1 && days <= 5;
        if (selectedDuration === "medium") return days >= 6 && days <= 10;
        if (selectedDuration === "long") return days >= 11;
        return true;
      });
    }

    if (selectedFocus !== "all") {
      const matchTerms = focusMapping[selectedFocus] || [selectedFocus];
      filtered = filtered.filter((item) => {
        const focusLower = item.focus?.toLowerCase() || "";
        const categoryLower = item.category?.toLowerCase() || "";
        return matchTerms.some(term => 
          focusLower.includes(term) || categoryLower.includes(term)
        );
      });
    }

    setFilteredResults(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allJourneys, visibleJourneys, dayTrips, overnightTrips, searchQuery, selectedDuration, selectedFocus]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDuration("all");
    setSelectedFocus("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || selectedDuration !== "all" || selectedFocus !== "all";

  // Pagination calculations
  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = filteredResults.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  return (
    <main className="bg-background min-h-screen" role="main" aria-label="Morocco Journeys Collection">
      {/* Immersive Hero Banner */}
      <PageBanner
        slug="journeys"
        fallback={{
          title: "Routes worth taking",
          subtitle: "Every journey is private and fully customizable. Choose a starting point, then we'll shape it around what matters to you.",
          label: "Journeys",
        }}
      />

      {/* Search & Filters */}
      <section className="py-8 border-b border-border" aria-label="Filter journeys">
        <div className="container mx-auto px-6 lg:px-16">
          {/* Hidden H1 for SEO - visible title is in PageBanner */}
          <h1 className="sr-only">Morocco Journeys & Tours - Private Itineraries</h1>
          
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-xl">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search journeys, destinations, or experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-transparent border-b border-foreground/20 focus:border-foreground/60 focus:outline-none text-base placeholder:text-foreground/30 transition-colors text-foreground"
                aria-label="Search Morocco journeys"
              />
            </div>
          </div>

          {/* Filters Row */}
          <nav className="flex flex-col md:flex-row md:items-start gap-8 md:gap-16" aria-label="Journey filters">
            {/* Duration Filter */}
            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">
                Duration
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {durations.map((duration) => (
                  <button
                    key={duration.slug}
                    onClick={() => setSelectedDuration(duration.slug === selectedDuration ? "all" : duration.slug)}
                    className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors ${
                      selectedDuration === duration.slug
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground/40"
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Focus Filter */}
            <div>
              <h2 className="text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">
                Focus
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {focuses.map((focus) => (
                  <button
                    key={focus.slug}
                    onClick={() => setSelectedFocus(focus.slug === selectedFocus ? "all" : focus.slug)}
                    className={`text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-colors ${
                      selectedFocus === focus.slug
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent text-foreground/60 border-foreground/20 hover:border-foreground/40"
                    }`}
                  >
                    {focus.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <div className="md:ml-auto md:self-end">
                <button
                  onClick={clearFilters}
                  className="text-xs tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground transition-colors"
                >
                  Clear filters ×
                </button>
              </div>
            )}
          </nav>
        </div>
      </section>

      {/* Results count */}
      <div className="container mx-auto px-6 lg:px-16 py-6" role="status" aria-live="polite">
        <p className="text-sm text-foreground/40">
          {filteredResults.length} {filteredResults.length === 1 ? "journey" : "journeys"} found
          {totalPages > 1 && (
            <span className="ml-2">
              · Page {currentPage} of {totalPages}
            </span>
          )}
        </p>
      </div>

      {/* Results Grid */}
      <section className="py-8 md:py-12" aria-label="Journey listings">
        <div className="container mx-auto px-6 lg:px-16">
          {filteredResults.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-foreground/50 mb-6">No results match your search.</p>
              <button
                onClick={clearFilters}
                className="text-sm text-foreground/40 hover:text-foreground underline transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {currentItems.map((item) => {
                  const href = item.type === 'daytrip' 
                    ? `/day-trips/${item.slug}`
                    : item.type === 'overnight'
                    ? `/overnight/${item.slug}`
                    : `/journeys/${item.slug}`;
                  
                  const durationLabel = item.type === 'daytrip'
                    ? `${item.durationHours} Hours`
                    : item.type === 'overnight'
                    ? '2 Days'
                    : `${item.durationDays} Days`;
                  
                  // Show meaningful badge: focus type for journeys, type for day trips/overnight
                  // Hide vague categories like "Interest", "Route", "Classic"
                  const vagueLabels = ['interest', 'route', 'classic', 'traveler type', 'grand tour'];
                  const getFocusBadge = () => {
                    if (item.type === 'daytrip') return 'Day Trip';
                    if (item.type === 'overnight') return 'Overnight';
                    
                    // Prefer focus over category, format nicely
                    const focus = item.focus?.toLowerCase() || '';
                    const category = item.category?.toLowerCase() || '';
                    
                    // Map focus types to display labels
                    const focusLabels: Record<string, string> = {
                      'desert': 'Desert',
                      'sahara': 'Desert',
                      'trekking': 'Trekking',
                      'hiking': 'Hiking',
                      'culture': 'Culture',
                      'coastal': 'Coastal',
                      'coast': 'Coastal',
                      'sea': 'Coastal',
                      'surf': 'Surf',
                      'food': 'Culinary',
                      'culinary': 'Culinary',
                      'craft': 'Craft',
                      'architecture': 'Architecture',
                      'heritage': 'Heritage',
                      'adventure': 'Adventure',
                      'nature': 'Nature',
                      'mountains': 'Mountains',
                      'wellness': 'Wellness',
                      'photography': 'Photography',
                      'wildlife': 'Wildlife',
                      'romance': 'Romance',
                      'family': 'Family',
                      'luxury': 'Luxury',
                      'literature': 'Literature',
                      'art': 'Art',
                    };
                    
                    // Check focus first
                    for (const [key, label] of Object.entries(focusLabels)) {
                      if (focus.includes(key)) return label;
                    }
                    
                    // Check category if focus didn't match
                    if (category && !vagueLabels.includes(category)) {
                      return item.category;
                    }
                    
                    return null; // Hide badge if nothing meaningful
                  };
                  
                  const typeBadge = getFocusBadge();

                  return (
                    <article 
                      key={`${item.type}-${item.slug}`}
                      className="group"
                      itemScope 
                      itemType="https://schema.org/TouristTrip"
                    >
                      <Link href={href} className="block">
                        <figure className="relative aspect-[4/5] mb-4 overflow-hidden bg-foreground/5">
                          {item.heroImage && (
                            <Image
                              src={item.heroImage}
                              alt={`${item.title} - Morocco ${item.type === 'daytrip' ? 'day trip' : 'journey'}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              itemProp="image"
                            />
                          )}
                          {typeBadge && (
                            <div className="absolute top-4 left-4">
                              <span className="text-[10px] tracking-[0.15em] uppercase bg-background/90 text-foreground/80 px-3 py-1.5 flex items-center gap-1.5">
                                {item.type === 'daytrip' && <Clock className="w-3 h-3" aria-hidden="true" />}
                                {item.type === 'overnight' && <Moon className="w-3 h-3" aria-hidden="true" />}
                                {typeBadge}
                              </span>
                            </div>
                          )}
                          {item.hidden && (
                            <div className="absolute top-4 right-4">
                              <span className="text-[10px] tracking-[0.15em] uppercase bg-foreground/80 text-background px-2 py-1">
                                Unlisted
                              </span>
                            </div>
                          )}
                        </figure>
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-xs tracking-[0.15em] uppercase text-foreground/40" itemProp="duration">
                            {durationLabel}
                          </span>
                          {Number(item.price) > 0 && (
                            <span className="text-xs text-foreground/40" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                              From <span className="text-foreground/70" itemProp="price">{format(Number(item.price))}</span>
                              <meta itemProp="priceCurrency" content="EUR" />
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-foreground/70 transition-colors" itemProp="name">
                          {item.title}
                        </h3>
                        <p className="text-sm text-foreground/50 leading-relaxed line-clamp-2" itemProp="description">
                          {item.description}
                        </p>
                        <meta itemProp="touristType" content={typeBadge || 'Cultural Tourism'} />
                      </Link>
                    </article>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 mt-16 pt-8 border-t border-foreground/10" aria-label="Journey pages">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Go to previous page"
                    className={`flex items-center gap-1 px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors ${
                      currentPage === 1
                        ? "text-foreground/20 cursor-not-allowed"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    Prev
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => (
                      page === '...' ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-foreground/30" aria-hidden="true">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page as number)}
                          aria-label={`Go to page ${page}`}
                          aria-current={currentPage === page ? 'page' : undefined}
                          className={`min-w-[40px] px-3 py-2 text-xs tracking-[0.1em] transition-colors ${
                            currentPage === page
                              ? "bg-foreground text-background"
                              : "text-foreground/60 hover:text-foreground hover:bg-foreground/5"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Go to next page"
                    className={`flex items-center gap-1 px-4 py-2 text-xs tracking-[0.15em] uppercase transition-colors ${
                      currentPage === totalPages
                        ? "text-foreground/20 cursor-not-allowed"
                        : "text-foreground/60 hover:text-foreground"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#1a1916] text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto px-6 lg:px-16 max-w-3xl text-center">
          <h2 id="cta-heading" className="font-serif text-3xl md:text-4xl lg:text-5xl mb-6">
            Looking for something different?
          </h2>
          <p className="text-white/70 leading-relaxed mb-12 text-lg">
            These are starting points, not scripts. Tell us what matters to you—we'll shape a route around it. Add a day in the desert. Skip the city. Stay longer where something pulls you.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-block bg-white text-[#1a1916] px-12 py-4 text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
            aria-label="Start planning your custom Morocco journey"
          >
            Start the conversation
          </Link>
        </div>
      </section>
    </main>
  );
}
