import { useState, useEffect } from 'react';
import type { Currency, Language, MoistureCondition, RfqFormData, TimberGrade, TransportType, VirtualYardBatch } from './types';
import { TopUtilityBar } from './components/TopUtilityBar';
import { IndustrialHeader } from './components/IndustrialHeader';
import { HeroSection } from './components/HeroSection';
import { CargoSimulator } from './components/CargoSimulator';
import { TimberCatalog } from './components/TimberCatalog';
import { SawmillPower } from './components/SawmillPower';
import { ExportRouteVisualizer } from './components/ExportRouteVisualizer';
import { VirtualYardBoard } from './components/VirtualYardBoard';
import { RfqOrderCenter } from './components/RfqOrderCenter';
import { IndustrialFooter } from './components/IndustrialFooter';
import { CertificateModal } from './components/CertificateModal';
import { generateRfqPdf } from './utils/pdfGenerator';

export function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [prefillRfqData, setPrefillRfqData] = useState<Partial<RfqFormData> | null>(null);
  const [certificateModalOpen, setCertificateModalOpen] = useState<boolean>(false);
  const [activeCertType, setActiveCertType] = useState<string>('fsc');

  // Handle RTL direction when Arabic is selected
  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCertificateModal = (certType?: string) => {
    setActiveCertType(certType || 'fsc');
    setCertificateModalOpen(true);
  };

  // 1. Cargo Simulator Lock-In -> Auto-populate RFQ
  const handleLockInCargo = (specs: {
    transportType: TransportType;
    thickness: number;
    width: number;
    length: number;
    moisture: MoistureCondition;
    bundles: number;
    volumeM3: number;
    weightTonnes: number;
  }) => {
    setPrefillRfqData({
      transportType: specs.transportType,
      thickness: specs.thickness,
      width: specs.width,
      length: specs.length,
      moisture: specs.moisture,
      approxVolumeM3: specs.volumeM3,
      volumeContainers: specs.transportType === 'container_40hc' ? Math.max(1, Math.round(specs.volumeM3 / 50)) : 1,
    });
    handleNavigateToSection('rfq');
  };

  // 2. Virtual Yard Lot Reservation -> Auto-populate RFQ
  const handleReserveBatchFromYard = (batch: VirtualYardBatch) => {
    setPrefillRfqData({
      thickness: batch.thickness,
      width: batch.width,
      length: batch.length,
      grade: batch.grade,
      moisture: batch.moisture,
      approxVolumeM3: batch.volumeM3,
      specialRequirements: `Inquiry for Batch: ${batch.batchCode} (${batch.locationName}) - Available ${batch.volumeM3} m³`,
    });
    handleNavigateToSection('rfq');
  };

  // 3. Port Inspector Selection -> Auto-populate RFQ
  const handleSelectDestinationPort = (portName: string) => {
    setPrefillRfqData((prev) => ({
      ...prev,
      destinationPort: portName,
      incoterm: 'CIF',
    }));
    handleNavigateToSection('rfq');
  };

  // 4. Timber Catalog Selection -> Auto-populate RFQ
  const handleSelectCatalogSpec = (spec: {
    thickness: number;
    width: number;
    length: number;
    grade: TimberGrade;
  }) => {
    setPrefillRfqData((prev) => ({
      ...prev,
      thickness: spec.thickness,
      width: spec.width,
      length: spec.length,
      grade: spec.grade,
    }));
    handleNavigateToSection('rfq');
  };

  // Technical PDF Data Sheet download
  const handleDownloadTechDataSheet = () => {
    generateRfqPdf({
      companyName: 'Official Timber Technical Spec',
      contactPerson: 'Technical Export Department',
      email: 'sales@holzexpert.com',
      phoneCountryCode: '+40',
      phoneNumber: '751012082',
      country: 'International Export',
      destinationPort: 'Worldwide Discharge Ports',
      transportType: 'container_40hc',
      incoterm: 'FOB',
      volumeContainers: 1,
      approxVolumeM3: 50,
      grade: 'EN1611_CLASS_AB',
      thickness: 48,
      width: 150,
      length: 4.0,
      moisture: 'kd_18',
      treatments: ['Automated Kiln Drying KD 18%', 'HT ISPM-15 Heat Treated', 'FSC 100% Chain-of-Custody'],
      specialRequirements: 'Standard Holz Expert Export Bundle Packaging: 4-side PET strapped, anti-UV waterproof hood capping, GS1 barcode tagged.',
      currency: currency,
      deliveryTimeline: '14-21 days from order confirmation',
    });
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. Top Utility Status & Language Bar */}
      <TopUtilityBar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* 2. Industrial Header / Navbar with FSC Badge */}
      <IndustrialHeader
        currentLang={currentLang}
        onOpenCertificateModal={handleOpenCertificateModal}
        onNavigateToSection={handleNavigateToSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 3. Hero Section with Real Assets & KPI Ticker */}
        <HeroSection
          currentLang={currentLang}
          onNavigateToSection={handleNavigateToSection}
        />

        {/* 4. SHOWSTOPPER A: Interactive 3D/2.5D Cargo Loading Simulator */}
        <CargoSimulator
          currentLang={currentLang}
          onLockInSpecification={handleLockInCargo}
        />

        {/* 5. Technical Timber Catalog & EN 1611-1 Specs */}
        <TimberCatalog
          currentLang={currentLang}
          onSelectSpecForRfq={handleSelectCatalogSpec}
          onOpenPdfDataSheet={handleDownloadTechDataSheet}
        />

        {/* 6. Heavy Industrial Sawmill Infrastructure (Gălănești 100,000 m²) */}
        <SawmillPower
          currentLang={currentLang}
        />

        {/* 7. SHOWSTOPPER B: Interactive Maritime & Overland Corridors Visualizer */}
        <ExportRouteVisualizer
          currentLang={currentLang}
          onSelectDestinationPort={handleSelectDestinationPort}
        />

        {/* 8. SHOWSTOPPER C: Live Virtual Yard & Production Batch Board */}
        <VirtualYardBoard
          currentLang={currentLang}
          onReserveBatch={handleReserveBatchFromYard}
        />

        {/* 9. High-Conversion RFQ & Export Order Center + PDF Spec Engine */}
        <RfqOrderCenter
          currentLang={currentLang}
          currency={currency}
          prefillData={prefillRfqData}
        />
      </main>

      {/* 10. Heavy Industrial Footer */}
      <IndustrialFooter
        currentLang={currentLang}
        onOpenCertificateModal={handleOpenCertificateModal}
      />

      {/* Certificate Verification Modal */}
      <CertificateModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        certType={activeCertType}
      />
    </div>
  );
}

export default App;
