import { NextResponse } from 'next/server';
import { appendSheetData, getSheetData } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

// Story fields in the order they appear in the Google Sheet
const STORY_HEADERS = [
  'slug',
  'title',
  'subtitle',
  'category',
  'sourceType',
  'heroImage',
  'heroCaption',
  'excerpt',
  'body',
  'readTime',
  'year',
  'textBy',
  'imagesBy',
  'sources',
  'the_facts',
  'tags',
  'region',
  'published',
  'order',
  'featured',
  'midjourney_prompt'
];

interface StoryData {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  sourceType?: string;
  heroImage?: string;
  heroCaption?: string;
  excerpt?: string;
  body?: string;
  readTime?: string;
  year?: string;
  textBy?: string;
  imagesBy?: string;
  sources?: string;
  the_facts?: string;
  tags?: string;
  region?: string;
  published?: string;
  order?: string;
  featured?: string;
  midjourney_prompt?: string;
}

export async function POST(request: Request) {
  try {
    const { stories }: { stories: StoryData[] } = await request.json();

    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      return NextResponse.json(
        { error: 'stories array is required' },
        { status: 400 }
      );
    }

    // Get existing stories to check for duplicate slugs
    const existingStories = await getSheetData('Stories');
    const existingSlugs = new Set(existingStories.map((s: any) => s.slug));

    // Filter out stories with duplicate slugs
    const newStories = stories.filter(story => {
      if (!story.slug || !story.title) {
        console.warn('Skipping story without slug or title');
        return false;
      }
      if (existingSlugs.has(story.slug)) {
        console.warn(`Skipping duplicate slug: ${story.slug}`);
        return false;
      }
      return true;
    });

    if (newStories.length === 0) {
      return NextResponse.json(
        { error: 'No valid new stories to add (all slugs may already exist)' },
        { status: 400 }
      );
    }

    // Convert stories to row format
    const rows = newStories.map(story => {
      return STORY_HEADERS.map(header => story[header as keyof StoryData] || '');
    });

    // Append to sheet
    await appendSheetData('Stories', rows);

    return NextResponse.json({
      success: true,
      message: `Added ${newStories.length} stories`,
      slugs: newStories.map(s => s.slug)
    });
  } catch (error) {
    console.error('Error adding stories:', error);
    return NextResponse.json(
      { error: 'Failed to add stories' },
      { status: 500 }
    );
  }
}
