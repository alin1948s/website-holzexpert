import React, { useState } from 'react';
import { Menu, X, ShieldCheck, TreePine, Sparkles, Box, Radio, FileText, ChevronRight } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../translations';
import { OFFICIAL_IMAGES } from '../data/timberData';

interface IndustrialHeaderProps {
  currentLang: Language;
  onOpenCertificateModal: (certType?: string) => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const IndustrialHeader: React.FC<IndustrialHeaderProps> = ({
  currentLang,
  onOpenCertificateModal,
  onNavigateToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const t = translations[currentLang].nav;

  const navItems = [
    { id: 'sawmill', label: t.sawmill, icon: TreePine },
    { id: 'specs', label: t.specs, icon: FileText },
    { id: 'simulator', label: t.simulator, icon: Box, highlight: true },
    { id: 'virtual-yard', label: t.virtualYard, icon: Radio, badge: 'LIVE' },
    { id: 'logistics', label: t.logistics, icon: Sparkles },
    { id: 'rfq', label: t.rfq, icon: ChevronRight },
  ];

  const handleNavClick = (id: string) => {
    onNavigateToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090D16]/90 backdrop-blur-md border-b border-slate-800/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & FSC Certification Badge */}
          <div className="flex items-center space-x-3 sm:space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => handleNavClick('hero')}
              className="flex items-center space-x-3 rtl:space-x-reverse group text-left"
            >
              {!logoError ? (
                <img
                  src={OFFICIAL_IMAGES.logo}
                  alt="Holz Expert Industry"
                  onError={() => setLogoError(true)}
                  className="h-11 sm:h-12 w-auto object-contain filter drop-shadow-md group-hover:brightness-110 transition-all"
                />
              ) : (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-orange-950/40">
                    H
                  </div>
                  <div>
                    <span className="text-lg font-black tracking-tight text-white block leading-tight">
                      HOLZ <span className="text-orange-500">EXPERT</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase block">
                      INDUSTRY S.R.L.
                    </span>
                  </div>
                </div>
              )}
            </button>

            {/* FSC 100% Chain of Custody Official Badge */}
            <button
              onClick={() => onOpenCertificateModal('fsc')}
              className="hidden md:flex items-center space-x-1.5 rtl:space-x-reverse bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700/60 rounded px-2.5 py-1 text-emerald-300 text-xs transition-colors group"
              title="Click to view official FSC® Chain of Custody Certificate"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-left rtl:text-right">
                <span className="block font-bold text-[10px] tracking-wide text-emerald-400 leading-tight">
                  FSC® 100% CoC
                </span>
                <span className="block font-mono text-[9px] text-emerald-200/80 leading-tight">
                  C119854 Certified
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all ${
                    item.highlight
                      ? 'text-orange-400 bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="flex items-center ml-1 rtl:mr-1">
                      <span className="animate-pulse inline-flex h-2 w-2 rounded-full bg-emerald-400 mr-1 rtl:ml-1"></span>
                      <span className="bg-emerald-900/80 text-emerald-300 text-[9px] font-mono px-1 rounded border border-emerald-500/40">
                        {item.badge}
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center space-x-3 rtl:space-x-reverse">
            <button
              onClick={() => handleNavClick('rfq')}
              className="relative inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-white transition-all bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 rounded-lg shadow-lg shadow-orange-950/40 hover:shadow-orange-900/60 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <span>{t.requestQuoteBtn}</span>
              <ChevronRight className="w-3.5 h-3.5 ml-1 rtl:mr-1 rtl:rotate-180" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#090D16] px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium ${
                  item.highlight
                    ? 'text-orange-400 bg-orange-950/50 border border-orange-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Icon className="w-4 h-4 text-orange-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-emerald-900/80 text-emerald-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-500/40">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => onOpenCertificateModal('fsc')}
              className="flex items-center justify-center space-x-2 rtl:space-x-reverse py-2 rounded-md bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 text-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>FSC® 100% Chain of Custody Certificate</span>
            </button>
            <button
              onClick={() => handleNavClick('rfq')}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm shadow-md"
            >
              {t.requestQuoteBtn}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
