interface PlaceSchemaProps {
  place: {
    title: string;
    slug: string;
    destination?: string;
    category?: string;
    heroImage?: string;
    body?: string;
    latitude?: number;
    longitude?: number;
  };
}

export default function PlaceSchema({ place }: PlaceSchemaProps) {
  // Extract first ~160 chars from body for description
  const description = place.body 
    ? place.body.replace(/<[^>]*>/g, '').slice(0, 160) + '...'
    : `Discover ${place.title} in ${place.destination || 'Morocco'}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.title,
    description: description,
    url: `https://slowmorocco.com/places/${place.slug}`,
    image: place.heroImage || "https://slowmorocco.com/og-image.jpg",
    ...(place.latitude && place.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: place.latitude,
        longitude: place.longitude,
      },
    }),
    address: {
      "@type": "PostalAddress",
      addressLocality: place.destination || "Morocco",
      addressCountry: "MA",
    },
    isAccessibleForFree: true,
    publicAccess: true,
    touristType: ["Cultural tourism", "Sightseeing"],
    containedInPlace: {
      "@type": "Country",
      name: "Morocco",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
