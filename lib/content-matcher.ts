/**
 * Content Matcher - Cross-links journeys and stories
 * 
 * Matching logic:
 * - Story region → Journey destinations
 * - Story tags → Journey destinations/focus
 * - Journey destinations → Story regions/tags
 */

// Normalize region/destination names for matching
const regionNormalizer: Record<string, string[]> = {
  // Story regions → Journey destination slugs
  'marrakech': ['marrakech', 'marrakesh'],
  'marrakesh': ['marrakech', 'marrakesh'],
  'fes': ['fes', 'fez'],
  'fez': ['fes', 'fez'],
  'draa valley': ['draa-valley', 'draa', 'zagora', 'tamegroute'],
  'draa-tafilalet': ['draa-valley', 'merzouga', 'errachidia', 'tinghir'],
  'sahara': ['merzouga', 'erg-chebbi', 'mhamid', 'erg-chigaga', 'zagora'],
  'high atlas': ['high-atlas', 'toubkal', 'imlil', 'ouirgane', 'ait-benhaddou'],
  'anti-atlas': ['anti-atlas', 'tafraoute', 'tata', 'tiznit', 'taroudant'],
  'middle atlas': ['middle-atlas', 'ifrane', 'azrou', 'midelt'],
  'rif': ['rif', 'chefchaouen', 'tetouan', 'al-hoceima'],
  'atlantic coast': ['essaouira', 'oualidia', 'el-jadida', 'casablanca', 'rabat', 'asilah'],
  'coast': ['essaouira', 'oualidia', 'el-jadida', 'casablanca', 'agadir', 'taghazout'],
  'essaouira': ['essaouira'],
  'tangier': ['tangier', 'tanger'],
  'casablanca': ['casablanca'],
  'ouarzazate': ['ouarzazate', 'skoura', 'ait-benhaddou'],
  'meknes': ['meknes', 'volubilis', 'moulay-idriss'],
  'merzouga': ['merzouga', 'erg-chebbi'],
  'north africa': [], // Too broad, skip
  'morocco': [], // Too broad, skip
  'multiple': [], // Skip
  'national': [], // Skip
};

// Focus/category matching
const focusToTags: Record<string, string[]> = {
  'desert': ['sahara', 'desert', 'dunes', 'erg', 'nomad', 'camel'],
  'culture': ['culture', 'tradition', 'craft', 'artisan', 'music', 'gnawa', 'sufi'],
  'architecture': ['architecture', 'kasbah', 'riad', 'medina', 'ksar', 'mosque'],
  'food': ['food', 'cuisine', 'culinary', 'spice', 'tagine', 'couscous'],
  'craft': ['craft', 'weaving', 'pottery', 'zellige', 'leather', 'textile'],
  'mountains': ['atlas', 'mountain', 'trek', 'berber', 'village'],
  'coast': ['coast', 'atlantic', 'ocean', 'port', 'fishing', 'surf'],
  'history': ['history', 'roman', 'andalusian', 'jewish', 'imperial'],
};

/**
 * Normalize a region name to matchable slugs
 */
export function normalizeRegion(region: string): string[] {
  if (!region) return [];
  const lower = region.toLowerCase().trim();
  
  // Check if it's a Midjourney prompt (contains --ar or --v)
  if (lower.includes('--ar') || lower.includes('--v')) return [];
  
  // Direct match
  if (regionNormalizer[lower]) {
    return regionNormalizer[lower];
  }
  
  // Partial match
  for (const [key, values] of Object.entries(regionNormalizer)) {
    if (lower.includes(key) || key.includes(lower)) {
      return values;
    }
  }
  
  // Return as slug
  return [lower.replace(/\s+/g, '-')];
}

/**
 * Parse tags string into array
 */
export function parseTags(tags: string): string[] {
  if (!tags) return [];
  return tags
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0);
}

/**
 * Parse destinations string into array
 */
export function parseDestinations(destinations: string): string[] {
  if (!destinations) return [];
  return destinations
    .split(',')
    .map(d => d.trim().toLowerCase())
    .filter(d => d.length > 0);
}

/**
 * Calculate match score between a story and a journey
 * Higher score = better match
 */
export function calculateMatchScore(
  storyRegion: string,
  storyTags: string,
  storyCategory: string,
  journeyDestinations: string,
  journeyFocus: string
): number {
  let score = 0;
  
  const normalizedRegions = normalizeRegion(storyRegion);
  const tags = parseTags(storyTags);
  const destinations = parseDestinations(journeyDestinations);
  const focus = journeyFocus?.toLowerCase() || '';
  const category = storyCategory?.toLowerCase() || '';
  
  // Region matches destination (strong signal)
  for (const region of normalizedRegions) {
    if (destinations.includes(region)) {
      score += 10;
    }
  }
  
  // Tags match destinations
  for (const tag of tags) {
    const tagSlug = tag.replace(/\s+/g, '-');
    if (destinations.includes(tagSlug) || destinations.some(d => d.includes(tagSlug) || tagSlug.includes(d))) {
      score += 5;
    }
  }
  
  // Category/focus alignment
  if (focus && focusToTags[focus]) {
    for (const tag of tags) {
      if (focusToTags[focus].includes(tag)) {
        score += 3;
      }
    }
    if (focusToTags[focus].includes(category)) {
      score += 3;
    }
  }
  
  // Direct category match
  if (category === focus) {
    score += 5;
  }
  
  return score;
}

/**
 * Find related stories for a journey
 */
export function findRelatedStories(
  journeyDestinations: string,
  journeyFocus: string,
  stories: Array<{
    slug: string;
    title: string;
    region?: string;
    tags?: string;
    category?: string;
    heroImage?: string;
    excerpt?: string;
  }>,
  limit: number = 4
): Array<{ slug: string; title: string; category?: string; heroImage?: string; excerpt?: string; score: number }> {
  const scored = stories.map(story => ({
    slug: story.slug,
    title: story.title,
    category: story.category,
    heroImage: story.heroImage,
    excerpt: story.excerpt,
    score: calculateMatchScore(
      story.region || '',
      story.tags || '',
      story.category || '',
      journeyDestinations,
      journeyFocus
    ),
  }));
  
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Find related journeys for a story
 */
export function findRelatedJourneys(
  storyRegion: string,
  storyTags: string,
  storyCategory: string,
  journeys: Array<{
    slug: string;
    title: string;
    destinations?: string;
    focus?: string;
    heroImage?: string;
    duration?: number;
    price?: number;
  }>,
  limit: number = 3
): Array<{ slug: string; title: string; heroImage?: string; duration?: number; price?: number; score: number }> {
  const scored = journeys.map(journey => ({
    slug: journey.slug,
    title: journey.title,
    heroImage: journey.heroImage,
    duration: journey.duration,
    price: journey.price,
    score: calculateMatchScore(
      storyRegion,
      storyTags,
      storyCategory,
      journey.destinations || '',
      journey.focus || ''
    ),
  }));
  
  return scored
    .filter(j => j.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
