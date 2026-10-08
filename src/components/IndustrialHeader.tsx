import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import type { Currency, Language } from '../types';
import { translations } from '../translations';
import { COMPANY_DATA } from '../data/companyData';

interface IndustrialHeaderProps {
  currentLang: Language;
  currency?: Currency;
  onLanguageChange?: (lang: Language) => void;
  onCurrencyChange?: (curr: Currency) => void;
  onOpenCertificateModal: (certType?: string) => void;
  onNavigateToSection: (sectionId: string) => void;
}

export const IndustrialHeader: React.FC<IndustrialHeaderProps> = ({
  currentLang,
  onOpenCertificateModal,
  onNavigateToSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const t = translations[currentLang].nav;

  const navItems = [
    { id: 'sawmill', label: t.sawmill },
    { id: 'specs', label: t.specs },
    { id: 'logistics', label: t.logistics },
    { id: 'virtual-yard', label: t.virtualYard },
    { id: 'simulator', label: t.simulator },
  ];

  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.scrollY + 160;
      const section = [...navItems].reverse().find((item) => {
        const element = document.getElementById(item.id);
        return element && scrollPosition >= element.offsetTop;
      });
      setActiveSection(section?.id ?? 'hero');
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navigate = (sectionId: string) => {
    onNavigateToSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className={mobileMenuOpen ? 'site-header is-menu-open' : 'site-header'}>
      <div className="site-header__inner">
        <button className="brand-lockup" onClick={() => navigate('hero')} aria-label="Holz Expert home">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span className="brand-name"><strong>HOLZ EXPERT</strong><small>INDUSTRY S.R.L.</small></span>
        </button>

        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={activeSection === item.id ? 'site-nav__link is-active' : 'site-nav__link'}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="site-header__actions">
          <button className="certificate-link" onClick={() => onOpenCertificateModal('fsc')} title="Verify FSC Chain-of-Custody">
            <ShieldCheck aria-hidden="true" />
            <span>FSC® certified</span>
          </button>
          <button className="button button--primary header-quote" onClick={() => navigate('rfq')}>
            {t.requestQuoteBtn}<ArrowUpRight aria-hidden="true" />
          </button>
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <button className="menu-backdrop" aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} />
          <div className="mobile-menu" id="mobile-navigation">
            <p className="mobile-menu__eyebrow">Explore Holz Expert</p>
            <nav aria-label="Mobile navigation">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => navigate(item.id)}>
                  <span>{item.label}</span><ArrowUpRight aria-hidden="true" />
                </button>
              ))}
            </nav>
            <button className="mobile-menu__certificate" onClick={() => { onOpenCertificateModal('fsc'); setMobileMenuOpen(false); }}>
              <ShieldCheck aria-hidden="true" /> Verify FSC® Chain-of-Custody
            </button>
            <a className="mobile-menu__phone" href={`tel:${COMPANY_DATA.contacts.phoneMain}`}>
              <Phone aria-hidden="true" /> {COMPANY_DATA.contacts.phoneFormatted}
            </a>
            <button className="button button--primary mobile-menu__quote" onClick={() => navigate('rfq')}>
              {t.requestQuoteBtn}<ArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </>
      )}
    </header>
  );
};
