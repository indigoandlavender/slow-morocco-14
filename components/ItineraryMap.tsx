'use client';

import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapboxgl: any = null;

interface ItineraryDay {
  dayNumber: number;
  cityName: string;
  fromCity?: string;
  toCity?: string;
  description?: string;
}

interface ItineraryMapProps {
  itinerary: ItineraryDay[];
  className?: string;
}

// Morocco city coordinates
const CITY_COORDINATES: Record<string, [number, number]> = {
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
  'Agadir': [-9.5981, 30.4278],
  'Taroudant': [-8.8769, 30.4706],
  'Meknes': [-5.5547, 33.8935],
  'Tetouan': [-5.3684, 35.5889],
  'Asilah': [-6.0341, 35.4653],
  
  // Day trip / journey destinations
  'Ait Benhaddou': [-7.1317, 31.0472],
  'Ait Ben Haddou': [-7.1317, 31.0472],
  'Imlil': [-7.9167, 31.1333],
  'Ourika': [-7.8333, 31.3333],
  'Ourika Valley': [-7.8333, 31.3333],
  'Toubkal': [-7.9086, 31.0597],
  'Setti Fatma': [-7.6833, 31.2167],
  'Ouzoud': [-6.7167, 32.0167],
  'Ouzoud Falls': [-6.7167, 32.0167],
  'Todra Gorge': [-5.5833, 31.5500],
  'Todra': [-5.5833, 31.5500],
  'Tinghir': [-5.5328, 31.5147],
  'Dades Valley': [-5.9000, 31.4500],
  'Dades': [-5.9000, 31.4500],
  'Skoura': [-6.5667, 31.0500],
  'Zagora': [-5.8381, 30.3303],
  'Draa Valley': [-5.8, 30.2],
  'Tamegroute': [-5.6833, 30.2667],
  'Volubilis': [-5.5547, 34.0722],
  'Moulay Idriss': [-5.5214, 34.0553],
  
  // Sahara camps
  'Erg Chebbi': [-3.9667, 31.1500],
  'Erg Chigaga': [-6.2833, 29.8167],
  'Sahara': [-4.5, 30.5],
  'Desert': [-4.5, 30.5],
  'Desert Camp': [-4.0, 31.1],
  
  // Atlas
  'High Atlas': [-7.5, 31.2],
  'Atlas Mountains': [-7.5, 31.2],
  'Middle Atlas': [-5.5, 33.2],
  'Anti-Atlas': [-8.5, 29.5],
  'Tizi n\'Tichka': [-7.3833, 31.2833],
  
  // Coast
  'El Jadida': [-8.5007, 33.2316],
  'Safi': [-9.2372, 32.2994],
  'Oualidia': [-9.0333, 32.7333],
  'Legzira': [-10.0500, 29.4333],
  'Mirleft': [-10.0333, 29.5833],
  'Sidi Ifni': [-10.1728, 29.3797],
  
  // South
  'Tafraoute': [-8.9753, 29.7214],
  'Taliouine': [-7.9167, 30.5333],
  'Tiznit': [-9.7319, 29.6974],
};

function getCityCoordinates(cityName: string): [number, number] | null {
  if (!cityName) return null;
  
  // Direct match
  if (CITY_COORDINATES[cityName]) {
    return CITY_COORDINATES[cityName];
  }
  
  // Case-insensitive match
  const lowerCity = cityName.toLowerCase();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (key.toLowerCase() === lowerCity) {
      return coords;
    }
  }
  
  // Partial match
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (lowerCity.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerCity)) {
      return coords;
    }
  }
  
  return null;
}

export default function ItineraryMap({ itinerary, className = '' }: ItineraryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (map.current || !mapContainer.current || itinerary.length === 0) return;

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

        // Build route points from itinerary
        const routePoints: { day: number; city: string; coords: [number, number]; description?: string }[] = [];
        
        itinerary.forEach((day) => {
          // Get the main city for this day
          const cityName = day.toCity || day.cityName || day.fromCity;
          if (cityName) {
            const coords = getCityCoordinates(cityName);
            if (coords) {
              // Avoid duplicate consecutive points
              const lastPoint = routePoints[routePoints.length - 1];
              if (!lastPoint || lastPoint.coords[0] !== coords[0] || lastPoint.coords[1] !== coords[1]) {
                routePoints.push({
                  day: day.dayNumber,
                  city: cityName,
                  coords,
                  description: day.description,
                });
              }
            }
          }
        });

        if (routePoints.length === 0) {
          setMapError(true);
          setIsLoading(false);
          return;
        }

        // Calculate bounds
        const lngs = routePoints.map(p => p.coords[0]);
        const lats = routePoints.map(p => p.coords[1]);
        const bounds = [
          [Math.min(...lngs) - 0.5, Math.min(...lats) - 0.5],
          [Math.max(...lngs) + 0.5, Math.max(...lats) + 0.5],
        ];

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          bounds: bounds as [[number, number], [number, number]],
          fitBoundsOptions: { padding: 50 },
          attributionControl: false,
          scrollZoom: false,
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

        mapContainer.current?.addEventListener('mouseleave', () => {
          map.current?.scrollZoom.disable();
        });

        map.current.on('load', () => {
          setIsLoading(false);

          // Add route line
          if (routePoints.length > 1) {
            map.current.addSource('route', {
              type: 'geojson',
              data: {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: routePoints.map(p => p.coords),
                },
              },
            });

            map.current.addLayer({
              id: 'route-line',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#8B2635',
                'line-width': 2,
                'line-dasharray': [2, 2],
              },
            });
          }

          // Add markers for each stop
          routePoints.forEach((point, index) => {
            const el = document.createElement('div');
            el.className = 'itinerary-marker';
            el.innerHTML = `
              <div style="
                width: 32px;
                height: 32px;
                background: #8B2635;
                border: 2px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
              ">
                ${point.day}
              </div>
            `;

            const popup = new mapboxgl.Popup({
              offset: 20,
              closeButton: false,
              closeOnClick: false,
              className: 'itinerary-popup',
            }).setHTML(`
              <div style="padding: 12px 16px; max-width: 220px; background: #1a1a1a;">
                <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.4); margin-bottom: 4px;">
                  Day ${point.day}
                </p>
                <p style="font-size: 15px; font-weight: 500; color: white; margin-bottom: 4px;">
                  ${point.city}
                </p>
                ${point.description ? `<p style="font-size: 12px; color: rgba(255,255,255,0.6); line-height: 1.4;">${point.description.substring(0, 100)}${point.description.length > 100 ? '...' : ''}</p>` : ''}
              </div>
            `);

            const marker = new mapboxgl.Marker(el)
              .setLngLat(point.coords)
              .addTo(map.current);

            markersRef.current.push(marker);

            el.addEventListener('mouseenter', () => {
              popup.setLngLat(point.coords).addTo(map.current);
            });

            el.addEventListener('mouseleave', () => {
              popup.remove();
            });
          });
        });
      } catch (error) {
        console.error('Error initializing itinerary map:', error);
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
  }, [itinerary]);

  if (mapError || itinerary.length === 0) {
    return null; // Don't show anything if map fails or no itinerary
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#f5f0e8] flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
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
        className="w-full h-[350px] md:h-[400px]"
        style={{ backgroundColor: '#f5f0e8' }}
      />
      <style jsx global>{`
        .mapboxgl-popup-content {
          background: #1a1a1a;
          border-radius: 0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
          padding: 0;
        }
        .mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
          border-top-color: #1a1a1a;
        }
        .mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
          border-bottom-color: #1a1a1a;
        }
        .mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
          border-right-color: #1a1a1a;
        }
        .mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
          border-left-color: #1a1a1a;
        }
        .itinerary-marker {
          transition: transform 0.2s ease;
        }
        .itinerary-marker:hover {
          transform: scale(1.15);
          z-index: 10;
        }
      `}</style>
    </div>
  );
}
