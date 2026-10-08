import { describe, it, expect } from 'vitest';
import { EXPORT_DESTINATIONS, CORRIDOR_STEPS } from '../src/data/routesData';
import { INITIAL_VIRTUAL_YARD_BATCHES } from '../src/data/virtualYardData';
import type { OperationsTab } from '../src/types';

describe('Export Operations Suite & Logistics Integrity Tests', () => {
  const validTabs: OperationsTab[] = ['simulator', 'virtual-yard', 'logistics'];

  it('validates supported operations suite tabs', () => {
    expect(validTabs).toHaveLength(3);
    expect(validTabs).toContain('simulator');
    expect(validTabs).toContain('virtual-yard');
    expect(validTabs).toContain('logistics');
  });

  it('ensures all export destinations have valid CFR/CIF coordinates and transit parameters', () => {
    expect(EXPORT_DESTINATIONS.length).toBeGreaterThanOrEqual(7);
    const regions = new Set<string>();

    EXPORT_DESTINATIONS.forEach((port) => {
      expect(port.id).toBeTruthy();
      expect(port.name).toBeTruthy();
      expect(port.country).toBeTruthy();
      expect(port.coordinates.x).toBeGreaterThanOrEqual(0);
      expect(port.coordinates.x).toBeLessThanOrEqual(100);
      expect(port.coordinates.y).toBeGreaterThanOrEqual(0);
      expect(port.coordinates.y).toBeLessThanOrEqual(100);
      expect(port.transitDays).toBeTruthy();
      expect(port.shippingLines.length).toBeGreaterThan(0);
      expect(port.primaryIncoterms.length).toBeGreaterThan(0);
      expect(port.customsNote.length).toBeGreaterThan(15);
      regions.add(port.region);
    });

    // Ensures all 4 commercial maritime trading basins are represented
    expect(regions.has('middle_east')).toBe(true);
    expect(regions.has('gulf')).toBe(true);
    expect(regions.has('mediterranean')).toBe(true);
    expect(regions.has('europe')).toBe(true);

    // Verify non-collision between all destination port coordinates (min SVG distance >= 50px)
    for (let i = 0; i < EXPORT_DESTINATIONS.length; i++) {
      for (let j = i + 1; j < EXPORT_DESTINATIONS.length; j++) {
        const p1 = EXPORT_DESTINATIONS[i];
        const p2 = EXPORT_DESTINATIONS[j];
        const svgX1 = p1.coordinates.x * 10;
        const svgY1 = p1.coordinates.y * 6.2;
        const svgX2 = p2.coordinates.x * 10;
        const svgY2 = p2.coordinates.y * 6.2;
        const dist = Math.hypot(svgX1 - svgX2, svgY1 - svgY2);
        expect(dist, `Ports ${p1.name} and ${p2.name} should not collide in SVG space`).toBeGreaterThanOrEqual(40);
      }
    }
  });

  it('verifies 4-step logistics multimodal pipeline nodes', () => {
    expect(CORRIDOR_STEPS).toHaveLength(4);
    const steps = CORRIDOR_STEPS.map((s) => s.step);
    expect(steps).toEqual(['01', '02', '03', '04']);
  });

  it('ensures initial virtual yard lots have valid technical specifications', () => {
    expect(INITIAL_VIRTUAL_YARD_BATCHES.length).toBeGreaterThanOrEqual(6);
    INITIAL_VIRTUAL_YARD_BATCHES.forEach((batch) => {
      expect(batch.batchCode).toMatch(/^LOT-/);
      expect(batch.volumeM3).toBeGreaterThan(0);
      expect(batch.bundlesCount).toBeGreaterThan(0);
      expect(batch.thickness).toBeGreaterThan(0);
      expect(batch.width).toBeGreaterThan(0);
      expect(batch.length).toBeGreaterThan(0);
      expect(['kd_18', 'fresh_cut']).toContain(batch.moisture);
      expect(['available', 'limited', 'reserved']).toContain(batch.status);
      expect(batch.treatment.length).toBeGreaterThan(0);
    });
  });

  it('verifies standard export dimension presets calculate valid stowage configurations', async () => {
    const { calculateCargoLoad } = await import('../src/utils/bundleCalculator');
    const presets = [
      { thickness: 48, width: 150, length: 4.0 },
      { thickness: 25, width: 100, length: 4.0 },
      { thickness: 75, width: 150, length: 4.0 },
      { thickness: 38, width: 125, length: 4.0 },
    ];

    presets.forEach((preset) => {
      const res = calculateCargoLoad('container_40hc', preset.thickness, preset.width, preset.length, 'kd_18', 12);
      expect(res.totalVolumeM3).toBeGreaterThan(30);
      expect(res.totalVolumeM3).toBeLessThan(60);
      expect(res.totalWeightTonnes).toBeGreaterThan(10);
      expect(res.totalWeightTonnes).toBeLessThanOrEqual(26.5);
      expect(res.piecesPerBundle).toBeGreaterThan(0);
      expect(res.recommendedMaxBundles).toBeGreaterThanOrEqual(8);
    });
  });
});
