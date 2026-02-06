import { NextResponse } from "next/server";
import { getTestimonials } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const testimonials = await getTestimonials({ published: true });

    const formatted = testimonials.map((t) => ({
      id: t.testimonial_id,
      quote: t.quote || "",
      author: t.author || "",
      journeyTitle: t.journey_title || "",
    }));

    return NextResponse.json({ testimonials: formatted });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
