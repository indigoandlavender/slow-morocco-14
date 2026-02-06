import { NextResponse } from 'next/server';
import { getStories } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const storiesData = await getStories({ published: true });
    
    // Format stories and convert <br> to newlines
    const stories = storiesData.map((story) => ({
      slug: story.slug,
      title: story.title,
      subtitle: story.subtitle,
      category: story.category,
      sourceType: story.source_type,
      heroImage: story.hero_image,
      mj_prompt: story.mj_prompt,
      heroCaption: story.hero_caption,
      excerpt: story.excerpt,
      body: story.body ? story.body.replace(/<br>/g, '\n') : '',
      readTime: story.read_time,
      year: story.year,
      textBy: story.text_by,
      imagesBy: story.images_by,
      sources: story.sources,
      tags: story.tags,
      published: story.published,
      featured: story.featured,
      order: story.sort_order,
      the_facts: story.the_facts,
      region: story.region,
      country: story.country,
      theme: story.theme,
      era: story.era,
      era_start: story.era_start,
      era_end: story.era_end,
    }));

    return NextResponse.json({ stories });
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ stories: [], error: 'Failed to fetch stories' }, { status: 500 });
  }
}
