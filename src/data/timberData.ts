import type { GradeDetail, TransportSpec } from '../types';

export const THICKNESS_OPTIONS = [18, 22, 25, 38, 48, 75, 100]; // mm
export const WIDTH_OPTIONS = [75, 100, 125, 150, 175, 200, 225]; // mm
export const LENGTH_OPTIONS = [3.0, 4.0, 5.0, 6.0]; // meters

export const DENSITIES = {
  kd_18: 450, // kg/m³ (Kiln dried ~18%)
  fresh_cut: 750, // kg/m³ (Fresh green wood)
};

export const TRANSPORT_SPECS: Record<'container_40hc' | 'mega_truck_136', TransportSpec> = {
  container_40hc: {
    id: 'container_40hc',
    name: "40' High Cube Ocean Container",
    typeLabel: "Maritime Freight (40' HC)",
    maxVolumeM3: 50.0,
    maxWeightTonnes: 26.5,
    lengthM: 12.03,
    widthM: 2.35,
    heightM: 2.69,
    tareWeightTonnes: 3.9,
    iconName: 'Ship',
  },
  mega_truck_136: {
    id: 'mega_truck_136',
    name: 'Mega Tautliner Truck 13.6m',
    typeLabel: 'Overland Road Freight (13.6m)',
    maxVolumeM3: 33.5,
    maxWeightTonnes: 24.0,
    lengthM: 13.62,
    widthM: 2.48,
    heightM: 3.00,
    tareWeightTonnes: 15.0,
    iconName: 'Truck',
  },
};

export const TIMBER_GRADES: GradeDetail[] = [
  {
    id: 'EN1611_CLASS_A',
    title: 'EN 1611-1 Class A (Joinery & Clear S4S)',
    code: 'CLASS A / G2-0',
    subtitle: 'Furniture, architectural visible beams, luxury joinery',
    description: 'Selected 4-sided clear timber. Free of bark pockets, zero wane, sound tight pin knots only (<15mm diameter). Absolutely no dead, black, or falling knots. Uniform pale honey tone.',
    allowedKnots: 'Sound tight knots <= 15mm. Max 1 knot per meter length.',
    surfaceFinish: '4-side clean cut or smooth calibrated planar surface.',
    primaryUses: ['Glulam laminations', 'Window and door profiles', 'Interior visible rafters', 'High-end furniture components'],
    textureImage: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=800&q=80',
    marketName: 'Nordic / European Class A Select',
  },
  {
    id: 'EN1611_CLASS_AB',
    title: 'EN 1611-1 Class A/B (Commercial Export & Framing)',
    code: 'CLASS A/B / G2-2',
    subtitle: 'Gulf standard "White Wood", construction framing, roof trusses',
    description: 'The premier export workhorse for Middle Eastern and European construction markets. Firmly intergrown sound knots permitted, negligible wane permitted on maximum 5% of piece length. Straight grain, uniform kiln drying to 18%.',
    allowedKnots: 'Sound tight knots up to 35mm. No rot or blue-stain.',
    surfaceFinish: 'Sharp-edged band-sawn or calibrated thickness.',
    primaryUses: ['Residential roof trusses & rafters', 'Structural formwork and scaffolding', 'Middle East construction market (White Wood)', 'Timber frame housing'],
    textureImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    marketName: 'Middle East & Gulf Standard White Wood (خشب أبيض)',
  },
  {
    id: 'EN1611_CLASS_BC',
    title: 'EN 1611-1 Class B/C (Packaging & Heavy Industry)',
    code: 'CLASS B/C / G2-4',
    subtitle: 'Industrial pallets, heavy cable reels, machinery crating',
    description: 'Engineered for high mechanical strength and structural durability where aesthetic knot defects are non-critical. Larger sound knots, blue stain allowed if treated, minor wane accepted.',
    allowedKnots: 'Larger sound knots and bark pockets permitted within strength thresholds.',
    surfaceFinish: 'Band-sawn standard industrial finish.',
    primaryUses: ['Heavy-duty EURO pallets (EPAL standard)', 'Electrical cable drums and reels', 'Industrial export crating', 'Temporary earth retention'],
    textureImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
    marketName: 'Industrial Packaging & Pallet Grade',
  },
];

export const OFFICIAL_IMAGES = {
  logo: 'https://holzexpert.com/wp-content/uploads/2014/06/copy-logo-HolzExpertIndustry-300.png',
  heroLogs: 'https://holzexpert.com/wp-content/uploads/2014/04/HEI-05.jpg',
  sawingLine: 'https://holzexpert.com/wp-content/uploads/2014/06/HEI-03.jpg',
  logYard: 'https://holzexpert.com/wp-content/uploads/2014/06/HEI-01.jpg',
  sortedPiles: 'https://holzexpert.com/wp-content/uploads/2014/05/HEI-06.jpg',
  exportBundles: 'https://holzexpert.com/wp-content/uploads/2014/06/HEI-04_cr-750x410.jpg',
  rawMaterialFsc: 'https://holzexpert.com/wp-content/uploads/2014/06/Raw-material.jpg',
  finishedProducts: 'https://holzexpert.com/wp-content/uploads/2014/06/Products.jpg',
  exportFlowMap: 'https://holzexpert.com/wp-content/uploads/2014/06/Holz-Expert-Industry-EXPORT_21.jpg',
  logisticsBase: 'https://holzexpert.com/wp-content/uploads/2014/06/DSC_4441-750x410.jpg',
};
