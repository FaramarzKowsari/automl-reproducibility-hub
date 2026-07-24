import type { ExperimentManifest } from '../types';
const KEY = 'automl-reproducibility-hub:experiments:v1';
export function loadHistory(): ExperimentManifest[] { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]'); } catch { return []; } }
export function saveHistory(items: ExperimentManifest[]): void { localStorage.setItem(KEY, JSON.stringify(items.slice(0, 20))); }
export function clearHistory(): void { localStorage.removeItem(KEY); }
