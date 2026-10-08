import { describe, it, expect } from 'vitest';
import { calculateCargoLoad } from '../src/utils/bundleCalculator';

describe('Cargo Loading Simulator Tests', () => {
  it('correctly calculates 40ft HC Container with KD 18% timber', () => {
    // 48mm thickness, 150mm width, 4.0m length, KD 18%, 12 bundles
    const result = calculateCargoLoad('container_40hc', 48, 150, 4.0, 'kd_18', 12);

    expect(result.piecesPerBundle).toBeGreaterThan(0);
    expect(result.totalVolumeM3).toBeGreaterThan(45);
    expect(result.totalVolumeM3).toBeLessThan(52);
    expect(result.totalWeightTonnes).toBeLessThan(26.5);
    expect(['safe', 'warning']).toContain(result.status);
    expect(result.recommendedMaxBundles).toBeGreaterThanOrEqual(10);
  });

  it('triggers overweight warning/error when fresh cut wet timber exceeds 26.5t payload', () => {
    // 14 bundles of fresh cut green timber (750 kg/m3)
    const result = calculateCargoLoad('container_40hc', 48, 150, 4.0, 'fresh_cut', 14);

    expect(result.status).toBe('overweight');
    expect(result.weightCapacityRatio).toBeGreaterThan(100);
  });

  it('correctly handles Mega Tautliner Truck 13.6m limits (33.5 m3 / 24.0t)', () => {
    // 7 bundles fits within 33.5 m3
    const fitResult = calculateCargoLoad('mega_truck_136', 25, 100, 4.0, 'kd_18', 7);
    expect(fitResult.totalVolumeM3).toBeLessThanOrEqual(33.5);
    expect(fitResult.totalWeightTonnes).toBeLessThanOrEqual(24.0);
    expect(['safe', 'warning']).toContain(fitResult.status);

    // 8 bundles exceeds 33.5 m3 and triggers overvolume
    const overflowResult = calculateCargoLoad('mega_truck_136', 25, 100, 4.0, 'kd_18', 8);
    expect(overflowResult.status).toBe('overvolume');
    expect(overflowResult.volumeCapacityRatio).toBeGreaterThan(100);
  });

  it('clamps non-positive bundle quantities to at least 1 bundle', () => {
    const result = calculateCargoLoad('container_40hc', 48, 150, 4.0, 'kd_18', 0);
    expect(result.totalBundles).toBe(1);
  });

  it('validates all standard thickness options (18mm to 100mm) generate positive pieces and valid dimensions', () => {
    const thicknesses = [18, 22, 25, 38, 48, 75, 100];
    thicknesses.forEach((th) => {
      const res = calculateCargoLoad('container_40hc', th, 150, 4.0, 'kd_18', 10);
      expect(res.piecesPerBundle).toBeGreaterThan(0);
      expect(res.volumePerBundleM3).toBeGreaterThan(0);
      expect(res.bundleHeightMm).toBeLessThanOrEqual(1050);
      expect(res.bundleWidthMm).toBeLessThanOrEqual(1150);
      expect(res.recommendedMaxBundles).toBeGreaterThan(0);
    });
  });

  it('validates all standard lengths (3.0m to 6.0m) scale volumes linearly', () => {
    const res3m = calculateCargoLoad('container_40hc', 48, 150, 3.0, 'kd_18', 10);
    const res6m = calculateCargoLoad('container_40hc', 48, 150, 6.0, 'kd_18', 10);
    // 6m should have double the volume of 3m for the same bundle count
    expect(res6m.totalVolumeM3).toBeCloseTo(res3m.totalVolumeM3 * 2, 1);
  });
});
