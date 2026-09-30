import React from 'react';
import { Phone, Mail, Globe, Anchor, ArrowUpDown } from 'lucide-react';
import type { Currency, Language } from '../types';
import { translations } from '../translations';
import { COMPANY_DATA } from '../data/companyData';

interface TopUtilityBarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  currentLang,
  onLanguageChange,
  currency,
  onCurrencyChange,
}) => {
  const t = translations[currentLang].utility;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ro', label: 'Română', flag: '🇷🇴' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <div className="w-full bg-[#070A11] border-b border-slate-800/80 text-xs text-slate-300 py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-y-2">
        {/* Port Terminal Live Ops Badge */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-900/90 border border-slate-700/60 rounded px-2.5 py-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Anchor className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              {t.terminalStatus}
            </span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-emerald-400 font-mono text-[10px] font-medium tracking-wide">
              {t.terminalActive}
            </span>
          </div>

          <div className="hidden lg:flex items-center text-slate-400 text-[11px] font-mono space-x-1">
            <span>21°C Calm Seas</span>
            <span>•</span>
            <span className="text-amber-400">Zero Berth Congestion</span>
          </div>
        </div>

        {/* Right side: Contacts, Currency & Language Switcher */}
        <div className="flex items-center space-x-4 sm:space-x-6 rtl:space-x-reverse ml-auto">
          {/* Direct Phone */}
          <a
            href={`tel:${COMPANY_DATA.contacts.phoneMain}`}
            className="hidden sm:flex items-center space-x-1.5 rtl:space-x-reverse text-slate-300 hover:text-orange-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-mono font-medium text-[11px]">{COMPANY_DATA.contacts.phoneFormatted}</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${COMPANY_DATA.contacts.emailSales}`}
            className="hidden md:flex items-center space-x-1.5 rtl:space-x-reverse text-slate-300 hover:text-orange-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-orange-500" />
            <span className="font-mono text-[11px]">{COMPANY_DATA.contacts.emailSales}</span>
          </a>

          {/* Currency Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded px-1.5 py-0.5">
            <span className="text-[10px] text-slate-400 mr-1.5 rtl:ml-1.5 hidden xl:inline">
              <ArrowUpDown className="w-2.5 h-2.5 inline mr-0.5" />
            </span>
            <button
              onClick={() => onCurrencyChange('EUR')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                currency === 'EUR'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EUR (€)
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-1.5 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-1 rtl:space-x-reverse bg-slate-900 border border-slate-700/60 rounded px-2 py-0.5">
            <Globe className="w-3 h-3 text-orange-400 mr-1" />
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onLanguageChange(lang.code)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                  currentLang === lang.code
                    ? 'bg-orange-600/30 text-orange-300 border border-orange-500/50 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={lang.label}
              >
                <span className="mr-0.5">{lang.flag}</span>
                <span className="uppercase">{lang.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
