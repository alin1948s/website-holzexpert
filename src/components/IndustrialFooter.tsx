import React from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Anchor, 
  Award, 
  TreePine, 
  ChevronRight, 
  ArrowUp 
} from 'lucide-react';
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
    <footer className="bg-[#050811] border-t border-slate-800 text-slate-400 text-xs">
      {/* Top Banner: Direct Contact Bar */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 bg-[#070A14]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest font-bold block mb-1">
              MARITIME & COMMERCIAL EXPORT DESK
            </span>
            <h3 className="text-xl font-black text-white">
              Direct Access to Holz Expert Trade Directors
            </h3>
            <p className="text-slate-400 text-xs mt-1">
              Binding CIF / FOB Container Spot Quotes Issued Within 4 Business Hours
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${COMPANY_DATA.contacts.phoneMain}`}
              className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse transition-all shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>{COMPANY_DATA.contacts.phoneFormatted}</span>
            </a>

            <a
              href={`mailto:${COMPANY_DATA.contacts.emailSales}`}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 rtl:space-x-reverse transition-all"
            >
              <Mail className="w-4 h-4 text-orange-400" />
              <span>{COMPANY_DATA.contacts.emailSales}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1: Corporate Profile */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-9 h-9 rounded bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center font-black text-white text-lg shadow-md">
                H
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white block leading-tight">
                  HOLZ <span className="text-orange-500">EXPERT</span>
                </span>
                <span className="text-[9px] text-slate-400 font-mono tracking-widest uppercase block">
                  INDUSTRY S.R.L.
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed font-sans text-xs">
              Major Romanian softwood & spruce timber manufacturer and deep-sea maritime exporter. High-yield sawing mill in Suceava and dedicated container terminal logistics in Port Constanța Sud - Agigea.
            </p>

            <div className="pt-2 font-mono text-[11px] text-slate-400 space-y-1">
              <div>{t.vatNumber}</div>
              <div>{t.regNumber}</div>
              <div className="text-emerald-400 font-semibold">Annual Turnover: {COMPANY_DATA.annualTurnover}</div>
            </div>
          </div>

          {/* Col 2: Production & Port Hub */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Industrial Platforms
            </h4>

            <div className="space-y-3 font-mono text-[11px]">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-white font-bold mb-1">
                  <TreePine className="w-3.5 h-3.5 text-orange-400" />
                  <span>Headquarters & Sawmill Base:</span>
                </div>
                <div className="text-slate-400">
                  {COMPANY_DATA.headquarters.address}, {COMPANY_DATA.headquarters.county}, Romania
                </div>
                <div className="text-slate-500 text-[10px] mt-1">
                  100,000 m² site • 100,000 m³ log sawing/yr
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3">
                <div className="flex items-center space-x-1.5 rtl:space-x-reverse text-white font-bold mb-1">
                  <Anchor className="w-3.5 h-3.5 text-sky-400" />
                  <span>Maritime Terminal & Depot:</span>
                </div>
                <div className="text-slate-400">
                  {COMPANY_DATA.maritimeTerminal.name}
                </div>
                <div className="text-slate-500 text-[10px] mt-1">
                  Port of Constanța Sud, Agigea • Deep-sea container stuffing
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Official Certifications */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {t.certifications}
            </h4>

            <div className="space-y-2">
              <button
                onClick={() => onOpenCertificateModal('fsc')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 text-left rtl:text-right transition-all group"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {t.fscTitle}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      CoC 100% Carpathian Forest
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 rtl:rotate-180" />
              </button>

              <button
                onClick={() => onOpenCertificateModal('ispm')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-left rtl:text-right transition-all group"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {t.ispmTitle}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Heat Treatment HT 56°C / 30m
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 rtl:rotate-180" />
              </button>

              <button
                onClick={() => onOpenCertificateModal('en')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 text-left rtl:text-right transition-all group"
              >
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Building2 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {t.enTitle}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Classes A, A/B, B/C Certified
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 rtl:rotate-180" />
              </button>
            </div>
          </div>

          {/* Col 4: Quick Navigation & Commercial Contacts */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              {t.directDesk}
            </h4>

            <div className="space-y-2 font-mono text-xs">
              <div className="text-slate-300">
                <span className="text-slate-500 block text-[10px]">Commercial Export Director:</span>
                <span className="font-bold text-white">Andrei Beilic</span>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500 block text-[10px]">Email:</span>
                <a href={`mailto:${COMPANY_DATA.contacts.emailDirector}`} className="text-orange-400 hover:underline">
                  {COMPANY_DATA.contacts.emailDirector}
                </a>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500 block text-[10px]">General Office Desk:</span>
                <a href={`mailto:${COMPANY_DATA.contacts.emailOffice}`} className="text-slate-300 hover:underline">
                  {COMPANY_DATA.contacts.emailOffice}
                </a>
              </div>
              <div className="text-slate-400">
                <span className="text-slate-500 block text-[10px]">Operational Hours:</span>
                <span className="text-slate-300">{COMPANY_DATA.contacts.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-mono text-slate-500 text-center sm:text-left rtl:sm:text-right">
            © {CURRENT_YEAR} {COMPANY_DATA.legalName}. {t.rights}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center space-x-1.5 rtl:space-x-reverse px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs font-mono transition-all"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
