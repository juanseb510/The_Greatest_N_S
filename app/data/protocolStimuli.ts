// app/data/protocolStimuli.ts

// Protocol stimuli derived from your uploaded CSV: Problems_ Cross-Notation.csv
// This keeps the CSV content compact (8 base pairs) and generates:
// - Cross-notation comparisons (6 per base) with WNB metadata from CSV
// - Within-notation comparisons (3 per base) derived from the same values
// - Estimation trials (both values x 3 notations per base)

export type BlockTag = 'Pre-Instruction' | 'Post-Instruction';
export type DistanceTag = 'Small' | 'Large' | 'Medium' | string;
export type Side = 'left' | 'right';
export type Notation = 'F' | 'D' | 'P';

export type ValueReps = { value: number; F: string; D: string; P: string };

export type BasePairStim = {
  base: string;
  block: BlockTag;
  distance: DistanceTag;
  larger: ValueReps;
  smaller: ValueReps;
  // Metadata keyed by the original CSV relation label
  relationMeta: Record<string, { problemNumber: number; wnb: boolean; decimalDigits: number | null }>;
};

export type ComparisonTrial = {
  id: number;
  block: BlockTag;
  distance: DistanceTag;
  relation: string;
  left: string;
  right: string;
  leftVal: number;
  rightVal: number;
  correctSide: Side;
  meta?: { wnbConsistent?: boolean; decimalDigits?: number | null; source?: 'csv-cross' | 'derived-within' };
};

export type EstimationTrial = {
  id: number;
  block: BlockTag;
  distance: DistanceTag;
  notation: 'Fraction' | 'Decimal' | 'Percentage';
  stimulus: string;
  value: number;
  meta?: { source?: 'derived-from-csv' };
};

// IMPORTANT: Your CSV always orders the larger value on the LEFT.
// We MUST randomize left/right before showing trials, otherwise participants can always press F.
export function randomizeSides(trial: ComparisonTrial, rng: () => number = Math.random): ComparisonTrial {
  if (rng() < 0.5) return trial;
  return {
    ...trial,
    left: trial.right,
    right: trial.left,
    leftVal: trial.rightVal,
    rightVal: trial.leftVal,
    correctSide: trial.correctSide === 'left' ? 'right' : 'left',
  };
}

export function correctKeyFromSide(side: Side): 'f' | 'j' {
  return side === 'left' ? 'f' : 'j';
}

export const BASE_PAIRS: BasePairStim[] = [
  {
    base: "0.55 vs 0.40",
    block: "Post-Instruction",
    distance: "Small",
    larger: {
      value: 0.55,
      F: "11/20",
      D: "0.55",
      P: "55%",
    },
    smaller: {
      value: 0.4,
      F: "2/5",
      D: "0.40",
      P: "40%",
    },
    relationMeta: {
      "Fraction > Decimal": { problemNumber: 67, wnb: false, decimalDigits: 2 },
      "Fraction > Percentage": { problemNumber: 68, wnb: false, decimalDigits: null },
      "Decimal > Fraction": { problemNumber: 69, wnb: true, decimalDigits: 2 },
      "Decimal > Percentage": { problemNumber: 70, wnb: true, decimalDigits: 2 },
      "Percentage > Fraction": { problemNumber: 71, wnb: true, decimalDigits: null },
      "Percentage > Decimal": { problemNumber: 72, wnb: true, decimalDigits: 2 },
    },
  },
  {
    base: "0.55 vs 0.48",
    block: "Post-Instruction",
    distance: "Small",
    larger: {
      value: 0.55,
      F: "11/20",
      D: "0.55",
      P: "55%",
    },
    smaller: {
      value: 0.48,
      F: "12/25",
      D: "0.48",
      P: "48%",
    },
    relationMeta: {
      "Fraction > Decimal": { problemNumber: 61, wnb: false, decimalDigits: 2 },
      "Fraction > Percentage": { problemNumber: 62, wnb: false, decimalDigits: null },
      "Decimal > Fraction": { problemNumber: 63, wnb: true, decimalDigits: 2 },
      "Decimal > Percentage": { problemNumber: 64, wnb: true, decimalDigits: 2 },
      "Percentage > Fraction": { problemNumber: 65, wnb: true, decimalDigits: null },
      "Percentage > Decimal": { problemNumber: 66, wnb: true, decimalDigits: 2 },
    },
  },
  {
    base: "0.75 vs 0.45",
    block: "Post-Instruction",
    distance: "Large",
    larger: {
      value: 0.75,
      F: "3/4",
      D: "0.75",
      P: "75%",
    },
    smaller: {
      value: 0.45,
      F: "9/20",
      D: "0.45",
      P: "45%",
    },
    relationMeta: {
      "Fraction > Decimal": { problemNumber: 49, wnb: false, decimalDigits: 2 },
      "Fraction > Percentage": { problemNumber: 50, wnb: false, decimalDigits: null },
      "Decimal > Fraction": { problemNumber: 51, wnb: true, decimalDigits: 2 },
      "Decimal > Percentage": { problemNumber: 52, wnb: true, decimalDigits: 2 },
      "Percentage > Fraction": { problemNumber: 53, wnb: true, decimalDigits: null },
      "Percentage > Decimal": { problemNumber: 54, wnb: true, decimalDigits: 2 },
    },
  },
  {
    base: "0.80 vs 0.40",
    block: "Post-Instruction",
    distance: "Large",
    larger: {
      value: 0.8,
      F: "4/5",
      D: "0.80",
      P: "80%",
    },
    smaller: {
      value: 0.4,
      F: "2/5",
      D: "0.40",
      P: "40%",
    },
    relationMeta: {
      "Fraction > Decimal": { problemNumber: 55, wnb: false, decimalDigits: 2 },
      "Fraction > Percentage": { problemNumber: 56, wnb: false, decimalDigits: null },
      "Decimal > Fraction": { problemNumber: 57, wnb: true, decimalDigits: 2 },
      "Decimal > Percentage": { problemNumber: 58, wnb: true, decimalDigits: 2 },
      "Percentage > Fraction": { problemNumber: 59, wnb: true, decimalDigits: null },
      "Percentage > Decimal": { problemNumber: 60, wnb: true, decimalDigits: 2 },
    },
  },
  {
    base: "0.52 vs 0.40",
    block: "Pre-Instruction",
    distance: "Small",
    larger: {
      value: 0.52,
      F: "13/25",
      D: "0.52",
      P: "52%",
    },
    smaller: {
      value: 0.4,
      F: "2/5",
      D: "0.40",
      P: "40%",
    },
    relationMeta: {
      "Fraction > Decimal": { problemNumber: 19, wnb: false, decimalDigits: 2 },
      "Fraction > Percentage": { problemNumber: 20, wnb: false, decimalDigits: null },
      "Decimal > Fraction": { problemNumber: 21, wnb: true, decimalDigits: 2 },
      "Decimal > Percentage": { problemNumber: 22, wnb: true, decimalDigits: 2 },
      "Percentage > Fraction": { problemNumber: 23, wnb: true, decimalDigits: null },
      "Percentage > Decimal": { problemNumber: 24, wnb: true, decimalDigits: 2 },
    },
  },
  {
    base: "0.56 vs 0.48",
    block: "Pre-Instruction",
    distance: "Small",
    larger: {
      value: 0.56,
      F: "14/25",
      D: "0.56",
      P: "56%",
    },
    smaller: {
      value: 0.48,
      F: "12/25",
      D: "0.48",
      P: "48%",
    },
    relationMeta: {
      "Fraction > Decimal": { problemNumber: 13, wnb: false, decimalDigits: 2 },
      "Fraction > Percentage": { problemNumber: 14, wnb: false, decimalDigits: null },
      "Decimal > Fraction": { problemNumber: 15, wnb: true, decimalDigits: 2 },
      "Decimal > Percentage": { problemNumber: 16, wnb: true, decimalDigits: 2 },
      "Percentage > Fraction": { problemNumber: 17, wnb: true, decimalDigits: null },
      "Percentage > Decimal": { problemNumber: 18, wnb: true, decimalDigits: 2 },
    },
  },
  {
    base: "0.65 vs 0.35",
    block: "Pre-Instruction",
    distance: "Large",
    larger: {
      value: 0.65,
      F: "13/20",
      D: "0.65",
      P: "65%",
    },
    smaller: {
      value: 0.35,
      F: "7/20",
      D: "0.35",
      P: "35%",
    },
    relationMeta: {
      "Fraction > Decimal": { problemNumber: 1, wnb: false, decimalDigits: 2 },
      "Fraction > Percentage": { problemNumber: 2, wnb: false, decimalDigits: null },
      "Decimal > Fraction": { problemNumber: 3, wnb: true, decimalDigits: 2 },
      "Decimal > Percentage": { problemNumber: 4, wnb: true, decimalDigits: 2 },
      "Percentage > Fraction": { problemNumber: 5, wnb: true, decimalDigits: null },
      "Percentage > Decimal": { problemNumber: 6, wnb: true, decimalDigits: 2 },
    },
  },
  {
    base: "0.70 vs 0.30",
    block: "Pre-Instruction",
    distance: "Large",
    larger: {
      value: 0.7,
      F: "7/10",
      D: "0.70",
      P: "70%",
    },
    smaller: {
      value: 0.3,
      F: "3/10",
      D: "0.30",
      P: "30%",
    },
    relationMeta: {
      "Fraction > Decimal": { problemNumber: 7, wnb: false, decimalDigits: 1 },
      "Fraction > Percentage": { problemNumber: 8, wnb: false, decimalDigits: null },
      "Decimal > Fraction": { problemNumber: 9, wnb: true, decimalDigits: 1 },
      "Decimal > Percentage": { problemNumber: 10, wnb: true, decimalDigits: 1 },
      "Percentage > Fraction": { problemNumber: 11, wnb: true, decimalDigits: null },
      "Percentage > Decimal": { problemNumber: 12, wnb: true, decimalDigits: 1 },
    },
  },
];

function notationLabel(n: Notation): 'Fraction' | 'Decimal' | 'Percentage' {
  if (n === 'F') return 'Fraction';
  if (n === 'D') return 'Decimal';
  return 'Percentage';
}

export function buildComparisonTrials(): ComparisonTrial[] {
  const trials: ComparisonTrial[] = [];
  let derivedId = 9000; // IDs for derived within-notation trials

  for (const bp of BASE_PAIRS) {
    const L = bp.larger;
    const S = bp.smaller;

    // (A) Cross-notation trials from CSV (6 per base)
    trials.push(
      { id: bp.relationMeta['Fraction > Decimal'].problemNumber, block: bp.block, distance: bp.distance, relation: 'Fraction > Decimal', left: L.F, right: S.D, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { wnbConsistent: bp.relationMeta['Fraction > Decimal'].wnb, decimalDigits: bp.relationMeta['Fraction > Decimal'].decimalDigits, source: 'csv-cross' } },
      { id: bp.relationMeta['Fraction > Percentage'].problemNumber, block: bp.block, distance: bp.distance, relation: 'Fraction > Percentage', left: L.F, right: S.P, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { wnbConsistent: bp.relationMeta['Fraction > Percentage'].wnb, decimalDigits: bp.relationMeta['Fraction > Percentage'].decimalDigits, source: 'csv-cross' } },
      { id: bp.relationMeta['Decimal > Fraction'].problemNumber, block: bp.block, distance: bp.distance, relation: 'Decimal > Fraction', left: L.D, right: S.F, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { wnbConsistent: bp.relationMeta['Decimal > Fraction'].wnb, decimalDigits: bp.relationMeta['Decimal > Fraction'].decimalDigits, source: 'csv-cross' } },
      { id: bp.relationMeta['Decimal > Percentage'].problemNumber, block: bp.block, distance: bp.distance, relation: 'Decimal > Percentage', left: L.D, right: S.P, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { wnbConsistent: bp.relationMeta['Decimal > Percentage'].wnb, decimalDigits: bp.relationMeta['Decimal > Percentage'].decimalDigits, source: 'csv-cross' } },
      { id: bp.relationMeta['Percentage > Fraction'].problemNumber, block: bp.block, distance: bp.distance, relation: 'Percentage > Fraction', left: L.P, right: S.F, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { wnbConsistent: bp.relationMeta['Percentage > Fraction'].wnb, decimalDigits: bp.relationMeta['Percentage > Fraction'].decimalDigits, source: 'csv-cross' } },
      { id: bp.relationMeta['Percentage > Decimal'].problemNumber, block: bp.block, distance: bp.distance, relation: 'Percentage > Decimal', left: L.P, right: S.D, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { wnbConsistent: bp.relationMeta['Percentage > Decimal'].wnb, decimalDigits: bp.relationMeta['Percentage > Decimal'].decimalDigits, source: 'csv-cross' } },
    );

    // (B) Within-notation trials (derived) — satisfies the Protocol requirement
    trials.push(
      { id: derivedId++, block: bp.block, distance: bp.distance, relation: 'Fraction vs Fraction', left: L.F, right: S.F, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { source: 'derived-within' } },
      { id: derivedId++, block: bp.block, distance: bp.distance, relation: 'Decimal vs Decimal', left: L.D, right: S.D, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { source: 'derived-within' } },
      { id: derivedId++, block: bp.block, distance: bp.distance, relation: 'Percentage vs Percentage', left: L.P, right: S.P, leftVal: L.value, rightVal: S.value, correctSide: 'left', meta: { source: 'derived-within' } },
    );
  }

  return trials;
}

export function buildEstimationTrials(): EstimationTrial[] {
  const trials: EstimationTrial[] = [];
  let id = 10000;

  for (const bp of BASE_PAIRS) {
    const values: Array<{ reps: ValueReps }> = [{ reps: bp.larger }, { reps: bp.smaller }];
    for (const v of values) {
      for (const n of ['F', 'D', 'P'] as Notation[]) {
        trials.push({
          id: id++,
          block: bp.block,
          distance: bp.distance,
          notation: notationLabel(n),
          stimulus: v.reps[n],
          value: v.reps.value,
          meta: { source: 'derived-from-csv' },
        });
      }
    }
  }

  return trials;
}

// Defaults (you can use these immediately in your jsPsych builder later)
export const COMPARISON_TRIALS: ComparisonTrial[] = buildComparisonTrials();
export const ESTIMATION_TRIALS: EstimationTrial[] = buildEstimationTrials();

// Note on length:
// - COMPARISON_TRIALS = 8 bases * (6 cross + 3 within) = 72
// - ESTIMATION_TRIALS = 8 bases * (2 values * 3 notations) = 48
// If this is too long for a screener, we can add a sampler later (e.g., pick N per condition).
