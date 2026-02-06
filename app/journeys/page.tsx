import { Metadata } from "next";
import { getJourneys as getJourneysFromSupabase, getDayTrips as getDayTripsFromSupabase } from "@/lib/supabase";
import JourneysContent from "./JourneysContent";

export const metadata: Metadata = {
  title: "Morocco Journeys | Private Tours & Itineraries | Slow Morocco",
  description:
    "Discover our curated collection of private Morocco journeys. From Atlas treks to Sahara expeditions, each itinerary is fully customizable to your interests.",
  keywords: [
    "Morocco tours",
    "private Morocco itineraries",
    "Morocco travel",
    "Sahara desert tour",
    "Atlas mountains trek",
    "Marrakech day trips",
  ],
  openGraph: {
    title: "Morocco Journeys | Private Tours & Itineraries",
    description:
      "Curated private journeys through Morocco. Atlas mountains, Sahara desert, imperial cities, and coastal escapes.",
    type: "website",
    url: "https://slowmorocco.com/journeys",
  },
  alternates: {
    canonical: "https://slowmorocco.com/journeys",
  },
};

// Revalidate every hour
export const revalidate = 3600;

interface Journey {
  type: "journey" | "daytrip" | "overnight";
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

async function getJourneys(): Promise<{
  journeys: Journey[];
  dayTrips: Journey[];
  overnightTrips: Journey[];
}> {
  try {
    // Fetch journeys from Supabase
    const journeysData = await getJourneysFromSupabase({ published: true });
    const journeys: Journey[] = journeysData
      .filter((j) => j.journey_type !== "epic")
      .map((j) => ({
        type: "journey" as const,
        slug: j.slug,
        title: j.title,
        description: j.short_description || j.arc_description || "",
        heroImage: j.hero_image_url || "",
        price: j.price_eur || 0,
        durationDays: j.duration_days || 0,
        focus: j.focus_type || undefined,
        category: j.category || undefined,
        destinations: j.destinations || undefined,
        startCity: j.start_city || undefined,
        hidden: !j.show_on_journeys_page,
      }));

    // Fetch day trips from Supabase
    const dayTripsData = await getDayTripsFromSupabase({ published: true });
    const dayTrips: Journey[] = dayTripsData.map((d) => ({
      type: "daytrip" as const,
      slug: d.slug,
      title: d.title,
      description: d.short_description || "",
      heroImage: d.hero_image_url || "",
      price: d.final_price_eur || 0,
      durationHours: d.duration_hours || 0,
      category: d.category || undefined,
      startCity: d.departure_city || undefined,
    }));

    // Overnight trips (hardcoded for now)
    const overnightTrips: Journey[] = [
      {
        type: "overnight",
        slug: "agafay-desert",
        title: "Agafay Desert Overnight",
        description:
          "One night in the hammada—the stone desert. Sunset camel ride, dinner under the sky, silence you can feel.",
        heroImage:
          "https://res.cloudinary.com/drstfu5yr/image/upload/v1769611923/agafay-desert_sp7d6n.jpg",
        price: 450,
        durationDays: 2,
        category: "Desert",
        startCity: "Marrakech",
      },
    ];

    return { journeys, dayTrips, overnightTrips };
  } catch (error) {
    console.error("Error fetching journeys:", error);
    return { journeys: [], dayTrips: [], overnightTrips: [] };
  }
}

export default async function JourneysPage() {
  const { journeys, dayTrips, overnightTrips } = await getJourneys();

  // Filter visible journeys (not hidden)
  const visibleJourneys = journeys.filter((j) => !j.hidden);

  return (
    <JourneysContent
      initialJourneys={journeys}
      visibleJourneys={visibleJourneys}
      dayTrips={dayTrips}
      overnightTrips={overnightTrips}
    />
  );
}
