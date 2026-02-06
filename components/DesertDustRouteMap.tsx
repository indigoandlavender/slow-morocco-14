'use client';

import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mapboxgl: any = null;

interface RouteStop {
  name: string;
  coords: [number, number];
  label: string;
}

const ROUTE_STOPS: RouteStop[] = [
  { name: 'Marrakech', coords: [-7.9811, 31.6295], label: 'Start' },
  { name: 'Tahanaout', coords: [-7.9533, 31.4994], label: 'Coffee Stop' },
  { name: 'Asni', coords: [-7.9833, 31.2500], label: 'Sweeping Curves' },
  { name: 'Moulay Brahim', coords: [-8.0333, 31.2833], label: 'Switchbacks' },
  { name: 'Lalla Takerkoust', coords: [-8.1333, 31.3667], label: 'Lunch at Lake' },
  { name: 'Agafay Desert', coords: [-8.3500, 31.4833], label: 'Golden Hour' },
  { name: 'Marrakech', coords: [-7.9811, 31.6295], label: 'Return' },
];

export default function DesertDustRouteMap({ className = '' }: { className?: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const map = useRef<any>(null);
  const [mapError, setMapError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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

          if (!document.getElementById('mapbox-gl-css')) {
            const link = document.createElement('link');
            link.id = 'mapbox-gl-css';
            link.rel = 'stylesheet';
            link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css';
            document.head.appendChild(link);
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        if (!mapContainer.current) return;

        // Calculate bounds
        const lngs = ROUTE_STOPS.map(s => s.coords[0]);
        const lats = ROUTE_STOPS.map(s => s.coords[1]);
        const bounds: [[number, number], [number, number]] = [
          [Math.min(...lngs) - 0.15, Math.min(...lats) - 0.1],
          [Math.max(...lngs) + 0.15, Math.max(...lats) + 0.1],
        ];

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/outdoors-v12',
          bounds,
          fitBoundsOptions: { padding: 40 },
          attributionControl: false,
          scrollZoom: false,
          pitch: 20,
        });

        map.current.on('error', (e: { error?: { message?: string } }) => {
          if (e.error?.message?.includes('Failed to initialize')) {
            setMapError(true);
          }
        });

        map.current.addControl(
          new mapboxgl.NavigationControl({ showCompass: false }),
          'top-right'
        );

        map.current.on('click', () => {
          map.current?.scrollZoom.enable();
        });

        mapContainer.current?.addEventListener('mouseleave', () => {
          map.current?.scrollZoom.disable();
        });

        map.current.on('load', () => {
          setIsLoading(false);

          // Add route line
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: ROUTE_STOPS.map(s => s.coords),
              },
            },
          });

          // Background line
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
              'line-width': 4,
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
              'line-color': '#8B2635',
              'line-width': 2.5,
              'line-dasharray': [0, 4, 3],
            },
          });

          // Animate the dash
          let dashOffset = 0;
          const animateDash = () => {
            dashOffset -= 0.3;
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

          // Add markers for each stop (skip last as it's same as first)
          ROUTE_STOPS.slice(0, -1).forEach((stop, index) => {
            const isStart = index === 0;
            const isAgafay = stop.name === 'Agafay Desert';

            const el = document.createElement('div');
            el.innerHTML = `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
              ">
                <div style="
                  width: ${isAgafay ? '24px' : isStart ? '16px' : '12px'};
                  height: ${isAgafay ? '24px' : isStart ? '16px' : '12px'};
                  background: ${isAgafay ? '#8B2635' : '#1a1916'};
                  border: ${isAgafay ? '3px' : '2px'} solid white;
                  border-radius: 50%;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 10px;
                  font-weight: 600;
                ">${isStart ? '' : index}</div>
                <div style="
                  margin-top: 6px;
                  font-size: ${isAgafay || isStart ? '11px' : '10px'};
                  font-weight: ${isAgafay || isStart ? '600' : '500'};
                  color: ${isAgafay ? '#8B2635' : '#1a1916'};
                  text-transform: uppercase;
                  letter-spacing: 0.08em;
                  background: white;
                  padding: 3px 8px;
                  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
                  white-space: nowrap;
                ">${stop.name}</div>
              </div>
            `;

            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: false,
              closeOnClick: false,
            }).setHTML(`
              <div style="padding: 10px 14px; background: #1a1a1a;">
                <p style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em; color: rgba(255,255,255,0.5); margin-bottom: 4px;">
                  ${stop.label}
                </p>
                <p style="font-size: 14px; font-weight: 500; color: white;">
                  ${stop.name}
                </p>
              </div>
            `);

            const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
              .setLngLat(stop.coords)
              .addTo(map.current);

            el.addEventListener('mouseenter', () => {
              popup.setLngLat(stop.coords).addTo(map.current);
            });
            el.addEventListener('mouseleave', () => {
              popup.remove();
            });
          });
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
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-[400px] bg-[#f5f0e8] flex items-center justify-center">
          <div className="text-center px-8">
            <p className="text-sm text-foreground/60 mb-4">Interactive map unavailable</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-foreground/70">
              <span>Marrakech</span>
              <span>→</span>
              <span>Tahanaout</span>
              <span>→</span>
              <span>Asni</span>
              <span>→</span>
              <span>Lake Takerkoust</span>
              <span>→</span>
              <span className="font-medium text-[#8B2635]">Agafay</span>
              <span>→</span>
              <span>Marrakech</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-[#f5f0e8] flex items-center justify-center z-10">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      )}
      <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <p className="text-xs text-foreground/50 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
          Tap map to enable scroll
        </p>
      </div>
      <div
        ref={mapContainer}
        className="w-full h-[400px] md:h-[450px]"
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
      `}</style>
    </div>
  );
}
