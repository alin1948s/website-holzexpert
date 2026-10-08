import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  Droplet,
  Maximize,
  Download,
  ArrowRight,
  Layers,
  Grid3X3
} from 'lucide-react';
import type { Language, TimberGrade } from '../types';
import { TIMBER_GRADES, THICKNESS_OPTIONS, WIDTH_OPTIONS, LENGTH_OPTIONS } from '../data/timberData';
import { translations } from '../translations';

interface TimberCatalogProps {
  currentLang: Language;
  onSelectSpecForRfq: (spec: { thickness: number; width: number; length: number; grade: TimberGrade }) => void;
  onOpenPdfDataSheet: () => void;
}

export const TimberCatalog: React.FC<TimberCatalogProps> = ({
  currentLang,
  onSelectSpecForRfq,
  onOpenPdfDataSheet,
}) => {
  const [catalogTab, setCatalogTab] = useState<'grades' | 'matrix' | 'treatments'>('grades');
  const [selectedGradeId, setSelectedGradeId] = useState<TimberGrade>('EN1611_CLASS_AB');
  const [isImperial, setIsImperial] = useState<boolean>(false);
  const [activeTreatment, setActiveTreatment] = useState<'kd' | 'ht' | 'antiblue'>('kd');
  const [zoomTexture, setZoomTexture] = useState<boolean>(false);
  const [imageMode, setImageMode] = useState<'texture' | 'real_stock'>('texture');

  const t = translations[currentLang].catalog;
  const currentGrade = TIMBER_GRADES.find((g) => g.id === selectedGradeId) || TIMBER_GRADES[1];
  const displayedImage = imageMode === 'real_stock' && currentGrade.realProductImage ? currentGrade.realProductImage : currentGrade.textureImage;

  return (
    <section id="specs" className="py-20 bg-[#070D18] relative border-b border-slate-800 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="section-heading section-heading--catalog mb-10">
          <span className="section-eyebrow">02 <span aria-hidden="true">/</span> {t.sectionBadge}</span>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>

          {/* Master Sub-Navigation Tabs */}
          <div className="catalog-tabs flex items-center gap-1 sm:gap-2 mt-8 p-1.5 bg-[#0B1324] border border-slate-800 rounded-xl inline-flex">
            <button
              aria-label="Grading standards EN 1611-1"
              onClick={() => setCatalogTab('grades')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse cursor-pointer ${
                catalogTab === 'grades'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grading Standards (EN 1611-1)</span>
              <span className="sm:hidden">Grades</span>
            </button>

            <button
              aria-label="Dimension matrix"
              onClick={() => setCatalogTab('matrix')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse cursor-pointer ${
                catalogTab === 'matrix'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Dimension Matrix</span>
              <span className="sm:hidden">Sizes</span>
            </button>

            <button
              aria-label="Export treatments"
              onClick={() => setCatalogTab('treatments')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 rtl:space-x-reverse cursor-pointer ${
                catalogTab === 'treatments'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Treatments</span>
              <span className="sm:hidden">Treatment</span>
            </button>
          </div>
        </div>

        {/* TAB 1: GRADING STANDARDS */}
        {catalogTab === 'grades' && (
          <div className="space-y-8">
            {/* Grade Selection Bar */}
            <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap gap-2 pb-1">
              {TIMBER_GRADES.map((grade) => (
                <button
                  key={grade.id}
                  onClick={() => {
                    setSelectedGradeId(grade.id);
                    setZoomTexture(false);
                  }}
                  className={`shrink-0 px-4 py-2.5 rounded-lg border text-xs sm:text-sm font-bold font-mono transition-all flex items-center space-x-2 rtl:space-x-reverse cursor-pointer ${
                    selectedGradeId === grade.id
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-[#0B1324] text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span>{grade.code}</span>
                  <span className="text-xs opacity-90 hidden sm:inline">• {grade.title.split('(')[0]}</span>
                </button>
              ))}
            </div>

            {/* Active Grade Detailed Showcase */}
            <div className="bg-[#0B1324] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Wood Texture / Real Stock with Zoom */}
                <div className="lg:col-span-5 relative group space-y-3">
                  {/* Image Mode Switcher */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 uppercase text-[10px] font-bold">Visual Inspection:</span>
                    <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => setImageMode('texture')}
                        className={`px-3 py-1 rounded text-xs transition-all cursor-pointer ${
                          imageMode === 'texture' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Grain Texture
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('real_stock')}
                        className={`px-3 py-1 rounded text-xs transition-all cursor-pointer ${
                          imageMode === 'real_stock' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Factory Bundles
                      </button>
                    </div>
                  </div>

                  <div
                    className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 cursor-pointer aspect-video sm:aspect-square flex items-center justify-center"
                    onClick={() => setZoomTexture(!zoomTexture)}
                  >
                    <img
                      src={displayedImage}
                      alt={currentGrade.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        zoomTexture ? 'scale-150 filter brightness-110' : 'group-hover:scale-105'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-amber-400 font-bold">
                      {imageMode === 'real_stock' ? 'Holz Expert Mill Stock (Gălănești)' : currentGrade.marketName}
                    </div>

                    <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700 rounded px-2.5 py-1 text-xs font-mono text-slate-300 flex items-center space-x-1 rtl:space-x-reverse">
                      <Maximize className="w-3.5 h-3.5 text-amber-500" />
                      <span>{zoomTexture ? 'Reset Zoom' : 'Click to Zoom Grain'}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Technical Specs & Rules */}
                <div className="lg:col-span-7 space-y-5">
                  <div>
                    <span className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold block mb-1">
                      OFFICIAL EN 1611-1 GRADING CRITERIA
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      {currentGrade.title}
                    </h3>
                    <p className="text-sm text-slate-300 font-mono mt-1">
                      {currentGrade.subtitle}
                    </p>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed">
                    {currentGrade.description}
                  </p>

                  <details className="grade-notes">
                    <summary>View grading tolerances</summary>
                    <div className="grade-notes__grid">
                      <div><strong>Knot & defect tolerance</strong><p>{currentGrade.allowedKnots}</p></div>
                      <div><strong>Surface & geometry</strong><p>{currentGrade.surfaceFinish}</p></div>
                    </div>
                  </details>

                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                      Recommended Industrial Applications:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentGrade.primaryUses.map((use) => (
                        <span
                          key={use}
                          className="bg-slate-900 text-slate-300 border border-slate-800 text-xs px-3 py-1 rounded-md"
                        >
                          {use}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() =>
                        onSelectSpecForRfq({
                          thickness: 48,
                          width: 150,
                          length: 4.0,
                          grade: currentGrade.id,
                        })
                      }
                      className="px-5 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer"
                    >
                      <span>Select {currentGrade.code} in RFQ</span>
                      <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>

                    <button
                      onClick={onOpenPdfDataSheet}
                      className="px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-500" />
                      <span>{t.downloadTechSheet}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DIMENSION MATRIX */}
        {catalogTab === 'matrix' && (
          <div className="bg-[#0B1324] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">
                  {t.dimensionMatrix}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Click any cross-section specification to load directly into the RFQ calculator
                </p>
              </div>

              {/* Unit toggle */}
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
                <button
                  onClick={() => setIsImperial(false)}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    !isImperial ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Metric (mm / m)
                </button>
                <button
                  onClick={() => setIsImperial(true)}
                  className={`px-3 py-1 rounded transition-all cursor-pointer ${
                    isImperial ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Imperial (in / ft)
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-[#080D1A] text-slate-400 font-mono uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Thickness</th>
                    <th className="py-3 px-4">Standard Widths</th>
                    <th className="py-3 px-4">Lengths Available</th>
                    <th className="py-3 px-4">Standard Export Uses</th>
                    <th className="py-3 px-4 text-right rtl:text-left">Configure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {THICKNESS_OPTIONS.map((th) => {
                    const thDisplay = !isImperial ? `${th} mm` : `${(th / 25.4).toFixed(2)}"`;
                    return (
                      <tr key={th} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                          <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800 text-amber-400 font-mono">
                            {thDisplay}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-200">
                          {WIDTH_OPTIONS.map((w) => (!isImperial ? `${w}mm` : `${(w / 25.4).toFixed(1)}"`)).join(', ')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {LENGTH_OPTIONS.map((l) => (!isImperial ? `${l.toFixed(1)}m` : `${(l * 3.28).toFixed(1)}'`)).join(' • ')}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-sans text-xs">
                          {th <= 25 ? 'Formwork, Pallets, Siding, Sheathing' : th <= 50 ? 'Structural Framing, Scaffolding, Rafters' : 'Heavy Beams, Scantlings, Posts'}
                        </td>
                        <td className="py-3.5 px-4 text-right rtl:text-left">
                          <button
                            onClick={() =>
                              onSelectSpecForRfq({
                                thickness: th,
                                width: 150,
                                length: 4.0,
                                grade: selectedGradeId,
                              })
                            }
                            className="catalog-rfq-button px-3 py-1.5 bg-slate-900 hover:bg-amber-600 rounded border border-slate-800 text-xs font-bold transition-all cursor-pointer"
                          >
                            Select in RFQ
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="catalog-common-dimensions md:hidden">
              <div><span>Standard widths</span><strong>{WIDTH_OPTIONS.map((width) => !isImperial ? String(width) : (width / 25.4).toFixed(1)).join(' · ')} {isImperial ? 'in' : 'mm'}</strong></div>
              <div><span>Available lengths</span><strong>{LENGTH_OPTIONS.map((length) => (length * (isImperial ? 3.28 : 1)).toFixed(1) + (isImperial ? "'" : 'm')).join(' · ')}</strong></div>
            </div>

            {/* Mobile thickness selector: dimensions above apply to every row. */}
            <div className="catalog-mobile-matrix grid grid-cols-2 gap-2 md:hidden">
              {THICKNESS_OPTIONS.map((th) => {
                const thDisplay = !isImperial ? `${th} mm` : `${(th / 25.4).toFixed(2)}"`;
                return (
                  <div key={th} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-bold font-mono text-sm bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {thDisplay}
                      </span>
                      <button
                        onClick={() =>
                          onSelectSpecForRfq({
                            thickness: th,
                            width: 150,
                            length: 4.0,
                            grade: selectedGradeId,
                          })
                        }
                        className="catalog-rfq-button px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded text-[11px] font-bold uppercase transition-all cursor-pointer"
                      >
                        Select in RFQ
                      </button>
                    </div>

                    <div className="text-xs font-mono text-slate-300">
                      <span className="text-slate-500 block text-[10px]">Widths:</span>
                      {WIDTH_OPTIONS.map((w) => (!isImperial ? `${w}mm` : `${(w / 25.4).toFixed(1)}"`)).join(', ')}
                    </div>

                    <div className="text-xs font-mono text-slate-300">
                      <span className="text-slate-500 block text-[10px]">Lengths:</span>
                      {LENGTH_OPTIONS.map((l) => (!isImperial ? `${l.toFixed(1)}m` : `${(l * 3.28).toFixed(1)}'`)).join(' • ')}
                    </div>

                    <div className="text-xs font-sans text-slate-400 pt-1.5 border-t border-slate-800">
                      {th <= 25 ? 'Formwork, Pallets, Siding' : th <= 50 ? 'Structural Framing, Scaffolding' : 'Heavy Beams & Posts'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: CERTIFIED KILN DRYING & TREATMENTS */}
        {catalogTab === 'treatments' && (
          <div className="space-y-6">
            <div className="max-w-xl mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {t.treatmentsTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
                Treatments for moisture control and overseas shipping.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Treatment 1: Kiln Drying */}
              <div
                role="button"
                tabIndex={0}
                aria-pressed={activeTreatment === 'kd'}
                onClick={() => setActiveTreatment('kd')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveTreatment('kd');
                  }
                }}
                className={`treatment-card ${activeTreatment === 'kd' ? 'is-selected' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                  <Flame className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Automated Kiln Drying (KD 18% ± 2%)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Computer-controlled kiln drying brings spruce to KD 18% ± 2% for stable dimensions in transit.
                </p>
                <span className="text-xs font-mono text-amber-400 font-bold block">
                  Capacity: 3,500 m³ / Month
                </span>
              </div>

              {/* Treatment 2: Heat Treatment ISPM-15 */}
              <div
                role="button"
                tabIndex={0}
                aria-pressed={activeTreatment === 'ht'}
                onClick={() => setActiveTreatment('ht')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveTreatment('ht');
                  }
                }}
                className={`treatment-card ${activeTreatment === 'ht' ? 'is-selected' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5 text-amber-500" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Heat Treatment HT ISPM-15 (56°C / 30m)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  IPPC-compliant heat treatment: 56°C core temperature for 30 minutes, stamped RO-SV-032.
                </p>
                <span className="text-xs font-mono text-amber-400 font-bold block">
                  Mandatory for Middle East & Gulf Ports
                </span>
              </div>

              {/* Treatment 3: Anti-Stain Anti-Blue */}
              <div
                role="button"
                tabIndex={0}
                aria-pressed={activeTreatment === 'antiblue'}
                onClick={() => setActiveTreatment('antiblue')}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setActiveTreatment('antiblue');
                  }
                }}
                className={`treatment-card ${activeTreatment === 'antiblue' ? 'is-selected' : ''}`}
              >
                <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mb-4">
                  <Droplet className="w-5 h-5 text-sky-400" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">
                  Anti-Stain & Anti-Blue Dip Treatment
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  Dip treatment helps protect spruce from blue stain during storage and humid sea freight.
                </p>
                <span className="text-xs font-mono text-sky-400 font-bold block">
                  High-humidity tropical protection
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
