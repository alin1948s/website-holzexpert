import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { COMPANY_DATA } from '../data/companyData';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certType?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certType = 'fsc',
}) => {
  if (!isOpen) return null;

  const currentCert =
    COMPANY_DATA.certifications.find((c) =>
      c.code.toLowerCase().includes(certType.toLowerCase()) ||
      c.title.toLowerCase().includes(certType.toLowerCase())
    ) || COMPANY_DATA.certifications[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0B101D] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Badge */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 text-emerald-400">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">
          OFFICIAL COMPLIANCE RECORD
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
          {currentCert.title}
        </h3>
        <p className="text-xs font-mono text-slate-400 mb-6">
          Registry Code: <span className="text-orange-400 font-bold">{currentCert.certNumber}</span>
        </p>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 mb-6 font-mono text-xs">
          <div className="flex justify-between pb-2 border-b border-slate-900">
            <span className="text-slate-500">Certified Organization:</span>
            <span className="text-slate-200 font-bold">{COMPANY_DATA.legalName}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-900">
            <span className="text-slate-500">Auditing Authority:</span>
            <span className="text-slate-200">{currentCert.issuer}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-900">
            <span className="text-slate-500">Operational Scope:</span>
            <span className="text-slate-200">Sawmilling, Kiln Drying & Export</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Traceability:</span>
            <span className="text-emerald-400 font-bold">100% Carpathian Forest Origin</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          {currentCert.description}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs uppercase tracking-wider transition-all"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
