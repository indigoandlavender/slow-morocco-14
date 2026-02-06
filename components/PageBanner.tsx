"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface BannerData {
  page_slug: string;
  hero_image_url: string;
  midjourney?: string;
  title: string;
  subtitle?: string;
  label_text?: string;
}

interface PageBannerProps {
  slug: string;
  fallback?: {
    title: string;
    subtitle?: string;
    label?: string;
    image?: string;
  };
}

export default function PageBanner({ slug, fallback }: PageBannerProps) {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/page-banners?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setBanner(data.banner);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Banner fetch error:", err);
        setLoading(false);
      });
  }, [slug]);

  // Use banner data or fallback
  const title = banner?.title || fallback?.title || "";
  const subtitle = banner?.subtitle || fallback?.subtitle || "";
  const label = banner?.label_text || fallback?.label || "";
  const image = banner?.hero_image_url || fallback?.image || "";

  return (
    <section className="relative h-[60vh] md:h-[70vh] flex items-end">
      {/* Background Image */}
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-[#8B7355]" />
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 pb-16 md:pb-20">
          <div className="max-w-3xl">
            {/* Label */}
            {label && (
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-4">
                {label}
              </p>
            )}

            {/* Title */}
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-4">
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
