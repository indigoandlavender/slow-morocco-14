"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface RelatedStory {
  slug: string;
  title: string;
  category?: string;
  heroImage?: string;
  excerpt?: string;
  score: number;
}

interface RelatedStoriesProps {
  destinations: string;
  focus?: string;
  limit?: number;
}

export default function RelatedStories({ destinations, focus, limit = 4 }: RelatedStoriesProps) {
  const [stories, setStories] = useState<RelatedStory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destinations) {
      setLoading(false);
      return;
    }

    const params = new URLSearchParams({
      destinations,
      ...(focus && { focus }),
      limit: limit.toString(),
    });

    fetch(`/api/related-stories?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setStories(data.stories || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading related stories:", err);
        setLoading(false);
      });
  }, [destinations, focus, limit]);

  if (loading) {
    return null; // Don't show loading state, just hide until ready
  }

  if (stories.length === 0) {
    return null; // No related stories found
  }

  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 mb-3">
            From the Archive
          </p>
          <h2 className="font-serif text-2xl md:text-3xl">
            Stories from this route
          </h2>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stories.map((story) => (
            <Link
              key={story.slug}
              href={`/story/${story.slug}`}
              className="group"
            >
              <article>
                <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-foreground/5">
                  {story.heroImage ? (
                    <Image
                      src={story.heroImage}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-foreground/5" />
                  )}
                </div>
                {story.category && (
                  <p className="text-[10px] tracking-[0.2em] uppercase text-foreground/40 mb-2">
                    {story.category}
                  </p>
                )}
                <h3 className="font-serif text-lg leading-tight group-hover:text-foreground/70 transition-colors">
                  {story.title}
                </h3>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link
            href="/stories"
            className="text-xs tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground transition-colors"
          >
            Explore all stories →
          </Link>
        </div>
      </div>
    </section>
  );
}
