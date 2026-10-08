import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Ship,
  ArrowRight,
  Globe2,
  Navigation,
  Clock,
  CheckCircle2,
  Anchor,
  RotateCcw,
} from 'lucide-react';
import type { Language, LogisticsPortDestination } from '../types';
import { EXPORT_DESTINATIONS } from '../data/routesData';
import { translations } from '../translations';

interface ExportRouteVisualizerProps {
  currentLang: Language;
  onSelectDestinationPort: (portName: string) => void;
}

type RegionFilter = 'all' | 'gulf_red_sea' | 'mediterranean' | 'europe';
export type MapTileTheme = 'nautical_dark' | 'ocean' | 'satellite' | 'osm';

interface TileProviderConfig {
  id: MapTileTheme;
  label: string;
  url: string;
  subdomains?: string[];
  maxZoom: number;
  attribution: string;
}

const TILE_PROVIDERS: Record<MapTileTheme, TileProviderConfig> = {
  nautical_dark: {
    id: 'nautical_dark',
    label: 'Nautical Dark',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 16,
    attribution: 'Esri, HERE, Garmin',
  },
  ocean: {
    id: 'ocean',
    label: 'Deep Ocean',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 13,
    attribution: 'Esri, GEBCO, NOAA',
  },
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    attribution: 'Esri, Maxar, Earthstar',
  },
  osm: {
    id: 'osm',
    label: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors',
  },
};

// Key strategic maritime chokepoints
const MARITIME_CHOKEPOINTS = [
  { id: 'bosphorus', name: 'Bosphorus Strait', coords: [41.1167, 29.0833] as [number, number], label: 'Bosphorus Gateway (Istanbul)' },
  { id: 'suez', name: 'Suez Canal Gateway', coords: [30.5852, 32.2654] as [number, number], label: 'Suez Maritime Corridor' },
  { id: 'bab_el_mandeb', name: 'Bab-el-Mandeb Strait', coords: [12.5833, 43.3333] as [number, number], label: 'Bab-el-Mandeb (Red Sea Gate)' },
  { id: 'hormuz', name: 'Strait of Hormuz', coords: [26.5667, 56.2500] as [number, number], label: 'Strait of Hormuz (Gulf Gate)' },
];

// Suceava / Gălănești Mill & Port Constanța Hub exact coordinates
const GALANESTI_COORDS: [number, number] = [47.9250, 25.8690];
const CONSTANTA_COORDS: [number, number] = [44.0931, 28.6294];

// Dedicated realistic route paths strictly following navigable waterways & rail corridors
const DETAILED_MARITIME_ROUTES: Record<string, {
  waypoints: [number, number][];
  isOverland?: boolean;
}> = {
  // Overland Shuttle: Gălănești Sawmill -> Port Constanța Sud - Agigea
  overland_feeder: {
    isOverland: true,
    waypoints: [
      GALANESTI_COORDS,
      [47.5000, 26.2500],
      [46.9200, 26.9300],
      [46.5600, 26.9100],
      [45.7000, 27.1800],
      [45.2700, 27.9700],
      [44.4000, 28.3000],
      CONSTANTA_COORDS,
    ]
  },
  // Constanța -> Piraeus
  piraeus: {
    waypoints: [
      CONSTANTA_COORDS,
      [43.2000, 29.2000],
      [41.2500, 29.1500], // Bosphorus North
      [41.0500, 29.0200], // Istanbul
      [40.8000, 28.2000], // Sea of Marmara
      [40.2000, 26.4000], // Dardanelles
      [39.5000, 25.4000], // North Aegean
      [38.2000, 24.3000], // Euboea / Attica fairway
      [37.9429, 23.6469], // Port of Piraeus
    ]
  },
  // Constanța -> Alexandria & Damietta
  alexandria: {
    waypoints: [
      CONSTANTA_COORDS,
      [43.2000, 29.2000],
      [41.2500, 29.1500],
      [41.0500, 29.0200],
      [40.8000, 28.2000],
      [40.2000, 26.4000],
      [39.5000, 25.4000],
      [37.5000, 26.0000],
      [35.0000, 27.5000], // East of Crete
      [33.0000, 29.2000], // Mediterranean fairway
      [31.2001, 29.9187], // Alexandria
    ]
  },
  // Constanța -> Beirut
  beirut: {
    waypoints: [
      CONSTANTA_COORDS,
      [43.2000, 29.2000],
      [41.2500, 29.1500],
      [41.0500, 29.0200],
      [40.8000, 28.2000],
      [40.2000, 26.4000],
      [39.5000, 25.4000],
      [36.5000, 28.5000],
      [34.5000, 32.5000], // South of Cyprus
      [33.9015, 35.5196], // Beirut
    ]
  },
  // Constanța -> Jeddah Islamic Port (via Suez Canal)
  jeddah: {
    waypoints: [
      CONSTANTA_COORDS,
      [43.2000, 29.2000],
      [41.2500, 29.1500],
      [41.0500, 29.0200],
      [40.8000, 28.2000],
      [40.2000, 26.4000],
      [39.5000, 25.4000],
      [37.0000, 26.5000],
      [34.5000, 28.0000],
      [32.5000, 31.5000],
      [31.2653, 32.3020], // Port Said (Suez North)
      [30.5852, 32.2654], // Ismailia
      [29.9700, 32.5600], // Suez Port (South exit)
      [28.0000, 33.5000], // Gulf of Suez
      [27.2000, 34.3000], // Strait of Gubal
      [25.0000, 36.2000], // Central Red Sea channel
      [23.0000, 38.0000], // Southward fairway
      [21.4858, 39.1925], // Jeddah
    ]
  },
  // Constanța -> Jebel Ali (Dubai)
  jebel_ali: {
    waypoints: [
      CONSTANTA_COORDS,
      [43.2000, 29.2000],
      [41.2500, 29.1500],
      [41.0500, 29.0200],
      [40.8000, 28.2000],
      [40.2000, 26.4000],
      [39.5000, 25.4000],
      [34.5000, 28.0000],
      [31.2653, 32.3020], // Suez
      [29.9700, 32.5600],
      [28.0000, 33.5000],
      [24.0000, 36.8000],
      [19.0000, 39.8000],
      [15.5000, 41.8000],
      [13.5000, 42.8000],
      [12.5833, 43.3333], // Bab-el-Mandeb
      [12.1000, 45.2000], // Gulf of Aden
      [13.2000, 49.5000],
      [15.0000, 53.5000], // Arabian Sea
      [18.5000, 57.5000],
      [21.0000, 59.8000],
      [22.7000, 60.1000], // Ras al Hadd
      [24.5000, 58.5000], // Gulf of Oman
      [26.2000, 56.8000],
      [26.5667, 56.2500], // Strait of Hormuz
      [25.8000, 55.6000],
      [24.9857, 55.0273], // Jebel Ali Port
    ]
  },
  // Constanța -> Dammam (King Abdulaziz Port)
  dammam: {
    waypoints: [
      CONSTANTA_COORDS,
      [43.2000, 29.2000],
      [41.2500, 29.1500],
      [41.0500, 29.0200],
      [40.8000, 28.2000],
      [40.2000, 26.4000],
      [39.5000, 25.4000],
      [34.5000, 28.0000],
      [31.2653, 32.3020],
      [29.9700, 32.5600],
      [28.0000, 33.5000],
      [24.0000, 36.8000],
      [19.0000, 39.8000],
      [15.5000, 41.8000],
      [13.5000, 42.8000],
      [12.5833, 43.3333], // Bab-el-Mandeb
      [12.1000, 45.2000],
      [13.2000, 49.5000],
      [15.0000, 53.5000],
      [18.5000, 57.5000],
      [21.0000, 59.8000],
      [22.7000, 60.1000],
      [24.5000, 58.5000],
      [26.5667, 56.2500], // Strait of Hormuz
      [26.6000, 54.0000], // Persian Gulf fairway
      [27.0000, 51.8000],
      [26.4344, 50.1033], // Dammam Port
    ]
  },
  // Overland Intermodal Rail: Gălănești Mill -> Rotterdam / Hamburg
  rotterdam: {
    isOverland: true,
    waypoints: [
      GALANESTI_COORDS,
      [47.6500, 23.5700],
      [47.0500, 21.9200],
      [47.5000, 19.0400], // Budapest Rail Hub
      [48.2000, 16.3700], // Vienna
      [49.4500, 11.0800], // Nuremberg
      [50.1100, 8.6800],  // Frankfurt
      [50.9300, 6.9600],  // Cologne
      [51.9244, 4.4777],  // Rotterdam
    ]
  }
};

export const ExportRouteVisualizer: React.FC<ExportRouteVisualizerProps> = ({
  currentLang,
  onSelectDestinationPort,
}) => {
  const [selectedPort, setSelectedPort] = useState<LogisticsPortDestination>(EXPORT_DESTINATIONS[0]);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [mapTheme, setMapTheme] = useState<MapTileTheme>('nautical_dark');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polylinesRef = useRef<L.Polyline[]>([]);
  const markersRef = useRef<L.Marker[]>([]);

  const t = translations[currentLang].logistics;

  // Filter ports based on selected region
  const filteredPorts = EXPORT_DESTINATIONS.filter((port) => {
    if (regionFilter === 'all') return true;
    if (regionFilter === 'gulf_red_sea') return port.region === 'gulf' || port.id === 'jeddah';
    if (regionFilter === 'mediterranean') return port.region === 'mediterranean' || port.id === 'beirut';
    if (regionFilter === 'europe') return port.region === 'europe';
    return true;
  });

  // Initialize and manage the Leaflet real-world map with 100% Free & Open Cartography
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if it exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default geographic bounds covering Western Europe to Arabian Sea
    const initialCenter: [number, number] = [36.0, 36.0];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: false,
      attributionControl: false,
    });

    mapInstanceRef.current = map;

    // 100% Free & Open Public Cartography (Esri Dark Canvas / World Ocean / Satellite / OSM - Zero API Key Required)
    const currentProvider = TILE_PROVIDERS[mapTheme];
    L.tileLayer(currentProvider.url, {
      subdomains: currentProvider.subdomains || ['server'],
      maxZoom: currentProvider.maxZoom,
      errorTileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    }).addTo(map);

    // Zoom control at bottom right for ergonomic mobile & desktop UX
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draw the constant Overland Feeder Corridor (Suceava Gălănești Mill -> Port Constanța)
    const overlandRoute = DETAILED_MARITIME_ROUTES.overland_feeder;
    const overlandPolyline = L.polyline(overlandRoute.waypoints, {
      color: '#F59E0B',
      weight: 3.5,
      dashArray: '6, 6',
      opacity: 0.9,
    }).addTo(map);
    polylinesRef.current.push(overlandPolyline);

    // Draw all maritime corridors
    EXPORT_DESTINATIONS.forEach((port) => {
      const routeData = DETAILED_MARITIME_ROUTES[port.id];
      if (!routeData) return;

      const isSelected = port.id === selectedPort.id;
      const strokeColor = isSelected ? '#F59E0B' : (mapTheme === 'satellite' ? '#38BDF8' : '#0284C7');
      const polyline = L.polyline(routeData.waypoints, {
        color: strokeColor,
        weight: isSelected ? 4.5 : 2.5,
        opacity: isSelected ? 1 : (mapTheme === 'satellite' ? 0.75 : 0.45),
        dashArray: isSelected ? '8, 8' : '4, 6',
      }).addTo(map);

      polyline.on('click', () => {
        setSelectedPort(port);
      });

      polylinesRef.current.push(polyline);
    });

    // 1. Production Hub Marker (Gălănești, Suceava)
    const galanestiIcon = L.divIcon({
      className: 'custom-hub-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute w-8 h-8 rounded-full bg-amber-500/30 radar-beacon"></div>
          <div class="w-6 h-6 rounded-md bg-amber-500 border-2 border-slate-900 flex items-center justify-center shadow-lg shadow-amber-950/80">
            <svg class="w-3.5 h-3.5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.8L19.2 8 12 11.2 4.8 8 12 4.8zM4 9.6l7 3.1v6.9l-7-3.5V9.6zm9 10v-6.9l7-3.1v6.5l-7 3.5z"/>
            </svg>
          </div>
          <div class="absolute left-7 bg-[#0B1324] border border-amber-500/60 px-2 py-0.5 rounded shadow text-[10px] font-mono font-bold text-amber-400 whitespace-nowrap hidden sm:block">
            GĂLĂNEȘTI MILL (HQ)
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const galanestiMarker = L.marker(GALANESTI_COORDS, { icon: galanestiIcon })
      .bindTooltip('<b>Holz Expert Industry HQ</b><br/>Gălănești Sawmill & Kiln Complex (100,000 m²)', {
        direction: 'top',
        className: 'leaflet-custom-tooltip'
      })
      .addTo(map);
    markersRef.current.push(galanestiMarker);

    // 2. Maritime Gateway Hub Marker (Port Constanța Sud - Agigea)
    const constantaIcon = L.divIcon({
      className: 'custom-port-marker',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer">
          <div class="absolute w-10 h-10 rounded-full bg-cyan-400/30 radar-beacon"></div>
          <div class="w-7 h-7 rounded-full bg-cyan-500 border-2 border-white flex items-center justify-center shadow-xl shadow-cyan-950">
            <svg class="w-4 h-4 text-slate-950" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="3"></circle>
              <line x1="12" y1="22" x2="12" y2="8"></line>
              <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
            </svg>
          </div>
          <div class="absolute left-8 bg-[#071328] border border-cyan-400/80 px-2.5 py-1 rounded shadow-lg text-[10px] font-mono font-black text-cyan-300 whitespace-nowrap hidden sm:block">
            PORT CONSTANȚA EXPORT TERMINAL
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const constantaMarker = L.marker(CONSTANTA_COORDS, { icon: constantaIcon })
      .bindTooltip('<b>Port Constanța Sud - Agigea</b><br/>Dedicated 40\' HC Stuffing & Deep-Sea Terminal', {
        direction: 'top',
        className: 'leaflet-custom-tooltip'
      })
      .addTo(map);
    markersRef.current.push(constantaMarker);

    // 3. Strategic Maritime Chokepoint Markers
    MARITIME_CHOKEPOINTS.forEach((cp) => {
      const chokepointIcon = L.divIcon({
        className: 'custom-chokepoint-marker',
        html: `
          <div class="w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-900 shadow cursor-pointer opacity-70 hover:opacity-100 hover:scale-125 transition-all"></div>
        `,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });

      const cpMarker = L.marker(cp.coords, { icon: chokepointIcon })
        .bindTooltip(`<b>${cp.name}</b><br/>${cp.label}`, { direction: 'top' })
        .addTo(map);
      markersRef.current.push(cpMarker);
    });

    // 4. Destination Port Markers
    EXPORT_DESTINATIONS.forEach((port) => {
      const geo = port.geoCoordinates;
      if (!geo) return;

      const isSelected = port.id === selectedPort.id;
      const portIcon = L.divIcon({
        className: 'custom-dest-marker',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${isSelected ? '<div class="absolute w-8 h-8 rounded-full bg-amber-500/40 radar-beacon"></div>' : ''}
            <div class="w-5 h-5 rounded-full ${isSelected ? 'bg-amber-500 border-2 border-white scale-125' : 'bg-slate-800 border border-slate-600 hover:border-amber-400'} flex items-center justify-center shadow-lg transition-all">
              <div class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-amber-400'}"></div>
            </div>
            <div class="absolute -top-7 ${isSelected ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-[#0B1324] text-slate-300 border-slate-700/80'} border px-2 py-0.5 rounded shadow text-[10px] font-mono font-bold whitespace-nowrap transition-all hidden md:block">
              ${port.name.split(' (')[0].replace('King Abdulaziz Port ', '').replace('Port of ', '')}
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      const portMarker = L.marker([geo.lat, geo.lng], { icon: portIcon })
        .bindTooltip(`<b>${port.name}</b><br/>${port.country} • Transit: ${port.transitDays}`, {
          direction: 'top'
        })
        .addTo(map);

      portMarker.on('click', () => {
        setSelectedPort(port);
      });

      markersRef.current.push(portMarker);
    });

    // Invalidate size to ensure proper tile rendering in responsive flex containers
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [selectedPort.id, mapTheme]);

  // Recenter or fly to destination port when user selects a port
  const handleSelectPort = (port: LogisticsPortDestination) => {
    setSelectedPort(port);
    if (mapInstanceRef.current && port.geoCoordinates) {
      mapInstanceRef.current.flyTo([port.geoCoordinates.lat, port.geoCoordinates.lng], 5.5, {
        duration: 1.2,
      });
    }
  };

  // Reset full map view
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([36.0, 36.0], 4, { duration: 1.0 });
    }
  };

  // Focus on Constanța Hub
  const handleFocusConstanta = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(CONSTANTA_COORDS, 6, { duration: 1.0 });
    }
  };

  return (
    <section id="logistics" className="py-20 bg-[#080D1A] relative border-b border-slate-800 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="section-heading mb-9">
          <span className="section-eyebrow">03 <span aria-hidden="true">/</span> {t.sectionBadge}</span>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        <div className="route-summary" aria-label="Export route">
          <div><span>01</span><strong>Gălănești</strong><small>Production</small></div>
          <ArrowRight aria-hidden="true" />
          <div><span>02</span><strong>Port Agigea</strong><small>Export terminal</small></div>
          <ArrowRight aria-hidden="true" />
          <div><span>03</span><strong>Destination port</strong><small>Choose below</small></div>
        </div>

        {/* Interactive Ocean Routes Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Interactive Vector Map & Flowchart Graphic */}
          {/* Left Column: Interactive Vector Map & Real Cartography */}
          <div className="lg:col-span-7 bg-[#0B1324] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative">

            {/* Header Bar */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Globe2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-200">Choose a destination</span>
              </div>
            </div>

            <div className="space-y-3">
                {/* Region Filter Selector */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setRegionFilter('all')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        regionFilter === 'all'
                          ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                      }`}
                    >
                      All Corridors ({EXPORT_DESTINATIONS.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegionFilter('gulf_red_sea')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        regionFilter === 'gulf_red_sea'
                          ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                      }`}
                    >
                      Gulf & Red Sea (3)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegionFilter('mediterranean')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        regionFilter === 'mediterranean'
                          ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                      }`}
                    >
                      Mediterranean (3)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegionFilter('europe')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        regionFilter === 'europe'
                          ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                      }`}
                    >
                      Western Europe (1)
                    </button>
                  </div>

                  {/* Fast Map Controls */}
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse shrink-0">
                    <button
                      type="button"
                      onClick={handleResetView}
                      title="Reset Overview"
                      className="px-2 py-1 rounded bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-amber-400 hover:border-amber-500/40 text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span className="hidden sm:inline">Overview</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleFocusConstanta}
                      title="Focus Port Constanța Hub"
                      className="px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 text-[11px] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Anchor className="w-3 h-3 text-cyan-400" />
                      <span className="hidden sm:inline">Hub Berth 128</span>
                    </button>
                  </div>
                </div>

                <details className="map-layer-settings">
                  <summary>Map appearance</summary>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-slate-400 text-[11px] font-bold shrink-0">Style:</span>
                    {(Object.keys(TILE_PROVIDERS) as MapTileTheme[]).map((themeKey) => {
                      const isCurrent = mapTheme === themeKey;
                      return (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={() => setMapTheme(themeKey)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap border ${
                            isCurrent
                              ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow'
                              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/60'
                          }`}
                        >
                          {TILE_PROVIDERS[themeKey].label}
                        </button>
                      );
                    })}
                  </div>

                  </div>
                </details>

                {/* Leaflet Real Geographical Map Container */}
                <div className="w-full bg-[#050A14] border border-slate-800 rounded-xl relative overflow-hidden select-none shadow-inner">
                  <div
                    ref={mapContainerRef}
                    className="w-full h-[400px] sm:h-[480px] lg:h-[540px] z-10"
                    style={{ minHeight: '400px' }}
                  />

                  {/* Floating Map Legend Overlay */}
                  <div className="absolute top-3 left-3 z-[400] bg-[#070D1A]/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono text-slate-300 hidden sm:block max-w-xs shadow-xl pointer-events-none">
                    <div className="flex items-center space-x-1.5 mb-1.5 font-bold text-white text-[11px]">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>ROUTE KEY</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-0.5 bg-amber-400"></div>
                        <span>Selected sea route</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-0.5 bg-amber-500 border-dashed"></div>
                        <span>Gălănești → Constanța Feeder Line</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <span>Port Constanța Sud (Agigea Berth 128)</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Destination Port Selector Horizontal Ribbon */}
                <div className="pt-2">
                  <div className="text-[11px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                    <span>Destination ports</span>
                    <span className="text-amber-400 font-bold">{filteredPorts.length} options</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {filteredPorts.map((port) => {
                      const isSelected = port.id === selectedPort.id;
                      return (
                        <button
                          key={port.id}
                          type="button"
                          onClick={() => handleSelectPort(port)}
                          className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center space-x-1.5 cursor-pointer border ${
                            isSelected
                              ? 'bg-amber-600 text-white font-bold border-amber-400 shadow-md shadow-amber-950/50 scale-102'
                              : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/60'
                          }`}
                        >
                          <Ship className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
                          <span>{port.name.split(' (')[0].replace('King Abdulaziz Port ', '').replace('Port of ', '')}</span>
                          <span className={`text-[10px] px-1 rounded ${isSelected ? 'bg-amber-700/80 text-amber-100' : 'bg-slate-800 text-slate-400'}`}>
                            {port.transitDays.split(' ')[0]}d
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
          </div>

          {/* Right Column: destination details */}
          <div className="lg:col-span-5 bg-[#0B1324] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            <div className="destination-inspector-header flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Navigation className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-200">Port information</span>
              </div>
            </div>

            {/* Destination Name & Country */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold block">
                  {selectedPort.country}
                </span>
                {selectedPort.nauticalMiles && (
                  <span className="text-[11px] font-mono text-slate-400">
                    ~{selectedPort.nauticalMiles.toLocaleString()} Nautical Miles
                  </span>
                )}
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                {selectedPort.name}
              </h3>
            </div>

            {/* Key Transit Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5 font-mono">
              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Estimated Vessel Transit</span>
                <span className="text-base sm:text-lg font-black text-amber-400 flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-amber-500 shrink-0 mr-1" />
                  <span>{selectedPort.transitDays}</span>
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Constanța Sud → Discharge Port</span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase block mb-1">Maritime Frequency</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-300 block truncate">
                  {selectedPort.containerFrequency.split(' via')[0]}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Berth 128 Agigea scheduled</span>
              </div>
            </div>

            <details className="destination-shipping-details">
              <summary>Shipping terms and compliance</summary>
              <div className="destination-shipping-details__body">
                <div>
                  <span className="destination-detail-label">Incoterms</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPort.primaryIncoterms.map((incoterm) => (
                      <span key={incoterm} className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300">
                        {incoterm}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="destination-detail-label">Shipping lines</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPort.shippingLines.map((line) => (
                      <span key={line} className="px-2 py-0.5 rounded text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300">
                        {line}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="destination-compliance">
                  <span className="destination-detail-label"><CheckCircle2 aria-hidden="true" /> Customs and compliance</span>
                  <p>{selectedPort.customsNote}</p>
                </div>
              </div>
            </details>

            {/* Action Buttons: Apply to RFQ */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onSelectDestinationPort(selectedPort.name)}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/50 cursor-pointer active:scale-98 transition-all"
              >
                <span>Use {selectedPort.name.split(' (')[0]} in quote request</span>
                <ArrowRight className="w-4 h-4 ml-1 rtl:rotate-180" />
              </button>

              <p className="text-[11px] font-mono text-center text-slate-500">
                Select a port to add it to your quote request
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
