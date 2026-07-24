from pathlib import Path
import hashlib, json, sys
root = Path(__file__).resolve().parents[1]
errors=[]
for relative in ['package.json','public/datasets/catalog.json','public/fixtures/static-runs.json','.zenodo.json']:
    try: json.loads((root/relative).read_text(encoding='utf-8'))
    except Exception as exc: errors.append(f'{relative}: {exc}')
catalog=json.loads((root/'public/datasets/catalog.json').read_text())
for entry in catalog:
    path=root/'public'/entry['file']
    digest=hashlib.sha256(path.read_bytes()).hexdigest()
    if digest != entry['sha256']: errors.append(f"Hash mismatch: {entry['id']}")
required=['src/App.tsx','src/workers/pyodide.worker.ts','src/lib/duckdb.ts','.github/workflows/ci.yml','.github/workflows/deploy-pages.yml']
for relative in required:
    if not (root/relative).exists(): errors.append(f'Missing: {relative}')
if errors:
    print('\n'.join(errors)); sys.exit(1)
print(f'Repository verification passed: {len(catalog)} datasets, {len(list(root.rglob("*")))} paths.')
