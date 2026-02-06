import { NextResponse } from "next/server";
import { getGentleJourneys, getGentleSettings, getWebsiteTeam } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const [journeysData, teamData, settingsData] = await Promise.all([
      getGentleJourneys({ published: true }),
      getWebsiteTeam({ published: true, showOnGentle: true }),
      getGentleSettings(),
    ]);

    const settings: { [key: string]: string } = {};
    settingsData.forEach((row) => {
      if (row.key) settings[row.key] = row.value || "";
    });

    const journeys = journeysData.map((j) => ({
      id: j.journey_id,
      title: j.title || "",
      slug: j.slug || "",
      heroImage: j.hero_image_url || "",
      tagline: j.tagline || "",
      description: j.description || "",
      duration: j.duration_days || 0,
      price: j.price_eur || 0,
      cities: j.route_cities || "",
      highlights: j.highlights ? j.highlights.split("|").filter(Boolean) : [],
      accessibilityNotes: j.accessibility_notes
        ? j.accessibility_notes.split("|").filter(Boolean)
        : [],
    }));

    const team = teamData.map((t) => ({
      id: t.team_id,
      name: t.name || "",
      role: t.role || "",
      quote: t.quote || "",
      bio: t.bio || "",
      image: t.image_url || "",
    }));

    return NextResponse.json({
      journeys,
      team,
      settings: {
        heroTitle: settings.hero_title || "Built for you. Not adapted.",
        heroSubtitle:
          settings.hero_subtitle ||
          "Journeys designed around how you actually travel.",
        heroImage: settings.hero_image || "",
      },
    });
  } catch (error) {
    console.error("Error fetching gentle journeys:", error);
    return NextResponse.json(
      { error: "Failed to fetch gentle journeys" },
      { status: 500 }
    );
  }
}
