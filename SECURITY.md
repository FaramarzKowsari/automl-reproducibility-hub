# Security policy

## Data handling

The project has no application backend. Bundled and uploaded CSV data are processed in the browser. User uploads are held in the active page session and are not sent to a project-owned service.

Full mode downloads pinned Pyodide packages and DuckDB-WASM assets from public CDNs. Organizations with stricter supply-chain requirements should self-host and pin those assets.

## Reporting

Please report vulnerabilities privately through GitHub's security advisory interface. Do not include confidential datasets, access tokens, or personal records in public issues.
