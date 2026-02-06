import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { findRelatedJourneys } from "@/lib/content-matcher";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  return auth;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "";
  const tags = searchParams.get("tags") || "";
  const category = searchParams.get("category") || "";
  const limit = parseInt(searchParams.get("limit") || "3");

  if (!region && !tags) {
    return NextResponse.json({ journeys: [] });
  }

  try {
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: "v4", auth });

    // Fetch all journeys
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "Website_Journeys!A:Z",
    });

    const rows = response.data.values || [];
    if (rows.length < 2) {
      return NextResponse.json({ journeys: [] });
    }

    const headers = rows[0].map((h: string) => h.toLowerCase().replace(/\s+/g, "_"));
    const journeys = rows.slice(1).map((row) => {
      const journey: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        journey[header] = row[index] || "";
      });
      return journey;
    });

    // Filter to published journeys only
    const publishedJourneys = journeys.filter(
      (j) => j.published?.toLowerCase() === "true" || j.published === "TRUE"
    );

    // Find related journeys
    const related = findRelatedJourneys(
      region,
      tags,
      category,
      publishedJourneys.map((j) => ({
        slug: j.slug,
        title: j.title,
        destinations: j.destinations,
        focus: j.focus_type || j.focus,
        heroImage: j.hero_image_url || j.heroimage,
        duration: parseInt(j.duration_days) || 0,
        price: parseInt(j.price_eur) || 0,
      })),
      limit
    );

    return NextResponse.json({ journeys: related });
  } catch (error) {
    console.error("Error fetching related journeys:", error);
    return NextResponse.json({ journeys: [] });
  }
}
