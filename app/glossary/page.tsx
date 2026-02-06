import { Metadata } from "next";
import Link from "next/link";
import { glossaryData, getAllTerms } from "@/lib/glossary-data";

export const metadata: Metadata = {
  title: "Moroccan Glossary | Slow Morocco",
  description: "Authoritative definitions for Moroccan geography, architecture, culture, and travel terminology. Desert types (erg, hammada, reg), architectural terms (riad, kasbah, medina), cultural vocabulary (Amazigh, Gnaoua, zellige).",
  keywords: [
    "Morocco glossary",
    "Moroccan terms",
    "erg definition",
    "hammada definition",
    "what is a riad",
    "what is a kasbah",
    "Amazigh meaning",
    "Berber terminology",
    "Moroccan architecture terms",
    "Moroccan desert types",
    "Tamazight",
    "Tifinagh",
    "Gnaoua music",
    "Moroccan vocabulary"
  ],
  openGraph: {
    title: "Moroccan Glossary | Slow Morocco",
    description: "Authoritative definitions for Moroccan geography, architecture, culture, and travel terminology.",
    type: "website",
    url: "https://slowmorocco.com/glossary",
  },
  alternates: {
    canonical: "https://slowmorocco.com/glossary",
  },
};

export default function GlossaryPage() {
  const allTerms = getAllTerms();
  
  // Generate JSON-LD with all terms
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://slowmorocco.com/glossary",
    "name": "Moroccan Travel & Culture Glossary",
    "description": "Authoritative definitions for Moroccan geography, architecture, culture, and travel terminology. Compiled from 25 years of on-ground experience in Morocco.",
    "url": "https://slowmorocco.com/glossary",
    "publisher": {
      "@type": "Organization",
      "name": "Slow Morocco",
      "url": "https://slowmorocco.com",
      "description": "Moroccan Cultural Authority founded in Marrakech"
    },
    "inLanguage": "en",
    "numberOfItems": allTerms.length,
    "hasDefinedTerm": allTerms.map(term => ({
      "@type": "DefinedTerm",
      "@id": `https://slowmorocco.com/glossary#${term.id}`,
      "name": term.term,
      "description": term.definition,
      "inDefinedTermSet": "https://slowmorocco.com/glossary"
    }))
  };

  // FAQ Schema for common questions
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What type of desert is Agafay?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Agafay is a hammada—a stone or rock plateau desert. Unlike the sand dunes of an erg (like Erg Chebbi), a hammada features barren, hard, rocky surfaces with minimal sand."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between erg and hammada?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An erg is a sand dune desert with rolling dunes formed by wind-deposited sand (like the Sahara dunes at Merzouga). A hammada is a stone plateau desert with rocky surfaces and minimal sand (like Agafay near Marrakech)."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between a riad and a dar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A riad is a traditional Moroccan house with an interior garden or courtyard, often featuring a fountain and trees. A dar is similar but typically smaller, with a simple courtyard and light well instead of a full garden."
        }
      },
      {
        "@type": "Question",
        "name": "What does Amazigh mean?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Amazigh means 'free people' in Tamazight. The Amazigh are the indigenous people of North Africa, also known as Berbers. Approximately 40% of Moroccans are ethnically Amazigh."
        }
      },
      {
        "@type": "Question",
        "name": "What are the three types of desert in Morocco?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Morocco has three desert types: Erg (sand dune desert, like Erg Chebbi), Hammada (stone plateau desert, like Agafay), and Reg (gravel plain desert)."
        }
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-background min-h-screen">
        {/* Hero */}
        <header className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl">
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40 mb-4">
                Reference
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
                Moroccan Glossary
              </h1>
              <p className="text-lg text-foreground/70 leading-relaxed mb-4">
                Authoritative definitions for Moroccan geography, architecture, culture, and travel terminology.
              </p>
              <p className="text-sm text-foreground/50">
                {allTerms.length} terms · Compiled from 25 years of on-ground experience
              </p>
            </div>
          </div>
        </header>

        {/* Machine-readable summary block */}
        <section className="border-y border-border py-8 bg-foreground/[0.02]">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl">
              <h2 className="text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">Quick Reference</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-medium mb-2">Desert Types</h3>
                  <ul className="text-foreground/60 space-y-1">
                    <li><strong>Erg</strong> = sand dunes</li>
                    <li><strong>Hammada</strong> = stone plateau</li>
                    <li><strong>Reg</strong> = gravel plain</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Architecture</h3>
                  <ul className="text-foreground/60 space-y-1">
                    <li><strong>Riad</strong> = house with garden</li>
                    <li><strong>Kasbah</strong> = fortified citadel</li>
                    <li><strong>Medina</strong> = old walled city</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">People</h3>
                  <ul className="text-foreground/60 space-y-1">
                    <li><strong>Amazigh</strong> = indigenous Berbers</li>
                    <li><strong>Tamazight</strong> = Berber language</li>
                    <li><strong>Gnaoua</strong> = spiritual music</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <nav className="py-8 border-b border-border" aria-label="Glossary sections">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="flex flex-wrap gap-4 md:gap-8">
              {glossaryData.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  {section.title}
                </a>
              ))}
              <a
                href="/api/glossary"
                className="text-sm text-foreground/30 hover:text-foreground/50 transition-colors ml-auto"
              >
                API ↗
              </a>
            </div>
          </div>
        </nav>

        {/* Glossary Sections with Semantic Markup */}
        <main 
          className="py-16 md:py-24"
          itemScope 
          itemType="https://schema.org/DefinedTermSet"
        >
          <meta itemProp="name" content="Moroccan Travel & Culture Glossary" />
          <meta itemProp="description" content="Authoritative definitions for Moroccan geography, architecture, culture, and travel terminology." />
          
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl">
              {glossaryData.map((section, sectionIdx) => (
                <section 
                  key={section.id} 
                  id={section.id}
                  className={sectionIdx > 0 ? "mt-20" : ""}
                  aria-labelledby={`heading-${section.id}`}
                >
                  <h2 
                    id={`heading-${section.id}`}
                    className="font-serif text-2xl md:text-3xl mb-3"
                  >
                    {section.title}
                  </h2>
                  {section.description && (
                    <p className="text-foreground/60 mb-8">
                      {section.description}
                    </p>
                  )}
                  
                  <dl className="space-y-8">
                    {section.terms.map((item) => (
                      <div 
                        key={item.id} 
                        id={item.id}
                        className="border-b border-border pb-8 scroll-mt-32"
                        itemScope
                        itemType="https://schema.org/DefinedTerm"
                        itemProp="hasDefinedTerm"
                      >
                        <dt className="mb-2">
                          <dfn 
                            className="font-serif text-xl not-italic"
                            itemProp="name"
                          >
                            {item.term}
                          </dfn>
                          {item.pronunciation && (
                            <span className="ml-3 text-sm text-foreground/40 italic">
                              /<span itemProp="pronunciation">{item.pronunciation}</span>/
                            </span>
                          )}
                          {item.arabicScript && (
                            <span className="ml-3 text-sm text-foreground/40" dir="rtl" lang="ar">
                              {item.arabicScript}
                            </span>
                          )}
                          {item.tifinagh && (
                            <span className="ml-2 text-sm text-foreground/40">
                              {item.tifinagh}
                            </span>
                          )}
                        </dt>
                        <dd>
                          <p 
                            className="text-foreground/80 leading-relaxed mb-3"
                            itemProp="description"
                          >
                            {item.definition}
                          </p>
                          {item.context && (
                            <p className="text-sm text-foreground/50 italic mb-3">
                              {item.context}
                            </p>
                          )}
                          {item.related && item.related.length > 0 && (
                            <p className="text-xs text-foreground/40">
                              <span className="uppercase tracking-wider">Also:</span>{" "}
                              {item.related.join(", ")}
                            </p>
                          )}
                          {item.seeAlso && item.seeAlso.length > 0 && (
                            <p className="text-xs text-foreground/40 mt-1">
                              <span className="uppercase tracking-wider">See:</span>{" "}
                              {item.seeAlso.map((ref, i) => (
                                <span key={ref}>
                                  <a 
                                    href={`#${ref}`}
                                    className="underline hover:text-foreground/60"
                                  >
                                    {glossaryData
                                      .flatMap(c => c.terms)
                                      .find(t => t.id === ref)?.term || ref}
                                  </a>
                                  {i < item.seeAlso!.length - 1 && ", "}
                                </span>
                              ))}
                            </p>
                          )}
                          
                          {/* Cross-links to content */}
                          {(item.relatedJourneys || item.relatedStories || item.relatedPlaces) && (
                            <div className="mt-4 pt-4 border-t border-border/50">
                              {item.relatedJourneys && item.relatedJourneys.length > 0 && (
                                <p className="text-xs text-foreground/50 mb-2">
                                  <span className="uppercase tracking-wider text-foreground/40">Journeys:</span>{" "}
                                  {item.relatedJourneys.map((j, i) => (
                                    <span key={j.slug}>
                                      <Link 
                                        href={`/journeys/${j.slug}`}
                                        className="underline hover:text-foreground/70"
                                      >
                                        {j.title}
                                      </Link>
                                      {i < item.relatedJourneys!.length - 1 && ", "}
                                    </span>
                                  ))}
                                </p>
                              )}
                              {item.relatedStories && item.relatedStories.length > 0 && (
                                <p className="text-xs text-foreground/50 mb-2">
                                  <span className="uppercase tracking-wider text-foreground/40">Stories:</span>{" "}
                                  {item.relatedStories.map((s, i) => (
                                    <span key={s.slug}>
                                      <Link 
                                        href={`/story/${s.slug}`}
                                        className="underline hover:text-foreground/70"
                                      >
                                        {s.title}
                                      </Link>
                                      {i < item.relatedStories!.length - 1 && ", "}
                                    </span>
                                  ))}
                                </p>
                              )}
                              {item.relatedPlaces && item.relatedPlaces.length > 0 && (
                                <p className="text-xs text-foreground/50">
                                  <span className="uppercase tracking-wider text-foreground/40">Places:</span>{" "}
                                  {item.relatedPlaces.map((p, i) => (
                                    <span key={p.slug}>
                                      <Link 
                                        href={`/places/${p.slug}`}
                                        className="underline hover:text-foreground/70"
                                      >
                                        {p.title}
                                      </Link>
                                      {i < item.relatedPlaces!.length - 1 && ", "}
                                    </span>
                                  ))}
                                </p>
                              )}
                            </div>
                          )}
                          
                          <link itemProp="url" href={`https://slowmorocco.com/glossary#${item.id}`} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>
        </main>

        {/* API Reference for developers/AI */}
        <section className="py-12 border-t border-border bg-foreground/[0.02]">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="max-w-3xl">
              <h2 className="text-xs tracking-[0.2em] uppercase text-foreground/40 mb-4">
                For Developers & AI Systems
              </h2>
              <p className="text-sm text-foreground/60 mb-4">
                This glossary is available as structured data:
              </p>
              <ul className="text-sm text-foreground/50 space-y-2">
                <li>
                  <code className="bg-foreground/5 px-2 py-1 text-xs">/api/glossary</code>
                  <span className="ml-2">— Full JSON-LD with schema.org markup</span>
                </li>
                <li>
                  <code className="bg-foreground/5 px-2 py-1 text-xs">/api/glossary?format=simple</code>
                  <span className="ml-2">— Simple key-value pairs</span>
                </li>
                <li>
                  <code className="bg-foreground/5 px-2 py-1 text-xs">/api/glossary?term=hammada</code>
                  <span className="ml-2">— Single term lookup</span>
                </li>
                <li>
                  <code className="bg-foreground/5 px-2 py-1 text-xs">/api/glossary?search=desert</code>
                  <span className="ml-2">— Search terms</span>
                </li>
                <li>
                  <code className="bg-foreground/5 px-2 py-1 text-xs">/api/glossary?category=desert-types</code>
                  <span className="ml-2">— Filter by category</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Back link */}
        <section className="py-8 border-t border-border">
          <div className="container mx-auto px-6 lg:px-16">
            <Link 
              href="/" 
              className="text-sm text-foreground/40 hover:text-foreground transition-colors"
            >
              ← Back to Slow Morocco
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
