import { NextRequest, NextResponse } from "next/server";
import { getJourneys } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "";
  const tags = searchParams.get("tags") || "";
  const excludeSlug = searchParams.get("exclude") || "";
  const limit = parseInt(searchParams.get("limit") || "3");

  if (!region && !tags) {
    return NextResponse.json({ journeys: [] });
  }

  try {
    const journeys = await getJourneys({ published: true });

    // Filter by region or tags
    const tagList = tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);

    const related = journeys
      .filter((j) => {
        // Exclude current journey
        if (excludeSlug && j.slug === excludeSlug) return false;

        // Match by region
        if (region && j.region?.toLowerCase() === region.toLowerCase()) return true;

        // Match by tags
        if (tagList.length > 0) {
          const journeyTags = (j.tags || "").toLowerCase();
          return tagList.some((tag) => journeyTags.includes(tag));
        }

        return false;
      })
      .slice(0, limit)
      .map((j) => ({
        slug: j.slug,
        title: j.title,
        tagline: j.tagline || j.short_description || "",
        heroImage: j.hero_image_url || "",
        duration: j.duration_days || 0,
        region: j.region || "",
      }));

    return NextResponse.json({ journeys: related });
  } catch (error) {
    console.error("Error fetching related journeys:", error);
    return NextResponse.json({ journeys: [] });
  }
}
