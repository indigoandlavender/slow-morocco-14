import type { Metadata } from "next";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Accessible Morocco Tours | Gentle Journeys for Mobility Challenges | Slow Morocco",
  description: "Private Morocco tours designed for travellers with mobility challenges. Wheelchair-friendly routes, ground-floor riads, shorter drives, accessible vehicles. Experience Marrakech, Fes, the coast & desert at your pace.",
  keywords: [
    "accessible Morocco tours",
    "wheelchair Morocco travel",
    "mobility friendly Morocco",
    "disabled travel Morocco",
    "accessible Marrakech",
    "wheelchair friendly Fes",
    "senior travel Morocco",
    "limited mobility Morocco",
    "accessible riad Morocco",
    "ground floor accommodation Morocco",
    "gentle Morocco tours",
    "slow travel Morocco",
    "accessible desert tour",
    "Morocco for seniors",
    "accessible North Africa",
    "barrier free Morocco",
  ].join(", "),
  openGraph: {
    title: "Accessible Morocco Tours | Gentle Journeys",
    description: "Private tours for travellers with mobility challenges. Wheelchair-friendly routes, accessible riads, shorter drives.",
    url: "https://slowmorocco.com/go/gentle",
    siteName: "Slow Morocco",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://res.cloudinary.com/drstfu5yr/image/upload/v1767309989/marrakech-and-the-sea_i5aacd.png",
        width: 1200,
        height: 630,
        alt: "Gentle Journeys - Accessible Morocco Tours",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessible Morocco Tours | Slow Morocco",
    description: "Private tours designed for mobility challenges. Wheelchair-friendly, ground-floor riads, shorter drives.",
  },
  alternates: {
    canonical: "https://slowmorocco.com/go/gentle",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const gentleFAQs = [
  {
    question: "Are your Morocco tours wheelchair accessible?",
    answer: "Yes, our Gentle Journeys are designed for wheelchair users and travellers with mobility challenges. We select ground-floor accommodations, accessible restaurants, and routes that minimize stairs and uneven terrain. We work with you to understand your specific needs before travel.",
  },
  {
    question: "Can I visit the Marrakech medina with mobility challenges?",
    answer: "Yes, with planning. While the medina has uneven surfaces, we know the accessible routes, can arrange wheelchair-friendly transport to key sites, and select riads with ground-floor rooms and step-free access. Our guides are experienced in navigating the medina with mobility-challenged guests.",
  },
  {
    question: "Do you provide wheelchair accessible vehicles in Morocco?",
    answer: "We arrange vehicles appropriate to your needs, including cars with extra legroom and vans that can accommodate wheelchairs. For travellers requiring wheelchair-accessible vehicles with ramps or lifts, we source specialist transport with advance notice.",
  },
  {
    question: "Can I visit the Sahara desert with limited mobility?",
    answer: "Our Desert Light journey offers the Sahara experience without the challenging dunes. You'll see rose-gold kasbahs, palm oases, and dramatic desert landscapes from accessible viewpoints. For those who can manage some uneven ground, we can arrange brief desert experiences with full support.",
  },
  {
    question: "What accommodations do you use for accessible tours?",
    answer: "We select riads and hotels with ground-floor rooms, grab rails where possible, step-free or minimal-step access, and accessible bathrooms. We personally inspect properties and match them to your specific requirements. Many traditional riads have been adapted for accessibility.",
  },
  {
    question: "How long are the drives on Gentle Journeys?",
    answer: "We keep driving segments shorter than standard tours—typically 2-3 hours maximum between stops. Frequent comfort breaks, scenic stops, and flexible timing are built into every day. You'll never feel rushed or uncomfortable.",
  },
  {
    question: "Can you accommodate seniors travelling to Morocco?",
    answer: "Absolutely. Many of our Gentle Journey guests are active seniors who prefer a slower pace. We design itineraries with rest time, avoid early starts, include comfortable restaurants with seating, and ensure manageable walking distances.",
  },
  {
    question: "Do your guides have experience with disabled travellers?",
    answer: "Yes, our Gentle Journey guides are specifically selected for their patience, experience with mobility-challenged guests, and knowledge of accessible routes. They're trained to anticipate needs and adapt on the go.",
  },
  {
    question: "Can I rent mobility equipment in Morocco?",
    answer: "We can help arrange wheelchair rental, walking aids, and other mobility equipment in major cities. Let us know your needs in advance and we'll coordinate everything before your arrival.",
  },
  {
    question: "What if my mobility needs change during the trip?",
    answer: "Flexibility is built into every Gentle Journey. If you need more rest, want to skip an activity, or require additional support, we adapt immediately. Your comfort and safety always come first.",
  },
];

// Breadcrumbs
const breadcrumbs = [
  { name: "Home", url: "https://slowmorocco.com" },
  { name: "Journeys", url: "https://slowmorocco.com/journeys" },
  { name: "Gentle Journeys", url: "https://slowmorocco.com/go/gentle" },
];

// TouristDestination schema for accessible travel
const accessibleTravelSchema = {
  "@context": "https://schema.org",
  "@type": "TouristTrip",
  name: "Gentle Journeys - Accessible Morocco Tours",
  description: "Private Morocco tours designed for travellers with mobility challenges, wheelchair users, and seniors seeking a slower pace.",
  url: "https://slowmorocco.com/go/gentle",
  touristType: ["Wheelchair users", "Seniors", "Travellers with disabilities", "Limited mobility travellers"],
  provider: {
    "@type": "TravelAgency",
    name: "Slow Morocco",
    url: "https://slowmorocco.com",
  },
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "2200",
    highPrice: "3200",
    priceCurrency: "EUR",
    offerCount: "4",
  },
  itinerary: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Marrakech & The Sea",
        description: "7 days - Gardens, galleries, and Atlantic coast",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Atlantic Coast",
        description: "8 days - Casablanca to Essaouira by the sea",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Imperial Cities",
        description: "9 days - Four royal cities, accessible routes",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Desert Light",
        description: "7 days - Kasbahs and palm groves without the dunes",
      },
    ],
  },
};

// Service schema
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Accessible Morocco Tours",
  alternateName: "Gentle Journeys",
  description: "Private, customized Morocco tours for travellers with mobility challenges, including wheelchair users, seniors, and those with limited mobility.",
  provider: {
    "@type": "TravelAgency",
    name: "Slow Morocco",
    url: "https://slowmorocco.com",
  },
  serviceType: "Accessible Tourism",
  areaServed: {
    "@type": "Country",
    name: "Morocco",
  },
  audience: {
    "@type": "PeopleAudience",
    audienceType: "Travellers with disabilities",
    suggestedMinAge: 0,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Gentle Journeys Collection",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: "Marrakech & The Sea",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: "Atlantic Coast",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: "Imperial Cities",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: "Desert Light",
        },
      },
    ],
  },
};

export default function GentleLandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured Data for SEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(accessibleTravelSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={gentleFAQs} />
      {children}
    </>
  );
}
