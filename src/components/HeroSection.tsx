import React from 'react';
import { ArrowDownRight, ArrowRight, Check, Factory, PackageCheck, Ship } from 'lucide-react';
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
    <section id="hero" className="hero-section scroll-mt-24">
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="hero-kicker__mark" aria-hidden="true" />
            <span>{t.badge}</span>
            <span className="hero-kicker__year">EST. 2004</span>
          </div>

          <h1>
            {t.headline}{' '}
            <span>{t.headlineHighlight}</span>
          </h1>

          <p className="hero-lede">{t.subheadline}</p>

          <div className="hero-actions">
            <button className="button button--primary" onClick={() => onNavigateToSection('rfq')}>
              {t.ctaQuote}
              <ArrowRight aria-hidden="true" />
            </button>
            <button className="button button--quiet" onClick={() => onNavigateToSection('simulator')}>
              {t.ctaSimulator}
              <ArrowDownRight aria-hidden="true" />
            </button>
          </div>

          <div className="hero-proof" aria-label="Export certifications">
            <span><Check aria-hidden="true" /> FSC® chain of custody</span>
            <span><Check aria-hidden="true" /> ISPM-15 heat treated</span>
            <span><Check aria-hidden="true" /> EN 1611-1 graded</span>
          </div>
        </div>

        <figure className="hero-image">
          <img src={OFFICIAL_IMAGES.heroLogs} alt="Holz Expert sawmill and timber yard in Gălănești, Romania" fetchPriority="high" />
          <figcaption className="hero-image__caption">
            <span>Gălănești, Suceava</span>
            <span>Romania</span>
          </figcaption>
          <div className="hero-image__note">
            <span className="hero-image__note-icon"><Factory aria-hidden="true" /></span>
            <span><strong>From log to loaded container</strong><small>One team. One supply chain.</small></span>
          </div>
        </figure>
      </div>

      <div className="hero-stats" aria-label="Holz Expert at a glance">
        <div className="hero-stat">
          <Factory aria-hidden="true" />
          <div><strong>{t.statSawing}</strong><span>{t.statSawingLabel}</span></div>
        </div>
        <div className="hero-stat">
          <PackageCheck aria-hidden="true" />
          <div><strong>3,500 m³</strong><span>Monthly kiln-drying capacity</span></div>
        </div>
        <div className="hero-stat">
          <Ship aria-hidden="true" />
          <div><strong>{t.statMaritime}</strong><span>{t.statMaritimeLabel}</span></div>
        </div>
        <div className="hero-stat hero-stat--last">
          <Check aria-hidden="true" />
          <div><strong>{t.statFsc}</strong><span>{t.statFscLabel}</span></div>
        </div>
      </div>
    </section>
  );
};
