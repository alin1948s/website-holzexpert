export type Language = 'en' | 'ro' | 'de' | 'ar';
export type Currency = 'EUR' | 'USD';

export type TransportType = 'container_40hc' | 'mega_truck_136';
export type MoistureCondition = 'kd_18' | 'fresh_cut';

export interface TimberDimension {
  id: string;
  thickness: number; // mm
  width: number; // mm
  length: number; // m
}

export type TimberGrade = 'EN1611_CLASS_A' | 'EN1611_CLASS_AB' | 'EN1611_CLASS_BC';

export interface GradeDetail {
  id: TimberGrade;
  title: string;
  code: string;
  subtitle: string;
  description: string;
  allowedKnots: string;
  surfaceFinish: string;
  primaryUses: string[];
  textureImage: string;
  realProductImage?: string;
  marketName: string;
}

export interface CargoSimulationState {
  transportType: TransportType;
  thickness: number; // mm
  width: number; // mm
  length: number; // m
  moisture: MoistureCondition;
  bundleQuantity: number;
}

export interface TransportSpec {
  id: TransportType;
  name: string;
  typeLabel: string;
  maxVolumeM3: number;
  maxWeightTonnes: number;
  lengthM: number;
  widthM: number;
  heightM: number;
  tareWeightTonnes: number;
  iconName: string;
}

export interface VirtualYardBatch {
  id: string;
  batchCode: string;
  species: string;
  grade: TimberGrade;
  thickness: number; // mm
  width: number; // mm
  length: number; // m
  moisture: MoistureCondition;
  volumeM3: number;
  bundlesCount: number;
  piecesCount: number;
  location: 'port_constanta' | 'drying_kilns_galanesti' | 'afloat_transit';
  locationName: string;
  etd: string;
  status: 'available' | 'reserved' | 'limited';
  treatment: string[];
  fscClaim: string;
}

export interface LogisticsPortDestination {
  id: string;
  name: string;
  country: string;
  region: 'middle_east' | 'gulf' | 'mediterranean' | 'europe';
  transitDays: string;
  shippingLines: string[];
  primaryIncoterms: string[];
  containerFrequency: string;
  coordinates: { x: number; y: number }; // normalized 0-100 for SVG route map
  geoCoordinates?: { lat: number; lng: number }; // Real WGS84 coordinates for Leaflet
  nauticalMiles?: number;
  customsNote: string;
}

export interface RfqFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  country: string;
  destinationPort: string;
  transportType: TransportType;
  incoterm: 'FOB' | 'CIF' | 'CFR' | 'DAP';
  volumeContainers: number;
  approxVolumeM3: number;
  grade: TimberGrade;
  thickness: number;
  width: number;
  length: number;
  moisture: MoistureCondition;
  treatments: string[];
  specialRequirements?: string;
  currency: Currency;
  deliveryTimeline: string;
}

export type OperationsTab = 'simulator' | 'virtual-yard' | 'logistics';
