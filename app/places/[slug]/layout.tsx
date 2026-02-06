import { getPlaceBySlug } from "@/lib/supabase";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const place = await getPlaceBySlug(params.slug);

    if (!place) {
      return {
        title: "Place Not Found | Slow Morocco",
        description: "This place could not be found.",
      };
    }

    const title = place.seo_title || `${place.name} | Places | Slow Morocco`;
    const description = place.seo_description || place.tagline || place.name;
    const imageUrl = place.hero_image || "";

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
    console.error("Error generating place metadata:", error);
    return {
      title: "Place | Slow Morocco",
      description: "Discover places in Morocco",
    };
  }
}

export default function PlaceLayout({ children }: Props) {
  return <>{children}</>;
}
