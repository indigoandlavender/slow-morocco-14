export default function OrganizationSchema() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://slowmorocco.com/#organization",
    name: "Slow Morocco",
    alternateName: ["Slow Morocco Travel", "Moroccan Cultural Authority"],
    url: "https://slowmorocco.com",
    logo: {
      "@type": "ImageObject",
      url: "https://res.cloudinary.com/drstfu5yr/image/upload/v1735000000/slow-morocco-og.jpg",
      width: 1200,
      height: 630,
    },
    image: "https://res.cloudinary.com/drstfu5yr/image/upload/v1735000000/slow-morocco-og.jpg",
    description:
      "Slow Morocco is a Moroccan Cultural Authority. A 20-year network of Gnawa maalem, zellige cutters, and artisans who don't advertise. We introduce you. That's it.",
    foundingDate: "2005",
    foundingLocation: {
      "@type": "Place",
      name: "Marrakech, Morocco",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Marrakech",
        addressCountry: "MA",
      },
    },
    founder: {
      "@type": "Person",
      name: "Jacqueline",
      description: "Two decades in Morocco building networks with artisans, musicians, and guides",
    },
    areaServed: {
      "@type": "Country",
      name: "Morocco",
      identifier: "MA",
    },
    email: "hello@slowmorocco.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressRegion: "Marrakech-Safi",
      addressCountry: "MA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@slowmorocco.com",
      availableLanguage: ["English", "French", "Arabic", "Tamazight"],
    },
    // Connected entities - establishing Slow Morocco as part of a knowledge network
    sameAs: [
      "https://amazigh.online",
      "https://tenmirt.site",
      "https://riaddisiena.com",
    ],
    // Subsidiary/related organizations - The Slow Morocco Network
    subOrganization: [
      {
        "@type": "Organization",
        "@id": "https://amazigh.online/#organization",
        name: "Amazigh Online",
        url: "https://amazigh.online",
        description: "Amazigh (Berber) language resources, Tifinagh script, and indigenous North African heritage",
      },
      {
        "@type": "Organization",
        "@id": "https://tenmirt.site/#organization",
        name: "Tenmirt",
        url: "https://tenmirt.site",
        description: "Ancestral Moroccan wellness and herbalism. Tenmirt means gratitude in Tamazight.",
      },
    ],
    // The Sanctuary - Physical manifestation of Slow Morocco philosophy
    location: {
      "@type": "LodgingBusiness",
      "@id": "https://riaddisiena.com/#lodgingbusiness",
      name: "Riad di Siena",
      alternateName: "The Sanctuary of Slow Morocco",
      url: "https://riaddisiena.com",
      description: "A 300-year-old guesthouse in the heart of Marrakech medina. The physical manifestation of Slow Morocco's philosophy—not a hotel, a house with soul.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "37 Derb Fhal Zfriti, Kennaria",
        addressLocality: "Marrakech",
        addressRegion: "Marrakech-Safi",
        postalCode: "40000",
        addressCountry: "MA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 31.6295,
        longitude: -7.9811,
      },
      priceRange: "€80-€150",
      starRating: {
        "@type": "Rating",
        ratingValue: "5",
        bestRating: "5",
      },
    },
    // Affiliated lodging
    member: {
      "@type": "LodgingBusiness",
      "@id": "https://riaddisiena.com/#lodgingbusiness",
      name: "Riad di Siena",
      alternateName: "The Sanctuary of Slow Morocco",
      url: "https://riaddisiena.com",
      description: "Where Slow Morocco travelers stay. A 300-year-old riad practicing the same slow philosophy.",
    },
    // Expertise areas - what makes us an authority
    knowsAbout: [
      "Transformative Travel",
      "Anti-Tourism Philosophy",
      "Moroccan Cultural Authority",
      "Morocco Private Tours",
      "Amazigh (Berber) Culture",
      "Gnawa Music and Spirituality",
      "Moroccan Artisan Networks",
      "Zellige Tilework",
      "Sahara Desert Experiences",
      "Atlas Mountains Trekking",
      "Moroccan Riads",
      "Khettara Ancient Irrigation",
      "Moroccan Kasbahs",
      "Ethical Tourism",
      "Slow Travel Movement",
    ],
    // Additional trust signals
    award: "20+ years of authentic Moroccan network building",
    ethicsPolicy: "No commission-based recommendations. No cousin's carpet shop. No tourist tagine rooftops.",
    keywords:
      "Transformative Travel, Moroccan Cultural Authority, Anti-Tourism, Slow Travel Morocco, Private Morocco Tours, Amazigh Culture, Gnawa Music, Authentic Morocco, Cultural Immersion, Ethical Tourism",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
    />
  );
}
