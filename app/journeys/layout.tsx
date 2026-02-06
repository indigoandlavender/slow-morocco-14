import { Metadata } from "next";
import FAQSchema from "@/components/seo/FAQSchema";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Morocco Journeys & Tours | Private Itineraries | Slow Morocco",
  description: "Explore 100+ curated Morocco journeys: Sahara desert tours, Atlas Mountain trekking, Imperial Cities, Fes & Marrakech cultural tours, coastal escapes. Private, customizable itineraries with local guides. 2-21 day trips from €500.",
  keywords: [
    "Morocco tours",
    "Morocco itinerary",
    "Morocco travel",
    "Sahara desert tour",
    "Atlas Mountains trekking",
    "Marrakech tours",
    "Fes tours",
    "Morocco private tour",
    "Morocco customized trip",
    "Morocco cultural tour",
    "Morocco adventure travel",
    "Chefchaouen tour",
    "Merzouga desert",
    "Erg Chebbi",
    "Morocco road trip",
    "Morocco holiday",
    "Morocco vacation",
    "best Morocco itinerary",
    "Morocco 7 days",
    "Morocco 10 days",
    "Morocco 2 weeks",
  ].join(", "),
  openGraph: {
    title: "Morocco Journeys & Tours | 100+ Private Itineraries",
    description: "Sahara desert, Atlas Mountains, Imperial Cities, coastal escapes. Private tours with local guides, 2-21 days.",
    url: "https://slowmorocco.com/journeys",
    siteName: "Slow Morocco",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://slowmorocco.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Morocco Journeys - Slow Morocco",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Morocco Journeys & Tours | Slow Morocco",
    description: "100+ private Morocco itineraries. Desert, mountains, culture, coast.",
  },
  alternates: {
    canonical: "https://slowmorocco.com/journeys",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const journeysFAQs = [
  {
    question: "Are Slow Morocco tours private?",
    answer: "Yes, all journeys are completely private. You travel only with your group, never with strangers. Your driver and guides are dedicated to you throughout.",
  },
  {
    question: "Can I customize my Morocco itinerary?",
    answer: "Absolutely. Every journey is a starting point, not a script. Add days in the desert, skip cities, extend your stay anywhere that pulls you. We shape routes around your interests.",
  },
  {
    question: "What is included in the tour price?",
    answer: "All journeys include private transport with experienced driver, handpicked accommodations, local expert guides, and curated experiences. Meals vary by itinerary—typically breakfast daily plus select lunches and dinners.",
  },
  {
    question: "How far in advance should I book a Morocco tour?",
    answer: "We recommend booking 2-3 months ahead, especially for peak season (March-May, September-November). Last-minute bookings are sometimes possible but accommodation options may be limited.",
  },
  {
    question: "What is the best time to visit Morocco?",
    answer: "Spring (March-May) and autumn (September-November) offer ideal temperatures. Summer suits coastal and mountain destinations. Winter is perfect for the Sahara and southern regions.",
  },
  {
    question: "How long should I spend in Morocco?",
    answer: "A week allows for highlights like Marrakech, the desert, and one other region. 10-14 days lets you explore more deeply—Imperial Cities, Atlas trekking, or the full north-to-south route.",
  },
  {
    question: "What makes Slow Morocco different from other tour operators?",
    answer: "Twenty years building relationships with artisans, musicians, guides, and families across Morocco. We offer access to people and places others miss—not just monuments, but living culture.",
  },
  {
    question: "Do you offer Morocco desert tours?",
    answer: "Yes, we specialize in Sahara experiences. From single-night camps at Erg Chebbi (Merzouga) to multi-day expeditions at Erg Chigaga. Camel treks, 4x4 adventures, and luxury desert camps available.",
  },
  {
    question: "Can I combine cities and desert in one Morocco trip?",
    answer: "Absolutely—this is our most popular format. Classic routes include Marrakech to Merzouga (via Atlas and Dades Gorge), or Fes to desert to Marrakech. We design seamless itineraries connecting all regions.",
  },
  {
    question: "Do you arrange Atlas Mountains trekking?",
    answer: "Yes, from day hikes in the Ourika Valley to multi-day treks including Toubkal summit (North Africa's highest peak), Ait Bouguemez valley walks, and remote High Atlas traverses with mountain guides.",
  },
];

// Breadcrumb for structured data
const breadcrumbs = [
  { name: "Home", url: "https://slowmorocco.com" },
  { name: "Journeys", url: "https://slowmorocco.com/journeys" },
];

// ItemList schema for journey collection
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Morocco Journeys & Tours",
  description: "Curated private Morocco itineraries featuring desert, mountains, culture, and coast",
  url: "https://slowmorocco.com/journeys",
  numberOfItems: 100,
  itemListOrder: "https://schema.org/ItemListUnordered",
  provider: {
    "@type": "TravelAgency",
    name: "Slow Morocco",
    url: "https://slowmorocco.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Marrakech",
      addressCountry: "MA",
    },
  },
};

// CollectionPage schema
const collectionPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Morocco Journeys & Tours",
  description: "Browse 100+ private Morocco itineraries: Sahara desert tours, Atlas trekking, Imperial Cities, coastal escapes. Customizable trips from 2-21 days.",
  url: "https://slowmorocco.com/journeys",
  isPartOf: {
    "@type": "WebSite",
    name: "Slow Morocco",
    url: "https://slowmorocco.com",
  },
  about: {
    "@type": "Country",
    name: "Morocco",
  },
  mainEntity: {
    "@type": "ItemList",
    name: "Morocco Tour Itineraries",
    numberOfItems: 100,
  },
};

export default function JourneysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Structured Data for SEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={journeysFAQs} />
      {children}
    </>
  );
}
