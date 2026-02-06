'use client';

import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapboxgl: any = null;

interface RouteMapProps {
  className?: string;
}

// Marrakech to Agafay coordinates
const MARRAKECH: [number, number] = [-7.9811, 31.6295];
const AGAFAY: [number, number] = [-8.3500, 31.4833];

export default function AgafayRouteMap({ className = '' }: RouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || map.current || !mapContainer.current) return;

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
            
            // Wait for CSS to load
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        if (!mapContainer.current) return;

        // Center between Marrakech and Agafay
        const centerLng = (MARRAKECH[0] + AGAFAY[0]) / 2;
        const centerLat = (MARRAKECH[1] + AGAFAY[1]) / 2;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          center: [centerLng, centerLat],
          zoom: 9.5,
          attributionControl: false,
          scrollZoom: false,
          pitch: 30,
        });

        map.current.on('error', (e: any) => {
          // Only set error for fatal initialization issues, not tile load failures
          if (e.error?.message?.includes('Failed to initialize')) {
            setMapError(true);
          }
        });

        // Enable scroll zoom on click
        map.current.on('click', () => {
          map.current?.scrollZoom.enable();
        });

        mapContainer.current?.addEventListener('mouseleave', () => {
          map.current?.scrollZoom.disable();
        });

        map.current.on('load', () => {
          setIsLoading(false);

          // Add route line source
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [MARRAKECH, AGAFAY],
              },
            },
          });

          // Background line (static)
          map.current.addLayer({
            id: 'route-bg',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#1a1916',
              'line-width': 3,
              'line-opacity': 0.15,
            },
          });

          // Animated dashed line
          map.current.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#1a1916',
              'line-width': 2,
              'line-dasharray': [0, 4, 3],
            },
          });

          // Animate the dash
          let dashOffset = 0;
          const animateDash = () => {
            dashOffset -= 0.5;
            if (map.current && map.current.getLayer('route-line')) {
              map.current.setPaintProperty('route-line', 'line-dasharray', [
                dashOffset % 7,
                4,
                3,
              ]);
            }
            requestAnimationFrame(animateDash);
          };
          animateDash();

          // Marrakech marker
          const marrakechEl = document.createElement('div');
          marrakechEl.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="
                width: 12px;
                height: 12px;
                background: #1a1916;
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              "></div>
              <div style="
                margin-top: 6px;
                font-size: 11px;
                font-weight: 500;
                color: #1a1916;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                background: white;
                padding: 4px 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              ">Marrakech</div>
            </div>
          `;

          new mapboxgl.Marker({ element: marrakechEl, anchor: 'top' })
            .setLngLat(MARRAKECH)
            .addTo(map.current);

          // Agafay marker (destination - larger)
          const agafayEl = document.createElement('div');
          agafayEl.innerHTML = `
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
            ">
              <div style="
                width: 20px;
                height: 20px;
                background: #8B2635;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 12px rgba(139,38,53,0.4);
              "></div>
              <div style="
                margin-top: 6px;
                font-size: 11px;
                font-weight: 600;
                color: #8B2635;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                background: white;
                padding: 4px 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
              ">Agafay Desert</div>
            </div>
          `;

          new mapboxgl.Marker({ element: agafayEl, anchor: 'top' })
            .setLngLat(AGAFAY)
            .addTo(map.current);
        });
      } catch (error) {
        console.error('Error initializing route map:', error);
        setMapError(true);
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mounted]);

  if (mapError) {
    // Fallback: static map image or simple route display
    return (
      <div className={`relative ${className}`}>
        <div 
          className="w-full h-[300px] md:h-[350px] bg-sand flex items-center justify-center"
        >
          <div className="text-center px-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="w-3 h-3 bg-foreground rounded-full mx-auto mb-2" />
                <span className="text-xs tracking-[0.1em] uppercase">Marrakech</span>
              </div>
              <div className="flex-1 max-w-[120px] border-t-2 border-dashed border-foreground/30" />
              <div className="text-center">
                <div className="w-4 h-4 bg-[#8B2635] rounded-full mx-auto mb-2" />
                <span className="text-xs tracking-[0.1em] uppercase font-medium">Agafay</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 px-2 text-xs text-foreground/70">
          <span>40 minutes from Marrakech</span>
          <span>Stone desert plateau</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-sand flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      )}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-xs text-foreground/50 bg-background/80 backdrop-blur-sm px-3 py-1.5">
          Tap map to enable scroll
        </p>
      </div>
      <div
        ref={mapContainer}
        className="w-full h-[300px] md:h-[350px]"
        style={{ backgroundColor: '#e8e0d4' }}
      />
      <div className="flex justify-between items-center mt-4 px-2 text-xs text-foreground/70">
        <span>40 minutes from Marrakech</span>
        <span>Stone desert plateau</span>
      </div>
    </div>
  );
}
