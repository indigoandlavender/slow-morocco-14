import { getJourneyBySlug } from "@/lib/supabase";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const journey = await getJourneyBySlug(params.slug);

    if (!journey) {
      return {
        title: "Journey Not Found | Slow Morocco",
        description: "This journey could not be found.",
      };
    }

    const title = journey.seo_title || `${journey.title} | Slow Morocco`;
    const description =
      journey.seo_description || journey.tagline || journey.title;
    const imageUrl = journey.hero_image || "";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [{ url: imageUrl }] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    console.error("Error generating journey metadata:", error);
    return {
      title: "Journey | Slow Morocco",
      description: "Discover Morocco with Slow Morocco",
    };
  }
}

export default function JourneyLayout({ children }: Props) {
  return <>{children}</>;
}
