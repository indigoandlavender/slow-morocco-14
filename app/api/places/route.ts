import { NextResponse } from "next/server";
import { getPlaces } from "@/lib/supabase";

export const revalidate = 60;

export async function GET() {
  try {
    const placesData = await getPlaces({ published: true });
    
    // Map to API format
    const places = placesData.map((p) => ({
      slug: p.slug || "",
      title: p.title || "",
      destination: p.destination || "",
      category: p.category || "",
      heroImage: p.hero_image || "",
      excerpt: p.excerpt || "",
      featured: p.featured || false,
      order: p.sort_order || 999,
    }));

    return NextResponse.json({ 
      success: true,
      places 
    });
  } catch (error: any) {
    console.error("GET /api/places error:", error);
    return NextResponse.json(
      { success: false, error: error.message, places: [] },
      { status: 500 }
    );
  }
}
