import { useState, useEffect } from 'react';
import { Box, ChevronRight } from 'lucide-react';
import type { Currency, Language, MoistureCondition, RfqFormData, TimberGrade, TransportType, VirtualYardBatch } from './types';
import { translations } from './translations';
import { TopUtilityBar } from './components/TopUtilityBar';
import { IndustrialHeader } from './components/IndustrialHeader';
import { HeroSection } from './components/HeroSection';
import { SawmillPower } from './components/SawmillPower';
import { TimberCatalog } from './components/TimberCatalog';
import { ExportRouteVisualizer } from './components/ExportRouteVisualizer';
import { CargoSimulator } from './components/CargoSimulator';
import { VirtualYardBoard } from './components/VirtualYardBoard';
import { RfqOrderCenter } from './components/RfqOrderCenter';
import { IndustrialFooter } from './components/IndustrialFooter';
import { CertificateModal } from './components/CertificateModal';
import { generateRfqPdf } from './utils/pdfGenerator';
import { EXPORT_DESTINATIONS } from './data/routesData';

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
    const defaultCapacity = specs.transportType === 'container_40hc' ? 50 : 33.5;
    const containersCount = Math.max(1, Math.round(specs.volumeM3 / defaultCapacity));
    setPrefillRfqData({
      transportType: specs.transportType,
      thickness: specs.thickness,
      width: specs.width,
      length: specs.length,
      moisture: specs.moisture,
      approxVolumeM3: specs.volumeM3,
      volumeContainers: containersCount,
      incoterm: specs.transportType === 'container_40hc' ? 'CIF' : 'DAP',
      treatments: specs.moisture === 'kd_18'
        ? ['KD 18%', 'HT ISPM-15', 'Anti-UV Foil', 'PET Strapping']
        : ['HT ISPM-15', 'Anti-Blue', 'PET Strapping'],
      specialRequirements: `Stowage Configuration locked: ${specs.bundles} bundles (~${specs.volumeM3} m³, ~${specs.weightTonnes} tonnes)`,
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
      volumeContainers: Math.max(1, Math.round(batch.volumeM3 / 50)),
      treatments: batch.treatment,
      specialRequirements: `Please confirm availability and current pricing for example lot ${batch.batchCode} (${batch.locationName}), ${batch.volumeM3} m³. Estimated dispatch: ${batch.etd}`,
    });
    handleNavigateToSection('rfq');
  };

  // 3. Port Inspector Selection -> Auto-populate RFQ
  const handleSelectDestinationPort = (portName: string) => {
    const portObj = EXPORT_DESTINATIONS.find((p) => p.name === portName || p.id === portName);
    setPrefillRfqData((prev) => ({
      ...prev,
      destinationPort: portName,
      country: portObj ? portObj.country : prev?.country,
      incoterm: 'CIF',
      specialRequirements: `Direct ocean liner booking inquiry to ${portName}. Preferred shipping hub: Port Constanța Sud - Agigea.`,
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
      specialRequirements: `Technical Catalog Selection: ${spec.thickness}×${spec.width}mm, ${spec.length.toFixed(1)}m (${spec.grade})`,
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
    <div className="site-shell">
      {/* 1. Top Utility Status & Language Bar */}
      <TopUtilityBar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* 2. World-Class Corporate Navigation Menu */}
      <IndustrialHeader
        currentLang={currentLang}
        currency={currency}
        onLanguageChange={setCurrentLang}
        onCurrencyChange={setCurrency}
        onOpenCertificateModal={handleOpenCertificateModal}
        onNavigateToSection={handleNavigateToSection}
      />

      {/* Main Content Area: Cohesive 10-Section B2B Architecture */}
      <main className="site-main">
        {/* 3. Editorial Corporate Hero */}
        <HeroSection
          currentLang={currentLang}
          onNavigateToSection={handleNavigateToSection}
        />

        {/* 4. About Holz Expert & Industrial Power (100,000 m² Gălănești Sawmill) */}
        <SawmillPower
          currentLang={currentLang}
        />

        {/* 5. Products & Technical Timber Specifications (EN 1611-1 Standards) */}
        <TimberCatalog
          currentLang={currentLang}
          onSelectSpecForRfq={handleSelectCatalogSpec}
          onOpenPdfDataSheet={handleDownloadTechDataSheet}
        />

        {/* 6. Port Constanța Sud - Agigea Maritime Export Hub */}
        <ExportRouteVisualizer
          currentLang={currentLang}
          onSelectDestinationPort={handleSelectDestinationPort}
        />

        {/* 7. Interactive Cargo Loading Simulator */}
        <CargoSimulator
          currentLang={currentLang}
          onLockInSpecification={handleLockInCargo}
        />

        {/* 8. Live Virtual Yard / Production Batches */}
        <VirtualYardBoard
          currentLang={currentLang}
          onReserveBatch={handleReserveBatchFromYard}
        />

        {/* 9. Enterprise RFQ & Proforma Generator */}
        <RfqOrderCenter
          currentLang={currentLang}
          currency={currency}
          prefillData={prefillRfqData}
        />
      </main>

      {/* 10. Institutional Enterprise Footer */}
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

      {/* Mobile Sticky Quick Action Bar */}
      <aside aria-label="Quick actions" className="mobile-action-bar md:hidden">
        <button
          onClick={() => handleNavigateToSection('simulator')}
          className="button button--quiet mobile-action-bar__secondary"
        >
          <Box aria-hidden="true" />
          <span>{translations[currentLang].nav.simulator}</span>
        </button>
        <button
          onClick={() => handleNavigateToSection('rfq')}
          className="button button--primary mobile-action-bar__primary"
        >
          <span>{translations[currentLang].nav.requestQuoteBtn}</span>
          <ChevronRight aria-hidden="true" />
        </button>
      </aside>
    </div>
  );
}

export default App;
