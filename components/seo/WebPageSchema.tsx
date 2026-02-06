interface WebPageSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}

export default function WebPageSchema({ 
  title, 
  description, 
  url, 
  image,
  datePublished,
  dateModified 
}: WebPageSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    name: title,
    description: description,
    url: url,
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://slowmorocco.com/#website",
      name: "Slow Morocco",
      url: "https://slowmorocco.com",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://slowmorocco.com/#organization",
      name: "Slow Morocco",
    },
    ...(image && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: image,
      },
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
