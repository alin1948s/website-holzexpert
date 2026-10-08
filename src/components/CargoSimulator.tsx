import React, { useState, useMemo } from 'react';
import { 
  Ship, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  Droplets,
  Flame
} from 'lucide-react';
import type { MoistureCondition, TransportType, Language } from '../types';
import { 
  THICKNESS_OPTIONS, 
  WIDTH_OPTIONS, 
  LENGTH_OPTIONS, 
  TRANSPORT_SPECS 
} from '../data/timberData';
import { calculateCargoLoad } from '../utils/bundleCalculator';
import { translations } from '../translations';

interface CargoSimulatorProps {
  currentLang: Language;
  onLockInSpecification: (specs: {
    transportType: TransportType;
    thickness: number;
    width: number;
    length: number;
    moisture: MoistureCondition;
    bundles: number;
    volumeM3: number;
    weightTonnes: number;
  }) => void;
}

export const CargoSimulator: React.FC<CargoSimulatorProps> = ({
  currentLang,
  onLockInSpecification,
}) => {
  const [transportType, setTransportType] = useState<TransportType>('container_40hc');
  const [thickness, setThickness] = useState<number>(48);
  const [width, setWidth] = useState<number>(150);
  const [length, setLength] = useState<number>(4.0);
  const [moisture, setMoisture] = useState<MoistureCondition>('kd_18');
  const [bundles, setBundles] = useState<number>(12);
  const [viewMode, setViewMode] = useState<'3d' | 'cross'>('3d');

  const t = translations[currentLang].simulator;
  const transport = TRANSPORT_SPECS[transportType];

  // Live calculation results
  const loadCalc = useMemo(() => {
    return calculateCargoLoad(transportType, thickness, width, length, moisture, bundles);
  }, [transportType, thickness, width, length, moisture, bundles]);

  const handleLockIn = () => {
    onLockInSpecification({
      transportType,
      thickness,
      width,
      length,
      moisture,
      bundles: loadCalc.totalBundles,
      volumeM3: loadCalc.totalVolumeM3,
      weightTonnes: loadCalc.totalWeightTonnes,
    });
  };

  // Preset quick-fit: fill container to optimal volume/weight
  const handleAutoOptimize = () => {
    setBundles(loadCalc.recommendedMaxBundles);
  };

  // Dynamic visual bundles slots
  const baseSlots = transportType === 'container_40hc' ? 14 : 10;
  const totalVisualSlots = Math.max(baseSlots, Math.min(21, bundles));
  const filledSlots = Math.min(bundles, totalVisualSlots);

  return (
    <section id="simulator" className="py-20 bg-[#070D18] relative border-b border-slate-800 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="section-heading mb-10">
          <span className="section-eyebrow">04 <span aria-hidden="true">/</span> {t.sectionBadge}</span>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 bg-[#0B1324] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* 1. Transport Mode Selector */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.transportMode}
                </label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTransportType('container_40hc');
                    setBundles(12);
                  }}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    transportType === 'container_40hc'
                      ? 'bg-amber-600/10 border-amber-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Ship className={`w-6 h-6 mb-1.5 ${transportType === 'container_40hc' ? 'text-amber-500' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold leading-tight">40' High Cube Ocean</span>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">~50 m³ • 26.5t limit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTransportType('mega_truck_136');
                    setBundles(8);
                  }}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                    transportType === 'mega_truck_136'
                      ? 'bg-amber-600/10 border-amber-500 text-white shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Truck className={`w-6 h-6 mb-1.5 ${transportType === 'mega_truck_136' ? 'text-amber-500' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold leading-tight">Mega Tautliner 13.6m</span>
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">~33.5 m³ • 24.0t limit</span>
                </button>
              </div>
            </div>

            {/* 2. Cross-Section Dimensions & Quick Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.selectDimensions}
                </label>
                <span className="text-xs font-mono text-amber-500 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {thickness} × {width} mm × {length.toFixed(1)}m
                </span>
              </div>

              {/* Quick Industry Presets */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Standard Export Presets:</span>
                  <span className="text-amber-500 text-[10px]">Choose a size</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setThickness(48); setWidth(150); setLength(4.0); }}
                    className={`p-2 rounded-lg text-left rtl:text-right border transition-all cursor-pointer ${
                      thickness === 48 && width === 150 && length === 4.0
                        ? 'bg-amber-600/15 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold text-amber-500">48 × 150 mm</span>
                    <span className="block text-[10px] text-slate-400 font-mono truncate">Structural Timber</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setThickness(25); setWidth(100); setLength(4.0); }}
                    className={`p-2 rounded-lg text-left rtl:text-right border transition-all cursor-pointer ${
                      thickness === 25 && width === 100 && length === 4.0
                        ? 'bg-amber-600/15 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold text-amber-500">25 × 100 mm</span>
                    <span className="block text-[10px] text-slate-400 font-mono truncate">Formwork Board</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setThickness(75); setWidth(150); setLength(4.0); }}
                    className={`p-2 rounded-lg text-left rtl:text-right border transition-all cursor-pointer ${
                      thickness === 75 && width === 150 && length === 4.0
                        ? 'bg-amber-600/15 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold text-amber-500">75 × 150 mm</span>
                    <span className="block text-[10px] text-slate-400 font-mono truncate">Heavy Scantling</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setThickness(38); setWidth(125); setLength(4.0); }}
                    className={`p-2 rounded-lg text-left rtl:text-right border transition-all cursor-pointer ${
                      thickness === 38 && width === 125 && length === 4.0
                        ? 'bg-amber-600/15 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-xs font-bold text-amber-500">38 × 125 mm</span>
                    <span className="block text-[10px] text-slate-400 font-mono truncate">Scaffold Plank</span>
                  </button>
                </div>
              </div>

              <details className="simulator-custom-dimensions">
                <summary>Adjust dimensions manually</summary>
                <div className="simulator-custom-dimensions__body">
              {/* Thickness Selector */}
              <div>
                <span className="text-xs text-slate-400 mb-1.5 block font-mono">{t.thickness} (mm):</span>
                <div className="flex flex-wrap gap-1.5">
                  {THICKNESS_OPTIONS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setThickness(val)}
                      className={`min-w-[42px] px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 ${
                        thickness === val
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Width Selector */}
              <div>
                <span className="text-xs text-slate-400 mb-1.5 block font-mono">{t.width} (mm):</span>
                <div className="flex flex-wrap gap-1.5">
                  {WIDTH_OPTIONS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setWidth(val)}
                      className={`min-w-[44px] px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 ${
                        width === val
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selector */}
              <div>
                <span className="text-xs text-slate-400 mb-1.5 block font-mono">{t.length} (meters):</span>
                <div className="grid grid-cols-4 gap-2">
                  {LENGTH_OPTIONS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setLength(val)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer active:scale-95 ${
                        length === val
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {val.toFixed(1)}m
                    </button>
                  ))}
                </div>
              </div>
                </div>
              </details>
            </div>

            {/* 3. Moisture Condition & Density */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {t.moistureCondition}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMoisture('kd_18')}
                  className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                    moisture === 'kd_18'
                      ? 'bg-amber-600/10 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1">
                    <Flame className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-xs font-bold text-amber-400">KD 18% Kiln Dried</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                    Approx. 450 kg/m³
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMoisture('fresh_cut')}
                  className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                    moisture === 'fresh_cut'
                      ? 'bg-amber-600/10 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 rtl:space-x-reverse mb-1">
                    <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-xs font-bold text-sky-300">Fresh Cut / Green Sawn</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                    Approx. 750 kg/m³
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Bundle Quantity Stepper & Auto-Optimize */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.bundleQty}
                </label>
                <button
                  type="button"
                  onClick={handleAutoOptimize}
                  className="simulator-auto-fit px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer"
                >
                  Auto-fit
                </button>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <input
                  type="range"
                  min="1"
                  max={transportType === 'container_40hc' ? 24 : 16}
                  value={bundles}
                  onChange={(e) => setBundles(parseInt(e.target.value) || 1)}
                  className="flex-1 accent-amber-500 cursor-pointer"
                />
                <span className="w-14 text-center font-mono font-bold text-sm bg-slate-900 border border-slate-800 py-1.5 px-2 rounded-lg text-white">
                  {bundles}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Stowage Visualizer & Telemetry */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visualizer Display Box */}
            <div className="bg-[#0B1324] border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="simulator-view-header flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                    {t.visualPreview}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({loadCalc.bundleWidthMm} × {loadCalc.bundleHeightMm} mm bundles)
                  </span>
                </div>
                <div className="simulator-view-toggle flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`px-3 py-1 rounded transition-all cursor-pointer ${
                      viewMode === '3d' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.topView}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('cross')}
                    className={`px-3 py-1 rounded transition-all cursor-pointer ${
                      viewMode === 'cross' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.crossSection}
                  </button>
                </div>
              </div>

              {/* View Container */}
              <div className="mt-5 min-h-[200px] flex items-center justify-center">
                {viewMode === '3d' ? (
                  /* 3D Container Bay Layout */
                  <div className="w-full">
                    <div className="bg-[#050811] border border-slate-800 rounded-xl p-4">
                      <div className="grid grid-cols-7 gap-1.5 min-h-[120px]">
                        {Array.from({ length: totalVisualSlots }).map((_, idx) => {
                          const isOccupied = idx < filledSlots;
                          return (
                            <div
                              key={idx}
                              className={`h-20 rounded border flex flex-col items-center justify-center text-center p-1 transition-all ${
                                isOccupied
                                  ? 'bg-amber-600/20 border-amber-500/60 text-amber-400'
                                  : 'bg-slate-900/40 border-slate-800/80 text-slate-600'
                              }`}
                            >
                              <span className="text-[10px] font-mono font-bold">
                                {isOccupied ? `#${idx + 1}` : 'EMPTY'}
                              </span>
                              {isOccupied && (
                                <span className="text-[9px] font-mono text-slate-300">
                                  {loadCalc.volumePerBundleM3.toFixed(2)}m³
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-3 px-1">
                        <span>
                          {transportType === 'container_40hc'
                            ? "40ft HC Interior Floor: 12.03m × 2.35m"
                            : "Mega Tautliner Bed: 13.62m × 2.48m • 3.00m H"}
                        </span>
                        <span className="text-amber-500 font-bold">{bundles} Bundles Stowed</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Cross-Section View */
                  <div className="w-full py-4 flex flex-col items-center">
                    <div className="w-64 h-48 bg-slate-900 border border-slate-700 rounded-lg p-3 relative flex flex-col justify-end shadow-md">
                      <div className="text-[10px] font-mono text-slate-400 absolute top-2.5 left-3">
                        {transportType === 'container_40hc'
                          ? "Cross-Section: 2.35m W × 2.69m H (40' HC)"
                          : "Cross-Section: 2.48m W × 3.00m H (Mega Truck)"}
                      </div>

                      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-36">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="bg-amber-600/20 border border-amber-500/60 rounded p-2 flex flex-col justify-between"
                          >
                            <span className="text-[10px] font-mono font-bold text-amber-300">
                              ~{loadCalc.bundleWidthMm} × {loadCalc.bundleHeightMm} mm
                            </span>
                            <span className="text-[9px] font-mono text-slate-300">
                              {loadCalc.piecesPerBundle} boards / pack
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="text-center text-[10px] font-mono text-slate-400 mt-1">
                        Modular 2-Tier Stack
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">{t.spaceUtilized}</span>
                    <span className={`font-mono font-bold text-xs ${loadCalc.volumeCapacityRatio > 100 ? 'text-red-400' : 'text-amber-400'}`}>
                      {loadCalc.volumeCapacityRatio}% ({loadCalc.totalVolumeM3} / {transport.maxVolumeM3} m³)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        loadCalc.volumeCapacityRatio > 100
                          ? 'bg-red-500'
                          : loadCalc.volumeCapacityRatio > 90
                          ? 'bg-amber-400'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, loadCalc.volumeCapacityRatio)}%` }}
                    />
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">{t.weightUtilized}</span>
                    <span className={`font-mono font-bold text-xs ${loadCalc.weightCapacityRatio > 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {loadCalc.weightCapacityRatio}% ({loadCalc.totalWeightTonnes}t / {transport.maxWeightTonnes}t)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        loadCalc.weightCapacityRatio > 100
                          ? 'bg-red-500'
                          : loadCalc.weightCapacityRatio > 90
                          ? 'bg-amber-400'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, loadCalc.weightCapacityRatio)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status Alert Banner */}
              <div className="mt-4">
                {loadCalc.status === 'safe' && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse bg-emerald-950/40 border border-emerald-700/50 rounded-lg p-2.5 text-emerald-300 text-xs font-mono">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{t.statusSafe}</span>
                  </div>
                )}
                {loadCalc.status === 'warning' && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse bg-amber-950/40 border border-amber-700/50 rounded-lg p-2.5 text-amber-300 text-xs font-mono">
                    <Info className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t.statusWarning}</span>
                  </div>
                )}
                {(loadCalc.status === 'overweight' || loadCalc.status === 'overvolume') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse bg-red-950/50 border border-red-700/60 rounded-lg p-2.5 text-red-300 text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{t.statusOverweight}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Telemetry Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-[#0B1324] border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{t.totalVolume}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {loadCalc.totalVolumeM3} <span className="text-xs font-normal text-amber-500">m³</span>
                </span>
              </div>

              <div className="bg-[#0B1324] border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{t.grossWeight}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {loadCalc.totalWeightTonnes} <span className="text-xs font-normal text-amber-500">t</span>
                </span>
              </div>

              <div className="bg-[#0B1324] border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{t.standardBundles}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {loadCalc.totalBundles} <span className="text-xs font-normal text-amber-500">packs</span>
                </span>
              </div>

              <div className="bg-[#0B1324] border border-slate-800 rounded-xl p-3.5 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{t.piecesCount}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {loadCalc.totalPieces.toLocaleString()} <span className="text-xs font-normal text-amber-500">pcs</span>
                </span>
              </div>
            </div>

            {/* Direct Call to Action Button */}
            <button
              type="button"
              onClick={handleLockIn}
              className="w-full py-4 px-6 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
            >
              <span>{t.lockInCta}</span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
