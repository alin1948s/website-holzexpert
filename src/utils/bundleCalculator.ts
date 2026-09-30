import type { MoistureCondition, TransportType } from '../types';
import { DENSITIES, TRANSPORT_SPECS } from '../data/timberData';

export interface CalculationResult {
  piecesPerBundle: number;
  bundleWidthMm: number;
  bundleHeightMm: number;
  volumePerBundleM3: number;
  weightPerBundleKg: number;
  totalBundles: number;
  totalPieces: number;
  totalVolumeM3: number;
  totalWeightTonnes: number;
  volumeCapacityRatio: number;
  weightCapacityRatio: number;
  status: 'safe' | 'warning' | 'overweight' | 'overvolume';
  recommendedMaxBundles: number;
}

export function calculateCargoLoad(
  transportType: TransportType,
  thicknessMm: number,
  widthMm: number,
  lengthM: number,
  moisture: MoistureCondition,
  requestedBundles: number
): CalculationResult {
  const transport = TRANSPORT_SPECS[transportType];
  const density = DENSITIES[moisture];

  // Target standard export bundle cross-section: ~1,100mm wide x ~1,000mm high
  const piecesWide = Math.max(1, Math.floor(1100 / widthMm));
  const piecesHigh = Math.max(1, Math.floor(1000 / thicknessMm));
  const piecesPerBundle = piecesWide * piecesHigh;

  const bundleWidthMm = piecesWide * widthMm;
  const bundleHeightMm = piecesHigh * thicknessMm;

  // Single piece volume in m3:
  const singlePieceVolumeM3 = (thicknessMm / 1000) * (widthMm / 1000) * lengthM;
  const volumePerBundleM3 = Number((piecesPerBundle * singlePieceVolumeM3).toFixed(3));
  const weightPerBundleKg = Number((volumePerBundleM3 * density).toFixed(1));

  // Determine maximum bundle capacity based on volume & weight limits
  const maxBundlesByVolume = Math.floor(transport.maxVolumeM3 / volumePerBundleM3);
  const maxBundlesByWeight = Math.floor((transport.maxWeightTonnes * 1000) / weightPerBundleKg);
  const recommendedMaxBundles = Math.min(maxBundlesByVolume, maxBundlesByWeight);

  const totalBundles = Math.max(1, requestedBundles);
  const totalPieces = totalBundles * piecesPerBundle;
  const totalVolumeM3 = Number((totalBundles * volumePerBundleM3).toFixed(2));
  const totalWeightTonnes = Number(((totalBundles * weightPerBundleKg) / 1000).toFixed(2));

  const volumeCapacityRatio = Number(((totalVolumeM3 / transport.maxVolumeM3) * 100).toFixed(1));
  const weightCapacityRatio = Number(((totalWeightTonnes / transport.maxWeightTonnes) * 100).toFixed(1));

  let status: 'safe' | 'warning' | 'overweight' | 'overvolume' = 'safe';
  if (weightCapacityRatio > 100) {
    status = 'overweight';
  } else if (volumeCapacityRatio > 100) {
    status = 'overvolume';
  } else if (weightCapacityRatio >= 90 || volumeCapacityRatio >= 90) {
    status = 'warning';
  }

  return {
    piecesPerBundle,
    bundleWidthMm,
    bundleHeightMm,
    volumePerBundleM3,
    weightPerBundleKg,
    totalBundles,
    totalPieces,
    totalVolumeM3,
    totalWeightTonnes,
    volumeCapacityRatio,
    weightCapacityRatio,
    status,
    recommendedMaxBundles: Math.max(1, recommendedMaxBundles),
  };
}
