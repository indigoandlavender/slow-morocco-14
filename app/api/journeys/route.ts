import { NextResponse } from "next/server";
import { getJourneys } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeHidden = searchParams.get("includeHidden") === "true";
    
    const journeys = await getJourneys({ 
      includeHidden,
      published: includeHidden ? undefined : true 
    });
    
    // Map to consistent format - matching existing API shape
    const formattedJourneys = journeys.map((j) => ({
      slug: j.slug || "",
      title: j.title || "",
      duration: j.duration_days ? `${j.duration_days}-Day` : "",
      durationDays: j.duration_days || 0,
      description: j.short_description || "",
      shortDescription: j.short_description || "",
      arcDescription: j.arc_description || "",
      heroImage: j.hero_image_url || "",
      price: j.price_eur || 0,
      startCity: j.start_city || "",
      focus: j.focus_type || "",
      category: j.category || "",
      journeyId: j.id || "",
      destinations: j.destinations || "",
      journeyType: j.journey_type || "regular",
      epicPrice: j.epic_price_eur || null,
      hidden: !j.show_on_journeys_page,
    }));

    return NextResponse.json({
      success: true,
      journeys: formattedJourneys,
    });
  } catch (error: any) {
    console.error("Journeys fetch error:", error);
    return NextResponse.json(
      { success: false, journeys: [], error: error.message },
      { status: 500 }
    );
  }
}
