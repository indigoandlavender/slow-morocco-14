import { NextResponse } from "next/server";
import { getJourneyBySlug, getRoutesByIds } from "@/lib/supabase";

// CORS headers for cross-origin requests (e.g., from Riad di Siena)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    
    // Get journey by slug
    const journeyData = await getJourneyBySlug(slug) || 
                        await getJourneyBySlug(decodeURIComponent(slug));

    if (!journeyData) {
      return NextResponse.json(
        { success: false, error: "Journey not found" },
        { status: 404 }
      );
    }

    // Format journey data
    const journey = {
      slug: journeyData.slug || "",
      title: journeyData.title || "",
      duration: journeyData.duration_days ? `${journeyData.duration_days}-Day` : "",
      durationDays: journeyData.duration_days || 0,
      description: journeyData.short_description || "",
      arcDescription: journeyData.arc_description || "",
      heroImage: journeyData.hero_image_url || "",
      price: journeyData.price_eur || 0,
      startCity: journeyData.start_city || "",
      focus: journeyData.focus_type || "",
      destinations: journeyData.destinations || "",
      journeyId: journeyData.id || "",
      journeyType: journeyData.journey_type || "regular",
      epicPrice: journeyData.epic_price_eur || null,
    };

    // Get Route_Sequence and parse into array of Route_IDs
    const routeSequence = journeyData.route_sequence || "";
    const routeIds = routeSequence
      .split(",")
      .map((id: string) => id.trim())
      .filter((id: string) => id.length > 0);

    // Get routes from Supabase
    const routes = await getRoutesByIds(routeIds);
    
    // Build itinerary from Route_Sequence
    const itinerary = routeIds.map((routeId: string, index: number) => {
      // Find the route by ID
      const route = routes.find((r) => r.id === routeId);
      
      if (!route) {
        return {
          dayNumber: index + 1,
          cityName: "",
          fromCity: "",
          toCity: "",
          description: `Route ${routeId} not found`,
          imageUrl: "",
          travelTime: "",
          difficulty: "",
          activities: "",
          meals: "",
          routeType: "",
        };
      }

      return {
        dayNumber: index + 1,
        cityName: route.to_city || "",
        fromCity: route.from_city || "",
        toCity: route.to_city || "",
        description: route.route_narrative || "",
        imageUrl: route.image_url || "",
        travelTime: route.travel_time_hours || "",
        difficulty: route.difficulty_level || "",
        activities: route.activities || "",
        meals: route.meals || "",
        routeType: route.route_type || "",
      };
    });

    return NextResponse.json({
      success: true,
      journey,
      itinerary,
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Journey detail fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
