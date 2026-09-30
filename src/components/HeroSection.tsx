import React from 'react';
import { Box, FileCheck, ArrowDownRight, Anchor, Factory, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../translations';
import { OFFICIAL_IMAGES } from '../data/timberData';

interface HeroSectionProps {
  currentLang: Language;
  onNavigateToSection: (sectionId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentLang, onNavigateToSection }) => {
  const t = translations[currentLang].hero;

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#090D16]">
      {/* Background Image with Dark Industrial Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src={OFFICIAL_IMAGES.heroLogs}
          alt="Holz Expert Industrial Forest Logs"
          className="w-full h-full object-cover object-center filter brightness-[0.28] contrast-125 scale-105 transform"
        />
        {/* Multi-layered dark gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-[#090D16]/70 to-[#090D16]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090D16] via-[#090D16]/80 to-transparent" />
        {/* Subtle engineering grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #F97316 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-16 w-full my-auto">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-orange-500/20 to-amber-500/10 border border-orange-500/40 rounded-full px-3.5 py-1.5 mb-6 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400 font-mono text-[11px] font-bold tracking-wider uppercase">
              {t.badge}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6">
            {t.headline}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              {t.headlineHighlight}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl">
            {t.subheadline}
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-10">
            <button
              onClick={() => onNavigateToSection('simulator')}
              className="group relative inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-orange-950/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Box className="w-5 h-5 mr-2 rtl:ml-2 text-white/90 group-hover:rotate-12 transition-transform" />
              <span>{t.ctaSimulator}</span>
              <ArrowDownRight className="w-4 h-4 ml-2 rtl:mr-2 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>

            <button
              onClick={() => onNavigateToSection('rfq')}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-500 text-slate-100 font-bold text-sm backdrop-blur-md transition-all shadow-md"
            >
              <span>{t.ctaQuote}</span>
              <ChevronRight className="w-4 h-4 ml-2 rtl:mr-2 rtl:rotate-180 text-orange-400" />
            </button>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-mono">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>FSC® 100% Chain-of-Custody</span>
            </div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ISPM-15 Heat Treated (56°C)</span>
            </div>
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>EN 1611-1 Standard Graded</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Ticker Bar */}
      <div className="relative z-10 w-full bg-[#070A11]/95 border-t border-slate-800/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-x-0 sm:divide-x sm:divide-slate-800/60 rtl:sm:divide-x-reverse">
            {/* Stat 1 */}
            <div className="px-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Factory className="w-4 h-4 text-orange-400" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight">
                  {t.statTurnover}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">
                {t.statTurnoverLabel}
              </span>
            </div>

            {/* Stat 2 */}
            <div className="px-2 sm:pl-6 rtl:sm:pr-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Box className="w-4 h-4 text-amber-400" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight">
                  {t.statSawing}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">
                {t.statSawingLabel}
              </span>
            </div>

            {/* Stat 3 */}
            <div className="px-2 sm:pl-6 rtl:sm:pr-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <Anchor className="w-4 h-4 text-sky-400" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight">
                  {t.statMaritime}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">
                {t.statMaritimeLabel}
              </span>
            </div>

            {/* Stat 4 */}
            <div className="px-2 sm:pl-6 rtl:sm:pr-6">
              <div className="flex items-center space-x-2 rtl:space-x-reverse mb-1">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono text-white tracking-tight">
                  {t.statFsc}
                </span>
              </div>
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium block">
                {t.statFscLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
