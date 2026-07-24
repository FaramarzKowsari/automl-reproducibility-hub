import * as duckdb from '@duckdb/duckdb-wasm';
import { DUCKDB_WASM_VERSION } from '../data/catalog';
import type { ColumnProfile, DatasetProfile } from '../types';

let databasePromise: Promise<duckdb.AsyncDuckDB> | null = null;

async function getDatabase(): Promise<duckdb.AsyncDuckDB> {
  if (!databasePromise) databasePromise = (async () => {
    const bundles = duckdb.getJsDelivrBundles();
    const bundle = await duckdb.selectBundle(bundles);
    if (!bundle.mainWorker) throw new Error('DuckDB worker bundle is unavailable.');
    const workerUrl = URL.createObjectURL(new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' }));
    const worker = new Worker(workerUrl);
    const logger = new duckdb.ConsoleLogger(duckdb.LogLevel.WARNING);
    const db = new duckdb.AsyncDuckDB(logger, worker);
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
    URL.revokeObjectURL(workerUrl);
    return db;
  })();
  return databasePromise;
}

function quote(identifier: string): string { return `"${identifier.replaceAll('"', '""')}"`; }
function rowsToObjects(table: unknown): Record<string, unknown>[] {
  const rows = (table as {toArray:()=>unknown[]}).toArray();
  return rows.map((row) => typeof (row as {toJSON?:()=>unknown}).toJSON === 'function' ? (row as {toJSON:()=>Record<string,unknown>}).toJSON() : row as Record<string,unknown>);
}

export async function profileCsv(csvText: string): Promise<DatasetProfile> {
  const db = await getDatabase();
  const fileName = `dataset-${crypto.randomUUID()}.csv`;
  await db.registerFileText(fileName, csvText);
  const connection = await db.connect();
  try {
    await connection.query(`CREATE OR REPLACE TABLE experiment_dataset AS SELECT * FROM read_csv_auto('${fileName}', header=true, sample_size=-1)`);
    const count = rowsToObjects(await connection.query('SELECT COUNT(*)::INTEGER AS rows FROM experiment_dataset'))[0];
    const schema = rowsToObjects(await connection.query('DESCRIBE experiment_dataset'));
    const profiles: ColumnProfile[] = [];
    for (const column of schema) {
      const name = String(column.column_name); const type = String(column.column_type);
      const numeric = /INT|DECIMAL|DOUBLE|FLOAT|REAL|HUGEINT/i.test(type);
      const sql = numeric
        ? `SELECT COUNT(*) FILTER (WHERE ${quote(name)} IS NULL)::INTEGER AS missing, APPROX_COUNT_DISTINCT(${quote(name)})::INTEGER AS distinct_count, MIN(${quote(name)})::DOUBLE AS min_value, MAX(${quote(name)})::DOUBLE AS max_value, AVG(${quote(name)})::DOUBLE AS mean_value FROM experiment_dataset`
        : `SELECT COUNT(*) FILTER (WHERE ${quote(name)} IS NULL)::INTEGER AS missing, APPROX_COUNT_DISTINCT(${quote(name)})::INTEGER AS distinct_count FROM experiment_dataset`;
      const value = rowsToObjects(await connection.query(sql))[0];
      profiles.push({ name, type, missing:Number(value.missing ?? 0), distinct:Number(value.distinct_count ?? 0), min:value.min_value == null ? null : Number(value.min_value), max:value.max_value == null ? null : Number(value.max_value), mean:value.mean_value == null ? null : Number(value.mean_value) });
    }
    return { rows:Number(count.rows), columns:schema.length, columnProfiles:profiles, duckdbVersion:DUCKDB_WASM_VERSION };
  } finally { await connection.close(); await db.dropFile(fileName).catch(()=>undefined); }
}
