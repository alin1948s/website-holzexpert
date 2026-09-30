import React, { useState } from 'react';
import { 
  FileText, 
  Flame, 
  ShieldCheck, 
  Droplet, 
  Maximize, 
  Download,
  ArrowRight
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
  const [selectedGradeId, setSelectedGradeId] = useState<TimberGrade>('EN1611_CLASS_AB');
  const [isImperial, setIsImperial] = useState<boolean>(false);
  const [activeTreatment, setActiveTreatment] = useState<'kd' | 'ht' | 'antiblue'>('kd');
  const [zoomTexture, setZoomTexture] = useState<boolean>(false);

  const t = translations[currentLang].catalog;
  const currentGrade = TIMBER_GRADES.find((g) => g.id === selectedGradeId) || TIMBER_GRADES[1];

  return (
    <section id="specs" className="py-20 bg-[#070A11] relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-orange-950/40 border border-orange-500/40 rounded-full px-3.5 py-1 mb-4">
            <FileText className="w-3.5 h-3.5 text-orange-400" />
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

        {/* Grade Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {TIMBER_GRADES.map((grade) => (
            <button
              key={grade.id}
              onClick={() => setSelectedGradeId(grade.id)}
              className={`px-5 py-3 rounded-xl border text-sm font-bold font-mono transition-all flex items-center space-x-2 rtl:space-x-reverse ${
                selectedGradeId === grade.id
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-orange-500 shadow-lg shadow-orange-950/50 scale-102'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <span>{grade.code}</span>
              <span className="text-xs opacity-80 hidden sm:inline">• {grade.title.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Active Grade Detailed Showcase */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Wood Texture with Zoom */}
            <div className="lg:col-span-5 relative group">
              <div 
                className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 cursor-pointer aspect-video sm:aspect-square flex items-center justify-center"
                onClick={() => setZoomTexture(!zoomTexture)}
              >
                <img
                  src={currentGrade.textureImage}
                  alt={currentGrade.title}
                  className={`w-full h-full object-cover transition-all duration-500 ${
                    zoomTexture ? 'scale-150 filter brightness-110' : 'group-hover:scale-105'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] font-mono text-orange-400 font-bold">
                  {currentGrade.marketName}
                </div>

                <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 flex items-center space-x-1 rtl:space-x-reverse">
                  <Maximize className="w-3 h-3 text-orange-400" />
                  <span>{zoomTexture ? 'Reset Zoom' : 'Click to Zoom Grain'}</span>
                </div>
              </div>
            </div>

            {/* Right: Technical Specs & Rules */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-mono text-orange-400 uppercase tracking-widest font-bold block mb-1">
                  OFFICIAL EN 1611-1 GRADING CRITERIA
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {currentGrade.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-mono mt-1">
                  {currentGrade.subtitle}
                </p>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed">
                {currentGrade.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold mb-1">
                    Knot & Defect Tolerance
                  </span>
                  <p className="text-xs text-slate-200 font-mono">
                    {currentGrade.allowedKnots}
                  </p>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold mb-1">
                    Surface & Geometry
                  </span>
                  <p className="text-xs text-slate-200 font-mono">
                    {currentGrade.surfaceFinish}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold">
                  Recommended Industrial Applications:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentGrade.primaryUses.map((use) => (
                    <span
                      key={use}
                      className="bg-slate-800/80 text-slate-300 border border-slate-700 text-xs px-3 py-1 rounded-lg"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    onSelectSpecForRfq({
                      thickness: 48,
                      width: 150,
                      length: 4.0,
                      grade: currentGrade.id,
                    })
                  }
                  className="px-4 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-950/50 flex items-center space-x-1.5 rtl:space-x-reverse transition-all"
                >
                  <span>Select {currentGrade.code} in RFQ</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>

                <button
                  onClick={onOpenPdfDataSheet}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center space-x-1.5 rtl:space-x-reverse transition-all"
                >
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>{t.downloadTechSheet}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Industrial Wood Treatments Selector */}
        <div className="mb-14">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-2xl font-black text-white">
              {t.treatmentsTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-mono mt-1">
              Industrial preservative and equilibrium processes certified for deep-sea container voyages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Treatment 1: Kiln Drying */}
            <div
              onClick={() => setActiveTreatment('kd')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                activeTreatment === 'kd'
                  ? 'bg-amber-950/40 border-amber-500 shadow-xl shadow-amber-950/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Automated Kiln Drying (KD 18% ± 2%)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Drying inside computer-regulated Mühlböck chambers with electronic moisture probes. Minimizes distortion, locks dimensional tolerance, and prevents blue stain mold growth during equatorial container shipping.
              </p>
              <span className="text-[11px] font-mono text-amber-400 font-bold">
                Capacity: 3,500 m³ / Month
              </span>
            </div>

            {/* Treatment 2: Heat Treatment ISPM-15 */}
            <div
              onClick={() => setActiveTreatment('ht')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                activeTreatment === 'ht'
                  ? 'bg-orange-950/40 border-orange-500 shadow-xl shadow-orange-950/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-orange-400" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Heat Treatment HT ISPM-15 (56°C / 30m)
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Full compliance with the International Plant Protection Convention (IPPC). Every bundle is heat-treated to ensure minimum 56°C core temperature for 30 consecutive minutes, officially stamped RO-SV-032.
              </p>
              <span className="text-[11px] font-mono text-orange-400 font-bold">
                Mandatory for Middle East & Gulf Ports
              </span>
            </div>

            {/* Treatment 3: Anti-Stain Anti-Blue */}
            <div
              onClick={() => setActiveTreatment('antiblue')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                activeTreatment === 'antiblue'
                  ? 'bg-sky-950/40 border-sky-500 shadow-xl shadow-sky-950/40'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center mb-4">
                <Droplet className="w-6 h-6 text-sky-400" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">
                Anti-Stain & Anti-Blue Dip Treatment
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Automated immersion bath with eco-friendly antifungal solutions (Sinesto / Antiblu). Protects the natural blonde brightness of Romanian spruce against sapstain fungi throughout maritime transit.
              </p>
              <span className="text-[11px] font-mono text-sky-400 font-bold">
                High-humidity tropical protection
              </span>
            </div>
          </div>
        </div>

        {/* Dimension Matrix Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-black text-white">
                {t.dimensionMatrix}
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Click any cross-section to load into RFQ calculator
              </p>
            </div>

            {/* Unit toggle */}
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-mono">
              <button
                onClick={() => setIsImperial(false)}
                className={`px-3 py-1 rounded transition-all ${
                  !isImperial ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Metric (mm / m)
              </button>
              <button
                onClick={() => setIsImperial(true)}
                className={`px-3 py-1 rounded transition-all ${
                  isImperial ? 'bg-orange-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Imperial (in / ft)
              </button>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left rtl:text-right text-xs">
              <thead className="bg-[#050811] text-slate-400 font-mono uppercase tracking-wider text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Thickness</th>
                  <th className="py-3 px-4">Standard Widths</th>
                  <th className="py-3 px-4">Lengths Available</th>
                  <th className="py-3 px-4">Standard Export Uses</th>
                  <th className="py-3 px-4 text-right rtl:text-left">Configure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {THICKNESS_OPTIONS.map((th) => {
                  const thDisplay = !isImperial ? `${th} mm` : `${(th / 25.4).toFixed(2)}"`;
                  return (
                    <tr key={th} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-orange-400">
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
                          className="px-3 py-1 bg-slate-800 hover:bg-orange-600 text-slate-200 hover:text-white rounded text-[11px] font-bold transition-all"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
