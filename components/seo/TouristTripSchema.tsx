interface TouristTripSchemaProps {
  journey: {
    title: string;
    slug: string;
    description: string;
    heroImage?: string;
    durationDays: number;
    duration: string;
    startCity: string;
    destinations?: string;
    price?: number;
    epicPrice?: number;
  };
}

export default function TouristTripSchema({ journey }: TouristTripSchemaProps) {
  const price = journey.epicPrice || journey.price;
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: journey.title,
    description: journey.description,
    url: `https://slowmorocco.com/journeys/${journey.slug}`,
    image: journey.heroImage || "https://slowmorocco.com/og-image.jpg",
    touristType: ["Cultural tourism", "Luxury travel", "Adventure travel"],
    itinerary: {
      "@type": "ItemList",
      numberOfItems: journey.durationDays,
      itemListElement: journey.destinations?.split(",").map((dest, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: dest.trim(),
      })) || [],
    },
    provider: {
      "@type": "TravelAgency",
      name: "Slow Morocco",
      url: "https://slowmorocco.com",
      email: "hello@slowmorocco.com",
    },
    ...(price && {
      offers: {
        "@type": "Offer",
        price: price,
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString().split('T')[0],
        url: `https://slowmorocco.com/journeys/${journey.slug}`,
        seller: {
          "@type": "TravelAgency",
          name: "Slow Morocco",
        },
      },
    }),
    duration: `P${journey.durationDays}D`,
    subjectOf: {
      "@type": "CreativeWork",
      abstract: journey.description,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
