import { NextResponse } from "next/server";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // Fetch gentle journeys
    const journeys = await getSheetData("Gentle_Journeys");
    
    // Fetch team members
    const team = await getSheetData("Website_Team");
    
    // Fetch settings
    const settingsRaw = await getSheetData("Gentle_Settings");
    
    // Convert settings array to object
    const settings: Record<string, string> = {};
    settingsRaw.forEach((row: any) => {
      if (row.Key) {
        settings[row.Key] = row.Value || "";
      }
    });

    // Format journeys
    const formattedJourneys = journeys
      .filter((j: any) => {
        const pub = String(j.Published || "").toLowerCase().trim();
        return pub === "true" || pub === "yes" || pub === "1";
      })
      .sort((a: any, b: any) => (parseInt(a.Order) || 99) - (parseInt(b.Order) || 99))
      .map((j: any) => ({
        id: j.Journey_ID || "",
        title: j.Title || "",
        slug: j.Slug || "",
        heroImage: convertDriveUrl(j.Hero_Image_URL || ""),
        tagline: j.Tagline || "",
        description: j.Description || "",
        duration: parseInt(j.Duration_Days) || 0,
        price: parseInt(j.Price_EUR) || 0,
        cities: j.Route_Cities || "",
        highlights: (j.Highlights || "").split("|").filter(Boolean),
        accessibilityNotes: (j.Accessibility_Notes || "").split("|").filter(Boolean),
      }));

    // Format team
    const formattedTeam = team
      .filter((t: any) => {
        const pub = String(t.Published || "").toLowerCase().trim();
        const showOnGentle = String(t.Show_On_Gentle || "").toLowerCase().trim();
        return (pub === "true" || pub === "yes" || pub === "1") &&
               (showOnGentle === "true" || showOnGentle === "yes" || showOnGentle === "1");
      })
      .sort((a: any, b: any) => (parseInt(a.Order) || 99) - (parseInt(b.Order) || 99))
      .map((t: any) => ({
        id: t.Team_ID || "",
        name: t.Name || "",
        role: t.Role || "",
        quote: t.Quote || "",
        bio: t.Bio || "",
        image: convertDriveUrl(t.Image_URL || ""),
      }));

    // Build WhatsApp URL
    const whatsappNumber = (settings.whatsapp_number || "+212618070450").replace(/\D/g, "");
    const whatsappMessage = encodeURIComponent(settings.whatsapp_message || "Hello, I'd like to talk about travelling to Morocco");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    return NextResponse.json({
      success: true,
      journeys: formattedJourneys,
      team: formattedTeam,
      settings: {
        heroTitle: settings.hero_title || "Built for you. Not adapted.",
        heroSubtitle: settings.hero_subtitle || "",
        heroTagline: settings.hero_tagline || "A Slow Morocco Collection",
        founderNoteTitle: settings.founder_note_title || "Why I built this",
        founderNoteBody: settings.founder_note_body || "",
        whatsappUrl,
        whatsappNumber: settings.whatsapp_number || "+212618070450",
        contactEmail: settings.contact_email || "hello@slowmorocco.com",
        requirements: [
          { title: "Travel insurance", description: settings.requirement_insurance || "" },
          { title: "Doctor's clearance", description: settings.requirement_doctor || "" },
          { title: "Honest conversation", description: settings.requirement_honesty || "" },
        ].filter(r => r.description),
        promises: [
          { title: "Medical care within reach", description: settings.promise_medical || "" },
          { title: "A dedicated team", description: settings.promise_team || "" },
          { title: "Complete honesty", description: settings.promise_honesty || "" },
        ].filter(p => p.description),
      },
    });
  } catch (error: any) {
    console.error("Gentle journeys fetch error:", error);
    return NextResponse.json(
      { 
        success: false, 
        journeys: [], 
        team: [],
        settings: {},
        error: error.message 
      },
      { status: 500 }
    );
  }
}
