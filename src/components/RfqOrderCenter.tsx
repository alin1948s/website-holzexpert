import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Send, 
  CheckCircle, 
  Ship, 
  FileText, 
  Building2, 
  Sparkles
} from 'lucide-react';
import type { Currency, Language, RfqFormData } from '../types';
import { generateRfqPdf } from '../utils/pdfGenerator';
import { translations } from '../translations';
import { THICKNESS_OPTIONS, WIDTH_OPTIONS, LENGTH_OPTIONS } from '../data/timberData';
import { EXPORT_DESTINATIONS } from '../data/routesData';

import { rfqSchema, type FormValues } from '../utils/validation';

interface RfqOrderCenterProps {
  currentLang: Language;
  currency: Currency;
  prefillData?: Partial<RfqFormData> | null;
}

export const RfqOrderCenter: React.FC<RfqOrderCenterProps> = ({
  currentLang,
  currency,
  prefillData,
}) => {
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submittedRefCode, setSubmittedRefCode] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [highlightBadge, setHighlightBadge] = useState<string | null>(null);

  const t = translations[currentLang].rfq;

  const defaultValues: FormValues = {
    companyName: '',
    contactPerson: '',
    email: '',
    phoneCountryCode: '+966',
    phoneNumber: '',
    country: 'Saudi Arabia',
    destinationPort: 'Jeddah Islamic Port',
    transportType: 'container_40hc',
    incoterm: 'CIF',
    volumeContainers: 2,
    approxVolumeM3: 100,
    grade: 'EN1611_CLASS_AB',
    thickness: 48,
    width: 150,
    length: 4.0,
    moisture: 'kd_18',
    treatments: ['HT ISPM-15', 'Anti-UV Wrapped'],
    specialRequirements: '',
    currency: currency,
    deliveryTimeline: 'Prompt / Next Vessel (14-21 days)',
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues,
  });

  const watchedTransportType = watch('transportType');
  const watchedVolumeCount = watch('volumeContainers');

  // Recalculate estimated cubic meters when parameters change
  useEffect(() => {
    const factorPerUnit = watchedTransportType === 'container_40hc' ? 49.5 : 33.0;
    const estimatedM3 = Number((watchedVolumeCount * factorPerUnit).toFixed(1));
    setValue('approxVolumeM3', estimatedM3);
  }, [watchedTransportType, watchedVolumeCount, setValue]);

  // Handle incoming prefill data from Cargo Simulator or Virtual Yard
  useEffect(() => {
    if (prefillData) {
      if (prefillData.transportType) setValue('transportType', prefillData.transportType);
      if (prefillData.thickness) setValue('thickness', prefillData.thickness);
      if (prefillData.width) setValue('width', prefillData.width);
      if (prefillData.length) setValue('length', prefillData.length);
      if (prefillData.moisture) setValue('moisture', prefillData.moisture);
      if (prefillData.grade) setValue('grade', prefillData.grade);
      if (prefillData.destinationPort) setValue('destinationPort', prefillData.destinationPort);
      if (prefillData.approxVolumeM3) setValue('approxVolumeM3', prefillData.approxVolumeM3);

      setHighlightBadge('Configuration loaded directly into RFQ Form');
      setTimeout(() => setHighlightBadge(null), 6000);
    }
  }, [prefillData, setValue]);

  const onSubmit = (_data: FormValues) => {
    const ref = `HEI-RFQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRefCode(ref);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F97316', '#FBBF24', '#38BDF8'],
      });
    } catch {
      // ignore
    }
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    const currentValues = getValues();
    try {
      const generatedRef = generateRfqPdf(currentValues as RfqFormData);
      setSubmittedRefCode(generatedRef);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const phonePrefixes = [
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+971', country: 'United Arab Emirates' },
    { code: '+20', country: 'Egypt' },
    { code: '+961', country: 'Lebanon' },
    { code: '+962', country: 'Jordan' },
    { code: '+965', country: 'Kuwait' },
    { code: '+974', country: 'Qatar' },
    { code: '+968', country: 'Oman' },
    { code: '+30', country: 'Greece' },
    { code: '+49', country: 'Germany' },
    { code: '+40', country: 'Romania' },
    { code: '+39', country: 'Italy' },
    { code: '+44', country: 'United Kingdom' },
    { code: '+1', country: 'USA / Canada' },
  ];

  return (
    <section id="rfq" className="py-20 bg-[#090D16] relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-orange-950/40 border border-orange-500/40 rounded-full px-3.5 py-1 mb-4">
            <Send className="w-3.5 h-3.5 text-orange-400" />
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

          {highlightBadge && (
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono px-4 py-2 rounded-xl mt-4 animate-fade-in shadow-lg">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>{highlightBadge}</span>
            </div>
          )}
        </div>

        {/* Main RFQ Form Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl relative">
          {isSubmitted ? (
            /* Success confirmation card */
            <div className="py-12 px-4 text-center max-w-xl mx-auto space-y-6">
              <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/50">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold block mb-1">
                  OFFICIAL RFQ TRACKING REFERENCE: {submittedRefCode}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {t.successTitle}
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-mono">
                {t.successMessage}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Proforma Specification (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    reset();
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            /* Enterprise Order Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Group 1: Buyer Corporate Credentials */}
              <div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6 pb-2 border-b border-slate-800">
                  <Building2 className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                    {t.companyDetails}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.companyName} *
                    </label>
                    <input
                      type="text"
                      {...register('companyName')}
                      placeholder="e.g. Al-Rashid Timber & Building Materials LLC"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    {errors.companyName && (
                      <span className="text-[11px] text-red-400 font-mono mt-1 block">
                        {errors.companyName.message}
                      </span>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.contactPerson} *
                    </label>
                    <input
                      type="text"
                      {...register('contactPerson')}
                      placeholder="e.g. Eng. Tariq Mansour / Procurement Dir."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    {errors.contactPerson && (
                      <span className="text-[11px] text-red-400 font-mono mt-1 block">
                        {errors.contactPerson.message}
                      </span>
                    )}
                  </div>

                  {/* Corporate Email */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.email} *
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="procurement@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-400 font-mono mt-1 block">
                        {errors.email.message}
                      </span>
                    )}
                  </div>

                  {/* Phone with International Prefix Selector */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.phone} *
                    </label>
                    <div className="flex">
                      <select
                        {...register('phoneCountryCode')}
                        className="bg-slate-950 border border-slate-800 border-r-0 rounded-l-xl px-2.5 py-3 text-xs font-mono text-orange-400 focus:outline-none focus:border-orange-500"
                      >
                        {phonePrefixes.map((p) => (
                          <option key={p.code} value={p.code}>
                            {p.code} ({p.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        {...register('phoneNumber')}
                        placeholder="50 123 4567"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-r-xl px-3 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    {errors.phoneNumber && (
                      <span className="text-[11px] text-red-400 font-mono mt-1 block">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                  </div>

                  {/* Destination Country */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.country} *
                    </label>
                    <input
                      type="text"
                      {...register('country')}
                      placeholder="e.g. Saudi Arabia, UAE, Greece, Egypt"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                    {errors.country && (
                      <span className="text-[11px] text-red-400 font-mono mt-1 block">
                        {errors.country.message}
                      </span>
                    )}
                  </div>

                  {/* Destination Port (POD) */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.destinationPort} *
                    </label>
                    <select
                      {...register('destinationPort')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    >
                      {EXPORT_DESTINATIONS.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.country})
                        </option>
                      ))}
                      <option value="Other Discharge Port">Other International Port</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Group 2: Cargo & Freight Logistics Parameters */}
              <div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6 pb-2 border-b border-slate-800">
                  <Ship className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                    {t.cargoDetails}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Transport Mode */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.transportMode}
                    </label>
                    <select
                      {...register('transportType')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="container_40hc">40' High Cube Ocean Container (~50 m³)</option>
                      <option value="mega_truck_136">Mega Tautliner Truck 13.6m (~33.5 m³)</option>
                    </select>
                  </div>

                  {/* Volume (Units Count) */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {watchedTransportType === 'container_40hc' ? 'Number of 40\' HC Containers' : 'Number of Mega-Trucks'} *
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        {...register('volumeContainers', { valueAsNumber: true })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Incoterm */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.incoterm}
                    </label>
                    <select
                      {...register('incoterm')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="CIF">CIF (Port of Destination)</option>
                      <option value="FOB">FOB (Port Constanța Sud - Agigea)</option>
                      <option value="CFR">CFR (Cost & Freight)</option>
                      <option value="DAP">DAP (Delivered at Place - Europe)</option>
                    </select>
                  </div>

                  {/* Calculated Volume M3 */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Approximate Total Net Volume
                    </label>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-orange-400 font-bold flex items-center justify-between">
                      <span>~{watch('approxVolumeM3')} m³</span>
                      <span className="text-[10px] text-slate-500 font-normal">Auto-calculated</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Group 3: Timber Quality & Dimension Specification */}
              <div>
                <div className="flex items-center space-x-2 rtl:space-x-reverse mb-6 pb-2 border-b border-slate-800">
                  <FileText className="w-5 h-5 text-orange-400" />
                  <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                    Timber Specifications (EN 1611-1)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {/* Grade */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.grade}
                    </label>
                    <select
                      {...register('grade')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="EN1611_CLASS_AB">Class A/B (Commercial Export / Framing)</option>
                      <option value="EN1611_CLASS_A">Class A (Joinery / Clear S4S)</option>
                      <option value="EN1611_CLASS_BC">Class B/C (Packaging & Pallets)</option>
                    </select>
                  </div>

                  {/* Thickness */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Thickness (mm)
                    </label>
                    <select
                      {...register('thickness', { valueAsNumber: true })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    >
                      {THICKNESS_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v} mm
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Width */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Width (mm)
                    </label>
                    <select
                      {...register('width', { valueAsNumber: true })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    >
                      {WIDTH_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v} mm
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Length */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      Length (m)
                    </label>
                    <select
                      {...register('length', { valueAsNumber: true })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    >
                      {LENGTH_OPTIONS.map((v) => (
                        <option key={v} value={v}>
                          {v.toFixed(1)} meters
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Moisture & Treatments */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.moisture}
                    </label>
                    <select
                      {...register('moisture')}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="kd_18">Kiln Dried KD 18% ± 2% (Automated Chambers)</option>
                      <option value="fresh_cut">Fresh Cut / Green Timber</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5">
                      {t.specialReq}
                    </label>
                    <input
                      type="text"
                      {...register('specialRequirements')}
                      placeholder="e.g. Specific barcode marking, Letter of Credit (L/C) term..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all shadow-md"
                >
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>{isGeneratingPdf ? 'Generating PDF...' : t.downloadPdf}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-orange-950/60 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>{isSubmitting ? t.submitting : t.submitQuote}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
