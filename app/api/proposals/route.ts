import { NextResponse } from "next/server";
import { getProposalById } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get("id");

    if (!proposalId) {
      return NextResponse.json(
        { error: "Proposal ID is required" },
        { status: 400 }
      );
    }

    const proposal = await getProposalById(proposalId);

    if (!proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      proposal: {
        id: proposal.proposal_id,
        clientId: proposal.client_id,
        clientName: proposal.client_name,
        country: proposal.country,
        heroImageUrl: proposal.hero_image_url,
        heroTitle: proposal.hero_title,
        heroBlurb: proposal.hero_blurb,
        startDate: proposal.start_date,
        endDate: proposal.end_date,
        days: proposal.days,
        nights: proposal.nights,
        numGuests: proposal.num_guests,
        totalPrice: proposal.total_price,
        formattedPrice: proposal.formatted_price,
        routePoints: proposal.route_points || [],
        daysList: proposal.days_list || [],
        createdAt: proposal.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return NextResponse.json(
      { error: "Failed to fetch proposal" },
      { status: 500 }
    );
  }
}
