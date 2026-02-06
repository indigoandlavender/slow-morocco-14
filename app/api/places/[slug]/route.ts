import { NextResponse } from "next/server";
import { getPlaceBySlug, getPlaceImages } from "@/lib/supabase";

export const revalidate = 60;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const place = await getPlaceBySlug(slug);
    
    if (!place) {
      return NextResponse.json(
        { success: false, error: "Place not found" },
        { status: 404 }
      );
    }

    // Get gallery images
    const images = await getPlaceImages(slug);

    return NextResponse.json({
      success: true,
      place: {
        slug: place.slug || "",
        title: place.title || "",
        destination: place.destination || "",
        category: place.category || "",
        address: place.address || "",
        openingHours: place.opening_hours || "",
        fees: place.fees || "",
        notes: place.notes || "",
        heroImage: place.hero_image || "",
        heroCaption: place.hero_caption || "",
        excerpt: place.excerpt || "",
        body: place.body || "",
        sources: place.sources || "",
        tags: place.tags || "",
      },
      images: images.map((img) => ({
        url: img.image_url || "",
        caption: img.caption || "",
        order: img.image_order,
      })),
    });
  } catch (error: any) {
    console.error("GET /api/places/[slug] error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
