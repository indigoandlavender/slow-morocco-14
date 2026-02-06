interface ArticleSchemaProps {
  story: {
    title: string;
    slug: string;
    excerpt?: string;
    heroImage?: string;
    category?: string;
    publishedAt?: string;
    author?: string;
  };
}

export default function ArticleSchema({ story }: ArticleSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: story.title,
    description: story.excerpt || `Read about ${story.title} on Slow Morocco`,
    image: story.heroImage || "https://slowmorocco.com/og-image.jpg",
    url: `https://slowmorocco.com/story/${story.slug}`,
    datePublished: story.publishedAt || new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "Slow Morocco",
      url: "https://slowmorocco.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Slow Morocco",
      url: "https://slowmorocco.com",
      logo: {
        "@type": "ImageObject",
        url: "https://slowmorocco.com/og-image.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://slowmorocco.com/story/${story.slug}`,
    },
    ...(story.category && {
      articleSection: story.category,
    }),
    about: {
      "@type": "Place",
      name: "Morocco",
    },
    inLanguage: "en",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
