import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Anchor, 
  Flame, 
  Ship, 
  ArrowUpRight
} from 'lucide-react';
import type { Language, VirtualYardBatch } from '../types';
import { INITIAL_VIRTUAL_YARD_BATCHES } from '../data/virtualYardData';
import { translations } from '../translations';

interface VirtualYardBoardProps {
  currentLang: Language;
  onReserveBatch: (batch: VirtualYardBatch) => void;
}

export const VirtualYardBoard: React.FC<VirtualYardBoardProps> = ({
  currentLang,
  onReserveBatch,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'drying_kilns_galanesti' | 'port_constanta' | 'afloat_transit'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[currentLang].yard;

  const filteredBatches = useMemo(() => {
    return INITIAL_VIRTUAL_YARD_BATCHES.filter((b) => {
      const matchesFilter = activeFilter === 'all' || b.location === activeFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        b.batchCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${b.thickness}x${b.width}`.includes(searchQuery.toLowerCase()) ||
        b.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.locationName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <section id="virtual-yard" className="yard-section py-20 relative border-b scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="section-heading section-heading--split mb-9">
          <div>
            <span className="section-eyebrow">05 <span aria-hidden="true">/</span> {t.sectionBadge}</span>
            <h2>{t.title}</h2>
          </div>
          <p>{t.subtitle}</p>
        </header>

        <p className="yard-disclaimer">{t.disclaimer}</p>

        {/* Filter Controls & Search */}
        <div className="bg-[#0B1324] border border-slate-800 rounded-xl p-4 mb-6 shadow-md">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t.filterAll}
              </button>

              <button
                onClick={() => setActiveFilter('drying_kilns_galanesti')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer ${
                  activeFilter === 'drying_kilns_galanesti'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.filterKd}</span>
              </button>

              <button
                onClick={() => setActiveFilter('port_constanta')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer ${
                  activeFilter === 'port_constanta'
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Anchor className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.filterPort}</span>
              </button>

              <button
                onClick={() => setActiveFilter('afloat_transit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer ${
                  activeFilter === 'afloat_transit'
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Ship className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.filterTransit}</span>
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specs or location…"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 rtl:pr-9 rtl:pl-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        <div className="yard-card-grid">
          {filteredBatches.map((batch) => {
            const statusLabel = batch.status === 'available'
              ? t.statusAvailable
              : batch.status === 'limited'
                ? t.statusLimited
                : t.statusReserved;

            return (
              <article key={batch.id} className="yard-lot-card">
                <header className="yard-lot-card__header">
                  <span className="yard-lot-card__code">{batch.batchCode}</span>
                  <span className={`yard-lot-card__status yard-lot-card__status--${batch.status}`}>{statusLabel}</span>
                </header>

                <div className="yard-lot-card__spec">
                  <div>
                    <strong>{batch.thickness} × {batch.width} mm</strong>
                    <small>{batch.length.toFixed(1)} m · {batch.grade.replace('EN1611_', '')} · KD 18%</small>
                  </div>
                  <div className="yard-lot-card__volume">
                    <strong>{batch.volumeM3} <span>m³</span></strong>
                    <small>{batch.bundlesCount} packs</small>
                  </div>
                </div>

                <div className="yard-lot-card__location">
                  <span>Shipping stage</span>
                  <strong>{batch.locationName}</strong>
                  <small><CheckCircle2 aria-hidden="true" /> {batch.fscClaim}</small>
                </div>

                <div className="yard-lot-card__footer">
                  <div><span>Estimated dispatch</span><strong>{batch.etd}</strong></div>
                  <button
                    type="button"
                    disabled={batch.status === 'reserved'}
                    onClick={() => onReserveBatch(batch)}
                  >
                    {t.reserveBtn}<ArrowUpRight aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
          {filteredBatches.length === 0 && (
            <p className="yard-empty-state">No example batches match this search. Try another size or location.</p>
          )}
        </div>      </div>
    </section>
  );
};
