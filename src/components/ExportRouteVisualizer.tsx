import React, { useState } from 'react';
import { 
  Anchor, 
  Ship, 
  ArrowRight, 
  Globe2,
  ShieldAlert
} from 'lucide-react';
import type { Language, LogisticsPortDestination } from '../types';
import { EXPORT_DESTINATIONS, CORRIDOR_STEPS } from '../data/routesData';
import { translations } from '../translations';

interface ExportRouteVisualizerProps {
  currentLang: Language;
  onSelectDestinationPort: (portName: string) => void;
}

export const ExportRouteVisualizer: React.FC<ExportRouteVisualizerProps> = ({
  currentLang,
  onSelectDestinationPort,
}) => {
  const [selectedPort, setSelectedPort] = useState<LogisticsPortDestination>(EXPORT_DESTINATIONS[0]);
  const t = translations[currentLang].logistics;

  return (
    <section id="logistics" className="py-20 bg-[#070A11] relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-sky-950/40 border border-sky-500/40 rounded-full px-3.5 py-1 mb-4">
            <Anchor className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-sky-400 font-mono text-[11px] font-bold tracking-wider uppercase">
              {t.sectionBadge}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4">
            {t.title}
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 4 Logistics Nodes Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {CORRIDOR_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-5 relative overflow-hidden group transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-orange-400 bg-orange-950/50 border border-orange-500/30 px-2 py-0.5 rounded">
                  NODE {step.step}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {step.coords}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5 leading-snug">
                {step.nodeName}
              </h3>
              <p className="text-[11px] font-mono text-slate-400 mb-3 leading-relaxed">
                {step.details}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-slate-500">Throughput:</span>
                <span className="text-emerald-400 font-medium">{step.capacity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Ocean Routes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive Vector Map & Route Simulation */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Globe2 className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  Transoceanic Shipping Corridors & Port Matrix
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                Hub: Port Constanța Sud (Agigea)
              </span>
            </div>

            {/* SVG Interactive Route Map Graphic */}
            <div className="w-full bg-[#040711] border border-slate-800/90 rounded-xl p-4 relative min-h-[360px] flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 1000 600"
                className="w-full h-auto max-h-[380px] select-none"
                style={{ filter: 'drop-shadow(0 0 20px rgba(15,23,42,0.8))' }}
              >
                <defs>
                  {/* Glowing Route Linear Gradients */}
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
                  </linearGradient>

                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Continental Outlines (Stylized Vector Landmass) */}
                <path
                  d="M 120 180 Q 220 100 350 140 T 480 180 T 600 140 Q 720 150 820 120 T 920 170 L 930 280 Q 820 310 740 370 T 680 500 T 520 480 T 400 360 T 260 380 T 140 320 Z"
                  fill="#0B132B"
                  stroke="#1E293B"
                  strokeWidth="1.5"
                  opacity="0.4"
                />

                {/* Black Sea & Mediterranean Outline accents */}
                <path
                  d="M 470 230 Q 510 215 545 228 T 575 255 T 510 270 Z"
                  fill="#082F49"
                  stroke="#0284C7"
                  strokeWidth="1"
                  opacity="0.3"
                />

                {/* Origin 1: Suceava Sawmill Platform */}
                <circle cx="510" cy="200" r="5" fill="#EF4444" filter="url(#glow)" />
                <text x="518" y="198" fill="#FCA5A5" fontSize="11" fontFamily="monospace" fontWeight="bold">
                  GĂLĂNEȘTI MILL
                </text>

                {/* Overland Route: Suceava -> Constanta */}
                <line
                  x1="510"
                  y1="200"
                  x2="538"
                  y2="242"
                  stroke="#F97316"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />

                {/* Hub Node: Port Constanța Sud - Agigea */}
                <circle cx="538" cy="242" r="8" fill="#F97316" filter="url(#glow)" />
                <circle cx="538" cy="242" r="14" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.6">
                  <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="552" y="246" fill="#FDBA74" fontSize="12" fontFamily="monospace" fontWeight="bold">
                  PORT CONSTANȚA TERMINAL
                </text>

                {/* Maritime Corridors departing Constanta through Bosphorus */}
                {/* 1. Constanta -> Jeddah & Red Sea */}
                <path
                  d="M 538 242 Q 530 290 545 350 T 630 450"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                >
                  <animate attributeName="stroke-dashoffset" values="40;0" dur="3s" repeatCount="indefinite" />
                </path>

                {/* 2. Constanta -> Jebel Ali & Gulf */}
                <path
                  d="M 538 242 Q 550 310 630 380 T 750 420"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                >
                  <animate attributeName="stroke-dashoffset" values="40;0" dur="3.5s" repeatCount="indefinite" />
                </path>

                {/* 3. Constanta -> Alexandria */}
                <path
                  d="M 538 242 Q 510 300 480 370"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />

                {/* 4. Constanta -> Piraeus */}
                <path
                  d="M 538 242 Q 490 270 450 310"
                  fill="none"
                  stroke="url(#routeGradient)"
                  strokeWidth="2"
                  strokeDasharray="5 3"
                />

                {/* Destination Node Pins */}
                {/* Jeddah */}
                <g
                  onClick={() => setSelectedPort(EXPORT_DESTINATIONS.find((p) => p.id === 'jeddah')!)}
                  className="cursor-pointer group"
                >
                  <circle cx="630" cy="450" r="7" fill={selectedPort.id === 'jeddah' ? '#F97316' : '#38BDF8'} />
                  <text x="642" y="454" fill="#E2E8F0" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                    Jeddah (16-20d)
                  </text>
                </g>

                {/* Jebel Ali */}
                <g
                  onClick={() => setSelectedPort(EXPORT_DESTINATIONS.find((p) => p.id === 'jebel_ali')!)}
                  className="cursor-pointer group"
                >
                  <circle cx="750" cy="420" r="7" fill={selectedPort.id === 'jebel_ali' ? '#F97316' : '#38BDF8'} />
                  <text x="762" y="424" fill="#E2E8F0" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                    Jebel Ali / Dubai (22-26d)
                  </text>
                </g>

                {/* Dammam */}
                <g
                  onClick={() => setSelectedPort(EXPORT_DESTINATIONS.find((p) => p.id === 'dammam')!)}
                  className="cursor-pointer group"
                >
                  <circle cx="720" cy="385" r="6" fill={selectedPort.id === 'dammam' ? '#F97316' : '#38BDF8'} />
                  <text x="732" y="388" fill="#CBD5E1" fontSize="9" fontFamily="sans-serif">
                    Dammam (24-28d)
                  </text>
                </g>

                {/* Alexandria */}
                <g
                  onClick={() => setSelectedPort(EXPORT_DESTINATIONS.find((p) => p.id === 'alexandria')!)}
                  className="cursor-pointer group"
                >
                  <circle cx="480" cy="370" r="6" fill={selectedPort.id === 'alexandria' ? '#F97316' : '#38BDF8'} />
                  <text x="410" y="374" fill="#CBD5E1" fontSize="9" fontFamily="sans-serif">
                    Alexandria (6-9d)
                  </text>
                </g>

                {/* Piraeus */}
                <g
                  onClick={() => setSelectedPort(EXPORT_DESTINATIONS.find((p) => p.id === 'piraeus')!)}
                  className="cursor-pointer group"
                >
                  <circle cx="450" cy="310" r="6" fill={selectedPort.id === 'piraeus' ? '#F97316' : '#38BDF8'} />
                  <text x="380" y="314" fill="#CBD5E1" fontSize="9" fontFamily="sans-serif">
                    Piraeus (3-5d)
                  </text>
                </g>

                {/* Rotterdam/Hamburg */}
                <g
                  onClick={() => setSelectedPort(EXPORT_DESTINATIONS.find((p) => p.id === 'rotterdam')!)}
                  className="cursor-pointer group"
                >
                  <circle cx="340" cy="180" r="6" fill={selectedPort.id === 'rotterdam' ? '#F97316' : '#38BDF8'} />
                  <text x="240" y="184" fill="#CBD5E1" fontSize="9" fontFamily="sans-serif">
                    Rotterdam / Hamburg
                  </text>
                </g>
              </svg>

              <div className="absolute bottom-3 left-4 text-[10px] font-mono text-slate-500">
                Interactive Map • Click any port node to inspect logistics parameters
              </div>
            </div>

            {/* Quick Port Selection Pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {EXPORT_DESTINATIONS.map((port) => (
                <button
                  key={port.id}
                  onClick={() => setSelectedPort(port)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                    selectedPort.id === port.id
                      ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-950/50'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {port.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Selected Port Logistics Sheet */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-orange-400 uppercase tracking-wider block font-bold">
                  PORT LOGISTICS INSPECTOR
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {selectedPort.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedPort.country}
                </span>
              </div>
              <div className="bg-sky-950/60 border border-sky-500/40 rounded-xl px-3 py-2 text-right">
                <span className="text-[10px] uppercase font-mono text-sky-400 block font-bold">
                  TRANSIT TIME
                </span>
                <span className="text-lg font-black font-mono text-white block">
                  {selectedPort.transitDays}
                </span>
              </div>
            </div>

            {/* Supported Incoterms */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                {t.incotermsOffered}
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedPort.primaryIncoterms.map((incoterm) => (
                  <span
                    key={incoterm}
                    className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded-md font-bold"
                  >
                    {incoterm}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct Shipping Lines */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                Contracted Liner Services:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {selectedPort.shippingLines.map((line) => (
                  <div
                    key={line}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs font-mono text-slate-300 flex items-center space-x-2 rtl:space-x-reverse"
                  >
                    <Ship className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                    <span className="truncate">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Departure Frequency */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1 font-bold">
                {t.frequency}
              </span>
              <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-950 border border-slate-800 rounded-lg p-2.5">
                {selectedPort.containerFrequency}
              </p>
            </div>

            {/* Customs & Phyto Protocol Note */}
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 flex items-start space-x-3 rtl:space-x-reverse">
              <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-300 block mb-0.5">
                  Port Compliance & Phyto Protocol:
                </span>
                <p className="text-[11px] text-slate-300 font-mono leading-relaxed">
                  {selectedPort.customsNote}
                </p>
              </div>
            </div>

            {/* Direct Booking to Port CTA */}
            <button
              onClick={() => onSelectDestinationPort(selectedPort.name)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/50 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all"
            >
              <span>Request Container Quote to {selectedPort.name}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
