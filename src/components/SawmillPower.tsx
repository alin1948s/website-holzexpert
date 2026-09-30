import React, { useState } from 'react';
import { 
  Factory, 
  Cpu, 
  TreePine, 
  Boxes 
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../translations';
import { OFFICIAL_IMAGES } from '../data/timberData';

interface SawmillPowerProps {
  currentLang: Language;
}

export const SawmillPower: React.FC<SawmillPowerProps> = ({ currentLang }) => {
  const t = translations[currentLang].infrastructure;
  const [activeImage, setActiveImage] = useState<string>(OFFICIAL_IMAGES.sawingLine);

  const galleryItems = [
    {
      url: OFFICIAL_IMAGES.sawingLine,
      title: 'Automated Primary Breakdown',
      category: 'Linck & Primultini Bandsaw Lines',
    },
    {
      url: OFFICIAL_IMAGES.logYard,
      title: 'Heavy Log Staging Yard',
      category: '100,000 m² Industrial Platform',
    },
    {
      url: OFFICIAL_IMAGES.exportBundles,
      title: 'Export Packaging Station',
      category: 'Anti-UV Capped & PET Strapped',
    },
    {
      url: OFFICIAL_IMAGES.sortedPiles,
      title: 'Graded Lumber Inventory',
      category: 'EN 1611-1 Optical & Manual Sorting',
    },
    {
      url: OFFICIAL_IMAGES.heroLogs,
      title: 'FSC Certified Carpathian Roundwood',
      category: '100% Chain-of-Custody Sourcing',
    },
    {
      url: OFFICIAL_IMAGES.logisticsBase,
      title: 'Direct Dispatch Terminal Yard',
      category: 'Overland & Container Staging',
    },
  ];

  return (
    <section id="sawmill" className="py-20 bg-[#090D16] relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-orange-950/40 border border-orange-500/40 rounded-full px-3.5 py-1 mb-4">
            <Factory className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-orange-400 font-mono text-[11px] font-bold tracking-wider uppercase">
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

        {/* Industrial Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{t.feature1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">{t.feature1Desc}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <Factory className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{t.feature2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">{t.feature2Desc}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-4">
              <Boxes className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{t.feature3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">{t.feature3Desc}</p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <TreePine className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{t.feature4Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">{t.feature4Desc}</p>
          </div>
        </div>

        {/* Dynamic Facility Gallery */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Featured Large View */}
            <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video group">
              <img
                src={activeImage}
                alt="Holz Expert Facility"
                className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold block mb-1">
                    GĂLĂNEȘTI MILL COMPLEX • SUCEAVA
                  </span>
                  <h4 className="text-lg font-black text-white">
                    Heavy Industrial Production Base
                  </h4>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1 text-xs font-mono text-slate-300">
                  100,000 m² Facility
                </div>
              </div>
            </div>

            {/* Thumbnail Selection Strip */}
            <div className="lg:col-span-4 space-y-3">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold mb-2">
                Operational Camera Views:
              </h4>
              <div className="space-y-2">
                {galleryItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(item.url)}
                    className={`w-full flex items-center space-x-3 rtl:space-x-reverse p-2.5 rounded-xl border text-left rtl:text-right transition-all ${
                      activeImage === item.url
                        ? 'bg-orange-950/40 border-orange-500 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-14 h-11 object-cover rounded-lg border border-slate-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block truncate">
                        {item.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
