import { RotateCcw, Settings2 } from 'lucide-react';
import { compatibleModels, defaultParameters, modelLabels } from '../data/catalog';
import type { DatasetEntry, ExperimentConfig, ModelKey } from '../types';
export function ConfigPanel({config,datasets,onChange,disabled}:{config:ExperimentConfig;datasets:DatasetEntry[];onChange:(c:ExperimentConfig)=>void;disabled:boolean}) {
 const update=(patch:Partial<ExperimentConfig>)=>onChange({...config,...patch});
 const selectDataset=(id:string)=>{const d=datasets.find(x=>x.id===id);if(!d)return;const model=compatibleModels[d.task][0];onChange({...config,datasetId:id,task:d.task,target:d.target,modelKey:model,parameters:defaultParameters[model]});};
 const selectModel=(modelKey:ModelKey)=>update({modelKey,parameters:defaultParameters[modelKey]});
 const p=config.parameters;
 return <section className="glass-card config-card">
  <div className="section-heading"><div><span className="eyebrow">Experiment contract</span><h2>Configuration</h2></div><Settings2/></div>
  <div className="form-grid">
   <label>Dataset<select value={config.datasetId} onChange={e=>selectDataset(e.target.value)} disabled={disabled}>{datasets.map(d=><option key={d.id} value={d.id}>{d.name} · v{d.version}</option>)}</select></label>
   <label>Run strategy<select value={config.strategy} onChange={e=>update({strategy:e.target.value as ExperimentConfig['strategy']})} disabled={disabled||config.mode==='static'}><option value="single">Single model</option><option value="automl">Compact AutoML benchmark</option></select></label>
   <label>Model<select value={config.modelKey} onChange={e=>selectModel(e.target.value as ModelKey)} disabled={disabled||config.strategy==='automl'}>{compatibleModels[config.task].map(m=><option key={m} value={m}>{modelLabels[m]}</option>)}</select></label>
   <label>Target<input value={config.target} onChange={e=>update({target:e.target.value})} disabled={disabled||config.mode==='static'}/></label>
   <label>Random seed<input type="number" value={config.seed} onChange={e=>update({seed:Number(e.target.value)})} disabled={disabled||config.mode==='static'}/></label>
   <label>Test fraction<input type="number" min="0.1" max="0.5" step="0.05" value={config.testSize} onChange={e=>update({testSize:Number(e.target.value)})} disabled={disabled||config.mode==='static'}/></label>
  </div>
  {config.mode==='full' && config.strategy==='single' && <div className="parameter-grid">
   {'C' in p && <label>C<input type="number" step="0.1" value={Number(p.C)} onChange={e=>update({parameters:{...p,C:Number(e.target.value)}})}/></label>}
   {'maxIter' in p && <label>Max iterations<input type="number" value={Number(p.maxIter)} onChange={e=>update({parameters:{...p,maxIter:Number(e.target.value)}})}/></label>}
   {'nEstimators' in p && <label>Trees<input type="number" min="20" max="500" value={Number(p.nEstimators)} onChange={e=>update({parameters:{...p,nEstimators:Number(e.target.value)}})}/></label>}
   {'maxDepth' in p && <label>Max depth<input type="number" min="2" max="30" value={Number(p.maxDepth)} onChange={e=>update({parameters:{...p,maxDepth:Number(e.target.value)}})}/></label>}
   {'minSamplesLeaf' in p && <label>Min leaf samples<input type="number" min="1" max="20" value={Number(p.minSamplesLeaf)} onChange={e=>update({parameters:{...p,minSamplesLeaf:Number(e.target.value)}})}/></label>}
  </div>}
  {config.mode==='static' && <div className="integrity-note"><ShieldText/> Static mode uses fixed seed 42 and versioned reference parameters. Switch to Full mode to edit and execute them.</div>}
 </section>;
}
function ShieldText(){return <RotateCcw size={17}/>}
