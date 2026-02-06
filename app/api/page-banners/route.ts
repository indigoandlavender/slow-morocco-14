import { NextResponse } from "next/server";
import { getPageBanners, getPageBannerBySlug } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  try {
    // If slug provided, return single banner
    if (slug) {
      const banner = await getPageBannerBySlug(slug);
      return NextResponse.json({ 
        banner: banner ? {
          page_slug: banner.page_slug,
          hero_image_url: banner.hero_image_url || "",
          title: banner.title || "",
          subtitle: banner.subtitle || "",
          label_text: banner.label_text || "",
        } : null 
      });
    }

    const bannersData = await getPageBanners();
    
    const banners = bannersData.map((row) => ({
      page_slug: row.page_slug,
      hero_image_url: row.hero_image_url || "",
      title: row.title || "",
      subtitle: row.subtitle || "",
      label_text: row.label_text || "",
    }));

    return NextResponse.json({ banners });
  } catch (error) {
    console.error("Page Banners API error:", error);
    return NextResponse.json({ error: "Failed to fetch page banners", banners: [], banner: null }, { status: 500 });
  }
}
