import { NextResponse } from "next/server";
import { getWebsiteGuides } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const guides = await getWebsiteGuides({ published: true });

    const formatted = guides.map((g) => ({
      id: g.guide_id,
      title: g.title || "",
      slug: g.slug || "",
      subtitle: g.subtitle || "",
      imageUrl: g.image_url || "",
      description: g.description || "",
    }));

    return NextResponse.json({ guides: formatted });
  } catch (error) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch guides" },
      { status: 500 }
    );
  }
}
