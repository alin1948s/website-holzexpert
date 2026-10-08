import React from 'react';
import { Anchor, Globe, Phone } from 'lucide-react';
import type { Currency, Language } from '../types';
import { translations } from '../translations';
import { COMPANY_DATA } from '../data/companyData';

interface TopUtilityBarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ro', label: 'Română' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية' },
];

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  currentLang,
  onLanguageChange,
  currency,
  onCurrencyChange,
}) => {
  const t = translations[currentLang].utility;

  return (
    <div className="utility-strip">
      <div className="utility-strip__inner">
        <div className="utility-strip__origin">
          <Anchor aria-hidden="true" />
          <span className="utility-strip__short">Made in Romania</span>
          <span className="utility-strip__long">{t.terminalStatus}</span>
          <span className="utility-strip__dot" aria-hidden="true">·</span>
          <span className="utility-strip__active">{t.terminalActive}</span>
        </div>

        <div className="utility-strip__controls">
          <a className="utility-strip__phone" href={`tel:${COMPANY_DATA.contacts.phoneMain}`}>
            <Phone aria-hidden="true" />{COMPANY_DATA.contacts.phoneFormatted}
          </a>
          <div className="utility-control" aria-label={t.switchCurrency}>
            {(['EUR', 'USD'] as const).map((value) => (
              <button key={value} onClick={() => onCurrencyChange(value)} className={currency === value ? 'is-selected' : ''}>
                {value}
              </button>
            ))}
          </div>
          <div className="utility-languages" aria-label="Choose language">
            <Globe aria-hidden="true" />
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => onLanguageChange(language.code)}
                className={currentLang === language.code ? 'is-selected' : ''}
                aria-label={language.label}
                aria-pressed={currentLang === language.code}
              >
                {language.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
