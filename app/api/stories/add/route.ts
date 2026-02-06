import { NextResponse } from "next/server";
import { createStory, storyExistsBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stories } = body;

    if (!stories || !Array.isArray(stories)) {
      return NextResponse.json(
        { error: "Stories array is required" },
        { status: 400 }
      );
    }

    const results = {
      added: [] as string[],
      skipped: [] as string[],
      errors: [] as string[],
    };

    for (const story of stories) {
      if (!story.slug) {
        results.errors.push("Story missing slug");
        continue;
      }

      const exists = await storyExistsBySlug(story.slug);
      if (exists) {
        results.skipped.push(story.slug);
        continue;
      }

      try {
        await createStory({
          slug: story.slug,
          title: story.title || "",
          subtitle: story.subtitle || "",
          category: story.category || "",
          source_type: story.sourceType || "",
          hero_image: story.heroImage || "",
          hero_caption: story.heroCaption || "",
          excerpt: story.excerpt || "",
          body: story.body || "",
          read_time: story.readTime || null,
          year: story.year || null,
          text_by: story.textBy || "",
          images_by: story.imagesBy || "",
          sources: story.sources || "",
          tags: story.tags || "",
          featured: story.featured || false,
          published: story.published !== false,
          sort_order: story.sortOrder || null,
          the_facts: story.theFacts || "",
          region: story.region || "",
          country: story.country || "",
          theme: story.theme || "",
          era: story.era || "",
          era_start: story.eraStart || null,
          era_end: story.eraEnd || null,
          mj_prompt: story.mjPrompt || "",
          related_place_slugs: story.relatedPlaceSlugs || "",
          related_story_slugs: story.relatedStorySlugs || "",
          seo_title: story.seoTitle || "",
          seo_description: story.seoDescription || "",
        });
        results.added.push(story.slug);
      } catch (err) {
        console.error(`Error adding story ${story.slug}:`, err);
        results.errors.push(story.slug);
      }
    }

    return NextResponse.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error("Error adding stories:", error);
    return NextResponse.json(
      { error: "Failed to add stories" },
      { status: 500 }
    );
  }
}
