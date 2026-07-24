import { Award, BarChart3, Trophy } from 'lucide-react';
import type { ModelResult, TaskType } from '../types';
const pct=(v:number|null|undefined)=>v==null?'—':v.toFixed(4);
export function MetricsPanel({results,winner,task}:{results:ModelResult[];winner?:string;task:TaskType}) {
 if(!results.length)return <section className="empty-result"><BarChart3/><h2>No experiment result yet</h2><p>Choose a mode and run an experiment to create a versioned manifest.</p></section>;
 return <section className="results-grid">{results.map(result=><article className={`glass-card result-card ${winner===result.modelKey?'winner':''}`} key={result.modelKey}>
  <div className="result-title"><div><span className="eyebrow">{winner===result.modelKey?'Selected model':'Candidate model'}</span><h3>{result.label}</h3></div>{winner===result.modelKey?<Trophy/>:<Award/>}</div>
  <div className="metric-grid">{Object.entries(result.metrics).map(([key,value])=><div key={key}><span>{key.replaceAll('_',' ')}</span><b>{pct(value)}</b><i style={{width:`${Math.max(4,Math.min(100, task==='classification'?(Number(value)||0)*100:key==='r2'?(Number(value)||0)*100:70))}%`}}/></div>)}</div>
  {result.confusionMatrix && <div className="confusion"><b>Confusion matrix</b><div>{result.confusionMatrix.flatMap((row,i)=>row.map((v,j)=><span key={`${i}-${j}`}>{v}</span>))}</div></div>}
  {!!result.topFeatures?.length && <div className="features"><b>Leading signals</b>{result.topFeatures.slice(0,5).map(f=><div key={f.name}><span>{f.name}</span><i style={{width:`${Math.min(100,f.importance/(result.topFeatures?.[0]?.importance||1)*100)}%`}}/></div>)}</div>}
 </article>)}</section>;
}
