import React, { useState, useEffect, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import confetti from 'canvas-confetti';
import { 
  Download, 
  Send, 
  CheckCircle, 
  Ship, 
  FileText, 
  Building2, 
  Sparkles,
  Printer,
  RotateCcw
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

const AVAILABLE_TREATMENTS = [
  { id: 'KD 18%', label: 'KD 18% Automated Kiln Drying (Mühlböck Chambers)', default: true },
  { id: 'HT ISPM-15', label: 'HT ISPM-15 Heat Treatment (56°C / 30m Core Stamped)', default: true },
  { id: 'Anti-Blue', label: 'Anti-Stain / Anti-Blue Immersion Dip (Sinesto Bath)', default: false },
  { id: 'Anti-UV Foil', label: 'Anti-UV Waterproof Plastic Hood Capping', default: true },
  { id: 'PET Strapping', label: 'High-Tensile PET Strapping (4-side band strapping)', default: true },
  { id: 'GS1 Barcode', label: 'GS1 Export Barcode Labeling on each bundle', default: false },
];

let rfqCounter = 784200;
function generateRfqRefCode(): string {
  rfqCounter += 1;
  return `HEI-RFQ-${rfqCounter}`;
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
  const isInternalPrefillUpdate = useRef(false);

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
    approxVolumeM3: 99.0,
    grade: 'EN1611_CLASS_AB',
    thickness: 48,
    width: 150,
    length: 4.0,
    moisture: 'kd_18',
    treatments: ['KD 18%', 'HT ISPM-15', 'Anti-UV Foil', 'PET Strapping'],
    specialRequirements: '',
    currency: currency,
    deliveryTimeline: 'Prompt / Next Scheduled Vessel (14-21 days)',
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(rfqSchema),
    defaultValues,
  });

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const watchedValues = useWatch({ control });
  const watchedTransportType = watchedValues.transportType || 'container_40hc';
  const watchedVolumeCount = watchedValues.volumeContainers || 1;
  const watchedVolumeM3 = watchedValues.approxVolumeM3 || 50.0;
  const watchedTreatments = watchedValues.treatments || [];
  const watchedThickness = watchedValues.thickness || 48;
  const watchedWidth = watchedValues.width || 150;
  const watchedLength = watchedValues.length || 4.0;
  const watchedGrade = watchedValues.grade || 'EN1611_CLASS_AB';
  const watchedPort = watchedValues.destinationPort || 'Jeddah Islamic Port';
  const watchedIncoterm = watchedValues.incoterm || 'CIF';
  const watchedCompany = watchedValues.companyName || '';

  // Currency synchronization
  useEffect(() => {
    setValue('currency', currency);
  }, [currency, setValue]);

  // Recalculate estimated cubic meters when parameters change, except during prefill lock
  useEffect(() => {
    if (isInternalPrefillUpdate.current) {
      isInternalPrefillUpdate.current = false;
      return;
    }
    const factorPerUnit = watchedTransportType === 'container_40hc' ? 49.5 : 33.0;
    const count = Number(watchedVolumeCount) || 1;
    const estimatedM3 = Number((count * factorPerUnit).toFixed(1));
    setValue('approxVolumeM3', estimatedM3);
  }, [watchedTransportType, watchedVolumeCount, setValue]);

  // Handle incoming prefill data from Cargo Simulator, Virtual Yard, Port Inspector, or Timber Catalog
  useEffect(() => {
    if (prefillData) {
      isInternalPrefillUpdate.current = true;
      if (prefillData.transportType) setValue('transportType', prefillData.transportType);
      if (prefillData.volumeContainers !== undefined) setValue('volumeContainers', prefillData.volumeContainers);
      if (prefillData.incoterm) setValue('incoterm', prefillData.incoterm);
      if (prefillData.thickness !== undefined) setValue('thickness', prefillData.thickness);
      if (prefillData.width !== undefined) setValue('width', prefillData.width);
      if (prefillData.length !== undefined) setValue('length', prefillData.length);
      if (prefillData.moisture) setValue('moisture', prefillData.moisture);
      if (prefillData.grade) setValue('grade', prefillData.grade);
      if (prefillData.country) setValue('country', prefillData.country);
      if (prefillData.destinationPort) setValue('destinationPort', prefillData.destinationPort);
      if (prefillData.approxVolumeM3 !== undefined) setValue('approxVolumeM3', prefillData.approxVolumeM3);
      if (prefillData.treatments && prefillData.treatments.length > 0) {
        setValue('treatments', prefillData.treatments);
      }
      if (prefillData.specialRequirements) {
        setValue('specialRequirements', prefillData.specialRequirements);
      }

      const badgeTimer = setTimeout(() => {
        // If user came from a tool, jump to step 2 or 3 to show progress
        if (prefillData.transportType || prefillData.volumeContainers) {
          setActiveStep(3);
        } else if (prefillData.thickness || prefillData.grade) {
          setActiveStep(2);
        }
        setHighlightBadge('Specification & Logistics parameters locked directly into RFQ Form');
      }, 0);
      const clearTimer = setTimeout(() => setHighlightBadge(null), 6000);
      return () => {
        clearTimeout(badgeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [prefillData, setValue]);

  const toggleTreatment = (treatmentId: string) => {
    const current = getValues('treatments') || [];
    if (current.includes(treatmentId)) {
      setValue('treatments', current.filter((t) => t !== treatmentId));
    } else {
      setValue('treatments', [...current, treatmentId]);
    }
  };

  const onSubmit = (_data: FormValues) => {
    const ref = generateRfqRefCode();
    setSubmittedRefCode(ref);
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F97316', '#38BDF8'],
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
      if (!submittedRefCode) {
        setSubmittedRefCode(generatedRef);
      }
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
    <section id="rfq" className="py-16 sm:py-24 bg-[#090D16] relative border-b border-slate-800 scroll-mt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="section-heading rfq-section-heading text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="section-eyebrow"><Send aria-hidden="true" /> {t.sectionBadge}</span>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>

          {highlightBadge && (
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-mono px-4 py-2 rounded-xl mt-4 animate-fade-in shadow-lg">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>{highlightBadge}</span>
            </div>
          )}
        </div>

        {/* Main RFQ Form Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-8 lg:p-10 backdrop-blur-md shadow-2xl relative">
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

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Proforma (PDF)</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Specification</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    reset();
                    setActiveStep(1);
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center justify-center space-x-1.5 rtl:space-x-reverse cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Inquiry</span>
                </button>
              </div>
            </div>
          ) : (
            /* Progressive Step Interface + Live Proforma Summary */
            <div>
              {/* Stepper Navigation Pills */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-6 pb-4 border-b border-slate-800/80 gap-3">
                <div className="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:space-x-3 rtl:sm:space-x-reverse w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    aria-current={activeStep === 1 ? 'step' : undefined}
                    className={`rfq-step-button px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse cursor-pointer ${
                      activeStep === 1
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span className="rfq-step-number">1</span>
                    <span className="sm:hidden text-[11px] truncate">Buyer</span>
                    <span className="hidden sm:inline">Buyer & Port</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep(2)}
                    aria-current={activeStep === 2 ? 'step' : undefined}
                    className={`rfq-step-button px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse cursor-pointer ${
                      activeStep === 2
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span className="rfq-step-number">2</span>
                    <span className="sm:hidden text-[11px] truncate">Specs</span>
                    <span className="hidden sm:inline">Timber Specs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    aria-current={activeStep === 3 ? 'step' : undefined}
                    className={`rfq-step-button px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 sm:space-x-2 rtl:space-x-reverse cursor-pointer ${
                      activeStep === 3
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-950/50'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span className="rfq-step-number">3</span>
                    <span className="sm:hidden text-[11px] truncate">Logistics</span>
                    <span className="hidden sm:inline">Logistics & Final</span>
                  </button>
                </div>

                <div className="hidden md:flex items-center text-xs font-mono text-slate-400">
                  <span className="text-amber-400 font-bold">Step {activeStep} of 3</span>
                </div>
              </div>

              {/* Mobile Quick Spec Recap Bar */}
              <div className="lg:hidden bg-slate-950 border border-slate-800/80 rounded-xl p-3 mb-5 text-xs font-mono flex items-center justify-between shadow-md">
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Configured Cargo:</span>
                  <span className="text-amber-400 font-bold truncate block">
                    {watchedThickness}×{watchedWidth}mm • {watchedVolumeCount}× {watchedTransportType === 'container_40hc' ? "40'HC" : 'Truck'} (~{watchedVolumeM3} m³)
                  </span>
                </div>
                <span className="bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold shrink-0">
                  {watchedIncoterm}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Active Step Form Inputs */}
                <div className="lg:col-span-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Hidden inputs to preserve full schema binding regardless of active step */}
                    <input type="hidden" {...register('approxVolumeM3', { valueAsNumber: true })} />
                    <input type="hidden" {...register('currency')} />
                    <input type="hidden" {...register('deliveryTimeline')} />

                    {/* STEP 1: Buyer Credentials & Destination Port */}
                    {activeStep === 1 && (
                      <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse pb-2 border-b border-slate-800">
                          <Building2 className="w-5 h-5 text-amber-400" />
                          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono">
                            {t.companyDetails}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Company Name */}
                          <div>
                            <label className="block text-xs font-mono text-slate-300 mb-1.5">
                              {t.companyName} *
                            </label>
                            <input
                              type="text"
                              {...register('companyName')}
                              placeholder="e.g. Al-Rashid Timber LLC"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                              placeholder="e.g. Eng. Tariq Mansour"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                            {errors.email && (
                              <span className="text-[11px] text-red-400 font-mono mt-1 block">
                                {errors.email.message}
                              </span>
                            )}
                          </div>

                          {/* Phone with Prefix */}
                          <div>
                            <label className="block text-xs font-mono text-slate-300 mb-1.5">
                              {t.phone} *
                            </label>
                            <div className="phone-field">
                              <select
                                {...register('phoneCountryCode')}
                                className="phone-field__prefix bg-slate-950 border border-slate-800 border-r-0 rtl:border-r rtl:border-l-0 rounded-l-xl rtl:rounded-l-none rtl:rounded-r-xl px-2 py-2.5 text-xs font-mono text-amber-400 focus:outline-none focus:border-amber-500"
                              >
                                {phonePrefixes.map((p) => (
                                  <option key={p.code} value={p.code}>
                                    {p.code} ({p.country})
                                  </option>
                                ))}
                              </select>
                              <input
                                type="tel"
                                dir="ltr"
                                {...register('phoneNumber')}
                                placeholder="50 123 4567"
                                className="phone-field__number flex-1 bg-slate-950 border border-slate-800 rounded-r-xl rtl:rounded-r-none rtl:rounded-l-xl px-3 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                              placeholder="e.g. Saudi Arabia, UAE, Greece"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
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

                        <div className="pt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => setActiveStep(2)}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
                          >
                            <span>Continue to Timber Specs</span>
                            <span className="rtl:rotate-180">→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Timber Quality & Dimension Specification */}
                    {activeStep === 2 && (
                      <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse pb-2 border-b border-slate-800">
                          <FileText className="w-5 h-5 text-amber-400" />
                          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono">
                            Timber Specifications (EN 1611-1)
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Grade */}
                          <div>
                            <label className="block text-xs font-mono text-slate-300 mb-1.5">
                              {t.grade}
                            </label>
                            <select
                              {...register('grade')}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                            >
                              <option value="EN1611_CLASS_AB">Class A/B (Framing & White Wood)</option>
                              <option value="EN1611_CLASS_A">Class A (Joinery & Clear S4S)</option>
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
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
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
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
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
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                            >
                              {LENGTH_OPTIONS.map((v) => (
                                <option key={v} value={v}>
                                  {v.toFixed(1)} meters
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Moisture & Special Requirements */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-slate-300 mb-1.5">
                              {t.moisture}
                            </label>
                            <select
                              {...register('moisture')}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
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
                              placeholder="e.g. GS1 barcode marking, L/C payment term..."
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveStep(1)}
                            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95"
                          >
                            ← Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveStep(3)}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-95 flex items-center justify-center space-x-1.5 rtl:space-x-reverse"
                          >
                            <span>Continue to Logistics</span>
                            <span className="rtl:rotate-180">→</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Logistics, Packaging Treatments & Submit */}
                    {activeStep === 3 && (
                      <div className="space-y-5 animate-fade-in">
                        <div className="flex items-center space-x-2 rtl:space-x-reverse pb-2 border-b border-slate-800">
                          <Ship className="w-5 h-5 text-amber-400" />
                          <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider font-mono">
                            {t.cargoDetails} & Protective Treatments
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Transport Mode */}
                          <div>
                            <label className="block text-xs font-mono text-slate-300 mb-1.5">
                              {t.transportMode}
                            </label>
                            <select
                              {...register('transportType')}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                            >
                              <option value="container_40hc">40' High Cube Ocean (~50 m³)</option>
                              <option value="mega_truck_136">Mega Tautliner 13.6m (~33.5 m³)</option>
                            </select>
                          </div>

                          {/* Volume Containers */}
                          <div>
                            <label className="block text-xs font-mono text-slate-300 mb-1.5">
                              {watchedTransportType === 'container_40hc' ? "40' HC Containers" : 'Mega-Trucks'} *
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="50"
                              {...register('volumeContainers', { valueAsNumber: true })}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          {/* Incoterm */}
                          <div>
                            <label className="block text-xs font-mono text-slate-300 mb-1.5">
                              {t.incoterm}
                            </label>
                            <select
                              {...register('incoterm')}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                            >
                              <option value="CIF">CIF (Port of Destination)</option>
                              <option value="FOB">FOB (Port Constanța Sud)</option>
                              <option value="CFR">CFR (Cost & Freight)</option>
                              <option value="DAP">DAP (Delivered at Place - Europe)</option>
                            </select>
                          </div>
                        </div>

                        {/* Packaging Treatments */}
                        <div className="pt-2">
                          <label className="block text-xs font-mono text-slate-300 mb-2 font-bold">
                            {t.treatments}:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {AVAILABLE_TREATMENTS.map((tr) => {
                              const isChecked = watchedTreatments.includes(tr.id);
                              return (
                                <button
                                  key={tr.id}
                                  type="button"
                                  onClick={() => toggleTreatment(tr.id)}
                                  className={`p-2.5 rounded-xl border text-left rtl:text-right text-xs font-mono flex items-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer ${
                                    isChecked
                                      ? 'bg-amber-950/40 border-amber-500 text-white shadow-sm'
                                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                                  }`}
                                >
                                  <span
                                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                                      isChecked ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-700'
                                    }`}
                                  >
                                    {isChecked ? '✓' : ''}
                                  </span>
                                  <span className="truncate">{tr.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveStep(2)}
                            className="order-2 sm:order-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer active:scale-95 text-center"
                          >
                            ← Back
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="order-1 sm:order-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 hover:from-amber-500 hover:to-orange-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-amber-950/60 flex items-center justify-center space-x-2 rtl:space-x-reverse transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <Send className="w-4 h-4 text-white" />
                            <span>{isSubmitting ? t.submitting : t.submitQuote}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Right: Live Proforma Summary Card (Desktop sticky & Mobile summary) */}
                <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 font-mono shadow-xl">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Quote summary
                    </span>
                    <span className="bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                      {watchedIncoterm}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Client / Port:</span>
                      <span className="text-white font-bold truncate block">
                        {watchedCompany || 'Your Company'} • {watchedPort}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 block text-[10px]">Specification:</span>
                      <span className="text-amber-400 font-bold block">
                        {watchedThickness}×{watchedWidth}mm, {watchedLength.toFixed(1)}m ({watchedGrade.replace('EN1611_', '')})
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Freight Volume:</span>
                        <span className="text-white font-bold">
                          {watchedVolumeCount}× {watchedTransportType === 'container_40hc' ? "40' HC" : 'Mega-Truck'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block text-[10px]">Est. Net Volume:</span>
                        <span className="text-lg font-black text-amber-400">
                          ~{watchedVolumeM3} m³
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions in Summary */}
                  <div className="pt-3 border-t border-slate-800/80 space-y-2">
                    <button
                      type="button"
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Proforma (PDF)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-medium border border-slate-800 flex items-center justify-center space-x-1.5 rtl:space-x-reverse transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Specification</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
