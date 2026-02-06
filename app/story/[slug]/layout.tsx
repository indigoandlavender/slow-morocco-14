import { getStoryBySlug } from "@/lib/supabase";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const story = await getStoryBySlug(params.slug);

    if (!story) {
      return {
        title: "Story Not Found | Slow Morocco",
        description: "This story could not be found.",
      };
    }

    const title = story.seo_title || `${story.title} | Slow Morocco`;
    const description = story.seo_description || story.excerpt || story.subtitle || "";
    const imageUrl = story.hero_image || "";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [{ url: imageUrl }] : [],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating story metadata:", error);
    return {
      title: "Story | Slow Morocco",
      description: "Stories from Morocco",
    };
  }
}

export default function StoryLayout({ children }: Props) {
  return <>{children}</>;
}
