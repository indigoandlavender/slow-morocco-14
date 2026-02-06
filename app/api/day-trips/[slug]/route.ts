import { NextResponse } from "next/server";
import { getDayTripBySlug, getDayTripAddons, getRouteById } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Get day trip from Supabase
    const tripData = await getDayTripBySlug(slug) || 
                     await getDayTripBySlug(decodeURIComponent(slug));

    if (!tripData) {
      return NextResponse.json(
        { success: false, error: "Day trip not found" },
        { status: 404 }
      );
    }

    // Get the route narrative from routes table
    const routeId = tripData.route_id || "";
    const routeData = routeId ? await getRouteById(routeId) : null;

    // Format day trip
    const dayTrip = {
      slug: tripData.slug || "",
      routeId: routeId,
      title: tripData.title || "",
      shortDescription: tripData.short_description || "",
      durationHours: tripData.duration_hours || 0,
      priceMAD: tripData.final_price_mad || 0,
      priceEUR: tripData.final_price_eur || 0,
      departureCity: tripData.departure_city || "Marrakech",
      category: tripData.category || "",
      heroImage: tripData.hero_image_url || "",
      includes: (tripData.includes || "").split("|").filter(Boolean),
      excludes: (tripData.excludes || "").split("|").filter(Boolean),
      meetingPoint: tripData.meeting_point || "",
      // From routes table
      narrative: routeData?.route_narrative || "",
      fromCity: routeData?.from_city || "Marrakech",
      toCity: routeData?.to_city || "",
      viaCities: routeData?.via_cities || "",
      travelTime: routeData?.travel_time_hours || "",
      activities: routeData?.activities || "",
      difficulty: routeData?.difficulty_level || "",
      region: routeData?.region || "",
      routeImage: routeData?.image_url || "",
    };

    // Get applicable addons for this trip
    const addons = await getDayTripAddons(slug);
    const applicableAddons = addons.map((a) => ({
      id: a.addon_id || "",
      name: a.addon_name || "",
      description: a.description || "",
      priceMAD: a.final_price_mad_pp || 0,
      priceEUR: a.final_price_eur_pp || 0,
    }));

    return NextResponse.json({
      success: true,
      dayTrip,
      addons: applicableAddons,
    });
  } catch (error: any) {
    console.error("Day trip detail fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
