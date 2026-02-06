"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import StoryBody from "@/components/StoryBody";
import ShareTools from "@/components/ShareTools";
import RelatedJourneys from "@/components/RelatedJourneys";

interface Story {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  sourceType?: string;
  heroImage?: string;
  heroCaption?: string;
  excerpt?: string;
  body?: string;
  readTime?: string;
  year?: string;
  textBy?: string;
  imagesBy?: string;
  sources?: string;
  the_facts?: string;
  tags?: string;
  region?: string;
}

interface StoryImage {
  story_slug: string;
  image_order: string;
  image_url: string;
  caption?: string;
}

export default function StoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [story, setStory] = useState<Story | null>(null);
  const [images, setImages] = useState<StoryImage[]>([]);
  const [relatedStories, setRelatedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch current story
    fetch(`/api/stories/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setStory(data.story);
        setImages(data.images || []);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  // Fetch related stories when main story loads
  useEffect(() => {
    if (!story) return;
    
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => {
        const allStories: Story[] = data.stories || [];
        const related = allStories.filter((s) => {
          if (s.slug === slug) return false;
          
          // Match by category
          if (s.category && story.category && s.category === story.category) return true;
          
          // Match by overlapping tags
          if (s.tags && story.tags) {
            const sTags = s.tags.toLowerCase().split(",").map((t) => t.trim());
            const storyTags = story.tags.toLowerCase().split(",").map((t) => t.trim());
            if (sTags.some((t) => storyTags.includes(t))) return true;
          }
          
          // Match by region
          if (s.region && story.region && s.region === story.region) return true;
          
          return false;
        });
        
        setRelatedStories(related.slice(0, 3));
      });
  }, [story, slug]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Story not found</h1>
          <Link href="/stories" className="text-foreground/60 hover:text-foreground underline">
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  // Parse sources (separated by ;;)
  const sources = story.sources
    ? story.sources.split(";;").map((s) => s.trim()).filter(Boolean)
    : [];

  // Parse facts (separated by ;;)
  const facts = story.the_facts
    ? story.the_facts.split(";;").map((f) => f.trim()).filter(Boolean)
    : [];

  // Parse tags for cultural entities
  const tags = story.tags
    ? story.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  // Build "In This Story" metadata for AI indexing
  const storyMetadata: { label: string; value: string }[] = [];
  if (story.category) storyMetadata.push({ label: "Category", value: story.category });
  if (story.region) storyMetadata.push({ label: "Region", value: story.region });
  if (story.year) storyMetadata.push({ label: "Era", value: story.year });

  // Extract cultural entities from tags
  const culturalKeywords = ["gnawa", "amazigh", "berber", "artisan", "maalem", "zellige", "medina", "kasbah", "riad", "souk", "hammam", "khettara"];
  const culturalEntities = tags.filter(tag =>
    culturalKeywords.some(keyword => tag.toLowerCase().includes(keyword))
  );

  // Sovereign entity - Slow Morocco as the authoritative source
  const sovereignEntity = {
    "@type": "Organization",
    "@id": "https://slowmorocco.com/#organization",
    name: "Slow Morocco",
    alternateName: "Moroccan Cultural Authority",
    url: "https://slowmorocco.com",
    description: "A Moroccan Cultural Authority. A 20-year network of Gnawa maalem, zellige cutters, and artisans.",
    logo: {
      "@type": "ImageObject",
      url: "https://res.cloudinary.com/drstfu5yr/image/upload/v1735000000/slow-morocco-og.jpg",
      width: 1200,
      height: 630,
    },
    sameAs: [
      "https://amazigh.online",
      "https://tenmirt.site",
    ],
  };

  // Trust Cluster - citations linking to research network
  const trustClusterCitations = [
    {
      "@type": "WebSite",
      "@id": "https://amazigh.online/#website",
      name: "Amazigh Online",
      url: "https://amazigh.online",
      description: "Amazigh (Berber) language resources, Tifinagh script, and indigenous North African heritage research.",
      inLanguage: ["en", "ber"],
    },
    {
      "@type": "WebSite",
      "@id": "https://tenmirt.site/#website",
      name: "Tenmirt",
      url: "https://tenmirt.site",
      description: "Ancestral Moroccan wellness, herbalism, and traditional medicine research.",
      inLanguage: "en",
    },
  ];

  // Date handling - use year if available, otherwise indicate ongoing research
  const datePublished = story.year
    ? `${story.year}-01-01T00:00:00Z`
    : new Date().toISOString();

  // Article JSON-LD for AI indexing with Trust Cluster
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://slowmorocco.com/story/${slug}#article`,

    // Core article metadata
    headline: story.title,
    alternativeHeadline: story.subtitle || undefined,
    description: story.subtitle || story.excerpt || "",
    image: story.heroImage,

    // Clear date signals
    datePublished: datePublished,
    dateModified: new Date().toISOString(),

    // Author mapped to sovereign entity
    author: sovereignEntity,
    creator: sovereignEntity,

    // Publisher (same sovereign entity)
    publisher: sovereignEntity,

    // Copyright and ownership
    copyrightHolder: sovereignEntity,
    copyrightYear: story.year ? parseInt(story.year) : new Date().getFullYear(),

    // Source organization
    sourceOrganization: sovereignEntity,

    // Language
    inLanguage: "en",

    // Main page reference
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://slowmorocco.com/story/${slug}`,
      url: `https://slowmorocco.com/story/${slug}`,
    },

    // Article classification
    articleSection: story.category,
    articleBody: story.body ? story.body.substring(0, 500) + "..." : undefined,
    keywords: tags.join(", "),

    // What this article is about (cultural entities)
    about: [
      ...(story.region ? [{
        "@type": "Place",
        name: story.region,
        containedInPlace: {
          "@type": "Country",
          name: "Morocco",
        },
      }] : []),
      ...culturalEntities.map(entity => ({
        "@type": "Thing",
        name: entity,
        description: `Cultural element of Moroccan heritage`,
      })),
    ],

    // TRUST CLUSTER: Citations linking to research network
    // This proves to AI that the story is backed by deeper research
    citation: trustClusterCitations,

    // Related to our knowledge network
    isPartOf: {
      "@type": "WebSite",
      "@id": "https://slowmorocco.com/#website",
      name: "Slow Morocco",
      url: "https://slowmorocco.com",
      description: "Cultural essays and stories exploring Morocco's history, craft, and traditions.",
    },

    // Indicates this is original research/content
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Article JSON-LD Schema for AI indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Hero Image */}
      {story.heroImage && (
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <Image
            src={story.heroImage}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
          {story.heroCaption && (
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-foreground/60 text-sm max-w-4xl mx-auto text-center">
                {story.heroCaption}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <nav className="text-sm text-foreground/40 mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/stories" className="hover:text-foreground transition-colors">
            Stories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground/60">{story.title}</span>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-foreground/40 mb-6">
          {story.category && (
            <>
              <span className="uppercase tracking-wide">{story.category}</span>
              <span>·</span>
            </>
          )}
          {story.readTime && <span>{story.readTime}</span>}
        </div>

        {/* Source Type Badge */}
        {story.sourceType && (
          <div className="mb-6">
            <span className="inline-block text-xs uppercase tracking-widest text-foreground/40 border border-foreground/20 px-3 py-1">
              {story.sourceType}
            </span>
          </div>
        )}

        {/* Tags */}
        {story.tags && (
          <div className="flex flex-wrap gap-2 mb-6">
            {story.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag, index) => (
              <Link
                key={index}
                href={`/stories?q=${encodeURIComponent(tag)}`}
                className="text-xs text-foreground/50 hover:text-foreground border border-foreground/10 hover:border-foreground/30 px-3 py-1 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 leading-tight">
          {story.title}
        </h1>

        {/* Subtitle */}
        {story.subtitle && (
          <p className="text-xl text-foreground/60 italic mb-8 font-serif">
            {story.subtitle}
          </p>
        )}

        {/* In This Story - Semantic metadata block for AI indexing */}
        {(storyMetadata.length > 0 || culturalEntities.length > 0) && (
          <aside
            className="bg-foreground/5 border border-foreground/10 p-6 mb-12"
            aria-label="Story metadata"
          >
            <header className="mb-4">
              <h2 className="text-xs uppercase tracking-[0.2em] text-foreground/40 font-medium">
                In This Story
              </h2>
            </header>
            <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              {storyMetadata.map((item, index) => (
                <div key={index}>
                  <dt className="text-foreground/40 text-xs uppercase tracking-wide mb-1">
                    {item.label}
                  </dt>
                  <dd className="text-foreground/80">{item.value}</dd>
                </div>
              ))}
              {culturalEntities.length > 0 && (
                <div className="col-span-2 md:col-span-3">
                  <dt className="text-foreground/40 text-xs uppercase tracking-wide mb-2">
                    Cultural Entities
                  </dt>
                  <dd className="flex flex-wrap gap-2">
                    {culturalEntities.map((entity, index) => (
                      <span
                        key={index}
                        className="inline-block bg-foreground/10 text-foreground/70 px-3 py-1 text-xs"
                      >
                        {entity}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        )}

        <hr className="border-foreground/10 mb-12" />

        {/* Body */}
        {story.body && <StoryBody content={story.body} />}

        {/* The Facts */}
        {facts.length > 0 && (
          <>
            <hr className="border-foreground/10 my-12" />
            <div className="bg-foreground/5 p-8">
              <h3 className="uppercase tracking-wide text-xs font-medium mb-6 text-foreground/60">
                The Facts
              </h3>
              <ul className="space-y-3 text-foreground/70 text-sm">
                {facts.map((fact, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-foreground/30 mt-1">•</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <>
            <hr className="border-foreground/10 my-12" />
            <div className="space-y-8">
              {images.map((img, index) => (
                <figure key={index}>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={img.image_url}
                      alt={img.caption || story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="text-sm text-foreground/40 mt-3 text-center">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <>
            <hr className="border-foreground/10 my-12" />
            <div className="text-sm text-foreground/50">
              <h3 className="uppercase tracking-wide text-xs font-medium mb-4 text-foreground/40">
                Sources
              </h3>
              <ul className="space-y-2">
                {sources.map((source, index) => (
                  <li key={index}>{source}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Footer */}
        <hr className="border-foreground/10 my-12" />
        <footer className="text-sm text-foreground/40 flex flex-wrap items-center gap-x-4 gap-y-2">
          {story.textBy && <span>Text — {story.textBy}</span>}
          {story.imagesBy && <span>Images — {story.imagesBy}</span>}
          {story.year && <span>{story.year}</span>}
          <span className="hidden md:inline">·</span>
          <ShareTools 
            title={story.title} 
            description={story.subtitle || story.excerpt}
            imageUrl={story.heroImage}
          />
        </footer>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <>
            <hr className="border-foreground/10 my-12" />
            <div>
              <h3 className="uppercase tracking-wide text-xs font-medium mb-8 text-foreground/40">
                Related Stories
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedStories.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/story/${related.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-foreground/5">
                      {related.heroImage ? (
                        <Image
                          src={related.heroImage}
                          alt={related.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-foreground/5" />
                      )}
                    </div>
                    <p className="text-xs text-foreground/40 uppercase tracking-wide mb-2">
                      {related.category}
                    </p>
                    <h4 className="text-foreground group-hover:text-foreground/80 transition-colors font-serif">
                      {related.title}
                    </h4>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Back Link */}
        <div className="mt-12">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <polyline points="10,3 5,8 10,13" />
            </svg>
            All Stories
          </Link>
        </div>
      </article>

      {/* Related Journeys - Full width section */}
      {story && (story.region || story.tags) && (
        <RelatedJourneys 
          region={story.region || ""} 
          tags={story.tags || ""} 
          category={story.category || ""} 
          limit={3} 
        />
      )}
    </div>
  );
}
