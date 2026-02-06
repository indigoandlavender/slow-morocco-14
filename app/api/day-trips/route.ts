import { NextResponse } from "next/server";
import { getDayTrips, getDayTripAddons } from "@/lib/supabase";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Get day trips and addons from Supabase
    const dayTrips = await getDayTrips({ published: true });
    const addons = await getDayTripAddons();
    
    // Get hero image from settings (still from Google Sheets)
    let heroImage = "";
    try {
      const settings = await getSheetData("Website_Settings");
      const heroSetting = settings.find((s: any) => s.Key === "day_trips_hero_image");
      heroImage = heroSetting ? convertDriveUrl(heroSetting.Value || "") : "";
    } catch (e) {
      console.error("Error fetching settings:", e);
    }
    
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
      name: a.addon_name || "",
      description: a.description || "",
      priceMAD: a.final_price_mad_pp || 0,
      priceEUR: a.final_price_eur_pp || 0,
      appliesTo: (a.applies_to || "").split("|").filter(Boolean),
    }));

    return NextResponse.json({
      success: true,
      heroImage,
      dayTrips: formattedTrips,
      addons: formattedAddons,
    });
  } catch (error: any) {
    console.error("Day trips fetch error:", error);
    return NextResponse.json(
      { success: false, heroImage: "", dayTrips: [], addons: [], error: error.message },
      { status: 500 }
    );
  }
}
