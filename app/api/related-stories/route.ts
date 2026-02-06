import { NextRequest, NextResponse } from "next/server";
import { getStories } from "@/lib/supabase";
import { findRelatedStories } from "@/lib/content-matcher";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const destinations = searchParams.get("destinations") || "";
  const focus = searchParams.get("focus") || "";
  const limit = parseInt(searchParams.get("limit") || "4");

  if (!destinations) {
    return NextResponse.json({ stories: [] });
  }

  try {
    // Fetch published stories from Supabase
    const storiesData = await getStories({ published: true });

    // Find related stories
    const related = findRelatedStories(
      destinations,
      focus,
      storiesData.map((s) => ({
        slug: s.slug,
        title: s.title,
        region: s.region || "",
        tags: s.tags || "",
        category: s.category || "",
        heroImage: s.hero_image || "",
        excerpt: s.excerpt || "",
      })),
      limit
    );

    return NextResponse.json({ stories: related });
  } catch (error) {
    console.error("Error fetching related stories:", error);
    return NextResponse.json({ stories: [] });
  }
}
