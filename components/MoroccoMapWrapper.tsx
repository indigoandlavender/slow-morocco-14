'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, Component, ReactNode } from 'react';
import Link from 'next/link';

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Fallback component when map fails
function MapFallback({ stories }: { stories: Array<{ slug: string; title: string; region?: string; category?: string }> }) {
  const byRegion = stories.reduce((acc, story) => {
    const region = story.region || 'Morocco';
    if (!acc[region]) acc[region] = [];
    acc[region].push(story);
    return acc;
  }, {} as Record<string, typeof stories>);

  const sortedRegions = Object.keys(byRegion).sort();

  return (
    <div className="w-full bg-[#111] px-6 py-8 border border-white/10">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
        Stories by Region
      </p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        {sortedRegions.slice(0, 9).map(region => (
          <div key={region}>
            <h3 className="text-sm text-white/70 mb-2">{region}</h3>
            <ul className="space-y-1">
              {byRegion[region].slice(0, 3).map(story => (
                <li key={story.slug}>
                  <Link 
                    href={`/story/${story.slug}`}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {story.title}
                  </Link>
                </li>
              ))}
              {byRegion[region].length > 3 && (
                <li className="text-xs text-white/30">+ {byRegion[region].length - 3} more</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const MoroccoMap = dynamic(() => import('./MoroccoMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[500px] bg-[#1a1a1a] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  ),
});

// Import the helper function separately to avoid SSR issues
const prepareStoriesForMoroccoMap = (stories: Array<{
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  region?: string;
}>) => {
  const MOROCCO_COORDINATES: Record<string, [number, number]> = {
    // Cities
    'Marrakech': [-7.9811, 31.6295],
    'Marrakesh': [-7.9811, 31.6295],
    'Fez': [-4.9998, 34.0331],
    'Fes': [-4.9998, 34.0331],
    'Tangier': [-5.8128, 35.7595],
    'Essaouira': [-9.7595, 31.5085],
    'Casablanca': [-7.5898, 33.5731],
    'Rabat': [-6.8498, 34.0209],
    'Chefchaouen': [-5.2636, 35.1688],
    'Ouarzazate': [-6.9063, 30.9189],
    'Merzouga': [-4.0133, 31.0801],
    'Erfoud': [-4.2333, 31.4314],
    'Agadir': [-9.5981, 30.4278],
    'Taroudant': [-8.8769, 30.4706],
    // Day trip destinations
    'Ouzoud': [-6.7167, 32.0167],
    'Ouzoud Falls': [-6.7167, 32.0167],
    'Ait Benhaddou': [-7.1317, 31.0472],
    'Ait Ben Haddou': [-7.1317, 31.0472],
    'Imlil': [-7.9167, 31.1333],
    'Ourika': [-7.8333, 31.3333],
    'Ourika Valley': [-7.8333, 31.3333],
    'Toubkal': [-7.9086, 31.0597],
    'Setti Fatma': [-7.6833, 31.2167],
    // Regions
    'High Atlas': [-7.5, 31.2],
    'Anti-Atlas': [-8.5, 29.5],
    'Middle Atlas': [-5.5, 33.2],
    'Rif': [-4.5, 35.0],
    'Sahara': [-5.5, 30.0],
    'Pre-Sahara': [-5.8, 30.5],
    'Draa Valley': [-5.8, 30.2],
    'Draa-Tafilalet': [-5.5, 31.0],
    'Atlantic Plains': [-8.0, 33.0],
    'Atlantic Coast': [-9.5, 31.0],
    'Coast': [-9.5, 31.0],
    'Mountains': [-7.5, 31.2],
    'Desert': [-5.5, 30.0],
    'North Africa': [-6.0, 32.0],
    'Morocco': [-6.0, 32.0],
    'Multiple': [-6.0, 32.0],
    'south': [-6.5, 29.5],
  };

  const getCoordinates = (region: string): [number, number] => {
    if (!region) return MOROCCO_COORDINATES['Morocco'];
    if (MOROCCO_COORDINATES[region]) return MOROCCO_COORDINATES[region];
    
    const lowerRegion = region.toLowerCase();
    for (const [key, coords] of Object.entries(MOROCCO_COORDINATES)) {
      if (key.toLowerCase() === lowerRegion) return coords;
      if (lowerRegion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRegion)) return coords;
    }
    return MOROCCO_COORDINATES['Morocco'];
  };

  return stories.map(story => ({
    slug: story.slug,
    title: story.title,
    subtitle: story.subtitle,
    category: story.category,
    region: story.region,
    coordinates: getCoordinates(story.region || ''),
  }));
};

interface MoroccoMapWrapperProps {
  stories: Array<{
    slug: string;
    title: string;
    subtitle?: string;
    category?: string;
    region?: string;
  }>;
  className?: string;
}

export default function MoroccoMapWrapper({ stories, className }: MoroccoMapWrapperProps) {
  const [mapError, setMapError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (stories.length === 0) {
    return (
      <div className="w-full h-[300px] bg-[#1a1a1a] flex items-center justify-center">
        <p className="text-white/40 text-sm">No stories to display on map</p>
      </div>
    );
  }

  // Server-side or map error: show fallback
  if (!isClient || mapError) {
    return <MapFallback stories={stories} />;
  }

  const mappedStories = prepareStoriesForMoroccoMap(stories);

  return (
    <ErrorBoundary fallback={<MapFallback stories={stories} />} onError={() => setMapError(true)}>
      <MoroccoMap stories={mappedStories} className={className} />
    </ErrorBoundary>
  );
}
