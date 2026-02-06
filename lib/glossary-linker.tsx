// Glossary Auto-Linker
// Scans text and wraps glossary terms with links to /glossary#term-id
// Only links each term once per text block to avoid over-linking

import { glossaryData } from './glossary-data';
import Link from 'next/link';
import React from 'react';

// Build a map of terms to their IDs (case-insensitive matching)
interface TermInfo {
  id: string;
  term: string; // Original casing for display
}

// Build lookup from glossary data
const termMap: Map<string, TermInfo> = new Map();

glossaryData.forEach(category => {
  category.terms.forEach(term => {
    // Add the main term
    termMap.set(term.term.toLowerCase(), { id: term.id, term: term.term });
    
    // Add common variations
    const lowerTerm = term.term.toLowerCase();
    
    // Handle plurals for common terms
    if (lowerTerm === 'riad') termMap.set('riads', { id: term.id, term: 'riads' });
    if (lowerTerm === 'kasbah') {
      termMap.set('kasbahs', { id: term.id, term: 'kasbahs' });
      termMap.set('casbah', { id: term.id, term: 'casbah' });
      termMap.set('casbahs', { id: term.id, term: 'casbahs' });
    }
    if (lowerTerm === 'ksar') {
      termMap.set('ksour', { id: term.id, term: 'ksour' });
      termMap.set('ksars', { id: term.id, term: 'ksars' });
    }
    if (lowerTerm === 'souk') termMap.set('souks', { id: term.id, term: 'souks' });
    if (lowerTerm === 'medina') termMap.set('medinas', { id: term.id, term: 'medinas' });
    if (lowerTerm === 'hammam') termMap.set('hammams', { id: term.id, term: 'hammams' });
    if (lowerTerm === 'tagine') {
      termMap.set('tagines', { id: term.id, term: 'tagines' });
      termMap.set('tajine', { id: term.id, term: 'tajine' });
      termMap.set('tajines', { id: term.id, term: 'tajines' });
    }
    if (lowerTerm === 'fondouk') {
      termMap.set('fondouks', { id: term.id, term: 'fondouks' });
      termMap.set('funduq', { id: term.id, term: 'funduq' });
      termMap.set('funduqs', { id: term.id, term: 'funduqs' });
    }
    if (lowerTerm === 'derb') termMap.set('derbs', { id: term.id, term: 'derbs' });
    if (lowerTerm === 'erg') termMap.set('ergs', { id: term.id, term: 'ergs' });
    if (lowerTerm === 'gnawa') termMap.set('gnaoua', { id: term.id, term: 'Gnaoua' });
    if (lowerTerm === 'maalem') {
      termMap.set('maâlem', { id: term.id, term: 'maâlem' });
      termMap.set('maâlems', { id: term.id, term: 'maâlems' });
      termMap.set('maalems', { id: term.id, term: 'maalems' });
    }
    
    // Textile variations
    if (lowerTerm === 'kilim') termMap.set('kilims', { id: term.id, term: 'kilims' });
    if (lowerTerm === 'boucherouite') {
      termMap.set('boucherouite rugs', { id: term.id, term: 'boucherouite rugs' });
      termMap.set('boucherouite rug', { id: term.id, term: 'boucherouite rug' });
      termMap.set('rag rug', { id: term.id, term: 'rag rug' });
      termMap.set('rag rugs', { id: term.id, term: 'rag rugs' });
    }
    if (lowerTerm === 'beni ourain') {
      termMap.set('beni ourain rug', { id: term.id, term: 'Beni Ourain rug' });
      termMap.set('beni ourain rugs', { id: term.id, term: 'Beni Ourain rugs' });
      termMap.set('beni ouarain', { id: term.id, term: 'Beni Ouarain' });
    }
    if (lowerTerm === 'hanbel') termMap.set('hanbels', { id: term.id, term: 'hanbels' });
    if (lowerTerm === 'azilal') {
      termMap.set('azilal rug', { id: term.id, term: 'Azilal rug' });
      termMap.set('azilal rugs', { id: term.id, term: 'Azilal rugs' });
    }
    if (lowerTerm === 'sabra') {
      termMap.set('sabra silk', { id: term.id, term: 'sabra silk' });
      termMap.set('cactus silk', { id: term.id, term: 'cactus silk' });
    }
    
    // Landmark variations
    if (lowerTerm === 'medersa ben youssef') {
      termMap.set('ben youssef medersa', { id: term.id, term: 'Ben Youssef Medersa' });
      termMap.set('madrasa ben youssef', { id: term.id, term: 'Madrasa Ben Youssef' });
    }
    if (lowerTerm === 'palais bahia') {
      termMap.set('bahia palace', { id: term.id, term: 'Bahia Palace' });
    }
    if (lowerTerm === 'palais el badi') {
      termMap.set('el badi palace', { id: term.id, term: 'El Badi Palace' });
      termMap.set('badi palace', { id: term.id, term: 'Badi Palace' });
    }
    if (lowerTerm === 'koutoubia mosque') {
      termMap.set('koutoubia', { id: term.id, term: 'Koutoubia' });
      termMap.set('kutubiyya', { id: term.id, term: 'Kutubiyya' });
    }
    if (lowerTerm === 'jardin majorelle') {
      termMap.set('majorelle garden', { id: term.id, term: 'Majorelle Garden' });
      termMap.set('majorelle gardens', { id: term.id, term: 'Majorelle Gardens' });
    }
    if (lowerTerm === 'jemaa el-fna') {
      termMap.set('jemaa el fna', { id: term.id, term: 'Jemaa el Fna' });
      termMap.set('djemaa el fna', { id: term.id, term: 'Djemaa el Fna' });
      termMap.set('djemaa el-fna', { id: term.id, term: 'Djemaa el-Fna' });
      termMap.set('place jemaa el-fna', { id: term.id, term: 'Place Jemaa el-Fna' });
    }
    if (lowerTerm === 'aït benhaddou') {
      termMap.set('ait benhaddou', { id: term.id, term: 'Ait Benhaddou' });
      termMap.set('ait ben haddou', { id: term.id, term: 'Ait Ben Haddou' });
      termMap.set('aït ben haddou', { id: term.id, term: 'Aït Ben Haddou' });
    }
    if (lowerTerm === 'fes el-bali') {
      termMap.set('fes el bali', { id: term.id, term: 'Fes el Bali' });
      termMap.set('fez el-bali', { id: term.id, term: 'Fez el-Bali' });
      termMap.set('fez el bali', { id: term.id, term: 'Fez el Bali' });
    }
    if (lowerTerm === 'chouara tannery') {
      termMap.set('chouara tanneries', { id: term.id, term: 'Chouara Tanneries' });
      termMap.set('fes tannery', { id: term.id, term: 'Fes Tannery' });
      termMap.set('fes tanneries', { id: term.id, term: 'Fes Tanneries' });
    }
    if (lowerTerm === 'hassan tower') {
      termMap.set('tour hassan', { id: term.id, term: 'Tour Hassan' });
    }
    if (lowerTerm === 'todra gorge') {
      termMap.set('todgha gorge', { id: term.id, term: 'Todgha Gorge' });
      termMap.set('gorges du todra', { id: term.id, term: 'Gorges du Todra' });
    }
    if (lowerTerm === 'dades valley') {
      termMap.set('dades gorge', { id: term.id, term: 'Dades Gorge' });
      termMap.set('gorges du dades', { id: term.id, term: 'Gorges du Dades' });
    }
    if (lowerTerm === 'essaouira medina') {
      termMap.set('essaouira', { id: term.id, term: 'Essaouira' });
      termMap.set('mogador', { id: term.id, term: 'Mogador' });
    }
    
    // City/region variations
    if (lowerTerm === 'fes') {
      termMap.set('fez', { id: term.id, term: 'Fez' });
    }
    if (lowerTerm === 'marrakech') {
      termMap.set('marrakesh', { id: term.id, term: 'Marrakesh' });
    }
    if (lowerTerm === 'tangier') {
      termMap.set('tanger', { id: term.id, term: 'Tanger' });
      termMap.set('tanja', { id: term.id, term: 'Tanja' });
    }
    if (lowerTerm === 'meknes') {
      termMap.set('meknès', { id: term.id, term: 'Meknès' });
      termMap.set('meknas', { id: term.id, term: 'Meknas' });
    }
    if (lowerTerm === 'draa valley') {
      termMap.set('draa', { id: term.id, term: 'Draa' });
      termMap.set('drâa valley', { id: term.id, term: 'Drâa Valley' });
      termMap.set('vallee du draa', { id: term.id, term: 'Vallée du Draa' });
    }
    if (lowerTerm === 'high atlas') {
      termMap.set('haut atlas', { id: term.id, term: 'Haut Atlas' });
      termMap.set('atlas mountains', { id: term.id, term: 'Atlas Mountains' });
    }
    if (lowerTerm === 'rif mountains') {
      termMap.set('the rif', { id: term.id, term: 'the Rif' });
      termMap.set('rif', { id: term.id, term: 'Rif' });
    }
    if (lowerTerm === 'souss valley') {
      termMap.set('souss', { id: term.id, term: 'Souss' });
      termMap.set('sous valley', { id: term.id, term: 'Sous Valley' });
      termMap.set('sous', { id: term.id, term: 'Sous' });
    }
  });
});

// Sort terms by length (longest first) to match longer terms before shorter ones
// e.g., "Erg Chebbi" before "Erg"
const sortedTerms = Array.from(termMap.keys()).sort((a, b) => b.length - a.length);

// Create regex pattern that matches whole words only
const termPattern = new RegExp(
  `\\b(${sortedTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
  'gi'
);

/**
 * Links glossary terms in HTML string
 * Returns HTML string with <a> tags for glossary terms
 * Only links each term once (first occurrence)
 */
export function linkGlossaryTermsHTML(html: string): string {
  if (!html) return html;
  
  const linkedTerms = new Set<string>();
  
  // Don't link inside existing anchor tags or headings
  // Split by tags, process text nodes only
  const parts = html.split(/(<[^>]+>)/);
  
  let inAnchor = false;
  let inHeading = false;
  
  const processed = parts.map(part => {
    // Check if this is a tag
    if (part.startsWith('<')) {
      const lowerPart = part.toLowerCase();
      if (lowerPart.startsWith('<a ') || lowerPart === '<a>') inAnchor = true;
      if (lowerPart.startsWith('</a')) inAnchor = false;
      if (lowerPart.match(/^<h[1-6]/)) inHeading = true;
      if (lowerPart.match(/^<\/h[1-6]/)) inHeading = false;
      return part;
    }
    
    // Skip if inside anchor or heading
    if (inAnchor || inHeading) return part;
    
    // Process text node
    return part.replace(termPattern, (match) => {
      const lowerMatch = match.toLowerCase();
      const termInfo = termMap.get(lowerMatch);
      
      if (!termInfo) return match;
      
      // Only link each term once
      if (linkedTerms.has(termInfo.id)) return match;
      linkedTerms.add(termInfo.id);
      
      // Return linked version, preserving original casing
      return `<a href="/glossary#${termInfo.id}" class="glossary-link">${match}</a>`;
    });
  });
  
  return processed.join('');
}

/**
 * React component that renders HTML with glossary links
 */
export function GlossaryLinkedContent({ 
  html, 
  className = '' 
}: { 
  html: string; 
  className?: string;
}) {
  const linkedHtml = linkGlossaryTermsHTML(html);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: linkedHtml }}
    />
  );
}

/**
 * For plain text (non-HTML), returns React elements with links
 * Useful for descriptions that aren't HTML
 */
export function linkGlossaryTermsText(text: string): React.ReactNode {
  if (!text) return text;
  
  const linkedTerms = new Set<string>();
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  
  // Find all matches
  const matches: { index: number; length: number; match: string; termInfo: TermInfo }[] = [];
  
  let match;
  const regex = new RegExp(termPattern.source, 'gi');
  
  while ((match = regex.exec(text)) !== null) {
    const lowerMatch = match[0].toLowerCase();
    const termInfo = termMap.get(lowerMatch);
    
    if (termInfo && !linkedTerms.has(termInfo.id)) {
      linkedTerms.add(termInfo.id);
      matches.push({
        index: match.index,
        length: match[0].length,
        match: match[0],
        termInfo
      });
    }
  }
  
  // Build result with links
  matches.forEach((m, i) => {
    // Add text before this match
    if (m.index > lastIndex) {
      parts.push(text.slice(lastIndex, m.index));
    }
    
    // Add the link
    parts.push(
      <Link 
        key={i} 
        href={`/glossary#${m.termInfo.id}`}
        className="glossary-link"
      >
        {m.match}
      </Link>
    );
    
    lastIndex = m.index + m.length;
  });
  
  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  
  return parts.length > 0 ? <>{parts}</> : text;
}
