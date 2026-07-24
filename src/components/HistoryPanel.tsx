import { Clock3, RotateCw, Trash2 } from 'lucide-react';
import type { ExperimentManifest } from '../types';
export function HistoryPanel({items,onLoad,onClear}:{items:ExperimentManifest[];onLoad:(m:ExperimentManifest)=>void;onClear:()=>void}) {
 return <section className="glass-card history-card"><div className="section-heading"><div><span className="eyebrow">Local provenance</span><h2>Experiment history</h2></div><Clock3/></div>
  {!items.length?<p>No local experiments yet. Manifests are stored only in this browser.</p>:<div className="history-list">{items.map(item=><button key={item.experimentId} onClick={()=>onLoad(item)}><span><b>{item.winner??item.selectedModel}</b><small>{new Date(item.createdAt).toLocaleString()}</small></span><code>{item.experimentId}</code><RotateCw/></button>)}</div>}
  {!!items.length&&<button className="danger-button" onClick={onClear}><Trash2/> Clear local history</button>}
 </section>;
}
