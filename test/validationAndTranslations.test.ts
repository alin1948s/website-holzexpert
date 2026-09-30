import { describe, it, expect } from 'vitest';
import { rfqSchema } from '../src/utils/validation';
import { translations } from '../src/translations';

describe('B2B RFQ Form Validation Suite', () => {
  const validData = {
    companyName: 'Al-Bawardi Timber & Building Materials LLC',
    contactPerson: 'Eng. Hisham Al-Sabah',
    email: 'hisham@albawardi.sa',
    phoneCountryCode: '+966',
    phoneNumber: '501234567',
    country: 'Saudi Arabia',
    destinationPort: 'Jeddah Islamic Port',
    transportType: 'container_40hc' as const,
    incoterm: 'CIF' as const,
    volumeContainers: 4,
    approxVolumeM3: 200,
    grade: 'EN1611_CLASS_AB' as const,
    thickness: 48,
    width: 150,
    length: 4.0,
    moisture: 'kd_18' as const,
    treatments: ['KD 18%', 'HT ISPM-15'],
    specialRequirements: 'GS1 barcode tags on each bundle',
    currency: 'USD' as const,
    deliveryTimeline: '14-21 days',
  };

  it('validates a complete enterprise export inquiry successfully', () => {
    const parseResult = rfqSchema.safeParse(validData);
    expect(parseResult.success).toBe(true);
  });

  it('rejects inquiry with missing company name', () => {
    const invalid = { ...validData, companyName: '' };
    const parseResult = rfqSchema.safeParse(invalid);
    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      expect(parseResult.error.issues[0].message).toContain('Company name is required');
    }
  });

  it('rejects inquiry with invalid email address', () => {
    const invalid = { ...validData, email: 'not-an-email' };
    const parseResult = rfqSchema.safeParse(invalid);
    expect(parseResult.success).toBe(false);
    if (!parseResult.success) {
      expect(parseResult.error.issues[0].message).toContain('Valid corporate email is required');
    }
  });

  it('rejects inquiry with zero or negative container volume', () => {
    const invalid = { ...validData, volumeContainers: 0 };
    const parseResult = rfqSchema.safeParse(invalid);
    expect(parseResult.success).toBe(false);
  });
});

describe('Multilingual Consistency Suite', () => {
  const supportedLanguages = ['en', 'ro', 'de', 'ar'] as const;
  const requiredSections = [
    'utility',
    'nav',
    'hero',
    'simulator',
    'catalog',
    'infrastructure',
    'logistics',
    'yard',
    'rfq',
    'footer',
  ] as const;

  it('ensures all 4 languages (EN, RO, DE, AR) contain all required translation sections', () => {
    supportedLanguages.forEach((lang) => {
      expect(translations[lang]).toBeDefined();
      requiredSections.forEach((section) => {
        expect(translations[lang][section], `Section ${section} missing in language ${lang}`).toBeDefined();
      });
    });
  });

  it('verifies critical international trading terminology in Arabic translation', () => {
    const arSim = translations.ar.simulator;
    const arHero = translations.ar.hero;
    expect(arSim.container40hc).toContain('40 قدم');
    expect(arHero.headline).toContain('خشب');
    expect(arHero.statTurnover).toContain('مليون');
  });

  it('verifies German export technical terms', () => {
    const deSim = translations.de.simulator;
    expect(deSim.container40hc).toContain('40\' High Cube');
    expect(deSim.kd18).toContain('KD 18%');
  });
});
