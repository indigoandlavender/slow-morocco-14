import { NextResponse } from 'next/server';
import { getStoryBySlug } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const storyData = await getStoryBySlug(params.slug);
    
    if (!storyData) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Format story for API response
    const story = {
      slug: storyData.slug,
      title: storyData.title,
      subtitle: storyData.subtitle,
      category: storyData.category,
      sourceType: storyData.source_type,
      heroImage: storyData.hero_image,
      mj_prompt: storyData.mj_prompt,
      heroCaption: storyData.hero_caption,
      excerpt: storyData.excerpt,
      body: storyData.body ? storyData.body.replace(/<br>/g, '\n') : '',
      readTime: storyData.read_time,
      year: storyData.year,
      textBy: storyData.text_by,
      imagesBy: storyData.images_by,
      sources: storyData.sources,
      tags: storyData.tags,
      published: storyData.published,
      featured: storyData.featured,
      order: storyData.sort_order,
      the_facts: storyData.the_facts,
      region: storyData.region,
      country: storyData.country,
      theme: storyData.theme,
      era: storyData.era,
      era_start: storyData.era_start,
      era_end: storyData.era_end,
    };

    // Story images not yet migrated - return empty array
    const images: any[] = [];

    return NextResponse.json({ story, images });
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
}
