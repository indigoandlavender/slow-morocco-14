"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Currency options
const currencies = [
  { code: "EUR", symbol: "€" },
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "MAD", symbol: "DH" },
];

// Language options
const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
];

interface FooterLink {
  label: string;
  href: string | null;
  type?: string;
}

interface FooterColumn {
  number: number;
  title: string;
  links: FooterLink[];
}

interface FooterData {
  brandId: string;
  newsletter: {
    show: boolean;
    backgroundImage: string;
    title: string;
    description: string;
    brandName: string;
  };
  columns: FooterColumn[];
  legal: FooterLink[];
  copyright: {
    year: number;
    name: string;
  };
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  
  // Language & Currency state
  const [currentLang, setCurrentLang] = useState("en");
  const [currentCurrency, setCurrentCurrency] = useState("EUR");

  useEffect(() => {
    fetch("/api/footer")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setFooterData(data.data);
        }
      })
      .catch((err) => console.error("Footer fetch error:", err));
  }, []);

  // Load saved preferences
  useEffect(() => {
    const savedLang = localStorage.getItem("slowmorocco_lang");
    const savedCurrency = localStorage.getItem("slowmorocco_currency");
    if (savedLang) setCurrentLang(savedLang);
    if (savedCurrency) setCurrentCurrency(savedCurrency);
  }, []);

  const handleLangChange = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem("slowmorocco_lang", code);
  };

  const handleCurrencyChange = (code: string) => {
    setCurrentCurrency(code);
    localStorage.setItem("slowmorocco_currency", code);
    window.dispatchEvent(new CustomEvent("currencyChange", { detail: code }));
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubscribing) return;

    setIsSubscribing(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubscribed(true);
        setEmail("");
      }
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setIsSubscribing(false);
    }
  };

  // Fallback values
  const newsletter = footerData?.newsletter || {
    show: true,
    backgroundImage: "",
    title: "Stay curious",
    description: "Stories, routes, and cultural insights from Morocco.",
    brandName: "Slow Morocco",
  };

  const columns = footerData?.columns || [];
  const legal = footerData?.legal || [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Cancellation", href: "/cancellation-policy" },
    { label: "Glossary", href: "/glossary" },
  ];
  const copyright = footerData?.copyright || {
    year: new Date().getFullYear(),
    name: "Slow Morocco",
  };

  return (
    <footer>
      {/* ═══════════════════════════════════════════════════════════════
          LEVEL 1: Newsletter
          ═══════════════════════════════════════════════════════════════ */}
      {newsletter.show && (
        <section 
          className="py-20 md:py-24 bg-[#1f1f1f] relative"
          style={newsletter.backgroundImage ? {
            backgroundImage: `url(${newsletter.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : undefined}
        >
          {/* Dark overlay when background image is present */}
          {newsletter.backgroundImage && (
            <div className="absolute inset-0 bg-black/60" />
          )}
          
          <div className="container mx-auto px-8 md:px-16 lg:px-20 relative z-10">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="font-serif text-2xl md:text-3xl text-white mb-4">
                {newsletter.title}
              </h3>
              <p className="text-white/50 text-sm mb-8">
                {newsletter.description}
              </p>

              {subscribed ? (
                <p className="text-white/70">Thank you for subscribing.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    disabled={isSubscribing}
                    className="flex-1 px-5 py-4 bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="px-8 py-4 bg-white text-[#1f1f1f] text-xs tracking-[0.15em] uppercase font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {isSubscribing ? "..." : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          LEVEL 2: Navigation (from API columns)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-[#161616]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="inline-block mb-6">
                <span className="font-serif text-sm tracking-[0.2em] text-white">
                  {newsletter.brandName.toUpperCase()}
                </span>
              </Link>
              <p className="text-sm text-white/40 leading-relaxed max-w-xs">
                Private cultural journeys through Morocco, shaped around what matters to you.
              </p>
            </div>

            {/* Dynamic Columns from API */}
            {columns.slice(1, 4).map((column) => (
              <div key={column.number}>
                <h4 className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-5">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.slice(0, 5).map((link, idx) => (
                    <li key={idx}>
                      {link.href ? (
                        <Link
                          href={link.href}
                          className="text-sm text-white/60 hover:text-white transition-colors"
                        >
                          {link.label}
                        </Link>
                      ) : (
                        <span className="text-sm text-white/40">{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Fallback columns if API returns empty */}
            {columns.length === 0 && (
              <>
                <div>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-5">
                    Explore
                  </h4>
                  <ul className="space-y-3">
                    <li><Link href="/journeys" className="text-sm text-white/60 hover:text-white transition-colors">Journeys</Link></li>
                    <li><Link href="/epic" className="text-sm text-white/60 hover:text-white transition-colors">Epic</Link></li>
                    <li><Link href="/stories" className="text-sm text-white/60 hover:text-white transition-colors">Stories</Link></li>
                    <li><Link href="/places" className="text-sm text-white/60 hover:text-white transition-colors">Places</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-5">
                    Plan
                  </h4>
                  <ul className="space-y-3">
                    <li><Link href="/plan-your-trip" className="text-sm text-white/60 hover:text-white transition-colors">Plan Your Trip</Link></li>
                    <li><Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">FAQ</Link></li>
                    <li><Link href="/whats-included" className="text-sm text-white/60 hover:text-white transition-colors">What's Included</Link></li>
                    <li><Link href="/glossary" className="text-sm text-white/60 hover:text-white transition-colors">Glossary</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-5">
                    About
                  </h4>
                  <ul className="space-y-3">
                    <li><Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">Who We Are</Link></li>
                    <li><Link href="/manifesto" className="text-sm text-white/60 hover:text-white transition-colors">Manifesto</Link></li>
                    <li><Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">Contact</Link></li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          LEVEL 3: Slow World Network
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-[#121212]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-4 md:gap-8">
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/20">
              Slow World
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <a
                href="https://slowmauritius.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.1em] text-white/40 hover:text-white/70 transition-colors"
              >
                Mauritius
              </a>
              <a
                href="https://slownamibia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.1em] text-white/40 hover:text-white/70 transition-colors"
              >
                Namibia
              </a>
              <a
                href="https://slowtunisia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.1em] text-white/40 hover:text-white/70 transition-colors"
              >
                Tunisia
              </a>
              <a
                href="https://slowturkiye.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-[0.1em] text-white/40 hover:text-white/70 transition-colors"
              >
                Türkiye
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          LEVEL 4: Legal & Copyright (from Nexus)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-[#0e0e0e]">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Legal links */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legal.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href || "#"}
                  className="text-[10px] tracking-[0.1em] uppercase text-white/30 hover:text-white/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Right side: Language, Currency, Copyright */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Language selector */}
              <select
                value={currentLang}
                onChange={(e) => handleLangChange(e.target.value)}
                className="bg-transparent text-[10px] tracking-[0.1em] uppercase text-white/30 hover:text-white/50 focus:outline-none cursor-pointer appearance-none pr-3"
                style={{ backgroundImage: 'none' }}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#0e0e0e] text-white/50">
                    {lang.label}
                  </option>
                ))}
              </select>
              
              {/* Currency selector */}
              <select
                value={currentCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="bg-transparent text-[10px] tracking-[0.1em] uppercase text-white/30 hover:text-white/50 focus:outline-none cursor-pointer appearance-none pr-3"
                style={{ backgroundImage: 'none' }}
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code} className="bg-[#0e0e0e] text-white/50">
                    {currency.symbol} {currency.code}
                  </option>
                ))}
              </select>
              
              {/* Copyright */}
              <p className="text-[10px] tracking-[0.1em] text-white/20">
                © {copyright.year} {copyright.name}
              </p>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
