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

  // Aggregate totals
  const totalVolumeInBoard = useMemo(() => {
    return INITIAL_VIRTUAL_YARD_BATCHES.reduce((sum, b) => sum + b.volumeM3, 0).toFixed(1);
  }, []);

  const totalContainersReady = useMemo(() => {
    const readyBatches = INITIAL_VIRTUAL_YARD_BATCHES.filter((b) => b.location === 'port_constanta');
    const vol = readyBatches.reduce((sum, b) => sum + b.volumeM3, 0);
    return Math.floor(vol / 50);
  }, []);

  return (
    <section id="virtual-yard" className="py-20 bg-[#090D16] relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-emerald-950/40 border border-emerald-500/40 rounded-full px-3.5 py-1 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-mono text-[11px] font-bold tracking-wider uppercase">
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

        {/* Real-time Ticker Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Active Parcels</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5 block">
              {INITIAL_VIRTUAL_YARD_BATCHES.length} <span className="text-xs text-orange-400">Lots</span>
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Available Physical Volume</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5 block">
              {totalVolumeInBoard} <span className="text-xs text-orange-400">m³</span>
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Port Constanța Staged</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-0.5 block">
              {totalContainersReady} <span className="text-xs text-slate-400">Containers 40' HC</span>
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
            <span className="text-[10px] font-mono uppercase text-slate-400 block">Average Moisture Level</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-amber-400 mt-0.5 block">
              17.8% <span className="text-xs text-slate-400">(KD Export Grade)</span>
            </span>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 backdrop-blur-md mb-6 shadow-xl">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activeFilter === 'all'
                    ? 'bg-orange-600 text-white font-bold shadow-md shadow-orange-950/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {t.filterAll}
              </button>

              <button
                onClick={() => setActiveFilter('drying_kilns_galanesti')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
                  activeFilter === 'drying_kilns_galanesti'
                    ? 'bg-amber-600 text-white font-bold shadow-md shadow-amber-950/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.filterKd}</span>
              </button>

              <button
                onClick={() => setActiveFilter('port_constanta')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
                  activeFilter === 'port_constanta'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-950/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <Anchor className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.filterPort}</span>
              </button>

              <button
                onClick={() => setActiveFilter('afloat_transit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1.5 rtl:space-x-reverse transition-all ${
                  activeFilter === 'afloat_transit'
                    ? 'bg-sky-600 text-white font-bold shadow-md shadow-sky-950/50'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
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
                placeholder="Search lot, 48x150, grade, location..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 rtl:pr-9 rtl:pl-4 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Batch Board Table (Desktop) */}
        <div className="hidden lg:block bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-[#050811] text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">{t.colLot}</th>
                  <th className="py-3.5 px-4">{t.colSpec}</th>
                  <th className="py-3.5 px-4">{t.colGrade}</th>
                  <th className="py-3.5 px-4">{t.colMoisture}</th>
                  <th className="py-3.5 px-4">{t.colVolume}</th>
                  <th className="py-3.5 px-4">{t.colLocation}</th>
                  <th className="py-3.5 px-4">{t.colEtd}</th>
                  <th className="py-3.5 px-4">{t.colStatus}</th>
                  <th className="py-3.5 px-4 text-right rtl:text-left">{t.colAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {filteredBatches.map((batch) => {
                  const isAvailable = batch.status === 'available';
                  const isLimited = batch.status === 'limited';

                  return (
                    <tr
                      key={batch.id}
                      className="hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* Lot ID */}
                      <td className="py-4 px-4 font-bold text-white whitespace-nowrap">
                        <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-orange-400">
                          {batch.batchCode}
                        </span>
                      </td>

                      {/* Dimensions */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-100">
                          {batch.thickness} × {batch.width} mm
                        </span>
                        <span className="text-slate-400 text-[11px] block">
                          Length: {batch.length.toFixed(1)}m
                        </span>
                      </td>

                      {/* Grade */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="bg-slate-800/90 text-slate-200 px-2 py-0.5 rounded text-[11px]">
                          {batch.grade.replace('EN1611_', '')}
                        </span>
                      </td>

                      {/* Moisture */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-amber-400 font-medium">KD 18%</span>
                      </td>

                      {/* Volume & Bundles */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-bold text-white text-sm">
                          {batch.volumeM3} m³
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {batch.bundlesCount} packs • {batch.piecesCount} pcs
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="text-slate-200 truncate font-sans text-xs">
                          {batch.locationName}
                        </div>
                        <div className="text-[10px] text-emerald-400 flex items-center space-x-1 rtl:space-x-reverse mt-0.5">
                          <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                          <span>{batch.fscClaim}</span>
                        </div>
                      </td>

                      {/* ETD */}
                      <td className="py-4 px-4 whitespace-nowrap text-slate-300">
                        {batch.etd}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isAvailable && (
                          <span className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            {t.statusAvailable}
                          </span>
                        )}
                        {isLimited && (
                          <span className="bg-amber-950/60 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            {t.statusLimited}
                          </span>
                        )}
                        {batch.status === 'reserved' && (
                          <span className="bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">
                            {t.statusReserved}
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right rtl:text-left whitespace-nowrap">
                        <button
                          disabled={batch.status === 'reserved'}
                          onClick={() => onReserveBatch(batch)}
                          className={`inline-flex items-center space-x-1 rtl:space-x-reverse px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            batch.status === 'reserved'
                              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                              : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-950/40'
                          }`}
                        >
                          <span>{t.reserveBtn}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-90" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile / Tablet Cards View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {filteredBatches.map((batch) => {
            const isAvailable = batch.status === 'available';
            const isLimited = batch.status === 'limited';

            return (
              <div
                key={batch.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800 text-orange-400 font-bold">
                    {batch.batchCode}
                  </span>
                  <div>
                    {isAvailable && (
                      <span className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t.statusAvailable}
                      </span>
                    )}
                    {isLimited && (
                      <span className="bg-amber-950/60 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t.statusLimited}
                      </span>
                    )}
                    {batch.status === 'reserved' && (
                      <span className="bg-slate-800 border border-slate-700 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t.statusReserved}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-800/80 pb-2">
                  <div>
                    <div className="text-white font-bold text-sm">
                      {batch.thickness} × {batch.width} mm • {batch.length}m
                    </div>
                    <div className="text-slate-400 text-[11px] font-sans">
                      Grade: {batch.grade.replace('EN1611_', '')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-bold text-base">
                      {batch.volumeM3} m³
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {batch.bundlesCount} packs
                    </div>
                  </div>
                </div>

                <div className="text-slate-300 font-sans text-xs">
                  <span className="text-slate-500 block text-[10px] font-mono">Location:</span>
                  {batch.locationName}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-400">ETD: {batch.etd}</span>
                  <button
                    disabled={batch.status === 'reserved'}
                    onClick={() => onReserveBatch(batch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      batch.status === 'reserved'
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-500 text-white'
                    }`}
                  >
                    {t.reserveBtn}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
