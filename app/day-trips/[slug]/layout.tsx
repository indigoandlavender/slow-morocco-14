import { getDayTripBySlug } from "@/lib/supabase";
import { Metadata } from "next";

type Props = {
  params: { slug: string };
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const dayTrip = await getDayTripBySlug(params.slug);

    if (!dayTrip) {
      return {
        title: "Day Trip Not Found | Slow Morocco",
        description: "This day trip could not be found.",
      };
    }

    const title = dayTrip.seo_title || `${dayTrip.title} | Day Trips | Slow Morocco`;
    const description =
      dayTrip.seo_description || dayTrip.short_description || dayTrip.title;
    const imageUrl = dayTrip.hero_image_url || "";

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
    console.error("Error generating day trip metadata:", error);
    return {
      title: "Day Trip | Slow Morocco",
      description: "Day trips from Marrakech",
    };
  }
}

export default function DayTripLayout({ children }: Props) {
  return <>{children}</>;
}
