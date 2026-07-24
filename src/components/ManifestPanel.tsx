import { CheckCircle2, Download, FileCode2, Fingerprint } from 'lucide-react';
import type { CSSProperties } from 'react';
import type { ExperimentManifest } from '../types';
import { downloadText } from '../lib/download';
import { buildPythonScript } from '../lib/reproducibility';
export function ManifestPanel({manifest}:{manifest:ExperimentManifest|null}) {
 if(!manifest)return null;
 return <section className="glass-card manifest-card"><div className="section-heading"><div><span className="eyebrow">Reproduction contract</span><h2>Experiment manifest</h2></div><Fingerprint/></div>
  <div className="score-ring" style={{'--score':`${manifest.reproducibilityScore*3.6}deg`} as CSSProperties}><b>{manifest.reproducibilityScore}</b><span>/100</span></div>
  <div className="manifest-facts"><span><CheckCircle2/> ID <code>{manifest.experimentId}</code></span><span>Seed <code>{manifest.seed}</code></span><span>Dataset <code>{manifest.dataset.version}</code></span><span>SHA <code>{manifest.dataset.sha256.slice(0,16)}</code></span><span>Runtime <code>{manifest.runtime.mode}</code></span></div>
  <div className="button-row"><button onClick={()=>downloadText(`experiment-${manifest.experimentId}.json`,JSON.stringify(manifest,null,2))}><Download/> Manifest JSON</button><button onClick={()=>downloadText(`reproduce-${manifest.experimentId}.py`,buildPythonScript(manifest),'text/x-python')}><FileCode2/> Python skeleton</button></div>
 </section>;
}
