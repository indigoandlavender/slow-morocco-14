import { Metadata } from "next";
import { getSheetData, convertDriveUrl } from "@/lib/sheets";

interface DayTripData {
  Slug: string;
  Title: string;
  Description?: string;
  HeroImage?: string;
  Duration?: string;
  FromCity?: string;
  Price?: string;
}

async function getDayTrip(slug: string): Promise<DayTripData | null> {
  try {
    const dayTrips = await getSheetData("DayTrips");
    const trip = dayTrips.find(
      (t: any) => t.Slug === slug && t.Published?.toLowerCase() === "true"
    );
    return trip || null;
  } catch (error) {
    console.error("Error fetching day trip for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getDayTrip(slug);

  if (!trip) {
    return {
      title: "Day Trip Not Found",
      description: "The requested day trip could not be found.",
    };
  }

  const title = trip.Title;
  const description = trip.Description?.slice(0, 160) || 
    `${trip.Title} - a private day trip from ${trip.FromCity || 'Marrakech'} with Slow Morocco.`;
  const heroImage = trip.HeroImage ? convertDriveUrl(trip.HeroImage) : null;

  return {
    title: title,
    description: description,
    keywords: [
      "morocco day trip",
      trip.FromCity?.toLowerCase(),
      "private day trip morocco",
      "marrakech excursion",
    ].filter((k): k is string => Boolean(k)),
    openGraph: {
      title: `${title} | Slow Morocco`,
      description: description,
      url: `https://slowmorocco.com/day-trips/${slug}`,
      type: "website",
      images: heroImage
        ? [
            {
              url: heroImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Slow Morocco`,
      description: description,
      images: heroImage ? [heroImage] : undefined,
    },
    alternates: {
      canonical: `https://slowmorocco.com/day-trips/${slug}`,
    },
  };
}

export default function DayTripLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
