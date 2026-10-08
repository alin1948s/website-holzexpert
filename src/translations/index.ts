import type { Language } from '../types';

export const translations: Record<Language, {
  utility: {
    terminalStatus: string;
    terminalActive: string;
    directExportDesk: string;
    switchCurrency: string;
  };
  nav: {
    company: string;
    sawmill: string;
    specs: string;
    simulator: string;
    virtualYard: string;
    logistics: string;
    rfq: string;
    fscBadge: string;
    callDirect: string;
    requestQuoteBtn: string;
  };
  hero: {
    badge: string;
    headline: string;
    headlineHighlight: string;
    subheadline: string;
    ctaSimulator: string;
    ctaQuote: string;
    statTurnover: string;
    statTurnoverLabel: string;
    statSawing: string;
    statSawingLabel: string;
    statMaritime: string;
    statMaritimeLabel: string;
    statFsc: string;
    statFscLabel: string;
  };
  simulator: {
    sectionBadge: string;
    title: string;
    subtitle: string;
    transportMode: string;
    container40hc: string;
    truckMega: string;
    selectDimensions: string;
    thickness: string;
    width: string;
    length: string;
    moistureCondition: string;
    kd18: string;
    kd18Desc: string;
    freshCut: string;
    freshCutDesc: string;
    bundleQty: string;
    telemetry: string;
    totalVolume: string;
    grossWeight: string;
    spaceUtilized: string;
    weightUtilized: string;
    piecesCount: string;
    standardBundles: string;
    statusSafe: string;
    statusWarning: string;
    statusOverweight: string;
    lockInCta: string;
    visualPreview: string;
    topView: string;
    crossSection: string;
    specsBadge: string;
  };
  catalog: {
    sectionBadge: string;
    title: string;
    subtitle: string;
    enStandardBadge: string;
    gradeA: string;
    gradeAdesc: string;
    gradeAB: string;
    gradeABdesc: string;
    gradeBC: string;
    gradeBCdesc: string;
    treatmentsTitle: string;
    treatmentKd: string;
    treatmentHt: string;
    treatmentAntiBlue: string;
    dimensionMatrix: string;
    metricImperialToggle: string;
    downloadTechSheet: string;
  };
  infrastructure: {
    sectionBadge: string;
    title: string;
    subtitle: string;
    feature1Title: string;
    feature1Desc: string;
    feature2Title: string;
    feature2Desc: string;
    feature3Title: string;
    feature3Desc: string;
    feature4Title: string;
    feature4Desc: string;
    annualLogs: string;
    dryKilnCapacity: string;
    landArea: string;
    automatedLines: string;
  };
  logistics: {
    sectionBadge: string;
    title: string;
    subtitle: string;
    corridorTitle: string;
    nodeGalanesti: string;
    nodeGalanestiDesc: string;
    nodeOverland: string;
    nodeOverlandDesc: string;
    nodeConstanta: string;
    nodeConstantaDesc: string;
    nodeGlobal: string;
    nodeGlobalDesc: string;
    transitTimesTitle: string;
    clickToInspect: string;
    incotermsOffered: string;
    frequency: string;
  };
  yard: {
    sectionBadge: string;
    title: string;
    subtitle: string;
    disclaimer: string;
    filterAll: string;
    filterKd: string;
    filterPort: string;
    filterTransit: string;
    colLot: string;
    colSpec: string;
    colGrade: string;
    colMoisture: string;
    colVolume: string;
    colLocation: string;
    colEtd: string;
    colStatus: string;
    colAction: string;
    reserveBtn: string;
    statusAvailable: string;
    statusReserved: string;
    statusLimited: string;
  };
  rfq: {
    sectionBadge: string;
    title: string;
    subtitle: string;
    companyDetails: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    country: string;
    destinationPort: string;
    cargoDetails: string;
    transportMode: string;
    volumeCount: string;
    incoterm: string;
    grade: string;
    dimensions: string;
    moisture: string;
    treatments: string;
    specialReq: string;
    submitQuote: string;
    downloadPdf: string;
    submitting: string;
    submitError: string;
    successTitle: string;
    successMessage: string;
  };
  footer: {
    legalName: string;
    hqAddress: string;
    terminalAddress: string;
    vatNumber: string;
    regNumber: string;
    certifications: string;
    fscTitle: string;
    ispmTitle: string;
    enTitle: string;
    directDesk: string;
    rights: string;
  };
}> = {
  en: {
    utility: {
      terminalStatus: "Port Constanța Sud - Agigea Terminal",
      terminalActive: "OPERATIONAL • 24/7 CONTAINER STUFFING",
      directExportDesk: "Direct Export Desk:",
      switchCurrency: "Trading Currency",
    },
    nav: {
      company: "The Enterprise",
      sawmill: "Industrial Power",
      specs: "Spruce Specs",
      simulator: "Cargo Simulator",
      virtualYard: "Example Lots",
      logistics: "Maritime Corridors",
      rfq: "Export RFQ",
      fscBadge: "FSC® 100% Chain-of-Custody",
      callDirect: "Call Trading Desk",
      requestQuoteBtn: "Request Container RFQ",
    },
    hero: {
      badge: "EUROPEAN WHITE WOOD / SPRUCE EXPORTER",
      headline: "Industrial Scale Softwood & Spruce Timber.",
      headlineHighlight: "Engineered for Global Maritime Export.",
      subheadline: "From sustainably certified Romanian Carpathian forests to major international ports. Over 70,000 m³ annual finished output with proprietary ocean terminal operations in Port Constanța.",
      ctaSimulator: "Launch 3D Cargo Simulator",
      ctaQuote: "Request Container Spot Quote",
      statTurnover: "50M+ RON",
      statTurnoverLabel: "Annual Turnover (>€10M)",
      statSawing: "100,000 m³",
      statSawingLabel: "Annual Log Sawing Capacity",
      statMaritime: "40' HC Ocean",
      statMaritimeLabel: "Deep-Sea Export Terminal",
      statFsc: "FSC® & ISPM-15",
      statFscLabel: "Official Certified Supply Chain",
    },
    simulator: {
      sectionBadge: "CARGO PLANNER",
      title: "Plan a container load",
      subtitle: "Set timber dimensions and bundle count. The calculator checks volume and payload as you work.",
      transportMode: "Select Transport Mode",
      container40hc: "40' High Cube Ocean Container (~50 m³ payload / 26.5t limit)",
      truckMega: "Standard Mega Tautliner Truck 13.6m (~33 m³ payload / 24.0t limit)",
      selectDimensions: "Select Timber Cross-Section",
      thickness: "Thickness",
      width: "Width",
      length: "Length",
      moistureCondition: "Moisture Condition & Density",
      kd18: "KD 18% (Industrial Kiln Dried)",
      kd18Desc: "Automated Mühlböck kilns. Density ~450 kg/m³. Anti-mold guaranteed.",
      freshCut: "Fresh Cut / Wet (Unseasoned)",
      freshCutDesc: "Green timber straight from log sawing. Density ~750 kg/m³.",
      bundleQty: "Standard Bundles Quantity",
      telemetry: "Real-Time Payload Telemetry",
      totalVolume: "Total Net Volume",
      grossWeight: "Cargo Net Weight",
      spaceUtilized: "Volumetric Space Ratio",
      weightUtilized: "Legal Payload Weight Ratio",
      piecesCount: "Calculated Board Count",
      standardBundles: "Export Bundles",
      statusSafe: "OPTIMIZED WITHIN MARITIME SAFETY MARGINS",
      statusWarning: "APPROACHING MAXIMUM VOLUME / AXLE LIMIT",
      statusOverweight: "EXCEEDS MAXIMUM LEGAL ROAD/RAIL WEIGHT LIMIT",
      lockInCta: "Lock In Specification & Request Official CIF/FOB Offer",
      visualPreview: "Interactive 2.5D Stowage Visualizer",
      topView: "Top Stowage Plan",
      crossSection: "Transverse Cross-Section",
      specsBadge: "INDUSTRIAL EXPORT BUNDLE SPECIFICATION",
    },
    catalog: {
      sectionBadge: "PRODUCT RANGE · EN 1611-1",
      title: "Timber, graded to your specification",
      subtitle: "Compare grades, standard sizes and export treatments. Custom cuts are available on request.",
      enStandardBadge: "Certified to EN 1611-1 Standards",
      gradeA: "Class A (Select Joinery / S4S Visible)",
      gradeAdesc: "Sound tight knots only, no black or falling knots, zero wane. Optimal for structural visible beams, doors, windows, and luxury architectural carpentry.",
      gradeAB: "Class A/B (Commercial & Structural Export)",
      gradeABdesc: "Standard Middle East & Gulf export specification. Sound firm knots, negligible wane, kiln-dried KD 18% with anti-stain treatment.",
      gradeBC: "Class B/C (Industrial Packaging & Pallets)",
      gradeBCdesc: "Economic grade for cable drums, packaging crates, heavy equipment pallets, and concrete formwork applications.",
      treatmentsTitle: "Certified Industrial Wood Treatments",
      treatmentKd: "Automated Kiln Drying (KD 18% ± 2%)",
      treatmentHt: "Heat Treatment ISPM-15 (56°C / 30 min minimum core)",
      treatmentAntiBlue: "Anti-Stain Anti-Blue Dipping Protection",
      dimensionMatrix: "Standard Export Dimensions (Stock & Custom Cut)",
      metricImperialToggle: "Metric (mm / m) / Imperial (in / ft)",
      downloadTechSheet: "Download Technical Data Sheet (PDF)",
    },
    infrastructure: {
      sectionBadge: "THE MILL",
      title: "Made in Gălănești. Ready for export.",
      subtitle: "Spruce timber is sawn, dried and prepared for shipment at our mill in Suceava County.",
      feature1Title: "Automated Primary Breakdown",
      feature1Desc: "High-capacity Linck & Primultini bandsaw lines with laser-guided 3D log scanning for maximized grain orientation.",
      feature2Title: "Mühlböck Automated Kiln Cells",
      feature2Desc: "Advanced vacuum and thermal chambers regulating equilibrium moisture content to precise KD 18% export standard.",
      feature3Title: "Robotic Packaging & Barcoding",
      feature3Desc: "Every bundle is plastic-strapped, capped with waterproof anti-UV foil, and labeled with GS1 barcode tracking.",
      feature4Title: "FSC® 100% Chain-of-Custody",
      feature4Desc: "Strict roundwood sourcing exclusively from sustainably certified Carpathian forest holdings in Northern Romania.",
      annualLogs: "100,000 m³ / yr Sawing Capacity",
      dryKilnCapacity: "3,500 m³ / month Kiln Output",
      landArea: "100,000 m² Sawmill Complex",
      automatedLines: "4 Fully Automated Lines",
    },
    logistics: {
      sectionBadge: "MILL · PORT · SEA",
      title: "From Gălănești to your port",
      subtitle: "Road and rail connect our Suceava mill to the Agigea export terminal and onward shipping routes.",
      corridorTitle: "The Holz Expert Supply Chain Corridor",
      nodeGalanesti: "1. Gălănești Mill (Suceava)",
      nodeGalanestiDesc: "Harvested FSC logs sawn, steamed, kiln-dried to 18%, sorted, and bundled with protective foil.",
      nodeOverland: "2. Overland Freight Corridor",
      nodeOverlandDesc: "Express rail and dedicated tautliner fleet transit from Suceava straight to Black Sea terminals.",
      nodeConstanta: "3. Hub Port Constanța Sud - Agigea",
      nodeConstantaDesc: "Container stuffing, ISPM-15 phytosanitary inspection, customs clearance, and Bill of Lading (B/L) release.",
      nodeGlobal: "4. Global Ocean Line Shipping",
      nodeGlobalDesc: "Direct feeder and mainline services via Maersk, MSC, CMA-CGM to Gulf, Middle East, and Mediterranean ports.",
      transitTimesTitle: "Transit Times & Available Port Incoterms",
      clickToInspect: "Click any destination port to review maritime transit days, direct shipping lines, and accepted Incoterms.",
      incotermsOffered: "Supported Incoterms:",
      frequency: "Sailings Frequency:",
    },
    yard: {
      sectionBadge: "BATCH EXAMPLES",
      title: "Explore export-ready specifications",
      subtitle: "Browse example timber lots by size, grade and shipping stage. Ask our team to confirm current stock and pricing.",
      disclaimer: "Illustrative batch data. Confirm current availability and pricing with our export team.",
      filterAll: "All stages",
      filterKd: "Drying",
      filterPort: "At port",
      filterTransit: "In transit",
      colLot: "Batch Code",
      colSpec: "Dimensions (T×W×L)",
      colGrade: "Grade (EN 1611-1)",
      colMoisture: "Moisture",
      colVolume: "Volume (m³)",
      colLocation: "Staging Location",
      colEtd: "Estimated ETD",
      colStatus: "Allocation Status",
      colAction: "Inquire / Reserve",
      reserveBtn: "Ask about lot",
      statusAvailable: "AVAILABLE",
      statusReserved: "RESERVED",
      statusLimited: "LIMITED STOCK",
    },
    rfq: {
      sectionBadge: "DIRECT EXPORT DESK",
      title: "Tell us what you need",
      subtitle: "Share your timber specification, volume and destination. Our export team will prepare a tailored quotation.",
      companyDetails: "Buyer Corporate Credentials",
      companyName: "Company Name (Legal Entity)",
      contactPerson: "Procurement / Commercial Officer",
      email: "Corporate Email Address",
      phone: "Direct Mobile / WhatsApp (International)",
      country: "Destination Country",
      destinationPort: "Discharge Port (POD)",
      cargoDetails: "Cargo & Logistics Parameters",
      transportMode: "Freight Configuration",
      volumeCount: "Volume Required (Containers or Trucks)",
      incoterm: "Incoterm Condition",
      grade: "EN 1611-1 Grade",
      dimensions: "Selected Cross-Section",
      moisture: "Moisture Requirement",
      treatments: "Additional Processing Treatments",
      specialReq: "Specific Packaging, Custom Marking, or Port Delivery Instructions",
      submitQuote: "Submit Official RFQ to Commercial Board",
      downloadPdf: "Export RFQ as Technical PDF Specification",
      submitting: "Transmitting RFQ & Generating Manifest...",
      submitError: "We couldn't save your request. Please try again or email sales@holzexpert.com.",
      successTitle: "RFQ Recorded Successfully!",
      successMessage: "Your request has been saved with an internal tracking reference. Our commercial team will review it and follow up with a CIF/FOB quotation.",
    },
    footer: {
      legalName: "Holz Expert Industry S.R.L.",
      hqAddress: "HQ & Sawmill: Gălănești nr. 346, Suceava County, 727280, Romania",
      terminalAddress: "Export Terminal: Port Constanța Sud - Agigea, Container Staging Yard, Romania",
      vatNumber: "VAT ID: RO 24657150 | Reg: J33/1785/2008",
      regNumber: "Annual Timber Processing: >70,000 m³ KD Softwood",
      certifications: "Official Certifications & Accreditations",
      fscTitle: "FSC®-C119854 Certified CoC",
      ispmTitle: "ISPM-15 Phytosanitary Ro-SV-032",
      enTitle: "EN 1611-1 European Softwood Standard",
      directDesk: "Commercial & Logistics Direct Desk",
      rights: "All rights reserved. Specialized international softwood timber export platform.",
    },
  },
  ro: {
    utility: {
      terminalStatus: "Terminal Port Constanța Sud - Agigea",
      terminalActive: "OPERATIONAL • ÎNCĂRCARE CONTAINERE 24/7",
      directExportDesk: "Birou Export Direct:",
      switchCurrency: "Monedă Tranzacționare",
    },
    nav: {
      company: "Compania",
      sawmill: "Capacitate Industrială",
      specs: "Specificații Molid",
      simulator: "Simulator Cargo",
      virtualYard: "Loturi exemplu",
      logistics: "Coridoare Maritime",
      rfq: "Cerere Cotație RFQ",
      fscBadge: "FSC® 100% Chain-of-Custody",
      callDirect: "Apelează Birou Vânzări",
      requestQuoteBtn: "Cere Ofertă Containere",
    },
    hero: {
      badge: "PRODUCĂTOR & EXPORTATOR MAJOR CHERESTEA RĂȘINOASE",
      headline: "Cherestea de Molid la Scară Industrială.",
      headlineHighlight: "Optimizată pentru Export Maritim Global.",
      subheadline: "Din pădurile carpatine gestionate sustenabil direct către marile porturi ale lumii. Peste 70.000 m³ cherestea finită anual cu operațiuni logistice integrate în Portul Constanța.",
      ctaSimulator: "Deschide Simulatorul 3D",
      ctaQuote: "Solicită Cotație Spot CIF/FOB",
      statTurnover: "50M+ RON",
      statTurnoverLabel: "Cifră de Afaceri (>10 Milioane EUR)",
      statSawing: "100.000 m³",
      statSawingLabel: "Capacitate Anuală Debitare Bușteni",
      statMaritime: "Containere 40' HC",
      statMaritimeLabel: "Terminal Maritim Propriu Constanța",
      statFsc: "FSC® & ISPM-15",
      statFscLabel: "Lanț de Aprovizionare Certificat",
    },
    simulator: {
      sectionBadge: "PLANIFICATOR DE ÎNCĂRCARE",
      title: "Planifică încărcarea unui container",
      subtitle: "Alege dimensiunile și numărul de pachete. Calculatorul verifică volumul și sarcina pe măsură ce lucrezi.",
      transportMode: "Selectează Tipul de Transport",
      container40hc: "Container Maritim 40' High Cube (~50 m³ volum util / 26.5t limită)",
      truckMega: "Camion Prelată Mega 13.6m (~33 m³ volum util / 24.0t limită)",
      selectDimensions: "Selectează Secțiunea Cherestelei",
      thickness: "Grosime",
      width: "Lățime",
      length: "Lungime",
      moistureCondition: "Condiție Umiditate & Densitate",
      kd18: "KD 18% (Uscat Industrial în Celule Mühlböck)",
      kd18Desc: "Uscare tehnică controlată. Densitate ~450 kg/m³. Garanție anti-mucegai.",
      freshCut: "Verde / Proaspăt Debitat (Umiditate Naturală)",
      freshCutDesc: "Debit direct din buștean proaspăt. Densitate ~750 kg/m³.",
      bundleQty: "Număr Pachete Standardizate",
      telemetry: "Telemetrie Încărcătură în Timp Real",
      totalVolume: "Volum Total Net",
      grossWeight: "Greutate Netă Marfă",
      spaceUtilized: "Grad de Ocupare Spațiu",
      weightUtilized: "Grad de Încărcare Greutate",
      piecesCount: "Număr Bucăți Rezultate",
      standardBundles: "Pachete Export",
      statusSafe: "OPTIMIZAT ÎN LIMITELE DE SIGURANȚĂ MARITIMĂ",
      statusWarning: "SE APROPIE DE CAPACITATEA MAXIMĂ ADMISĂ",
      statusOverweight: "DEPĂȘEȘTE GREUTATEA LEGALĂ RUTIERĂ/FEROVIARĂ",
      lockInCta: "Blochează Specificația & Solicită Cotație CIF/FOB",
      visualPreview: "Secțiune Vizuală Interactivă de Încărcare",
      topView: "Plan Superior de Aranjare",
      crossSection: "Secțiune Transversală Container",
      specsBadge: "FIȘĂ TEHNICĂ PACHET STANDARD EXPORT",
    },
    catalog: {
      sectionBadge: "GAMĂ DE PRODUSE · EN 1611-1",
      title: "Cherestea sortată după cerințele tale",
      subtitle: "Compară clasele, dimensiunile standard și tratamentele pentru export. Debităm și la comandă.",
      enStandardBadge: "Certificat Conform Standardului EN 1611-1",
      gradeA: "Clasa A (Tâmplărie / Fără Defecte Vizibile)",
      gradeAdesc: "Noduri sănătoase concrescute mici, fără noduri căzătoare, fără inimă roșie, fără teșitură. Ideală pentru profile expuse, uși, ferestre și mobilier superior.",
      gradeAB: "Clasa A/B (Construcții & Export Comercial)",
      gradeABdesc: "Specificația standard pentru export maritim în Golf și Orient. Noduri sănătoase admise, teșitură minimă, uscat KD 18% și tratat anti-pătare.",
      gradeBC: "Clasa B/C (Ambalaje Industriale & Paleți)",
      gradeBCdesc: "Calitate economică pentru producția de tamburi cabluri, lăzi industriale de transport, paleți de mare tonaj și cofraje.",
      treatmentsTitle: "Tratamente Industriale Atestate",
      treatmentKd: "Uscare Tehnică Automatizată (KD 18% ± 2%)",
      treatmentHt: "Tratament Termic Fitosanitar HT ISPM-15 (56°C / 30 min)",
      treatmentAntiBlue: "Impregnare Chimică Anti-Mucegai Albastru",
      dimensionMatrix: "Matrice Dimensiuni Standard Export",
      metricImperialToggle: "Metric (mm / m) / Imperial (in / ft)",
      downloadTechSheet: "Descarcă Fișa Tehnică (PDF)",
    },
    infrastructure: {
      sectionBadge: "FABRICA",
      title: "Prelucrat la Gălănești. Pregătit pentru export.",
      subtitle: "Cheresteaua este debitată, uscată și pregătită pentru transport la fabrica noastră din județul Suceava.",
      feature1Title: "Debit Primar Automatizat",
      feature1Desc: "Linii de fierăstraie panglică Linck și Primultini cu scanare 3D laser pentru maximizarea randamentului fibrei lemnoase.",
      feature2Title: "Celule de Uscare Mühlböck",
      feature2Desc: "Sistem computerizat de control termic și higrometric pentru atingerea precisă a umidității KD 18%.",
      feature3Title: "Pachetare cu Folie Anti-UV",
      feature3Desc: "Fiecare pachet este legat cu bandă PET de înaltă rezistență, căpăcit cu folie impermeabilă și etichetat cu cod de bare GS1.",
      feature4Title: "Trasabilitate 100% FSC®",
      feature4Desc: "Aprovizionare exclusivă din exploatări certificate durabil din Bucovina și nordul Carpaților Orientali.",
      annualLogs: "100.000 m³ / an Capacitate Debitare",
      dryKilnCapacity: "3.500 m³ / lună Capacitate Uscare",
      landArea: "100.000 m² Suprafață Platformă",
      automatedLines: "4 Linii de Producție Integrate",
    },
    logistics: {
      sectionBadge: "FABRICĂ · PORT · MARE",
      title: "Din Gălănești către portul tău",
      subtitle: "Drumul și calea ferată leagă fabrica din Suceava de terminalul de export din Agigea și de rutele maritime.",
      corridorTitle: "Coridorul Logistic Holz Expert",
      nodeGalanesti: "1. Fabrica Gălănești (Suceava)",
      nodeGalanestiDesc: "Bușteni FSC debitați, uscați KD 18%, pachetați și etichetați pentru export maritim.",
      nodeOverland: "2. Coridor Terestru Rutier/Feroviar",
      nodeOverlandDesc: "Flotă dedicată și transport feroviar direct către litoralul Mării Negre.",
      nodeConstanta: "3. Hub Port Constanța Sud - Agigea",
      nodeConstantaDesc: "Stuffing containere maritime 40' HC, inspecție fitosanitară ISPM-15, vămuire și emitere B/L.",
      nodeGlobal: "4. Linii Maritime Transoceanice",
      nodeGlobalDesc: "Plecări directe săptămânale prin Maersk, MSC, CMA-CGM către Golf, Marea Roșie și Mediterana.",
      transitTimesTitle: "Timpi de Tranzit & Incoterms Acceptate",
      clickToInspect: "Selectează orice port pentru a vizualiza durata tranzitului maritim, liniile active și Incoterms disponibile.",
      incotermsOffered: "Incoterms Disponibile:",
      frequency: "Frecvență Plecări:",
    },
    yard: {
      sectionBadge: "EXEMPLE DE LOTURI",
      title: "Explorează specificații pentru export",
      subtitle: "Răsfoiește exemple de loturi după dimensiune, clasă și etapă de livrare. Cere echipei confirmarea stocului și a prețului actual.",
      disclaimer: "Loturile sunt exemple. Cere echipei confirmarea stocului și a prețului actual.",
      filterAll: "Toate etapele",
      filterKd: "La uscare",
      filterPort: "În port",
      filterTransit: "În tranzit",
      colLot: "Cod Lot",
      colSpec: "Dimensiuni (G×L×L)",
      colGrade: "Calitate (EN 1611-1)",
      colMoisture: "Umiditate",
      colVolume: "Volum (m³)",
      colLocation: "Locație Lot",
      colEtd: "Data Estimată (ETD)",
      colStatus: "Disponibilitate",
      colAction: "Rezervă / Solicită",
      reserveBtn: "Întreabă de lot",
      statusAvailable: "DISPONIBIL",
      statusReserved: "REZERVAT",
      statusLimited: "STOC LIMITAT",
    },
    rfq: {
      sectionBadge: "BIROU EXPORT DIRECT",
      title: "Spune-ne de ce ai nevoie",
      subtitle: "Trimite dimensiunile, volumul și portul de destinație. Echipa de export pregătește o ofertă potrivită cererii tale.",
      companyDetails: "Date Identificare Companie Cumpărătoare",
      companyName: "Nume Companie (Denumire Legală)",
      contactPerson: "Persoană de Contact / Achiziții",
      email: "Adresă de Email Corporativă",
      phone: "Telefon Mobil / WhatsApp (Internațional)",
      country: "Țară de Destinație",
      destinationPort: "Port de Descărcare (POD)",
      cargoDetails: "Parametri Marfă & Logistică",
      transportMode: "Modalitate de Transport",
      volumeCount: "Cantitate (Containere sau Camioane)",
      incoterm: "Condiție Incoterm Solicitată",
      grade: "Clasă de Calitate EN 1611-1",
      dimensions: "Secțiune Lemn Selectată",
      moisture: "Condiție de Umiditate",
      treatments: "Tratamente Speciale Cerute",
      specialReq: "Instrucțiuni Specifice de Ambalare sau Livrare",
      submitQuote: "Transmite Cererea Fermă către Departamentul Comercial",
      downloadPdf: "Descarcă Fișa Tehnică RFQ (Format PDF)",
      submitting: "Se transmite cererea și se generează fișa...",
      submitError: "Cererea nu a putut fi salvată. Încearcă din nou sau scrie la sales@holzexpert.com.",
      successTitle: "Cererea a Fost Înregistrată cu Succes!",
      successMessage: "Solicitarea a fost înregistrată cu un cod intern. Echipa comercială o va verifica și va reveni cu o ofertă CIF/FOB.",
    },
    footer: {
      legalName: "Holz Expert Industry S.R.L.",
      hqAddress: "Sediu & Fabrică: Gălănești nr. 346, Jud. Suceava, 727280, România",
      terminalAddress: "Terminal Export: Port Constanța Sud - Agigea, Depozit Containere, România",
      vatNumber: "CUI: RO 24657150 | Reg. Com: J33/1785/2008",
      regNumber: "Debit Anual Cherestea: >70.000 m³ Rășinoase KD",
      certifications: "Certificări & Acreditări Oficiale",
      fscTitle: "Certificat FSC®-C119854 Chain of Custody",
      ispmTitle: "Autorizație Fitosanitară ISPM-15 Ro-SV-032",
      enTitle: "Standard Calitate Cherestea EN 1611-1",
      directDesk: "Biroul Comercial Direct de Export",
      rights: "Toate drepturile rezervate. Platformă industrială dedicată tradingului internațional de cherestea.",
    },
  },
  de: {
    utility: {
      terminalStatus: "Seehafen Constanța Süd - Agigea Terminal",
      terminalActive: "OPERATIV • 24/7 CONTAINERVERLADUNG",
      directExportDesk: "Direkter Export-Desk:",
      switchCurrency: "Handelswährung",
    },
    nav: {
      company: "Das Unternehmen",
      sawmill: "Industrielle Kapazität",
      specs: "Fichtenholz-Spezifikationen",
      simulator: "Fracht-Simulator",
      virtualYard: "Beispielchargen",
      logistics: "Seekorridore",
      rfq: "Export-RFQ",
      fscBadge: "FSC® 100% Chain-of-Custody",
      callDirect: "Export-Desk Anrufen",
      requestQuoteBtn: "Container-Angebot Anfordern",
    },
    hero: {
      badge: "EUROPÄISCHER EXPORTEUR VON FICHTEN-SCHNITTHOLZ",
      headline: "Industrielles Nadelholz & Fichten-Schnittholz.",
      headlineHighlight: "Prädestiniert für den Globalen See-Export.",
      subheadline: "Aus nachhaltig bewirtschafteten rumänischen Karpatenwäldern direkt in die Welthäfen. Über 70.000 m³ jährliche Schnittholzproduktion mit eigener Seeterminal-Logistik im Hafen Constanța.",
      ctaSimulator: "3D-Ladesimulator Starten",
      ctaQuote: "Spot-Angebot CIF/FOB Anfordern",
      statTurnover: "50M+ RON",
      statTurnoverLabel: "Jahresumsatz (>10 Mio. EUR)",
      statSawing: "100.000 m³",
      statSawingLabel: "Jährlicher Rundholzeinschnitt",
      statMaritime: "40' HC Seefracht",
      statMaritimeLabel: "Eigenes Tiefsee-Exportterminal",
      statFsc: "FSC® & ISPM-15",
      statFscLabel: "Zertifizierte Lieferkette",
    },
    simulator: {
      sectionBadge: "LADUNGSPLANER",
      title: "Containerladung planen",
      subtitle: "Abmessungen und Paketanzahl wählen. Der Rechner prüft Volumen und Nutzlast während der Eingabe.",
      transportMode: "Transportmittel Wählen",
      container40hc: "40' High Cube Seecontainer (~50 m³ Nutzvolumen / 26,5t Limit)",
      truckMega: "Standard Mega-Tautliner 13,6m (~33 m³ Nutzvolumen / 24,0t Limit)",
      selectDimensions: "Holzquerschnitt Auswählen",
      thickness: "Stärke",
      width: "Breite",
      length: "Länge",
      moistureCondition: "Holzfeuchte & Raumgewicht",
      kd18: "KD 18% (Technisch Getrocknet)",
      kd18Desc: "Automatisierte Mühlböck-Trockenkammern. Dichte ~450 kg/m³.",
      freshCut: "Frisch Eingeschnitten / Nass",
      freshCutDesc: "Waldfrisches Schnittholz. Dichte ~750 kg/m³.",
      bundleQty: "Anzahl Exportpakete",
      telemetry: "Echtzeit-Telemetrie der Ladung",
      totalVolume: "Gesamtes Nettovolumen",
      grossWeight: "Nettogewicht Ladung",
      spaceUtilized: "Raumausnutzung",
      weightUtilized: "Gewichtsausnutzung",
      piecesCount: "Stückzahl Bretter",
      standardBundles: "Export-Pakete",
      statusSafe: "OPTIMIERT INNERHALB SICHERHEITSGRENZEN",
      statusWarning: "NÄHERT SICH DER HÖCHSTGRENZE",
      statusOverweight: "ÜBERSCHREITET ZULÄSSIGES STRASSENGEWICHT",
      lockInCta: "Spezifikation Sperren & CIF/FOB Angebot Anfordern",
      visualPreview: "Visuelle Schnittstellenansicht",
      topView: "Draufsicht Stauplan",
      crossSection: "Querschnitt Container",
      specsBadge: "TECHNISCHE SPEZIFIKATION EXPORTPAKET",
    },
    catalog: {
      sectionBadge: "SORTIMENT · EN 1611-1",
      title: "Schnittholz nach Ihren Vorgaben",
      subtitle: "Qualitäten, Standardmaße und Behandlungen vergleichen. Zuschnitt auf Anfrage.",
      enStandardBadge: "Zertifiziert nach EN 1611-1",
      gradeA: "Klasse A (Tischlerqualität / Sichtqualität)",
      gradeAdesc: "Ausschließlich gesunde feste Äste, keine Ausfalläste, splintfrei. Ideal für sichtbare Konstruktionen, Türen und Leimholz.",
      gradeAB: "Klasse A/B (Bauholz & Kommerzieller Export)",
      gradeABdesc: "Standardqualität für den Export in die Golfregion. Technisch getrocknet KD 18% mit Bläueschutz.",
      gradeBC: "Klasse B/C (Industrieverpackungen & Paletten)",
      gradeBCdesc: "Wirtschaftliche Sortierung für Kabeltrommeln, Schwergutkisten und Baustellenschalung.",
      treatmentsTitle: "Industrielle Holzbehandlung",
      treatmentKd: "Automatisierte Kammertrocknung (KD 18% ± 2%)",
      treatmentHt: "Hitzebehandlung ISPM-15 (56°C / 30 Min Kern)",
      treatmentAntiBlue: "Tauchimprägnierung gegen Bläuepilz",
      dimensionMatrix: "Standard Export-Dimensionen",
      metricImperialToggle: "Metrisch (mm / m) / Imperial (in / ft)",
      downloadTechSheet: "Technisches Datenblatt Herunterladen (PDF)",
    },
    infrastructure: {
      sectionBadge: "SÄGEWERK",
      title: "In Gălănești verarbeitet. Für den Export bereit.",
      subtitle: "Schnittholz wird an unserem Standort im Kreis Suceava gesägt, getrocknet und für den Versand vorbereitet.",
      feature1Title: "Automatisierter Einschnitt",
      feature1Desc: "Linck & Primultini Hochleistungs-Bandsägelinien mit 3D-Laserscannern.",
      feature2Title: "Mühlböck Trocknungskammern",
      feature2Desc: "Mikroprozessor-gesteuerte Klimakammern für exakt reproduzierbare 18% Holzfeuchte.",
      feature3Title: "UV-Schutz & GS1-Barcodes",
      feature3Desc: "Strapazierte PET-Umreifung, regendichte UV-Hauben und lückenlose Barcode-Kennzeichnung.",
      feature4Title: "FSC® 100% Chain-of-Custody",
      feature4Desc: "Verantwortungsvolle Rundholzbeschaffung aus nachhaltig bewirtschafteten Karpatenwäldern.",
      annualLogs: "100.000 m³ / Jahr Einschnittkapazität",
      dryKilnCapacity: "3.500 m³ / Monat Trockenkapazität",
      landArea: "100.000 m² Werksgelände",
      automatedLines: "4 Integrierte Fertigungslinien",
    },
    logistics: {
      sectionBadge: "WERK · HAFEN · SEE",
      title: "Von Gălănești zu Ihrem Hafen",
      subtitle: "Straße und Schiene verbinden unser Werk in Suceava mit dem Exportterminal Agigea und den Seerouten.",
      corridorTitle: "Der Holz Expert Logistikkorridor",
      nodeGalanesti: "1. Werk Gălănești (Suceava)",
      nodeGalanestiDesc: "Einschnitt, Dämpfen, KD 18% Trocknung und exportfertige Verpackung.",
      nodeOverland: "2. Landkorridor Schiene/Straße",
      nodeOverlandDesc: "Direkttransporte zum Schwarzmeer-Tiefseehafen Constanța.",
      nodeConstanta: "3. Drehkreuz Hafen Constanța",
      nodeConstantaDesc: "Containerbeladung, ISPM-15 Inspektion, Zollabfertigung und B/L-Erstellung.",
      nodeGlobal: "4. Globale Reederdienste",
      nodeGlobalDesc: "Wöchentliche Liniendienste mit Maersk, MSC, CMA-CGM in den Golf und den Nahen Osten.",
      transitTimesTitle: "Transitzeiten & Hafen-Incoterms",
      clickToInspect: "Klicken Sie auf einen Zielhafen für Seefracht-Transitzeiten und Incoterms.",
      incotermsOffered: "Verfügbare Incoterms:",
      frequency: "Abfahrtsfrequenz:",
    },
    yard: {
      sectionBadge: "BEISPIELCHARGEN",
      title: "Exportmaße entdecken",
      subtitle: "Beispielchargen nach Maß, Güte und Versandphase durchsuchen. Verfügbarkeit und Preis bitte aktuell anfragen.",
      disclaimer: "Beispieldaten. Verfügbarkeit und aktuellen Preis bitte beim Exportteam anfragen.",
      filterAll: "Alle Phasen",
      filterKd: "Trocknung",
      filterPort: "Im Hafen",
      filterTransit: "Unterwegs",
      colLot: "Chargen-Code",
      colSpec: "Maße (D×B×L)",
      colGrade: "Güte (EN 1611-1)",
      colMoisture: "Feuchte",
      colVolume: "Volumen (m³)",
      colLocation: "Standort",
      colEtd: "Geschätzte ETD",
      colStatus: "Status",
      colAction: "Reservieren",
      reserveBtn: "Charge anfragen",
      statusAvailable: "VERFÜGBAR",
      statusReserved: "RESERVIERT",
      statusLimited: "KNAPPER BESTAND",
    },
    rfq: {
      sectionBadge: "DIREKTER EXPORT-DESK",
      title: "Exportangebot anfragen",
      subtitle: "Holzart, Abmessungen, Menge und Zielhafen angeben. Unser Exportteam erstellt ein passendes Angebot.",
      companyDetails: "Unternehmensdaten des Käufers",
      companyName: "Firmenname (Rechtsform)",
      contactPerson: "Ansprechpartner / Einkauf",
      email: "Geschäftliche E-Mail-Adresse",
      phone: "Telefon / WhatsApp (International)",
      country: "Bestimmungsland",
      destinationPort: "Löschhafen (POD)",
      cargoDetails: "Fracht- & Logistikparameter",
      transportMode: "Transportart",
      volumeCount: "Menge (Container oder Lkw)",
      incoterm: "Gewünschtes Incoterm",
      grade: "Güteklasse nach EN 1611-1",
      dimensions: "Ausgewählter Holzquerschnitt",
      moisture: "Feuchtigkeitsanforderung",
      treatments: "Zusätzliche Behandlungen",
      specialReq: "Besondere Verpackungs- oder Liefervorschriften",
      submitQuote: "Verbindliche RFQ an das Export-Desk Senden",
      downloadPdf: "RFQ als Technische PDF-Spezifikation Exportieren",
      submitting: "Anfrage wird übermittelt...",
      submitError: "Die Anfrage konnte nicht gespeichert werden. Bitte erneut versuchen oder sales@holzexpert.com schreiben.",
      successTitle: "Anfrage erfolgreich gespeichert!",
      successMessage: "Ihre Anfrage wurde mit einer internen Referenz gespeichert. Unser Vertrieb prüft sie und meldet sich mit einem CIF/FOB-Angebot.",
    },
    footer: {
      legalName: "Holz Expert Industry S.R.L.",
      hqAddress: "Hauptsitz & Sägewerk: Gălănești Nr. 346, Kreis Suceava, 727280, Rumänien",
      terminalAddress: "Export-Terminal: Hafen Constanța Süd - Agigea, Containerdepot, Rumänien",
      vatNumber: "USt-IdNr.: RO 24657150 | Handelsregister: J33/1785/2008",
      regNumber: "Jährlicher Einschnitt: >70.000 m³ Fichten-Schnittholz KD",
      certifications: "Offizielle Zertifizierungen & Akkreditierungen",
      fscTitle: "FSC®-C119854 Zertifiziertes CoC",
      ispmTitle: "ISPM-15 Pflanzenschutz Ro-SV-032",
      enTitle: "EN 1611-1 Europäischer Holzstandard",
      directDesk: "Kommerzieller Export-Desk",
      rights: "Alle Rechte vorbehalten. Spezialisierte B2B-Plattform für internationalen Nadelschnittholz-Export.",
    },
  },
  ar: {
    utility: {
      terminalStatus: "محطة ميناء كونستانتسا الجنوبي - أجيجيا",
      terminalActive: "جاهز للعمليات • تعبئة الحاويات البحرية 24/7",
      directExportDesk: "مكتب التصدير المباشر:",
      switchCurrency: "عملة التداول",
    },
    nav: {
      company: "الشركة",
      sawmill: "القدرة الصناعية",
      specs: "مواصفات الخشب الأبيض",
      simulator: "محاكي التحميل",
      virtualYard: "أمثلة الدفعات",
      logistics: "الممرات البحرية",
      rfq: "طلب عرض أسعار RFQ",
      fscBadge: "شهادة FSC® 100% المعتمدة",
      callDirect: "اتصال بمكتب التصدير",
      requestQuoteBtn: "طلب تسعير حاويات",
    },
    hero: {
      badge: "المصدّر الأوروبي الرائد لخشب الموسكي / الأبيض KD 18%",
      headline: "خشب الموسكي والأبيض على نطاق صناعي عالمي.",
      headlineHighlight: "مهيأ خصيصاً للشحن البحري والحاويات الدولية.",
      subheadline: "من غابات الكاربات الرومانية المعتمدة بيئياً مباشرة إلى كبرى موانئ الشرق الأوسط والخليج العربي. طاقة إنتاجية تتجاوز 70,000 متر مكعب سنوياً مع محطة لوجستية خاصة في ميناء كونستانتسا.",
      ctaSimulator: "تشغيل محاكي الحاويات 3D",
      ctaQuote: "طلب تسعير فوري CIF / FOB",
      statTurnover: "+50 مليون ليو",
      statTurnoverLabel: "حجم الأعمال السنوي (>10 مليون يورو)",
      statSawing: "100,000 م³",
      statSawingLabel: "طاقة شق جذوع الأشجار سنوياً",
      statMaritime: "حاويات 40' HC",
      statMaritimeLabel: "محطة بحرية خاصة للشحن الدولي",
      statFsc: "FSC® & ISPM-15",
      statFscLabel: "سلسلة توريد معتمدة عالمياً",
    },
    simulator: {
      sectionBadge: "مخطط الحمولة",
      title: "خطّط تحميل الحاوية",
      subtitle: "حدّد أبعاد الخشب وعدد الرزم. يحسب النظام الحجم والحمولة أثناء الاستخدام.",
      transportMode: "اختر وسيلة الشحن",
      container40hc: "حاوية بحرية 40 قدم High Cube (~50 م³ حمولة / حد أقصى 26.5 طن)",
      truckMega: "شاحنة ميجا تريلا 13.6م (~33 م³ حمولة / حد أقصى 24.0 طن)",
      selectDimensions: "حدد مقاسات الخشب (القطاع)",
      thickness: "السماكة",
      width: "العرض",
      length: "الطول",
      moistureCondition: "حالة الرطوبة والكثافة النوعية",
      kd18: "مجفف كلياً KD 18% (أفران أوتوماتيكية)",
      kd18Desc: "تجفيف حراري متطور في أفران Mühlböck. كثافة ~450 كجم/م³. ضمان ضد الفطريات والعفن.",
      freshCut: "رطب / مقصوص حديثاً (Fresh Cut)",
      freshCutDesc: "خشب طبيعي غير مجفف. كثافة ~750 كجم/م³.",
      bundleQty: "عدد الرزم والباليتات القياسية",
      telemetry: "بيانات الحمولة في الوقت الفعلي",
      totalVolume: "إجمالي الحجم الصافي",
      grossWeight: "الوزن الصافي للشحنة",
      spaceUtilized: "نسبة استغلال المساحة الحجمية",
      weightUtilized: "نسبة الوزن المسموح قانونياً",
      piecesCount: "عدد الألواح الإجمالي",
      standardBundles: "رزم التصدير",
      statusSafe: "الحمولة ضمن حدود الأمان والسلامة البحرية",
      statusWarning: "اقتراب من الحد الأقصى المسموح للحاوية",
      statusOverweight: "تجاوز الحد القانوني المسموح به للوزن",
      lockInCta: "تثبيت المواصفة وطلب عرض أسعار رسمي CIF/FOB",
      visualPreview: "عرض هندسي مقطعي للحاوية",
      topView: "مخطط التحميل العلوي",
      crossSection: "القطاع العرضي للحاوية",
      specsBadge: "بطاقة المواصفات الفنية لرزم التصدير",
    },
    catalog: {
      sectionBadge: "مجموعة المنتجات · EN 1611-1",
      title: "خشب وفق المواصفات التي تحتاجها",
      subtitle: "قارن الدرجات والمقاسات القياسية والمعالجات. يتوفر القص حسب الطلب.",
      enStandardBadge: "معتمد وفق المواصفة الأوروبية EN 1611-1",
      gradeA: "الدرجة الأولى Class A (نجارة فاخرة وأعمال ديكور)",
      gradeAdesc: "عقد حية مدمجة وصغيرة فقط، خالي تماماً من العقد الساقطة أو السواد. مثالي للأبواب، النوافذ والأعمال الهندسية الظاهرة.",
      gradeAB: "الدرجة التجارية Class A/B (خشب بناء وتصدير تجاري)",
      gradeABdesc: "المواصفة الأكثر طلباً في أسواق الخليج العربي والشرق الأوسط. عقد مسموحة، استقامة مثالية، مجفف KD 18% ومعالج ضد الزرقة.",
      gradeBC: "الدرجة الصناعية Class B/C (طبليات وصناديق تغليف)",
      gradeBCdesc: "درجة اقتصادية مخصصة لصناعة بكرات الكابلات وطبليات الشحن الثقيل وقوالب صب الخرسانة.",
      treatmentsTitle: "المعالجات الصناعية المعتمدة",
      treatmentKd: "تجفيف حراري بالأفران الصناعية (KD 18% ± 2%)",
      treatmentHt: "معالجة حرارية وقائية ISPM-15 (56°C لمدة 30 دقيقة)",
      treatmentAntiBlue: "حماية بالغمر ضد العفن الأزرق والفطريات",
      dimensionMatrix: "جدول المقاسات القياسية للتصدير",
      metricImperialToggle: "متري (مم / م) / بالبوصة والقدم",
      downloadTechSheet: "تحميل النشرة الفنية للمنتجات (PDF)",
    },
    infrastructure: {
      sectionBadge: "المصنع",
      title: "تصنيع في غالانيشت. جاهز للتصدير.",
      subtitle: "يُقطّع الخشب ويُجفف ويُجهّز للشحن في مصنعنا بمقاطعة سوتشافا.",
      feature1Title: "خطوط الشق الأوتوماتيكية",
      feature1Desc: "مناشر Linck و Primultini الإيطالية المزودة بماسات ليزرية ثلاثية الأبعاد لتحقيق أقصى استقامة للألياف.",
      feature2Title: "أفران التجفيف Mühlböck النمساوية",
      feature2Desc: "منظومة إلكترونية بالكامل تضمن ثبات نسبة الرطوبة عند 18% لمنع التقوس أو التصدع.",
      feature3Title: "التغليف المقاوم للأشعة فوق البنفسجية",
      feature3Desc: "أشرطة بوليستر قوية، أغطية حماية علوية عازلة للمياه وأشعة الشمس، وباركود GS1 دولي لكل رزمة.",
      feature4Title: "سلسلة توريد FSC® 100%",
      feature4Desc: "توريد الأخشاب حصرياً من غابات مستدامة ومعتمدة دولياً في جبال بوكوفينا وشمال رومانيا.",
      annualLogs: "100,000 م³ / سنوياً طاقة شق الجذوع",
      dryKilnCapacity: "3,500 م³ / شهرياً طاقة التجفيف",
      landArea: "100,000 م² مساحة المجمع الصناعي",
      automatedLines: "4 خطوط إنتاج متكاملة",
    },
    logistics: {
      sectionBadge: "المصنع · الميناء · البحر",
      title: "من غالانيشت إلى مينائك",
      subtitle: "يربط النقل البري والسكك الحديدية مصنعنا في سوتشافا بمحطة التصدير في أجيجيا وخطوط الشحن البحري.",
      corridorTitle: "ممر الإمداد اللوجستي لشركة هولتز إكسبرت",
      nodeGalanesti: "1. مصنع غالانيشت (سوتشافا)",
      nodeGalanestiDesc: "شق الجذوع، التبخير، التجفيف KD 18%، والتغليف بباليتات مخصصة للشحن البحري.",
      nodeOverland: "2. ممر النقل البري والقطارات",
      nodeOverlandDesc: "أسطول شاحنات مخصص ومسار سككي ينقل الشحنات مباشرة إلى ساحل البحر الأسود.",
      nodeConstanta: "3. محطة ميناء كونستانتسا الجنوبي - أجيجيا",
      nodeConstantaDesc: "تعبئة الحاويات 40' HC، الفحص الصحي النباتي ISPM-15، التخليص الجمركي وإصدار بوالص الشحن (B/L).",
      nodeGlobal: "4. خطوط الملاحة البحرية العالمية",
      nodeGlobalDesc: "خدمات أسبوعية مباشرة عبر ميرسك، MSC، وCMA-CGM لموانئ جدة، جبل علي، والدمام والإسكندرية.",
      transitTimesTitle: "فترات الإبحار وشروط التجارة الدولية (Incoterms)",
      clickToInspect: "اضغط على أي ميناء لعرض مدة الرحلة البحرية، الخطوط الملاحية، وشروط التسليم المدعومة.",
      incotermsOffered: "شروط التسليم المتاحة:",
      frequency: "تكرار الرحلات الملاحية:",
    },
    yard: {
      sectionBadge: "أمثلة على الدفعات",
      title: "استكشف مواصفات التصدير",
      subtitle: "تصفّح أمثلة الأخشاب حسب المقاس والدرجة ومرحلة الشحن. اطلب تأكيد التوفر والسعر الحالي من فريقنا.",
      disclaimer: "هذه بيانات توضيحية. يرجى تأكيد التوفر والسعر الحالي مع فريق التصدير.",
      filterAll: "كل المراحل",
      filterKd: "قيد التجفيف",
      filterPort: "في الميناء",
      filterTransit: "قيد الشحن",
      colLot: "رمز الشحنة",
      colSpec: "المقاس (سماكة×عرض×طول)",
      colGrade: "الدرجة (EN 1611-1)",
      colMoisture: "الرطوبة",
      colVolume: "الحجم (م³)",
      colLocation: "موقع الشحنة",
      colEtd: "تاريخ المغادرة المتوقع",
      colStatus: "الحالة",
      colAction: "طلب الحجز",
      reserveBtn: "استفسر عن الدفعة",
      statusAvailable: "متاح للحجز",
      statusReserved: "تم الحجز",
      statusLimited: "كمية محدودة جداً",
    },
    rfq: {
      sectionBadge: "مكتب التصدير المباشر",
      title: "اطلب عرضاً للتصدير",
      subtitle: "أرسل المقاسات والكمية وميناء الوصول. يجهّز فريق التصدير عرضاً يناسب طلبك.",
      companyDetails: "بيانات الشركة المشترية",
      companyName: "اسم الشركة التجاري",
      contactPerson: "اسم مسؤول المشتريات / التجارة",
      email: "البريد الإلكتروني للشركة",
      phone: "رقم الهاتف / واتساب مع الرمز الدولي",
      country: "دولة الوصول",
      destinationPort: "ميناء التفريغ (POD)",
      cargoDetails: "مواصفات الشحنة والخدمات اللوجستية",
      transportMode: "نوع الشحن",
      volumeCount: "الكمية المطلوبة (عدد الحاويات أو الشاحنات)",
      incoterm: "شرط التسليم (Incoterm)",
      grade: "درجة الجودة حسب EN 1611-1",
      dimensions: "القطاع المطلوب",
      moisture: "نسبة الرطوبة المطلوبة",
      treatments: "المعالجات الإضافية",
      specialReq: "تعليمات خاصة بالتغليف أو متطلبات الفحص الجمركي",
      submitQuote: "إرسال طلب التسعير الرسمي إلى مكتب التصدير",
      downloadPdf: "تصدير المواصفة كملف فني PDF",
      submitting: "جارٍ إرسال الطلب وإعداد البيانات...",
      submitError: "تعذر حفظ طلبك. يُرجى المحاولة مرة أخرى أو مراسلة sales@holzexpert.com.",
      successTitle: "تم تسجيل طلب التسعير بنجاح!",
      successMessage: "تم حفظ طلبكم برقم مرجعي داخلي. سيقوم فريق المبيعات بمراجعته والتواصل معكم بعرض CIF/FOB.",
    },
    footer: {
      legalName: "شركة هولتز إكسبرت إندستري المحدودة (Holz Expert Industry S.R.L.)",
      hqAddress: "المقر الرئيسي والمناشر: غالانيشت رقم 346، محافظة سوتشافا، 727280، رومانيا",
      terminalAddress: "محطة التصدير البحرية: ميناء كونستانتسا الجنوبي - أجيجيا، ساحة شحن الحاويات، رومانيا",
      vatNumber: "السجل التجاري والضريبي: RO 24657150 | J33/1785/2008",
      regNumber: "الطاقة الإنتاجية: >70,000 م³ سنوياً من أخشاب الموسكي والأبيض KD",
      certifications: "الشهادات والاعتمادات الرسمية الدولية",
      fscTitle: "شهادة FSC®-C119854 لإدارة الغابات المستدامة",
      ispmTitle: "المعايير الصحية النباتية الدولية ISPM-15 Ro-SV-032",
      enTitle: "المواصفة القياسية الأوروبية لجودة الأخشاب EN 1611-1",
      directDesk: "مكتب التصدير واللوجستيات المباشر",
      rights: "جميع الحقوق محفوظة. المنصة الصناعية لتصدير أخشاب الراتنجيات والموسكي.",
    },
  },
};
