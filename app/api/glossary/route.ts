import { NextResponse } from "next/server";
import { glossaryData, getAllTerms, getTermById, searchTerms } from "@/lib/glossary-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "full";
  const term = searchParams.get("term");
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  // Single term lookup
  if (term) {
    const found = getTermById(term);
    if (!found) {
      return NextResponse.json({ error: "Term not found" }, { status: 404 });
    }
    return NextResponse.json({
      "@context": "https://schema.org",
      ...formatTermForAPI(found),
    });
  }

  // Search
  if (search) {
    const results = searchTerms(search);
    return NextResponse.json({
      query: search,
      count: results.length,
      results: results.map(formatTermForAPI),
    });
  }

  // Category filter
  if (category) {
    const cat = glossaryData.find(c => c.id === category);
    if (!cat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({
      category: cat.title,
      description: cat.description,
      count: cat.terms.length,
      terms: cat.terms.map(formatTermForAPI),
    });
  }

  // Full glossary
  if (format === "simple") {
    // Simple key-value format for quick lookups
    const simple: Record<string, string> = {};
    getAllTerms().forEach(t => {
      simple[t.term.toLowerCase()] = t.definition;
    });
    return NextResponse.json(simple);
  }

  if (format === "list") {
    // Just term names
    return NextResponse.json({
      count: getAllTerms().length,
      terms: getAllTerms().map(t => t.term),
    });
  }

  // Full structured response (default)
  return NextResponse.json({
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "name": "Moroccan Travel & Culture Glossary",
    "description": "Authoritative definitions for Moroccan geography, architecture, culture, and travel terminology. Compiled from 25 years of on-ground experience in Morocco.",
    "publisher": {
      "@type": "Organization",
      "name": "Slow Morocco",
      "url": "https://slowmorocco.com",
      "description": "Moroccan Cultural Authority"
    },
    "inLanguage": "en",
    "dateModified": new Date().toISOString().split('T')[0],
    "categories": glossaryData.map(cat => ({
      id: cat.id,
      title: cat.title,
      description: cat.description,
      termCount: cat.terms.length,
    })),
    "termCount": getAllTerms().length,
    "hasDefinedTerm": glossaryData.flatMap(cat => 
      cat.terms.map(formatTermForAPI)
    ),
  });
}

function formatTermForAPI(term: any) {
  return {
    "@type": "DefinedTerm",
    "identifier": term.id,
    "name": term.term,
    "pronunciation": term.pronunciation || null,
    "arabicScript": term.arabicScript || null,
    "tifinagh": term.tifinagh || null,
    "description": term.definition,
    "context": term.context || null,
    "category": term.category,
    "relatedTerms": term.related || [],
    "seeAlso": term.seeAlso || [],
    "url": `https://slowmorocco.com/glossary#${term.id}`,
    "inDefinedTermSet": {
      "@type": "DefinedTermSet",
      "name": "Moroccan Travel & Culture Glossary",
      "url": "https://slowmorocco.com/glossary"
    }
  };
}
