export type RunMode = 'static' | 'full';
export type TaskType = 'classification' | 'regression';
export type ModelKey = 'logistic_regression' | 'random_forest_classifier' | 'linear_regression' | 'random_forest_regressor';
export type RunStrategy = 'single' | 'automl';

export interface DatasetEntry {
  id: string; name: string; version: string; task: TaskType; target: string; file: string;
  rows: number; columns: number; sha256: string; description: string;
}
export interface ExperimentConfig {
  mode: RunMode; strategy: RunStrategy; datasetId: string; task: TaskType; target: string;
  modelKey: ModelKey; seed: number; testSize: number;
  parameters: Record<string, number | string | boolean | null>;
}
export interface ColumnProfile { name: string; type: string; missing: number; distinct: number; min?: number | null; max?: number | null; mean?: number | null; }
export interface DatasetProfile { rows: number; columns: number; columnProfiles: ColumnProfile[]; duckdbVersion?: string; }
export interface ModelResult { modelKey: ModelKey; label: string; metrics: Record<string, number | null>; confusionMatrix?: number[][] | null; topFeatures?: {name:string; importance:number}[]; }
export interface RuntimeVersions { mode:string; pyodide?:string; python?:string; scikitLearn?:string; pandas?:string; numpy?:string; duckdbWasm?:string; app:string; }
export interface ExperimentManifest {
  schemaVersion: '1.0.0'; experimentId: string; createdAt: string; reproducibilityScore: number;
  mode: RunMode; strategy: RunStrategy; seed: number; dataset: { id:string; name:string; version:string; sha256:string; rows:number; columns:number; target:string; source:'bundled'|'upload' };
  task: TaskType; selectedModel: ModelKey; parameters: Record<string, unknown>; testSize:number;
  results: ModelResult[]; winner?: ModelKey; runtime: RuntimeVersions; codeFingerprint:string; notes:string[];
}
export interface WorkerRunRequest { id:string; csvText:string; config:ExperimentConfig; dataset:{name:string;version:string;sha256:string}; }
export interface WorkerResponse { id:string; type:'progress'|'result'|'error'; message?:string; payload?: {results:ModelResult[];winner?:ModelKey;runtime:RuntimeVersions}; }
