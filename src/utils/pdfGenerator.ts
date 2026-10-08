import { jsPDF } from 'jspdf';
import type { RfqFormData } from '../types';
import { COMPANY_DATA } from '../data/companyData';

/**
 * Transliterates diacritics & non-standard characters to clean ASCII
 * so that standard PDF Helvetica prints crisp glyphs without distortion or '?' artifacts.
 */
export function cleanPdfText(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/[șş]/g, 's')
    .replace(/[ȘŞ]/g, 'S')
    .replace(/[țţ]/g, 't')
    .replace(/[ȚŢ]/g, 'T')
    .replace(/[ăâ]/g, 'a')
    .replace(/[ĂÂ]/g, 'A')
    .replace(/[îï]/g, 'i')
    .replace(/[ÎÏ]/g, 'I')
    .replace(/[éèêë]/g, 'e')
    .replace(/[ÉÈÊË]/g, 'E')
    .replace(/[äöü]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue' }[c] || c))
    .replace(/[ÄÖÜ]/g, (c) => ({ Ä: 'Ae', Ö: 'Oe', Ü: 'Ue' }[c] || c))
    .replace(/[ß]/g, 'ss')
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, '-')
    .replace(/[\u0600-\u06FF]/g, ''); // strip unsupported arabic script glyphs in ascii pdf
}

export function generateRfqPdf(data: RfqFormData): string {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const refCode = `HEI-RFQ-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toISOString().split('T')[0];

  // Brand background bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 42, 'F');

  // Accent line
  doc.setFillColor(249, 115, 22); // orange-500
  doc.rect(0, 42, 210, 2.5, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('HOLZ EXPERT INDUSTRY S.R.L.', 14, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(226, 232, 240);
  doc.text('INDUSTRIAL SOFTWOOD SAWMILL & DEEP-SEA MARITIME EXPORT TERMINAL', 14, 22);
  doc.text(
    cleanPdfText(`HQ: ${COMPANY_DATA.headquarters.address}, ${COMPANY_DATA.headquarters.county} | Terminal: Port Constanta Sud - Agigea`),
    14,
    27
  );
  doc.text(
    cleanPdfText(`Fiscal ID: ${COMPANY_DATA.fiscalCode} | Reg: ${COMPANY_DATA.tradeRegister} | Phone: ${COMPANY_DATA.contacts.phoneMain}`),
    14,
    32
  );

  // Document Badge
  doc.setFillColor(249, 115, 22);
  doc.roundedRect(140, 10, 56, 18, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('EXPORT PROFORMA SPEC', 142, 17);
  doc.setFontSize(8);
  doc.text(`REF: ${refCode}`, 142, 24);

  // Subtitle
  let y = 54;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('COMMERCIAL INQUIRY & TECHNICAL TIMBER SPECIFICATION', 14, y);

  y += 6;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(
    cleanPdfText(`Issued on: ${dateStr} | Status: OFFICIAL B2B RFQ | Preferred Currency: ${data.currency}`),
    14,
    y
  );

  // Buyer Info Box
  y += 8;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 34, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. BUYER & CONGLOMERATE PROFILE', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  doc.text(cleanPdfText(`Company Name: ${data.companyName || 'Not specified'}`), 18, y + 13);
  doc.text(cleanPdfText(`Representative: ${data.contactPerson || 'Not specified'}`), 18, y + 19);
  doc.text(cleanPdfText(`Corporate Email: ${data.email || 'Not specified'}`), 18, y + 25);

  doc.text(cleanPdfText(`Country: ${data.country || 'International'}`), 110, y + 13);
  doc.text(cleanPdfText(`Phone / WhatsApp: ${data.phoneCountryCode} ${data.phoneNumber}`), 110, y + 19);
  doc.text(cleanPdfText(`Discharge Port (POD): ${data.destinationPort || 'Direct Port Delivery'}`), 110, y + 25);

  // Logistics & Freight Parameters
  y += 40;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 36, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. LOGISTICS CORRIDOR & INCOTERMS DELIVERY', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);

  const transportLabel = data.transportType === 'container_40hc'
    ? "Maritime 40' High Cube Ocean Container"
    : "Standard European Mega-Tautliner (13.6m)";

  doc.text(cleanPdfText(`Freight Mode: ${transportLabel}`), 18, y + 13);
  doc.text(cleanPdfText(`Incoterm Requested: ${data.incoterm} (${data.incoterm === 'FOB' ? 'Port Constanta Sud' : data.destinationPort})`), 18, y + 19);
  doc.text(cleanPdfText(`Requested Volume: ${data.volumeContainers} ${data.transportType === 'container_40hc' ? "Container(s) 40' HC" : "Mega-Truck(s)"}`), 18, y + 25);
  doc.text(cleanPdfText(`Approx Net Cargo Volume: ~${data.approxVolumeM3} m3`), 18, y + 31);

  doc.text(cleanPdfText('Origin Sawmill: Galanesti Platform, Suceava, RO'), 110, y + 13);
  doc.text(cleanPdfText('Export Port: Constanta Sud - Agigea Terminal'), 110, y + 19);
  doc.text(cleanPdfText(`Estimated Delivery Window: ${data.deliveryTimeline || 'Within 14-21 days of L/C / DP'}`), 110, y + 25);
  doc.text(cleanPdfText('Customs Tracking: Bill of Lading (B/L) & EUR.1 / ATR'), 110, y + 31);

  // Technical Timber Specifications Table
  y += 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. TIMBER GRADE, DIMENSIONS & PROCESSING PROTOCOL', 14, y);

  y += 4;
  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y, 182, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('PARAMETER', 18, y + 5);
  doc.text('AGREED SPECIFICATION DETAIL', 90, y + 5);

  const treatmentsText = data.treatments && data.treatments.length > 0
    ? data.treatments.join(', ')
    : 'Anti-UV plastic hooded top & heavy PET strapped bundles';

  const rows = [
    ['Botanical Wood Species', 'Picea Abies (Carpathian Spruce / White Wood)'],
    ['European Quality Grade', `${cleanPdfText(data.grade)} (Visual grading according to EN 1611-1:2002)`],
    ['Nominal Cross-Section', `${data.thickness}mm (T) x ${data.width}mm (W) x ${data.length}m (L)`],
    ['Moisture Equilibrium', data.moisture === 'kd_18' ? 'KD 18% +/- 2% (Automated Muhlboeck Kiln Dried)' : 'Fresh Cut / Green (Log Run)'],
    ['Phytosanitary Standard', 'HT ISPM-15 Heat Treated (56 deg C / 30 min minimum core)'],
    ['Chain of Custody', 'FSC 100% Certified (FSC-C119854) - 100% Carpathian Forest'],
    ['Protection & Packaging', cleanPdfText(treatmentsText)],
  ];

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);

  rows.forEach((row, idx) => {
    if (idx % 2 === 0) {
      doc.setFillColor(241, 245, 249);
      doc.rect(14, y, 182, 6, 'F');
    }
    doc.text(cleanPdfText(row[0]), 18, y + 4.2);
    doc.text(cleanPdfText(row[1]), 90, y + 4.2);
    y += 6;
  });

  // Buyer Special Requirements
  if (data.specialRequirements) {
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Client Special Packaging / Port Notes:', 14, y);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(cleanPdfText(data.specialRequirements.slice(0, 180)), 14, y + 5);
    y += 8;
  } else {
    y += 2;
  }

  // Official Seal & Signatures
  y += 10;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 196, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('AUTHORIZED COMMERCIAL BOARD', 18, y);
  doc.text('CONFIRMATION & BUYER ACKNOWLEDGMENT', 110, y);

  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Holz Expert Industry S.R.L. - Export Board', 18, y + 4);
  doc.text('Direct: sales@holzexpert.com | +40 751 012 082', 18, y + 8);
  doc.text('Constanta Port Terminal Staging Division', 18, y + 12);

  doc.text('Authorized Corporate Signature & Stamp:', 110, y + 4);
  doc.rect(110, y + 8, 65, 16);
  doc.text('[ Stamp / Authorized Electronic Signature ]', 114, y + 17);

  // Footer Disclaimer
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 282, 210, 15, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text('This document constitutes an official preliminary export specification sheet issued by Holz Expert Industry S.R.L.', 14, 287);
  doc.text('Subject to vessel slot booking and phytosanitary container stuffing confirmation at Port Constanta Sud - Agigea.', 14, 291);

  // Save / Return data uri or trigger download
  const filename = `HolzExpert_Specification_${refCode}.pdf`;
  if (typeof window !== 'undefined' && typeof doc.save === 'function') {
    try {
      doc.save(filename);
    } catch {
      // In SSR or non-standard environments
    }
  }
  return refCode;
}
