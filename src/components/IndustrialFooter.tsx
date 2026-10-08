import React from 'react';
import { Anchor, ArrowUp, Award, Building2, ChevronRight, Mail, Phone, ShieldCheck, TreePine } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../translations';
import { COMPANY_DATA } from '../data/companyData';

interface IndustrialFooterProps {
  currentLang: Language;
  onOpenCertificateModal: (certType?: string) => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export const IndustrialFooter: React.FC<IndustrialFooterProps> = ({
  currentLang,
  onOpenCertificateModal,
}) => {
  const t = translations[currentLang].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="site-footer scroll-mt-28">
      <section className="footer-contact" aria-labelledby="footer-contact-title">
        <div className="footer-contact__inner">
          <div className="footer-contact__copy">
            <span className="footer-eyebrow">{t.directDesk}</span>
            <h2 id="footer-contact-title">Request a timber export quote</h2>
            <p>Share your dimensions, volume and destination port with Andrei Beilic, Export Director.</p>
          </div>

          <div className="footer-contact__actions">
            <a className="footer-contact__action" href={`tel:${COMPANY_DATA.contacts.phoneMain}`}>
              <Phone aria-hidden="true" />
              <span><small>Call sales</small><strong>{COMPANY_DATA.contacts.phoneFormatted}</strong></span>
            </a>
            <a className="footer-contact__action" href={`mailto:${COMPANY_DATA.contacts.emailSales}`}>
              <Mail aria-hidden="true" />
              <span><small>Email sales</small><strong>{COMPANY_DATA.contacts.emailSales}</strong></span>
            </a>
          </div>
        </div>
      </section>

      <div className="footer-main">
        <div className="footer-grid">
          <section className="footer-company" aria-labelledby="footer-company-title">
            <div className="footer-brand-lockup">
              <span className="footer-brand-mark">H</span>
              <span><strong id="footer-company-title">HOLZ EXPERT</strong><small>INDUSTRY S.R.L.</small></span>
            </div>
            <p className="footer-company__summary">
              Romanian spruce producer · Gălănești mill · Agigea export terminal.
            </p>
            <p className="footer-legal-id">VAT {COMPANY_DATA.fiscalCode} · Reg. {COMPANY_DATA.tradeRegister}</p>
          </section>

          <section className="footer-details" aria-labelledby="footer-locations-title">
            <h3 id="footer-locations-title">Factory & shipping</h3>
            <div className="footer-detail">
              <TreePine aria-hidden="true" />
              <div><strong>Sawmill · Gălănești</strong><span>{COMPANY_DATA.headquarters.address}, {COMPANY_DATA.headquarters.county}, {COMPANY_DATA.headquarters.postalCode}, Romania</span></div>
            </div>
            <div className="footer-detail">
              <Anchor aria-hidden="true" />
              <div><strong>Export terminal · Agigea</strong><span>{COMPANY_DATA.maritimeTerminal.name}</span><small>{COMPANY_DATA.maritimeTerminal.location} · container staging and stuffing</small></div>
            </div>
          </section>

          <section className="footer-certifications" aria-labelledby="footer-certifications-title">
            <h3 id="footer-certifications-title">{t.certifications}</h3>
            <button type="button" onClick={() => onOpenCertificateModal('fsc')} className="footer-certification">
              <ShieldCheck aria-hidden="true" />
              <span><strong>{t.fscTitle}</strong><small>{COMPANY_DATA.certifications[0].certNumber}</small></span>
              <ChevronRight className="footer-certification__mark" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onOpenCertificateModal('ispm')} className="footer-certification">
              <Award aria-hidden="true" />
              <span><strong>{t.ispmTitle}</strong><small>RO-SV-032 · HT 56°C / 30 min</small></span>
              <ChevronRight className="footer-certification__mark" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => onOpenCertificateModal('en')} className="footer-certification">
              <Building2 aria-hidden="true" />
              <span><strong>{t.enTitle}</strong><small>Classes A · A/B · B/C</small></span>
              <ChevronRight className="footer-certification__mark" aria-hidden="true" />
            </button>
          </section>

        </div>

        <div className="footer-bottom">
          <span>© {CURRENT_YEAR} {COMPANY_DATA.legalName} · {COMPANY_DATA.headquarters.county}, Romania</span>
          <button type="button" onClick={scrollToTop} className="footer-back-to-top">
            Back to top <ArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
};
