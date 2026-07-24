import type { DatasetEntry, ExperimentConfig, ModelKey, TaskType } from '../types';

export const PYODIDE_VERSION = '0.28.3';
export const DUCKDB_WASM_VERSION = '1.32.0';
export const APP_VERSION = '1.0.0';

export const modelLabels: Record<ModelKey, string> = {
  logistic_regression: 'Logistic Regression',
  random_forest_classifier: 'Random Forest Classifier',
  linear_regression: 'Linear Regression',
  random_forest_regressor: 'Random Forest Regressor',
};

export const compatibleModels: Record<TaskType, ModelKey[]> = {
  classification: ['logistic_regression', 'random_forest_classifier'],
  regression: ['linear_regression', 'random_forest_regressor'],
};

export const defaultParameters: Record<ModelKey, Record<string, number>> = {
  logistic_regression: { C: 1, maxIter: 600 },
  random_forest_classifier: { nEstimators: 180, maxDepth: 8, minSamplesLeaf: 2 },
  linear_regression: {},
  random_forest_regressor: { nEstimators: 180, maxDepth: 10, minSamplesLeaf: 2 },
};

export const defaultConfig: ExperimentConfig = {
  mode: 'static', strategy: 'single', datasetId: 'customer-conversion-v1', task: 'classification', target: 'converted',
  modelKey: 'logistic_regression', seed: 42, testSize: .25, parameters: defaultParameters.logistic_regression,
};

export async function loadCatalog(): Promise<DatasetEntry[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}datasets/catalog.json`);
  if (!response.ok) throw new Error('Dataset catalog could not be loaded.');
  return response.json();
}
