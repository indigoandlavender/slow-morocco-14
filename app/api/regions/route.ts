import { NextResponse } from "next/server";
import { getRegions } from "@/lib/supabase";

export const revalidate = 60;

export async function GET() {
  try {
    const regionsData = await getRegions();
    
    const regions = regionsData.map((r) => ({
      slug: r.slug,
      title: r.title,
      subtitle: r.subtitle || "",
      heroImage: r.hero_image || "",
      order: r.sort_order || 999,
    }));

    return NextResponse.json({ 
      success: true,
      regions 
    });
  } catch (error: any) {
    console.error("GET /api/regions error:", error);
    return NextResponse.json(
      { success: false, error: error.message, regions: [] },
      { status: 500 }
    );
  }
}
