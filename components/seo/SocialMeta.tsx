/**
 * SocialMeta - Enhanced OpenGraph and social sharing metadata
 *
 * Generates meta tags that make shared links appear like high-end cultural publications.
 * Includes OpenGraph, Twitter Cards, and additional social platform optimizations.
 */

interface SocialMetaProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

const DEFAULT_IMAGE = "https://res.cloudinary.com/drstfu5yr/image/upload/v1735000000/slow-morocco-og.jpg";
const SITE_NAME = "Slow Morocco";
const TWITTER_HANDLE = "@slowmorocco";

export default function SocialMeta({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
  publishedTime,
  modifiedTime,
  author = "Slow Morocco",
  section,
  tags = [],
}: SocialMetaProps) {
  // Ensure description is optimized length (150-160 chars for social)
  const optimizedDescription = description.length > 160
    ? description.substring(0, 157) + "..."
    : description;

  // Format title for social (brand last, like publications)
  const socialTitle = title.includes("Slow Morocco")
    ? title
    : `${title} — Slow Morocco`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type === "article" ? "Article" : "WebPage",
    headline: title,
    description: optimizedDescription,
    image: image,
    url: url,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: DEFAULT_IMAGE,
      },
    },
    ...(type === "article" && {
      author: {
        "@type": "Person",
        name: author,
      },
      datePublished: publishedTime,
      dateModified: modifiedTime || publishedTime,
      articleSection: section,
      keywords: tags.join(", "),
    }),
  };

  return (
    <>
      {/* Essential OpenGraph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific OpenGraph */}
      {type === "article" && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />

      {/* Pinterest */}
      <meta name="pinterest-rich-pin" content="true" />

      {/* LinkedIn */}
      <meta name="linkedin:title" content={socialTitle} />

      {/* Structured Data for Social */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

/**
 * Generate metadata object for Next.js pages
 * Use this in generateMetadata() functions
 */
export function generateSocialMetadata({
  title,
  description,
  image = DEFAULT_IMAGE,
  url,
  type = "website",
}: SocialMetaProps) {
  const optimizedDescription = description.length > 160
    ? description.substring(0, 157) + "..."
    : description;

  return {
    title,
    description: optimizedDescription,
    openGraph: {
      title: `${title} — Slow Morocco`,
      description: optimizedDescription,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: `${title} — Slow Morocco`,
      description: optimizedDescription,
      images: [image],
      site: TWITTER_HANDLE,
    },
    alternates: {
      canonical: url,
    },
  };
}
