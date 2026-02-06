import { NextResponse } from "next/server";
import { getQuotes, createQuote } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ exists: false });
    }

    const quotes = await getQuotes();
    const exists = quotes.some(
      (q) => q.email?.toLowerCase() === email.toLowerCase()
    );

    return NextResponse.json({ exists });
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json({ exists: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      country,
      travelDates,
      flexibility,
      groupSize,
      interests,
      accommodationStyle,
      pace,
      budget,
      notes,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const quoteId = `QT-${Date.now()}`;

    await createQuote({
      quote_id: quoteId,
      name,
      email,
      country: country || "",
      travel_dates: travelDates || "",
      flexibility: flexibility || "",
      group_size: groupSize ? parseInt(groupSize, 10) : null,
      interests: Array.isArray(interests) ? interests.join(", ") : interests || "",
      accommodation_style: accommodationStyle || "",
      pace: pace || "",
      budget: budget || "",
      notes: notes || "",
      status: "new",
    });

    return NextResponse.json({
      success: true,
      quoteId,
      message: "Thank you! We'll be in touch within 24 hours.",
    });
  } catch (error) {
    console.error("Error submitting quote:", error);
    return NextResponse.json(
      { error: "Failed to submit quote request" },
      { status: 500 }
    );
  }
}
