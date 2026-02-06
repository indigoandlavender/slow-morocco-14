import { NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const quotes = await getQuotes();

    const formatted = quotes.map((q) => ({
      id: q.quote_id,
      name: q.name,
      email: q.email,
      country: q.country,
      travelDates: q.travel_dates,
      flexibility: q.flexibility,
      groupSize: q.group_size,
      interests: q.interests,
      accommodationStyle: q.accommodation_style,
      pace: q.pace,
      budget: q.budget,
      notes: q.notes,
      status: q.status,
      createdAt: q.created_at,
    }));

    return NextResponse.json({ quotes: formatted });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const quoteId = `QT-${Date.now()}`;

    await createQuote({
      quote_id: quoteId,
      name: body.name || "",
      email: body.email || "",
      country: body.country || "",
      travel_dates: body.travelDates || "",
      flexibility: body.flexibility || "",
      group_size: body.groupSize ? parseInt(body.groupSize, 10) : null,
      interests: body.interests || "",
      accommodation_style: body.accommodationStyle || "",
      pace: body.pace || "",
      budget: body.budget || "",
      notes: body.notes || "",
      status: body.status || "new",
    });

    return NextResponse.json({
      success: true,
      quoteId,
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}
