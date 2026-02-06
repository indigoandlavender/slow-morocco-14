"use client";

import { useState, useRef, useEffect } from "react";

interface ShareToolsProps {
  title: string;
  url?: string;
  description?: string;
  imageUrl?: string;
}

export default function ShareTools({ title, url, description, imageUrl }: ShareToolsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current URL if not provided
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareDescription = description || title;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsOpen(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareVia = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(shareDescription);

    const urls: Record<string, string> = {
      email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(imageUrl || "")}&description=${encodedDesc}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    };

    if (platform === "email") {
      window.location.href = urls[platform];
    } else {
      window.open(urls[platform], "_blank", "width=600,height=500,menubar=no,toolbar=no");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Share this page"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span className="text-xs tracking-[0.15em] uppercase">Share</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="absolute left-0 top-full mt-3 z-50 min-w-[200px] bg-background border border-border shadow-lg"
          style={{
            animation: "fadeIn 0.15s ease-out"
          }}
        >
          {/* Email */}
          <button
            onClick={() => shareVia("email")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="1" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Email
          </button>

          {/* Copy Link */}
          <button
            onClick={copyToClipboard}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? "Copied" : "Copy Link"}
          </button>

          {/* Divider */}
          <div className="border-t border-border my-1" />

          {/* WhatsApp */}
          <button
            onClick={() => shareVia("whatsapp")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>

          {/* Pinterest */}
          <button
            onClick={() => shareVia("pinterest")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.38.04-3.4l1.46-6.2s-.37-.74-.37-1.84c0-1.72 1-3 2.24-3 1.06 0 1.57.8 1.57 1.74 0 1.06-.68 2.64-1.03 4.11-.29 1.23.62 2.24 1.83 2.24 2.2 0 3.89-2.32 3.89-5.67 0-2.96-2.13-5.03-5.17-5.03-3.52 0-5.59 2.64-5.59 5.37 0 1.06.41 2.2.92 2.82.1.12.12.23.08.35l-.34 1.38c-.05.23-.18.27-.42.16-1.57-.73-2.55-3.02-2.55-4.86 0-3.96 2.88-7.6 8.3-7.6 4.36 0 7.75 3.1 7.75 7.25 0 4.33-2.73 7.82-6.52 7.82-1.27 0-2.47-.66-2.88-1.44l-.78 2.98c-.28 1.1-1.05 2.47-1.56 3.31A12 12 0 1 0 12 0z"/>
            </svg>
            Pinterest
          </button>

          {/* Facebook */}
          <button
            onClick={() => shareVia("facebook")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>

          {/* X / Twitter */}
          <button
            onClick={() => shareVia("twitter")}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            X
          </button>
        </div>
      )}
    </div>
  );
}
