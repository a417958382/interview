// True hierarchical spatial grid: coarse grid with on-demand per-cell fine grids.
// Provides ISpatialIndex-compatible methods without importing the internal interface.

import { CombatUnit, Position, Faction } from './realtime-combat-system';

// Minimal index interface to interop in tests/tools.
export interface ISpatialIndexLike {
  addUnit(unit: CombatUnit): void;
  removeUnit(unit: CombatUnit): void;
  updateUnit(unit: CombatUnit): void;
  getUnitsInRange(position: Position, range: number): CombatUnit[];
  getPotentialCombats(): Map<string, string[]>;
  clear(): void;
}

// Internal uniform grid that stores unit IDs per cell and supports fast update/removal.
class BucketGrid {
  private readonly gridSize: number;
  private readonly invGrid: number;
  private buckets: Map<string, Set<string>> = new Map(); // key -> unitIds
  private unitToKey: Map<string, string> = new Map(); // unitId -> key

  constructor(gridSize: number) {
    this.gridSize = gridSize;
    this.invGrid = 1 / gridSize;
  }

  keyFor(pos: Position): string {
    const i = Math.floor(pos.x * this.invGrid);
    const j = Math.floor(pos.y * this.invGrid);
    return `${i},${j}`;
  }

  add(unitId: string, pos: Position): string {
    const newKey = this.keyFor(pos);
    const oldKey = this.unitToKey.get(unitId);
    if (oldKey === newKey) return newKey; // no-op
    if (oldKey) this.removeFromKey(unitId, oldKey);
    let set = this.buckets.get(newKey);
    if (!set) {
      set = new Set();
      this.buckets.set(newKey, set);
    }
    set.add(unitId);
    this.unitToKey.set(unitId, newKey);
    return newKey;
  }

  update(unitId: string, pos: Position): string {
    return this.add(unitId, pos);
  }

  remove(unitId: string): void {
    const key = this.unitToKey.get(unitId);
    if (!key) return;
    this.removeFromKey(unitId, key);
  }

  private removeFromKey(unitId: string, key: string): void {
    const set = this.buckets.get(key);
    if (set) {
      set.delete(unitId);
      if (set.size === 0) this.buckets.delete(key);
    }
    this.unitToKey.delete(unitId);
  }

  // Returns unit IDs in all cells overlapped by [xmin,xmax]x[ymin,ymax].
  getCandidateIdsInRect(xmin: number, ymin: number, xmax: number, ymax: number): string[] {
    const i0 = Math.floor(xmin * this.invGrid);
    const i1 = Math.floor(xmax * this.invGrid);
    const j0 = Math.floor(ymin * this.invGrid);
    const j1 = Math.floor(ymax * this.invGrid);
    const out: string[] = [];
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const key = `${i},${j}`;
        const set = this.buckets.get(key);
        if (set && set.size) out.push(...set);
      }
    }
    return out;
  }

  // Drain a specific cell: return IDs and remove the bucket.
  drainCellByKey(key: string): string[] {
    const set = this.buckets.get(key);
    if (!set) return [];
    const ids = Array.from(set);
    // Clean unitToKey for these ids
    for (const id of ids) this.unitToKey.delete(id);
    this.buckets.delete(key);
    return ids;
  }

  getCellCountByKey(key: string): number {
    const set = this.buckets.get(key);
    return set ? set.size : 0;
  }

  size(): number {
    return this.unitToKey.size;
  }

  allUnitIds(): string[] {
    return Array.from(this.unitToKey.keys());
  }
}

// True hierarchical grid: per coarse cell optional fine grid. Units are either in coarse bucket
// or in its fine grid. We use hysteresis (refine/unrefine thresholds) to avoid oscillation.
export class TrueHierarchicalGrid implements ISpatialIndexLike {
  private readonly coarseSize: number;
  private readonly fineSize: number;
  private readonly refineThreshold: number;
  private readonly unrefineThreshold: number;

  private coarse: BucketGrid;
  private fineByCoarseKey: Map<string, BucketGrid> = new Map();

  // Unit bookkeeping
  private units: Map<string, CombatUnit> = new Map();
  // Remember each unit's current coarse cell key
  private unitCoarseKey: Map<string, string> = new Map();
  // If unit lives in a fine grid, which coarse key owns that fine grid
  private unitFineOwner: Map<string, string> = new Map();

  constructor(
    coarseGridSize: number = 100,
    fineGridSize: number = 25,
    refineThreshold: number = 50,
    unrefineThreshold: number = 30 // hysteresis lower threshold
  ) {
    this.coarseSize = coarseGridSize;
    this.fineSize = fineGridSize;
    this.refineThreshold = refineThreshold;
    this.unrefineThreshold = Math.min(unrefineThreshold, refineThreshold);
    this.coarse = new BucketGrid(coarseGridSize);
  }

  addUnit(unit: CombatUnit): void {
    this.units.set(unit.id, unit);
    const coarseKey = this.coarse.add(unit.id, unit.position);
    this.unitCoarseKey.set(unit.id, coarseKey);

    // If this coarse cell is refined, move the unit to its fine grid immediately
    if (this.fineByCoarseKey.has(coarseKey)) {
      const fine = this.fineByCoarseKey.get(coarseKey)!;
      fine.add(unit.id, unit.position);
      this.unitFineOwner.set(unit.id, coarseKey);
      // Remove from coarse bucket (coarse.add inserted it). Drain just this unit.
      // We can directly call coarse.remove which will no-op if already removed.
      this.coarse.remove(unit.id);
    } else {
      // If not refined yet, check refine threshold and promote if needed
      this.maybeRefine(coarseKey);
    }
  }

  removeUnit(unit: CombatUnit): void {
    const id = unit.id;
    const fineOwner = this.unitFineOwner.get(id);
    if (fineOwner) {
      const fine = this.fineByCoarseKey.get(fineOwner);
      if (fine) fine.remove(id);
      this.unitFineOwner.delete(id);
      this.maybeUnrefine(fineOwner);
    } else {
      this.coarse.remove(id);
    }
    this.unitCoarseKey.delete(id);
    this.units.delete(id);
  }

  updateUnit(unit: CombatUnit): void {
    const id = unit.id;
    const newCoarseKey = this.coarse.keyFor(unit.position);
    const prevCoarseKey = this.unitCoarseKey.get(id);
    const livesInFine = this.unitFineOwner.has(id);

    // Coarse cell changed: move across owners
    if (!prevCoarseKey || prevCoarseKey !== newCoarseKey) {
      // Remove from previous location
      if (livesInFine) {
        const owner = this.unitFineOwner.get(id)!;
        const fine = this.fineByCoarseKey.get(owner);
        if (fine) fine.remove(id);
        this.unitFineOwner.delete(id);
        this.maybeUnrefine(owner);
      } else {
        this.coarse.remove(id);
      }

      // Add to new owner
      this.coarse.add(id, unit.position);
      this.unitCoarseKey.set(id, newCoarseKey);

      if (this.fineByCoarseKey.has(newCoarseKey)) {
        const fine = this.fineByCoarseKey.get(newCoarseKey)!;
        fine.add(id, unit.position);
        this.unitFineOwner.set(id, newCoarseKey);
        this.coarse.remove(id);
      } else {
        this.maybeRefine(newCoarseKey);
      }
      return;
    }

    // Same coarse cell: update inside fine or keep coarse
    if (livesInFine) {
      const owner = this.unitFineOwner.get(id)!;
      const fine = this.fineByCoarseKey.get(owner);
      if (fine) fine.update(id, unit.position);
      // owner unchanged; no unrefine check here
    } else {
      // Only update coarse grid if the fine-grained key changed (BucketGrid handles no-op)
      this.coarse.update(id, unit.position);
      this.maybeRefine(prevCoarseKey!);
    }
  }

  getUnitsInRange(position: Position, range: number): CombatUnit[] {
    const r = range;
    const xmin = position.x - r;
    const xmax = position.x + r;
    const ymin = position.y - r;
    const ymax = position.y + r;

    const resultIds = new Set<string>();

    // Coarse pass: identify all overlapped coarse cells
    const coarseInv = 1 / this.coarseSize;
    const ci0 = Math.floor(xmin * coarseInv);
    const ci1 = Math.floor(xmax * coarseInv);
    const cj0 = Math.floor(ymin * coarseInv);
    const cj1 = Math.floor(ymax * coarseInv);

    for (let ci = ci0; ci <= ci1; ci++) {
      for (let cj = cj0; cj <= cj1; cj++) {
        const cKey = `${ci},${cj}`;
        const fine = this.fineByCoarseKey.get(cKey);
        if (fine) {
          // Query the fine grid overlapping cells
          const ids = fine.getCandidateIdsInRect(xmin, ymin, xmax, ymax);
          for (const id of ids) resultIds.add(id);
        } else {
          // No fine grid: collect from coarse buckets in this coarse cell only
          // Use the same rect query on the coarse grid for simplicity
          const ids = this.coarse.getCandidateIdsInRect(xmin, ymin, xmax, ymax);
          for (const id of ids) {
            // Filter to only ids whose current coarse key equals cKey to avoid double-count
            if (this.unitCoarseKey.get(id) === cKey && !this.unitFineOwner.has(id)) {
              resultIds.add(id);
            }
          }
        }
      }
    }

    // Precise circle filter
    const out: CombatUnit[] = [];
    const r2 = r * r;
    for (const id of resultIds) {
      const u = this.units.get(id);
      if (!u) continue;
      const dx = u.position.x - position.x;
      const dy = u.position.y - position.y;
      if (dx * dx + dy * dy <= r2) out.push(u);
    }
    return out;
  }

  getPotentialCombats(): Map<string, string[]> {
    // Accurate approach: for each unit, query neighbors within its attackRange.
    // Deduplicate pairs by enforcing attackerId < defenderId when recording key.
    const pairs = new Map<string, string[]>();
    const allUnits = Array.from(this.units.values());
    const seen = new Set<string>(); // key: a|b with a<b

    for (const u of allUnits) {
      const range = u.attackRange;
      if (range <= 0) continue;
      const neighbors = this.getUnitsInRange(u.position, range);
      for (const v of neighbors) {
        if (u.id === v.id) continue;
        if (u.faction === v.faction) continue;
        const a = u.id < v.id ? u.id : v.id;
        const b = u.id < v.id ? v.id : u.id;
        const key = `${a}|${b}`;
        if (seen.has(key)) continue;
        seen.add(key);
        // Record from perspective of attacker u
        if (!pairs.has(u.id)) pairs.set(u.id, []);
        pairs.get(u.id)!.push(v.id);
      }
    }
    return pairs;
  }

  clear(): void {
    this.units.clear();
    this.unitCoarseKey.clear();
    this.unitFineOwner.clear();
    this.coarse = new BucketGrid(this.coarseSize);
    this.fineByCoarseKey.clear();
  }

  // Create a fine grid for this coarse cell and migrate its current units.
  private maybeRefine(coarseKey: string): void {
    if (this.fineByCoarseKey.has(coarseKey)) return;
    const count = this.coarse.getCellCountByKey(coarseKey);
    if (count >= this.refineThreshold) {
      const fine = new BucketGrid(this.fineSize);
      // Drain units from this coarse cell
      const ids = this.coarse.drainCellByKey(coarseKey);
      for (const id of ids) {
        const u = this.units.get(id);
        if (!u) continue;
        fine.add(id, u.position);
        this.unitFineOwner.set(id, coarseKey);
      }
      this.fineByCoarseKey.set(coarseKey, fine);
    }
  }

  // If a fine grid becomes sparse, migrate back to coarse and remove it.
  private maybeUnrefine(coarseKey: string): void {
    const fine = this.fineByCoarseKey.get(coarseKey);
    if (!fine) return;
    if (fine.size() <= this.unrefineThreshold) {
      // Migrate all back
      const ids = fine.allUnitIds();
      for (const id of ids) {
        const u = this.units.get(id);
        if (!u) continue;
        this.coarse.add(id, u.position);
        this.unitFineOwner.delete(id);
      }
      this.fineByCoarseKey.delete(coarseKey);
    }
  }
}

