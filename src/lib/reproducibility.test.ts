import { describe, expect, it } from 'vitest';
import { canonicalJson } from './canonical';
import { computeReproducibilityScore } from './reproducibility';

describe('reproducibility primitives', () => {
  it('canonicalizes object keys', () => expect(canonicalJson({b:2,a:1})).toBe('{"a":1,"b":2}'));
  it('awards a complete reproducibility record', () => expect(computeReproducibilityScore({seed:42,datasetVersion:'1.0.0',datasetHash:'a'.repeat(64),parameters:{C:1},metricsCount:4,runtimeKnown:true})).toBe(100));
});
