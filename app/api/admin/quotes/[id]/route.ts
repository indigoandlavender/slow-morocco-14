import { NextResponse } from "next/server";
import { getQuoteById, updateQuote } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const quote = await getQuoteById(params.id);

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({
      quote: {
        id: quote.quote_id,
        name: quote.name,
        email: quote.email,
        country: quote.country,
        travelDates: quote.travel_dates,
        flexibility: quote.flexibility,
        groupSize: quote.group_size,
        interests: quote.interests,
        accommodationStyle: quote.accommodation_style,
        pace: quote.pace,
        budget: quote.budget,
        notes: quote.notes,
        status: quote.status,
        createdAt: quote.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const updates: Record<string, any> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.country !== undefined) updates.country = body.country;
    if (body.travelDates !== undefined) updates.travel_dates = body.travelDates;
    if (body.flexibility !== undefined) updates.flexibility = body.flexibility;
    if (body.groupSize !== undefined) updates.group_size = body.groupSize;
    if (body.interests !== undefined) updates.interests = body.interests;
    if (body.accommodationStyle !== undefined)
      updates.accommodation_style = body.accommodationStyle;
    if (body.pace !== undefined) updates.pace = body.pace;
    if (body.budget !== undefined) updates.budget = body.budget;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.status !== undefined) updates.status = body.status;

    await updateQuote(params.id, updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    if (!body.status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    await updateQuote(params.id, { status: body.status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating quote status:", error);
    return NextResponse.json(
      { error: "Failed to update quote status" },
      { status: 500 }
    );
  }
}
