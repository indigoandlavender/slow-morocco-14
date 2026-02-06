import { NextResponse } from "next/server";
import { getProposals, createProposal } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const proposals = await getProposals();

    const formatted = proposals.map((p) => ({
      id: p.proposal_id,
      clientId: p.client_id,
      clientName: p.client_name,
      country: p.country,
      heroTitle: p.hero_title,
      days: p.days,
      nights: p.nights,
      numGuests: p.num_guests,
      totalPrice: p.total_price,
      formattedPrice: p.formatted_price,
      createdAt: p.created_at,
    }));

    return NextResponse.json({ proposals: formatted });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const proposalId = `PRP-${Date.now()}`;

    await createProposal({
      proposal_id: proposalId,
      client_id: body.clientId || "",
      client_name: body.clientName || "",
      country: body.country || null,
      hero_image_url: body.heroImageUrl || "",
      hero_title: body.heroTitle || "",
      hero_blurb: body.heroBlurb || "",
      start_date: body.startDate || null,
      end_date: body.endDate || null,
      days: body.days || null,
      nights: body.nights || null,
      num_guests: body.numGuests || null,
      total_price: body.totalPrice || null,
      formatted_price: body.formattedPrice || "",
      route_points: body.routePoints || [],
      days_list: body.daysList || [],
    });

    return NextResponse.json({
      success: true,
      proposalId,
    });
  } catch (error) {
    console.error("Error creating proposal:", error);
    return NextResponse.json(
      { error: "Failed to create proposal" },
      { status: 500 }
    );
  }
}
