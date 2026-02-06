import { NextResponse } from "next/server";
import { getDestinations } from "@/lib/supabase";

export const revalidate = 60;

export async function GET() {
  try {
    const destinationsData = await getDestinations({ published: true });
    
    const destinations = destinationsData.map((d) => ({
      slug: d.slug,
      title: d.title,
      subtitle: d.subtitle || "",
      region: d.region || "",
      heroImage: d.hero_image || "",
      excerpt: d.excerpt || "",
      featured: d.featured,
      order: d.sort_order || 999,
    }));

    return NextResponse.json({ 
      success: true,
      destinations 
    });
  } catch (error: any) {
    console.error("GET /api/destinations error:", error);
    return NextResponse.json(
      { success: false, error: error.message, destinations: [] },
      { status: 500 }
    );
  }
}
