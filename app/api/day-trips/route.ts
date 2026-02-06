import { NextResponse } from "next/server";
import { getDayTrips, getDayTripAddons, getWebsiteSettingByKey } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Get day trips and addons from Supabase
    const [dayTrips, addons, heroSetting] = await Promise.all([
      getDayTrips({ published: true }),
      getDayTripAddons(),
      getWebsiteSettingByKey("day_trips_hero_image"),
    ]);
    
    const heroImage = heroSetting?.value || "";
    
    // Format day trips
    const formattedTrips = dayTrips.map((t) => ({
      slug: t.slug || "",
      routeId: t.route_id || "",
      title: t.title || "",
      shortDescription: t.short_description || "",
      durationHours: t.duration_hours || 0,
      priceMAD: t.final_price_mad || 0,
      priceEUR: t.final_price_eur || 0,
      departureCity: t.departure_city || "Marrakech",
      category: t.category || "",
      heroImage: t.hero_image_url || "",
      includes: (t.includes || "").split("|").filter(Boolean),
      excludes: (t.excludes || "").split("|").filter(Boolean),
      meetingPoint: t.meeting_point || "",
    }));

    // Format addons
    const formattedAddons = addons.map((a) => ({
      id: a.addon_id || "",
      tripSlug: a.applies_to || "",
      title: a.addon_name || "",
      description: a.description || "",
      priceMAD: a.final_price_mad_pp || 0,
      priceEUR: a.final_price_eur_pp || 0,
    }));

    return NextResponse.json({
      dayTrips: formattedTrips,
      addons: formattedAddons,
      heroImage,
    });
  } catch (error) {
    console.error("Error fetching day trips:", error);
    return NextResponse.json(
      { error: "Failed to fetch day trips" },
      { status: 500 }
    );
  }
}
