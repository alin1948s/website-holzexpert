import React, { useState, useMemo } from 'react';
import { 
  Ship, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
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

  // Max visual bundles slots (e.g. 16 for 40' container, 12 for truck)
  const totalVisualSlots = transportType === 'container_40hc' ? 14 : 10;
  const filledSlots = Math.min(bundles, totalVisualSlots);

  return (
    <section id="simulator" className="py-20 bg-[#090D16] relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-orange-950/40 border border-orange-500/40 rounded-full px-3.5 py-1 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
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

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-6">
            {/* 1. Transport Mode Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                {t.transportMode}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTransportType('container_40hc');
                    setBundles(12);
                  }}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                    transportType === 'container_40hc'
                      ? 'bg-gradient-to-b from-orange-950/60 to-slate-900 border-orange-500 text-white shadow-lg shadow-orange-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Ship className={`w-6 h-6 mb-2 ${transportType === 'container_40hc' ? 'text-orange-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold leading-tight">40' High Cube Ocean</span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">~50 m³ • 26.5t limit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTransportType('mega_truck_136');
                    setBundles(8);
                  }}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all ${
                    transportType === 'mega_truck_136'
                      ? 'bg-gradient-to-b from-orange-950/60 to-slate-900 border-orange-500 text-white shadow-lg shadow-orange-950/50'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Truck className={`w-6 h-6 mb-2 ${transportType === 'mega_truck_136' ? 'text-orange-400' : 'text-slate-500'}`} />
                  <span className="text-xs font-bold leading-tight">Mega Tautliner 13.6m</span>
                  <span className="text-[10px] font-mono text-slate-400 mt-1">~33.5 m³ • 24.0t limit</span>
                </button>
              </div>
            </div>

            {/* 2. Cross-Section Dimensions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.selectDimensions}
                </label>
                <span className="text-[11px] font-mono text-orange-400 font-semibold bg-orange-950/40 px-2 py-0.5 rounded border border-orange-500/30">
                  {thickness} × {width} mm × {length}m
                </span>
              </div>

              {/* Thickness Selector */}
              <div>
                <span className="text-[11px] text-slate-400 mb-1.5 block">{t.thickness} (mm):</span>
                <div className="flex flex-wrap gap-1.5">
                  {THICKNESS_OPTIONS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setThickness(val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        thickness === val
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-950/50'
                          : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Width Selector */}
              <div>
                <span className="text-[11px] text-slate-400 mb-1.5 block">{t.width} (mm):</span>
                <div className="flex flex-wrap gap-1.5">
                  {WIDTH_OPTIONS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setWidth(val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        width === val
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-950/50'
                          : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Length Selector */}
              <div>
                <span className="text-[11px] text-slate-400 mb-1.5 block">{t.length} (meters):</span>
                <div className="grid grid-cols-4 gap-2">
                  {LENGTH_OPTIONS.map((val) => (
                    <button
                      key={val}
                      onClick={() => setLength(val)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        length === val
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-950/50'
                          : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {val.toFixed(2)}m
                    </button>
                  ))}
                </div>
              </div>
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
                  className={`p-3 rounded-xl border text-left rtl:text-right transition-all ${
                    moisture === 'kd_18'
                      ? 'bg-amber-950/40 border-amber-500/80 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">KD 18% Kiln Dried</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                    Density ~450 kg/m³. Anti-mold certified for long ocean voyages.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMoisture('fresh_cut')}
                  className={`p-3 rounded-xl border text-left rtl:text-right transition-all ${
                    moisture === 'fresh_cut'
                      ? 'bg-sky-950/40 border-sky-500/80 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-sky-300">Fresh Cut / Wet</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block leading-tight">
                    Density ~750 kg/m³. Heavy payload; hits weight limit sooner.
                  </span>
                </button>
              </div>
            </div>

            {/* 4. Bundle Quantity Stepper */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.bundleQty}
                </label>
                <button
                  type="button"
                  onClick={handleAutoOptimize}
                  className="text-[11px] font-mono text-orange-400 hover:text-orange-300 underline underline-offset-2"
                >
                  Optimize Fit ({loadCalc.recommendedMaxBundles} bundles)
                </button>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={() => setBundles(Math.max(1, bundles - 1))}
                  className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-lg hover:bg-slate-800 active:scale-95 flex items-center justify-center transition-all"
                >
                  -
                </button>
                <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-2 px-3 text-center">
                  <span className="text-xl font-black font-mono text-white">{bundles}</span>
                  <span className="text-xs text-slate-400 font-mono ml-2">Export Bundles</span>
                </div>
                <button
                  type="button"
                  onClick={() => setBundles(bundles + 1)}
                  className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700 text-white font-bold text-lg hover:bg-slate-800 active:scale-95 flex items-center justify-center transition-all"
                >
                  +
                </button>
              </div>

              <input
                type="range"
                min="1"
                max={Math.max(20, loadCalc.recommendedMaxBundles + 4)}
                value={bundles}
                onChange={(e) => setBundles(parseInt(e.target.value, 10))}
                className="w-full mt-3 accent-orange-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Visualizer & Live Telemetry */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visualizer Display Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                    {t.visualPreview}
                  </span>
                </div>

                <div className="flex items-center space-x-1 rtl:space-x-reverse bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                      viewMode === '3d' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2.5D Isometric
                  </button>
                  <button
                    onClick={() => setViewMode('cross')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-all ${
                      viewMode === 'cross' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Cross-Section
                  </button>
                </div>
              </div>

              {/* Visual 2.5D Canvas / SVG Container Rendering */}
              <div className="w-full bg-[#050810] border border-slate-800 rounded-xl p-4 sm:p-6 min-h-[290px] flex flex-col justify-center relative overflow-hidden">
                {/* Container Specification Watermark */}
                <div className="absolute top-3 right-4 font-mono text-[10px] text-slate-600 text-right uppercase tracking-wider select-none pointer-events-none">
                  <div>HEIU 481902 4</div>
                  <div>45G1 • 40' HIGH CUBE</div>
                  <div>MAX GROSS: 32,500 KG</div>
                </div>

                {viewMode === '3d' ? (
                  /* 2.5D Isometric View of Container and Loaded Wood Bundles */
                  <div className="w-full py-4 flex flex-col items-center">
                    {/* Container Outer Frame */}
                    <div className="w-full max-w-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-slate-700 rounded-lg p-3 shadow-inner relative">
                      {/* Corrugated Wall Simulation Lines */}
                      <div className="absolute inset-x-0 top-0 h-2 bg-slate-950/80 border-b border-slate-700/50 flex justify-between px-2">
                        {Array.from({ length: 18 }).map((_, i) => (
                          <div key={i} className="w-0.5 h-full bg-slate-700/40" />
                        ))}
                      </div>

                      {/* Cargo Interior Floor */}
                      <div className="bg-[#121622] border border-slate-700/60 rounded p-2.5 min-h-[160px] flex flex-col justify-end relative">
                        {/* Empty Floor Grid Indicator */}
                        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#F97316_1px,transparent_1px),linear-gradient(to_bottom,#F97316_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                        {/* Bundles Matrix Visualized */}
                        <div className="grid grid-cols-7 gap-2 z-10">
                          {Array.from({ length: totalVisualSlots }).map((_, index) => {
                            const isLoaded = index < filledSlots;
                            return (
                              <div
                                key={index}
                                className={`h-16 sm:h-20 rounded border transition-all duration-300 relative flex flex-col justify-between p-1 select-none ${
                                  isLoaded
                                    ? 'bg-gradient-to-b from-amber-200 via-amber-300 to-amber-400 border-amber-600 text-amber-950 shadow-md shadow-amber-950/40 transform hover:-translate-y-1'
                                    : 'border-dashed border-slate-800 bg-slate-950/40 text-slate-700 flex items-center justify-center'
                                }`}
                              >
                                {isLoaded ? (
                                  <>
                                    {/* Anti-UV Blue/White Foil Hood Representation on top */}
                                    <div className="w-full h-2 bg-sky-500/80 rounded-t-sm border-b border-sky-700" title="Anti-UV Protective Foil Top Hood" />

                                    {/* Strapping Bands */}
                                    <div className="absolute inset-y-0 left-2 w-0.5 bg-slate-900/60" />
                                    <div className="absolute inset-y-0 right-2 w-0.5 bg-slate-900/60" />

                                    {/* Bundle Label */}
                                    <div className="text-[8px] font-mono font-black text-center text-amber-950 truncate px-0.5">
                                      B-{index + 1}
                                    </div>

                                    {/* Moisture & FSC stamp */}
                                    <div className="flex justify-between items-center text-[7px] font-mono px-0.5 text-amber-900 font-bold">
                                      <span>KD</span>
                                      <span>FSC</span>
                                    </div>
                                  </>
                                ) : (
                                  <span className="font-mono text-[9px] opacity-40">Slot {index + 1}</span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Overload Alert Badge overlay inside visualizer */}
                        {loadCalc.status === 'overweight' && (
                          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center rounded p-4 text-center z-20 animate-fade-in">
                            <AlertTriangle className="w-8 h-8 text-red-400 mb-2 animate-bounce" />
                            <span className="text-white font-black text-xs uppercase tracking-wider">
                              AXLE WEIGHT EXCEEDED
                            </span>
                            <span className="text-red-200 text-[11px] font-mono max-w-xs mt-1">
                              Current load: {loadCalc.totalWeightTonnes}t. Legal road/rail maximum is {transport.maxWeightTonnes}t.
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Floor Specs */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 mt-2 px-1">
                        <span>40ft HC Interior Floor: 12.03m × 2.35m</span>
                        <span className="text-orange-400 font-bold">{bundles} Export Bundles Stowed</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Cross-Section View */
                  <div className="w-full py-4 flex flex-col items-center">
                    <div className="w-64 h-48 bg-slate-900 border-2 border-slate-700 rounded-lg p-2 relative flex flex-col justify-end shadow-xl">
                      <div className="text-[9px] font-mono text-slate-400 absolute top-2 left-2">
                        Cross-Section: 2.35m W × 2.69m H
                      </div>

                      {/* Cross section 2x2 stacking representation */}
                      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-36">
                        {Array.from({ length: 4 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="bg-gradient-to-br from-amber-300 to-amber-500 border border-amber-700 rounded p-1.5 flex flex-col justify-between"
                          >
                            <span className="text-[9px] font-mono font-bold text-amber-950">
                              ~{loadCalc.bundleWidthMm} × {loadCalc.bundleHeightMm} mm
                            </span>
                            <span className="text-[8px] font-mono text-amber-900">
                              {loadCalc.piecesPerBundle} boards / pack
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="text-center text-[9px] font-mono text-slate-400 mt-1">
                        Solid 2-Tier Modular Stowage
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Gauges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {/* Volume Utilization Progress */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">{t.spaceUtilized}</span>
                    <span className={`font-mono font-bold ${loadCalc.volumeCapacityRatio > 100 ? 'text-red-400' : 'text-orange-400'}`}>
                      {loadCalc.volumeCapacityRatio}% ({loadCalc.totalVolumeM3} / {transport.maxVolumeM3} m³)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        loadCalc.volumeCapacityRatio > 100
                          ? 'bg-red-500'
                          : loadCalc.volumeCapacityRatio > 90
                          ? 'bg-amber-400'
                          : 'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min(100, loadCalc.volumeCapacityRatio)}%` }}
                    />
                  </div>
                </div>

                {/* Weight Utilization Progress */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">{t.weightUtilized}</span>
                    <span className={`font-mono font-bold ${loadCalc.weightCapacityRatio > 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {loadCalc.weightCapacityRatio}% ({loadCalc.totalWeightTonnes}t / {transport.maxWeightTonnes}t)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
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
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{t.statusSafe}</span>
                  </div>
                )}
                {loadCalc.status === 'warning' && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse bg-amber-950/40 border border-amber-700/50 rounded-lg p-2.5 text-amber-300 text-xs font-mono">
                    <Info className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>{t.statusWarning}</span>
                  </div>
                )}
                {(loadCalc.status === 'overweight' || loadCalc.status === 'overvolume') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse bg-red-950/50 border border-red-700/60 rounded-lg p-2.5 text-red-300 text-xs font-mono">
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>{t.statusOverweight}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Telemetry Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{t.totalVolume}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {loadCalc.totalVolumeM3} <span className="text-xs font-normal text-orange-400">m³</span>
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{t.grossWeight}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {loadCalc.totalWeightTonnes} <span className="text-xs font-normal text-orange-400">t</span>
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{t.standardBundles}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {loadCalc.totalBundles} <span className="text-xs font-normal text-orange-400">packs</span>
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">{t.piecesCount}</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {loadCalc.totalPieces.toLocaleString()} <span className="text-xs font-normal text-orange-400">pcs</span>
                </span>
              </div>
            </div>

            {/* Direct Call to Action Button */}
            <button
              type="button"
              onClick={handleLockIn}
              className="w-full group py-4 px-6 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-orange-950/60 transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <span>{t.lockInCta}</span>
              <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
