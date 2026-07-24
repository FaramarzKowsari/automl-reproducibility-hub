import { DatabaseZap, FlaskConical, ShieldCheck, Wifi } from 'lucide-react';
import type { RunMode } from '../types';
export function ModeSelector({mode,onChange}:{mode:RunMode;onChange:(mode:RunMode)=>void}) {
 return <section className="mode-grid" aria-label="Execution mode">
  <button className={`mode-card ${mode==='static'?'selected':''}`} onClick={()=>onChange('static')}><span className="mode-icon"><ShieldCheck/></span><div><b>S · Static Reference</b><p>Instant, precomputed reference experiments. No runtime downloads and no synthetic execution claims.</p><small>Best for preview, teaching, and repository demos.</small></div></button>
  <button className={`mode-card ${mode==='full'?'selected':''}`} onClick={()=>onChange('full')}><span className="mode-icon"><FlaskConical/></span><div><b>F · Full Browser Run</b><p>Executes pandas and scikit-learn inside Pyodide while DuckDB-WASM profiles the dataset.</p><small><Wifi size={14}/> First run downloads pinned WebAssembly packages.</small></div></button>
 </section>;
}
