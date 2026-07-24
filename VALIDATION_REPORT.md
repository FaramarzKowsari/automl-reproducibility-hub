# Validation report

The generated repository passed the following pre-delivery checks:

- all required project, workflow, dataset, documentation, citation, and governance files exist;
- `package.json`, dataset catalog, static fixtures, and Zenodo metadata parse as valid JSON;
- bundled CSV SHA-256 hashes match `public/datasets/catalog.json`;
- all TypeScript and TSX source files passed a compiler syntax and internal-type sanity check with local module stubs;
- the Python program embedded in the Pyodide worker compiles successfully as Python source;
- static reference metrics were generated with deterministic datasets and scikit-learn;
- the repository contains no API key, backend credential, or invented DOI.

The final dependency-aware verification is intentionally performed by GitHub Actions after publication:

```bash
npm install --no-audit --no-fund
npm run test
npm run build
```

A local repository integrity check is also included:

```bash
python scripts/verify_repository.py
```
