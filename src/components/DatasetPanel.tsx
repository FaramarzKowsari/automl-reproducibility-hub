import { Database, FileCheck2, Upload } from 'lucide-react';
import type { DatasetEntry, DatasetProfile } from '../types';
import { shortHash } from '../lib/hash';
export function DatasetPanel({dataset,profile,onUpload}:{dataset?:DatasetEntry;profile?:DatasetProfile|null;onUpload:(file:File)=>void}) {
 return <section className="glass-card dataset-card"><div className="section-heading"><div><span className="eyebrow">Data provenance</span><h2>Dataset identity</h2></div><Database/></div>
  {dataset && <><div className="dataset-name"><b>{dataset.name}</b><span>v{dataset.version}</span></div><p>{dataset.description}</p><div className="facts"><span><FileCheck2/> {dataset.rows} rows</span><span>{dataset.columns} columns</span><span className="mono">sha256:{shortHash(dataset.sha256)}</span></div></>}
  <label className="upload-button"><Upload size={17}/> Use a custom CSV<input type="file" accept=".csv,text/csv" onChange={e=>e.target.files?.[0]&&onUpload(e.target.files[0])}/></label>
  {profile && <div className="profile-mini"><b>DuckDB profile</b><span>{profile.rows} rows · {profile.columns} columns</span><span>{profile.columnProfiles.reduce((a,c)=>a+c.missing,0)} missing cells</span></div>}
 </section>;
}
