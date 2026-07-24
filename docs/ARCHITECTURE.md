# Architecture

The application is a static React + TypeScript site deployed to GitHub Pages.

## Runtime boundary

- The React shell manages configuration, dataset identity, history, and exports.
- DuckDB-WASM runs analytical SQL in its own Web Worker and profiles CSV structure, nulls, distinct values, and numeric ranges.
- Pyodide runs in a dedicated module worker. It loads pinned browser-compatible NumPy, pandas, and scikit-learn packages from the official Pyodide distribution.
- Experiment history is stored in localStorage. No dataset or result is uploaded to a project-owned service.

## Data flow

CSV → SHA-256 → DuckDB profile → Pyodide pipeline → metrics → canonical manifest → experiment fingerprint.

Static mode never enters the Pyodide pipeline. It loads explicitly labeled reference fixtures from `public/fixtures/static-runs.json`.
