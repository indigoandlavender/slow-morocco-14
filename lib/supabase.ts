import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// =============================================
// TYPE DEFINITIONS
// =============================================

export interface Journey {
  id: string;
  title: string;
  slug: string;
  image_prompt: string | null;
  hero_image_url: string | null;
  short_description: string | null;
  arc_description: string | null;
  duration_days: number | null;
  price_eur: number | null;
  epic_price_eur: number | null;
  start_city: string | null;
  focus_type: string | null;
  route_sequence: string | null;
  category: string | null;
  destinations: string | null;
  journey_type: string | null;
  marketing_priority: string | null;
  published: boolean;
  show_on_journeys_page: boolean;
  featured_on_homepage: boolean;
  created_at: string;
  updated_at: string;
}

export interface Route {
  id: string;
  route_narrative: string | null;
  route_description: string | null;
  image_prompt: string | null;
  image_url: string | null;
  from_city: string | null;
  to_city: string | null;
  via_cities: string | null;
  region: string | null;
  route_type: string | null;
  travel_time_hours: number | null;
  day_duration_hours: number | null;
  difficulty_level: string | null;
  activities: string | null;
  meals: string | null;
  created_at: string;
  updated_at: string;
}

// =============================================
// JOURNEY QUERIES
// =============================================

export async function getJourneys(options?: {
  published?: boolean;
  showOnJourneysPage?: boolean;
  featuredOnHomepage?: boolean;
  category?: string;
  includeHidden?: boolean;
}) {
  let query = supabase.from("journeys").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  } else if (!options?.includeHidden) {
    query = query.eq("published", true);
  }

  if (options?.showOnJourneysPage !== undefined) {
    query = query.eq("show_on_journeys_page", options.showOnJourneysPage);
  }

  if (options?.featuredOnHomepage !== undefined) {
    query = query.eq("featured_on_homepage", options.featuredOnHomepage);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  const { data, error } = await query.order("duration_days", { ascending: true });

  if (error) {
    console.error("Error fetching journeys:", error);
    return [];
  }

  return data as Journey[];
}

export async function getJourneyBySlug(slug: string) {
  const { data, error } = await supabase
    .from("journeys")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching journey:", error);
    return null;
  }

  return data as Journey;
}

// =============================================
// ROUTE QUERIES
// =============================================

export async function getRoutes(options?: {
  region?: string;
  routeType?: string;
  fromCity?: string;
  toCity?: string;
}) {
  let query = supabase.from("routes").select("*");

  if (options?.region) {
    query = query.eq("region", options.region);
  }

  if (options?.routeType) {
    query = query.eq("route_type", options.routeType);
  }

  if (options?.fromCity) {
    query = query.eq("from_city", options.fromCity);
  }

  if (options?.toCity) {
    query = query.eq("to_city", options.toCity);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching routes:", error);
    return [];
  }

  return data as Route[];
}

export async function getRouteById(id: string) {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching route:", error);
    return null;
  }

  return data as Route;
}

export async function getRoutesByIds(ids: string[]) {
  const { data, error } = await supabase
    .from("routes")
    .select("*")
    .in("id", ids);

  if (error) {
    console.error("Error fetching routes:", error);
    return [];
  }

  // Return in the same order as requested
  const routeMap = new Map(data.map((r) => [r.id, r]));
  return ids.map((id) => routeMap.get(id)).filter(Boolean) as Route[];
}

// =============================================
// HELPER: Transform to API format (matches existing API shape)
// =============================================

export function transformJourneyForAPI(journey: Journey) {
  return {
    slug: journey.slug,
    title: journey.title,
    heroImage: journey.hero_image_url,
    shortDescription: journey.short_description,
    description: journey.arc_description,
    durationDays: journey.duration_days,
    price: journey.price_eur,
    epicPrice: journey.epic_price_eur,
    startCity: journey.start_city,
    focus: journey.focus_type,
    category: journey.category,
    destinations: journey.destinations,
    routeSequence: journey.route_sequence,
    journeyType: journey.journey_type,
    marketingPriority: journey.marketing_priority,
    published: journey.published,
    showOnJourneysPage: journey.show_on_journeys_page,
    featuredOnHomepage: journey.featured_on_homepage,
    hidden: !journey.show_on_journeys_page,
  };
}

export function transformRouteForAPI(route: Route) {
  return {
    id: route.id,
    narrative: route.route_narrative,
    description: route.route_description,
    imagePrompt: route.image_prompt,
    imageUrl: route.image_url,
    fromCity: route.from_city,
    toCity: route.to_city,
    viaCities: route.via_cities,
    region: route.region,
    routeType: route.route_type,
    travelTimeHours: route.travel_time_hours,
    dayDurationHours: route.day_duration_hours,
    difficultyLevel: route.difficulty_level,
    activities: route.activities,
    meals: route.meals,
  };
}

// =============================================
// DAY TRIPS
// =============================================

export interface DayTrip {
  slug: string;
  route_id: string | null;
  title: string;
  short_description: string | null;
  duration_hours: number | null;
  driver_cost_mad: number | null;
  margin_percent: number | null;
  paypal_percent: number | null;
  final_price_mad: number | null;
  final_price_eur: number | null;
  departure_city: string | null;
  category: string | null;
  hero_image_url: string | null;
  includes: string | null;
  excludes: string | null;
  meeting_point: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DayTripAddon {
  addon_id: string;
  addon_name: string;
  description: string | null;
  cost_mad_pp: number | null;
  margin_percent: number | null;
  paypal_percent: number | null;
  final_price_mad_pp: number | null;
  final_price_eur_pp: number | null;
  applies_to: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface DayTripBooking {
  booking_id: string;
  created_at: string;
  trip_slug: string;
  trip_title: string | null;
  trip_date: string | null;
  guests: number | null;
  base_price_mad: number | null;
  addons: string | null;
  addons_price_mad: number | null;
  total_mad: number | null;
  total_eur: number | null;
  guest_name: string | null;
  guest_email: string | null;
  guest_phone: string | null;
  pickup_location: string | null;
  notes: string | null;
  paypal_transaction_id: string | null;
  status: string;
}

export async function getDayTrips(options?: { published?: boolean }) {
  let query = supabase.from("day_trips").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  }

  const { data, error } = await query.order("duration_hours", { ascending: true });

  if (error) {
    console.error("Error fetching day trips:", error);
    return [];
  }

  return data as DayTrip[];
}

export async function getDayTripBySlug(slug: string) {
  const { data, error } = await supabase
    .from("day_trips")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching day trip:", error);
    return null;
  }

  return data as DayTrip;
}

export async function getDayTripAddons(tripSlug?: string) {
  let query = supabase
    .from("day_trip_addons")
    .select("*")
    .eq("published", true);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching day trip addons:", error);
    return [];
  }

  // Filter by applies_to if tripSlug provided
  if (tripSlug) {
    return (data as DayTripAddon[]).filter((addon) =>
      addon.applies_to?.split("|").includes(tripSlug)
    );
  }

  return data as DayTripAddon[];
}

export async function createDayTripBooking(booking: Omit<DayTripBooking, "booking_id" | "created_at">) {
  const { data, error } = await supabase
    .from("day_trip_bookings")
    .insert(booking)
    .select()
    .single();

  if (error) {
    console.error("Error creating booking:", error);
    return null;
  }

  return data as DayTripBooking;
}

// =============================================
// PLACES
// =============================================

export interface Place {
  slug: string;
  title: string;
  destination: string | null;
  category: string | null;
  address: string | null;
  opening_hours: string | null;
  fees: string | null;
  notes: string | null;
  hero_image: string | null;
  hero_caption: string | null;
  excerpt: string | null;
  body: string | null;
  sources: string | null;
  tags: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

export interface PlaceImage {
  id: number;
  place_slug: string;
  image_order: number;
  image_url: string | null;
  caption: string | null;
  created_at: string;
}

export async function getPlaces(options?: {
  published?: boolean;
  destination?: string;
  category?: string;
  featured?: boolean;
}) {
  let query = supabase.from("places").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  }

  if (options?.destination) {
    query = query.eq("destination", options.destination);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured);
  }

  const { data, error } = await query.order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching places:", error);
    return [];
  }

  return data as Place[];
}

export async function getPlaceBySlug(slug: string) {
  const { data, error } = await supabase
    .from("places")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching place:", error);
    return null;
  }

  return data as Place;
}

export async function getPlaceImages(placeSlug: string) {
  const { data, error } = await supabase
    .from("place_images")
    .select("*")
    .eq("place_slug", placeSlug)
    .order("image_order", { ascending: true });

  if (error) {
    console.error("Error fetching place images:", error);
    return [];
  }

  return data as PlaceImage[];
}

// =============================================
// STORIES
// =============================================

export interface Story {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string | null;
  source_type: string | null;
  hero_image: string | null;
  mj_prompt: string | null;
  hero_caption: string | null;
  excerpt: string | null;
  body: string | null;
  read_time: number | null;
  year: number | null;
  text_by: string | null;
  images_by: string | null;
  sources: string | null;
  tags: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number | null;
  the_facts: string | null;
  region: string | null;
  country: string | null;
  theme: string | null;
  era: string | null;
  era_start: number | null;
  era_end: number | null;
  created_at: string;
  updated_at: string;
}

export async function getStories(options?: {
  published?: boolean;
  featured?: boolean;
  category?: string;
  region?: string;
  limit?: number;
}) {
  let query = supabase.from("stories").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  }

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured);
  }

  if (options?.category) {
    query = query.eq("category", options.category);
  }

  if (options?.region) {
    query = query.eq("region", options.region);
  }

  query = query.order("sort_order", { ascending: true });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching stories:", error);
    return [];
  }

  return data as Story[];
}

export async function getStoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching story:", error);
    return null;
  }

  return data as Story;
}

// =============================================
// REGIONS
// =============================================

export interface Region {
  slug: string;
  title: string;
  subtitle: string | null;
  hero_image: string | null;
  description: string | null;
  sort_order: number | null;
  created_at: string;
}

export async function getRegions() {
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching regions:", error);
    return [];
  }

  return data as Region[];
}

// =============================================
// DESTINATIONS
// =============================================

export interface Destination {
  slug: string;
  title: string;
  subtitle: string | null;
  region: string | null;
  hero_image: string | null;
  hero_caption: string | null;
  excerpt: string | null;
  body: string | null;
  published: boolean;
  featured: boolean;
  sort_order: number | null;
  created_at: string;
}

export async function getDestinations(options?: {
  published?: boolean;
  featured?: boolean;
  region?: string;
}) {
  let query = supabase.from("destinations").select("*");

  if (options?.published !== undefined) {
    query = query.eq("published", options.published);
  }

  if (options?.featured !== undefined) {
    query = query.eq("featured", options.featured);
  }

  if (options?.region) {
    query = query.ilike("region", `%${options.region}%`);
  }

  const { data, error } = await query.order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching destinations:", error);
    return [];
  }

  return data as Destination[];
}

export async function getDestinationBySlug(slug: string) {
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching destination:", error);
    return null;
  }

  return data as Destination;
}

// =============================================
// PAGE BANNERS
// =============================================

export interface PageBanner {
  page_slug: string;
  hero_image_url: string | null;
  title: string | null;
  subtitle: string | null;
  label_text: string | null;
  created_at: string;
}

export async function getPageBanners() {
  const { data, error } = await supabase
    .from("page_banners")
    .select("*");

  if (error) {
    console.error("Error fetching page banners:", error);
    return [];
  }

  return data as PageBanner[];
}

export async function getPageBannerBySlug(slug: string) {
  const { data, error } = await supabase
    .from("page_banners")
    .select("*")
    .eq("page_slug", slug)
    .single();

  if (error) {
    console.error("Error fetching page banner:", error);
    return null;
  }

  return data as PageBanner;
}

// =============================================
// WEBSITE SETTINGS
// =============================================

export interface WebsiteSetting {
  key: string;
  value: string | null;
  updated_at: string;
}

export async function getWebsiteSettings() {
  const { data, error } = await supabase
    .from("website_settings")
    .select("*");

  if (error) {
    console.error("Error fetching website settings:", error);
    return [];
  }

  return data as WebsiteSetting[];
}

export async function getWebsiteSettingByKey(key: string) {
  const { data, error } = await supabase
    .from("website_settings")
    .select("*")
    .eq("key", key)
    .single();

  if (error) {
    console.error("Error fetching website setting:", error);
    return null;
  }

  return data as WebsiteSetting;
}
