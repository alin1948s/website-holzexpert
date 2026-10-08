import { describe, it, expect } from 'vitest';
import { generateRfqPdf, cleanPdfText } from '../src/utils/pdfGenerator';
import type { RfqFormData } from '../src/types';

describe('PDF Specification Generator & Typography Suite', () => {
  const sampleRfqData: RfqFormData = {
    companyName: 'Bavaria Holzimport GmbH & Co. KG',
    contactPerson: 'Herr Stefan Müller',
    email: 'stefan.mueller@bavaria-holz.de',
    phoneCountryCode: '+49',
    phoneNumber: '8912345678',
    country: 'Germany',
    destinationPort: 'Hamburg / Rotterdam Port',
    transportType: 'container_40hc',
    incoterm: 'CIF',
    volumeContainers: 3,
    approxVolumeM3: 148.5,
    grade: 'EN1611_CLASS_AB',
    thickness: 48,
    width: 150,
    length: 4.0,
    moisture: 'kd_18',
    treatments: ['Automated Kiln Drying (KD 18%)', 'HT ISPM-15 Heat Treated', 'Anti-UV Wrapped'],
    specialRequirements: 'Pachete tivite, certificat fitosanitar ISPM-15 cu ștampila RO-SV-032. Livrare în Port Constanța.',
    currency: 'EUR',
    deliveryTimeline: '14-21 days from order confirmation',
  };

  it('generates an official RFQ reference matching the format HEI-RFQ-XXXXXX', () => {
    const refCode = generateRfqPdf(sampleRfqData);
    expect(refCode).toMatch(/^HEI-RFQ-\d{6}$/);
  });

  it('correctly transliterates Romanian diacritics and German umlauts to clean printable characters', () => {
    const input = 'Cherestea de molid tivită și uscată KD 18% în Gălănești, Suceava. Calitate A/B pentru München & Nürnberg!';
    const cleaned = cleanPdfText(input);

    expect(cleaned).not.toContain('ș');
    expect(cleaned).not.toContain('ț');
    expect(cleaned).not.toContain('ă');
    expect(cleaned).not.toContain('ü');
    expect(cleaned).toContain('tivita si uscata');
    expect(cleaned).toContain('Galanesti');
    expect(cleaned).toContain('Muenchen & Nuernberg');
  });

  it('handles null, undefined, and empty string without throwing', () => {
    expect(cleanPdfText(null)).toBe('');
    expect(cleanPdfText(undefined)).toBe('');
    expect(cleanPdfText('')).toBe('');
  });

  it('generates proforma PDF with overland mega-truck configuration seamlessly', () => {
    const truckData: RfqFormData = {
      ...sampleRfqData,
      transportType: 'mega_truck_136',
      incoterm: 'DAP',
      volumeContainers: 2,
      approxVolumeM3: 67.0,
    };
    const refCode = generateRfqPdf(truckData);
    expect(refCode).toMatch(/^HEI-RFQ-\d{6}$/);
  });
});
