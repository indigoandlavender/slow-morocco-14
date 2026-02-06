'use client';

import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapboxgl: any = null;

interface StoryLocation {
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  region?: string;
  coordinates: [number, number]; // [lng, lat]
}

interface MoroccoMapProps {
  stories: StoryLocation[];
  className?: string;
}

// Morocco region coordinates
const MOROCCO_COORDINATES: Record<string, [number, number]> = {
  // Major cities
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
  'North Africa': [-6.0, 32.0],
  'Morocco': [-6.0, 32.0],
  'Multiple': [-6.0, 32.0],
  'south': [-6.5, 29.5],
  
  // Specific places
  'Ait Benhaddou': [-7.1317, 31.0472],
  'Todra Gorge': [-5.5833, 31.5500],
  'Dades Valley': [-5.9000, 31.4500],
  'Tafraoute': [-8.9753, 29.7214],
  'Taliouine': [-7.9167, 30.5333],
  'Skoura': [-6.5667, 31.0500],
  'Zagora': [-5.8381, 30.3303],
  'Tinghir': [-5.5328, 31.5147],
  'Taroudant': [-8.8769, 30.4706],
  'Agadir': [-9.5981, 30.4278],
  'Volubilis': [-5.5547, 34.0722],
  'Meknes': [-5.5547, 33.8935],
};

function getCoordinatesForStory(region: string): [number, number] | null {
  if (!region) return MOROCCO_COORDINATES['Morocco'];
  
  // Try exact match first
  if (MOROCCO_COORDINATES[region]) {
    return MOROCCO_COORDINATES[region];
  }
  
  // Try case-insensitive match
  const lowerRegion = region.toLowerCase();
  for (const [key, coords] of Object.entries(MOROCCO_COORDINATES)) {
    if (key.toLowerCase() === lowerRegion) {
      return coords;
    }
  }
  
  // Try partial match
  for (const [key, coords] of Object.entries(MOROCCO_COORDINATES)) {
    if (lowerRegion.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerRegion)) {
      return coords;
    }
  }
  
  // Default to center of Morocco
  return MOROCCO_COORDINATES['Morocco'];
}

export default function MoroccoMap({ stories, className = '' }: MoroccoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Dynamically import mapbox-gl
    const initMap = async () => {
      try {
        if (!mapboxgl) {
          const mb = await import('mapbox-gl');
          mapboxgl = mb.default;
          mapboxgl.accessToken = 'pk.eyJ1IjoiaW5kaWdvYW5kbGF2ZW5kZXIiLCJhIjoiY21kN3B0OTZvMGllNjJpcXY0MnZlZHVlciJ9.1-jV-Pze3d7HZseOAhmkCg';
          
          // Add CSS dynamically
          if (!document.getElementById('mapbox-gl-css')) {
            const link = document.createElement('link');
            link.id = 'mapbox-gl-css';
            link.rel = 'stylesheet';
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
            document.head.appendChild(link);
          }
        }

        if (!mapContainer.current) return;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [-6.5, 31.5], // Center on Morocco
          zoom: 5.2,
          minZoom: 4.5,
          maxZoom: 10,
          attributionControl: false,
          scrollZoom: false,
          // Restrict to Morocco bounds
          maxBounds: [
            [-17, 21], // Southwest
            [0, 36.5]   // Northeast
          ],
        });

        map.current.on('error', () => {
          setMapError(true);
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          'top-right'
        );

        // Enable scroll zoom on click
        map.current.on('click', () => {
          map.current?.scrollZoom.enable();
        });

        // Disable scroll zoom when mouse leaves
        mapContainer.current?.addEventListener('mouseleave', () => {
          map.current?.scrollZoom.disable();
        });

        map.current.on('load', () => {
          setIsLoading(false);
          
          // Clear existing markers
          markersRef.current.forEach(m => m.remove());
          markersRef.current = [];

          // Group stories by coordinates to handle overlapping
          const storyGroups: Record<string, StoryLocation[]> = {};
          
          stories.forEach((story) => {
            const coords = story.coordinates;
            if (!coords) return;
            
            const key = `${coords[0].toFixed(2)},${coords[1].toFixed(2)}`;
            if (!storyGroups[key]) {
              storyGroups[key] = [];
            }
            storyGroups[key].push(story);
          });

          // Add markers for each group
          Object.entries(storyGroups).forEach(([key, groupStories]) => {
            const [lng, lat] = key.split(',').map(Number);
            
            const el = document.createElement('div');
            el.className = 'morocco-story-marker';
            el.innerHTML = `
              <div style="position: relative;">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="10" fill="#0a0a0a" stroke="#ffffff" stroke-width="2"/>
                  ${groupStories.length > 1 ? `<text x="14" y="18" text-anchor="middle" fill="white" font-size="10" font-weight="500">${groupStories.length}</text>` : ''}
                </svg>
              </div>
            `;
            el.style.cursor = 'pointer';

            // Create popup content
            const popupContent = groupStories.length === 1
              ? `
                <a href="/story/${groupStories[0].slug}" style="display: block; padding: 12px 16px; max-width: 240px; background: #0a0a0a; text-decoration: none;">
                  <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); margin-bottom: 6px;">
                    ${groupStories[0].category || 'Story'}
                  </p>
                  <p style="font-family: 'Libre Baskerville', serif; font-size: 14px; font-weight: 400; color: white; margin-bottom: 4px; line-height: 1.3;">
                    ${groupStories[0].title}
                  </p>
                  ${groupStories[0].region ? `<p style="font-size: 11px; color: rgba(255,255,255,0.5);">${groupStories[0].region}</p>` : ''}
                </a>
              `
              : `
                <div style="padding: 12px 16px; max-width: 260px; background: #0a0a0a;">
                  <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); margin-bottom: 8px;">
                    ${groupStories.length} Stories
                  </p>
                  ${groupStories.slice(0, 5).map(s => `
                    <a href="/story/${s.slug}" style="display: block; padding: 6px 0; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.1);">
                      <p style="font-size: 13px; color: white; margin: 0; line-height: 1.3;">${s.title}</p>
                    </a>
                  `).join('')}
                  ${groupStories.length > 5 ? `<p style="font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 8px;">+ ${groupStories.length - 5} more</p>` : ''}
                </div>
              `;

            const popup = new mapboxgl!.Popup({
              offset: 20,
              closeButton: true,
              closeOnClick: false,
              className: 'morocco-popup',
            }).setHTML(popupContent);

            const marker = new mapboxgl!.Marker(el)
              .setLngLat([lng, lat])
              .setPopup(popup)
              .addTo(map.current!);

            markersRef.current.push(marker);

            el.addEventListener('click', () => {
              // Close other popups
              markersRef.current.forEach(m => m.getPopup()?.remove());
              popup.addTo(map.current!);
            });
          });
        });
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(true);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      markersRef.current.forEach(m => m.remove());
      map.current?.remove();
      map.current = null;
    };
  }, [stories]);

  if (mapError) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-[400px] md:h-[500px] bg-[#1a1a1a] flex items-center justify-center">
          <p className="text-white/40 text-sm">Map unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      {/* Mobile scroll hint */}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-xs text-black/50 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
          Tap map to enable scroll
        </p>
      </div>
      <div
        ref={mapContainer}
        className="w-full h-[400px] md:h-[500px]"
        style={{ backgroundColor: '#f5f0e8' }}
      />
      <style jsx global>{`
        .mapboxgl-popup-content {
          background: #0a0a0a;
          border-radius: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          padding: 0;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .mapboxgl-popup-close-button {
          color: rgba(255,255,255,0.5);
          font-size: 18px;
          padding: 4px 8px;
        }
        .mapboxgl-popup-close-button:hover {
          color: white;
          background: transparent;
        }
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
          border-top-color: #0a0a0a;
        }
        .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
          border-bottom-color: #0a0a0a;
        }
        .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
          border-right-color: #0a0a0a;
        }
        .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
          border-left-color: #0a0a0a;
        }
        .morocco-story-marker {
          transition: transform 0.2s ease;
        }
        .morocco-story-marker:hover {
          transform: scale(1.15);
        }
        .mapboxgl-ctrl-group {
          border-radius: 0 !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
          background: #0a0a0a !important;
          border: 1px solid rgba(255,255,255,0.1) !important;
        }
        .mapboxgl-ctrl-group button {
          border-radius: 0 !important;
          background: #0a0a0a !important;
        }
        .mapboxgl-ctrl-group button span {
          filter: invert(1);
        }
        .mapboxgl-ctrl-group button:hover {
          background: #1a1a1a !important;
        }
      `}</style>
    </div>
  );
}

// Helper function to prepare stories for the map
export function prepareStoriesForMoroccoMap(stories: Array<{
  slug: string;
  title: string;
  subtitle?: string;
  category?: string;
  region?: string;
}>): StoryLocation[] {
  const result: StoryLocation[] = [];
  
  for (const story of stories) {
    const coordinates = getCoordinatesForStory(story.region || '');
    if (coordinates) {
      result.push({
        slug: story.slug,
        title: story.title,
        subtitle: story.subtitle,
        category: story.category,
        region: story.region,
        coordinates,
      });
    }
  }
  
  return result;
}
